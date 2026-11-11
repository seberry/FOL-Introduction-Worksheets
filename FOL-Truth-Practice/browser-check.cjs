// Optional visual/interaction check using the repository's existing browser tools.
const { chromium } = require('../connective-fluency/node_modules/playwright-core');
const axe = require('../connective-fluency/node_modules/axe-core');
const assert = require('node:assert/strict');
const fs = require('node:fs');
const output = 'working/monadic-highlights';

(async () => {
  fs.mkdirSync(output, { recursive: true });
  const browser = await chromium.launch({ executablePath: 'C:/Program Files/Google/Chrome/Application/chrome.exe', headless: true });
  try {
    const page = await browser.newPage({ viewport: { width: 1440, height: 1000 } });
    const errors = [];
    page.on('pageerror', error => errors.push(error.message));
    await page.goto('http://127.0.0.1:8765/FOL-Truth-Practice/');
    await page.locator('#lesson').selectOption('7');
    assert(await page.locator('#level-two-introduction').isVisible(), 'Existential introduction is visible in Level 2');
    assert(!(await page.locator('#level-one-introduction').isVisible()), 'Model introduction is hidden in Level 2');
    const exampleTruth = await page.evaluate(async () => {
      const { truth, model } = await import('./models.mjs');
      const example = model(1, 2, [1], [2, 3]);
      return [truth('∃x Px', example), truth('∃x (Px ∧ Qx)', example)];
    });
    assert.deepEqual(exampleTruth, [true, false]);
    await page.locator('#lesson').selectOption('0');
    assert(await page.locator('#level-one-introduction').isVisible(), 'Model introduction returns in Level 1');
    assert(!(await page.locator('#level-two-introduction').isVisible()), 'Existential introduction is hidden in Level 1');
    const guide = page.locator('.picture-guide');
    assert(!(await guide.locator('p').isVisible()), 'Picture explanation starts collapsed');
    await guide.locator('summary').click();
    assert(await guide.locator('p').isVisible());
    await page.keyboard.press('Enter');
    assert(!(await guide.locator('p').isVisible()), 'Picture explanation closes with the keyboard');
    await page.locator('#introduction-picture').screenshot({ path: `${output}/introduction.png` });
    await page.locator('#gallery').screenshot({ path: `${output}/gallery-desktop.png` });

    const geometry = await page.evaluate(async () => {
      const { modelPicture } = await import('./diagram.mjs');
      const extension = (mask,size) => Array.from({length:size},(_,i)=>i+1).filter(n => mask & (1 << (n - 1)));
      const host = document.createElement('div');
      host.id = 'geometry-review';
      host.style.cssText = 'display:grid;grid-template-columns:repeat(4,1fr);gap:16px;padding:20px;background:white';
      document.body.append(host);
      const failures = [], cases=[];
      for (let p=0;p<8;p++) for(let q=0;q<8;q++) cases.push({size:3,masks:[p,q],show:[[5,6],[3,3],[7,7],[0,0]].some(([a,b])=>a===p&&b===q)});
      // Each region depends only on its own extension and domain layout. Exercise
      // all 90 P/Q/R geometries, including identical extensions and empty sets.
      for (let size=1;size<=4;size++) for(let mask=0;mask<2**size;mask++) {
        cases.push({size,masks:[mask,mask,mask],show:[0,1,2**size-1].includes(mask)});
      }
      for (const [size,masks] of [[2,[1,2,0]],[3,[3,5,6]],[4,[9,6,11]],[4,[7,14,13]],[4,[5,10,0]]]) cases.push({size,masks,show:true});
      for (const {size,masks,show} of cases) {
        const predicates=['P','Q','R'].slice(0,masks.length);
        const domain=Array.from({length:size},(_,i)=>i+1), named=domain.at(-1);
        const model = { domain, constants: { a:named, b:named }, predicates: Object.fromEntries(predicates.map((p,i)=>[p,extension(masks[i],size)])) };
        const card = document.createElement('div');
        const title = document.createElement('p');
        title.textContent = `Domain: ${domain.join(', ')}; `+predicates.map(p=>`${p}: ${model.predicates[p].join(', ') || 'none'}`).join('; ');
        const picture = modelPicture(model, { predicates, constants: ['a', 'b'] });
        card.append(title, picture); host.append(card);
        if(picture.querySelectorAll('.object-node').length!==size) failures.push('Every object needs a circled number');
        for (const predicate of predicates) {
          const shape = picture.querySelector(`.region-fill[data-predicate="${predicate}"]`);
          for (const node of picture.querySelectorAll('[data-object]')) {
            const n = Number(node.dataset.object);
            const x = Number(node.getAttribute('cx')), y = Number(node.getAttribute('cy'));
            // Check the whole numbered node and its name label, not just its center.
            for (const [dx, dy] of [[0,0],[-16,0],[16,0],[0,-16],[0,16],[0,32],[-18,32],[18,32]]) {
              // Shapes are direct SVG children. Stay in viewBox coordinates to
              // avoid screen round-trip error at vertical capsule centerlines.
              const transform=shape?.transform.baseVal.consolidate()?.matrix;
              const point=new DOMPoint(x+dx,y+dy);
              const local=transform ? point.matrixTransform(transform.inverse()) : point;
              const inside = shape ? shape.isPointInFill(local) : false;
              if (inside !== model.predicates[predicate].includes(n)) failures.push({size,masks,predicate,n,dx,dy,inside,local:local && [local.x,local.y]});
            }
          }
          const key = [...picture.querySelectorAll('.predicate-key-item')].find(e => e.textContent.startsWith(predicate));
          if (model.predicates[predicate].length === 0 && key.textContent !== `${predicate}: none`) failures.push('Missing empty label');
        }
        if (picture.querySelectorAll('.object-names')[size-1].textContent !== 'a, b') failures.push('Missing shared names');
        for (const text of picture.querySelectorAll('svg text')) {
          const box=text.getBBox();
          if(box.x<0 || box.y<0 || box.x+box.width>320 || box.y+box.height>294) failures.push({size,masks,text:text.textContent,problem:'clipped text'});
        }
        const badges=[...picture.querySelectorAll('.predicate-label')].map(e=>e.getBBox());
        for(let i=0;i<badges.length;i++) for(let j=i+1;j<badges.length;j++) {
          const a=badges[i],b=badges[j];
          if(a.x<b.x+b.width && b.x<a.x+a.width && a.y<b.y+b.height && b.y<a.y+a.height) failures.push({size,masks,problem:'overlapping predicate labels'});
        }
        card.hidden=!show;
      }
      return failures;
    });
    assert.deepEqual(geometry, [], 'Every region must contain exactly its named objects');
    await page.locator('#geometry-review').screenshot({ path: `${output}/edge-cases.png` });
    await page.locator('#geometry-review').evaluate(e => e.remove());

    // Exercise the actual gallery through the keyboard, including the false card.
    const buttons = page.locator('#gallery > button');
    await buttons.nth(0).focus();
    await page.keyboard.press('Enter');
    assert.equal(await buttons.nth(0).getAttribute('aria-pressed'), 'true');
    await page.keyboard.press('Tab');
    assert(await buttons.nth(1).evaluate(e => e === document.activeElement));
    await page.keyboard.press('Enter');
    assert.equal(await buttons.nth(1).getAttribute('aria-pressed'), 'false');
    assert.match(await page.locator('#feedback').textContent(), /Not quite/);
    assert.equal(await page.locator('#feedback').evaluate(e => getComputedStyle(e).color), 'rgb(154, 52, 18)');
    await page.locator('#feedback').locator('..').screenshot({ path: `${output}/incorrect-gallery.png` });
    for (const index of [2,4]) { await buttons.nth(index).focus(); await page.keyboard.press('Space'); }
    assert(await page.locator('#complete').isVisible());
    assert(!(await page.locator('#feedback').evaluate(e => e.closest('.feedback').classList.contains('is-incorrect'))));
    await buttons.nth(1).click();
    await page.locator('#round').click();
    assert(!(await page.locator('#feedback').evaluate(e => e.closest('.feedback').classList.contains('is-incorrect'))), 'New round clears incorrect styling');
    await page.locator('#lesson').selectOption('0');
    await page.locator('#gallery > button').nth(0).click();
    await page.locator('#pictures').uncheck();
    assert.equal(await page.locator('#gallery .model-picture').count(), 0);
    assert.equal(await page.locator('#gallery .description').count(), 6);
    await page.locator('#pictures').check();
    assert.equal(await buttons.nth(0).getAttribute('aria-pressed'), 'true');

    for (const width of [1440, 844, 390, 320]) {
      await page.setViewportSize({ width, height: 900 });
      for (let lesson = 0; lesson < 20; lesson++) {
        await page.locator('#lesson').selectOption(String(lesson));
        for (let variation = 0; variation < 2; variation++) {
          assert.equal(await page.locator('#gallery > button').count(), 6);
          await page.locator('#gallery .card, #examples .card, #witness-model .card').evaluateAll(cards => {
            for(const card of cards) {
              const picture=card.querySelector('.model-picture');
              if(!picture) continue;
              const domain=card.querySelector('.description p').textContent.replace('Domain: ','').split(', ');
              if(picture.querySelectorAll('circle.object-node').length!==domain.length) throw new Error('Missing circled object in a live card');
            }
          });
          assert(await page.evaluate(() => document.documentElement.scrollWidth <= innerWidth), `Overflow: ${width}, lesson ${lesson}`);
          if ([1,7,11,16].includes(lesson) && variation === 0 && [1440,390,320].includes(width)) {
            await page.locator('#gallery').screenshot({ path: `${output}/lesson-${lesson}-${width}.png` });
          }
          await page.locator('#variation').click();
        }
      }
    }
    await page.locator('#lesson').selectOption('7');
    await page.locator('#witness-choices button').nth(0).focus();
    await page.keyboard.press('Enter');
    assert.match(await page.locator('#witness-feedback').textContent(), /Correct!/);
    await page.keyboard.press('Tab'); await page.keyboard.press('Enter');
    assert.match(await page.locator('#witness-feedback').textContent(), /Not quite/);
    assert.equal(await page.locator('#witness-feedback').evaluate(e => getComputedStyle(e).color), 'rgb(154, 52, 18)');
    await page.locator('#witness-section').screenshot({ path: `${output}/witness-mobile.png` });
    await page.locator('#witness-choices button').nth(0).click();
    assert(!(await page.locator('#witness-feedback').evaluate(e => e.classList.contains('is-incorrect'))));
    await page.locator('#witness-choices button').nth(1).click();
    await page.locator('#witness-next').click();
    assert(!(await page.locator('#witness-feedback').evaluate(e => e.classList.contains('is-incorrect'))), 'New witness model clears incorrect styling');
    await page.locator('#lesson').selectOption('12');
    assert(await page.locator('#level-three-introduction').isVisible());
    assert.equal(await page.locator('#candidate-title').textContent(), 'Find a counterexample');
    assert.equal(await page.locator('#gallery > button').count(), 6);
    assert(await page.locator('#witness-choices button').count() > 0);
    await page.locator('#witness-choices button').first().click();
    assert.match(await page.locator('#witness-feedback').textContent(), /counterexample/);
    for (const index of ['8', '12', '14', '16']) {
      await page.locator('#lesson').selectOption(index);
      for (const button of await page.locator('#witness-choices button').all()) {
        const object = Number((await button.textContent()).replace('Object ', ''));
        const expected = await page.evaluate(async ({ index, object }) => {
          const { lessons, gallery } = await import('./models.mjs');
          const { checkCandidate, evaluate } = await import('../fol-explanations/index.mjs');
          const formula = lessons[Number(index)].formula;
          const cards = gallery(formula, 0);
          const isWitness = evaluate(formula, cards[0]).formula.type === 'exists';
          const model = cards.find(m => evaluate(formula, m).value === isWitness);
          return checkCandidate(formula, model, object).valid;
        }, { index, object });
        await button.click();
        assert.equal((await page.locator('#witness-feedback').textContent()).startsWith('Correct!'), expected);
      }
      await page.locator('#witness-next').click();
      assert.equal(await page.locator('#witness-feedback').textContent(), 'Choose an object.');
    }
    await page.locator('#lesson').selectOption('11');
    assert(await page.locator('#gallery .predicate-label.r').count() > 0, 'Three-predicate pictures include R regions and labels');
    await page.locator('#lesson').selectOption('17');
    assert(await page.locator('#level-four-introduction').isVisible());
    assert(await page.locator('#witness-section').isHidden());
    await page.addScriptTag({ content: axe.source });
    for (const lesson of ['1','7','11','16']) {
      await page.locator('#lesson').selectOption(lesson);
      if (lesson === '7') await page.locator('#witness-choices button').nth(1).click();
      else if (lesson === '1') {
        await page.locator('#gallery > button').nth(0).click();
        await page.locator('#more summary').click();
        assert.equal(await page.locator('#explanation').evaluate(e => getComputedStyle(e).color), 'rgb(154, 52, 18)');
      }
      const accessibility = await page.evaluate(() => axe.run());
      assert.deepEqual(accessibility.violations.map(v => ({ id: v.id, impact: v.impact })), []);
    }
    assert.deepEqual(errors, []);
    console.log('PASS: all 64 three-object P/Q models and all 90 P/Q/R region geometries for domains of 1–4 objects, shared names, empty sets, label bounds, circled objects throughout all lessons/variations at four widths, gallery/witness keyboard interaction, hint colors and resets, expandable picture guide, picture toggle, accessibility, and no JavaScript errors.');
    console.log(`Screenshots: ${output}/`);
  } finally { await browser.close(); }
})().catch(error => { console.error(error); process.exitCode = 1; });
