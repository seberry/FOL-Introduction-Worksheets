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
    await page.locator('#lesson').selectOption('0');
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
      const extension = mask => [1, 2, 3].filter(n => mask & (1 << (n - 1)));
      const host = document.createElement('div');
      host.id = 'geometry-review';
      host.style.cssText = 'display:grid;grid-template-columns:repeat(4,1fr);gap:16px;padding:20px;background:white';
      document.body.append(host);
      const failures = [];
      for (let p = 0; p < 8; p++) for (let q = 0; q < 8; q++) {
        const model = { domain: [1, 2, 3], constants: { a: 2, b: 2 }, predicates: { P: extension(p), Q: extension(q) } };
        const card = document.createElement('div');
        const title = document.createElement('p');
        title.textContent = `P: ${extension(p).join(', ') || 'none'}; Q: ${extension(q).join(', ') || 'none'}`;
        const picture = modelPicture(model, { predicates: ['P', 'Q'], constants: ['a', 'b'] });
        card.append(title, picture); host.append(card);
        const svg = picture.querySelector('svg');
        for (const predicate of ['P', 'Q']) {
          const shape = picture.querySelector(`.region-fill[data-predicate="${predicate}"]`);
          for (const node of picture.querySelectorAll('[data-object]')) {
            const n = Number(node.dataset.object);
            const x = Number(node.getAttribute('cx')), y = Number(node.getAttribute('cy'));
            // Check the whole numbered node and its name label, not just its center.
            for (const [dx, dy] of [[0,0],[-16,0],[16,0],[0,-16],[0,16],[0,32]]) {
              const screen = new DOMPoint(x + dx, y + dy).matrixTransform(svg.getScreenCTM());
              const inside = shape ? shape.isPointInFill(screen.matrixTransform(shape.getScreenCTM().inverse())) : false;
              if (inside !== model.predicates[predicate].includes(n)) failures.push({p,q,predicate,n,dx,dy,inside});
            }
          }
          const key = [...picture.querySelectorAll('.predicate-key-item')].find(e => e.textContent.startsWith(predicate));
          if (model.predicates[predicate].length === 0 && key.textContent !== `${predicate}: none`) failures.push('Missing empty label');
        }
        if (picture.querySelectorAll('.object-names')[1].textContent !== 'a, b') failures.push('Missing shared names');
        // Keep representative edge cases for a compact visual review.
        if (![[5,6],[3,3],[0,2],[1,2],[7,7],[0,0],[7,2],[1,7]].some(([a,b]) => a === p && b === q)) card.hidden = true;
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
      for (let lesson = 0; lesson < 8; lesson++) {
        await page.locator('#lesson').selectOption(String(lesson));
        for (let variation = 0; variation < 2; variation++) {
          assert.equal(await page.locator('#gallery > button').count(), 6);
          assert(await page.evaluate(() => document.documentElement.scrollWidth <= innerWidth), `Overflow: ${width}, lesson ${lesson}`);
          if (lesson === 1 && variation === 0 && [1440,390,320].includes(width)) {
            await page.locator('#gallery').screenshot({ path: `${output}/two-predicates-${width}.png` });
          }
          await page.locator('#variation').click();
        }
      }
    }
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
    await page.addScriptTag({ content: axe.source });
    for (const lesson of ['1','7']) {
      await page.locator('#lesson').selectOption(lesson);
      if (lesson === '7') await page.locator('#witness-choices button').nth(1).click();
      else {
        await page.locator('#gallery > button').nth(0).click();
        await page.locator('#more summary').click();
        assert.equal(await page.locator('#explanation').evaluate(e => getComputedStyle(e).color), 'rgb(154, 52, 18)');
      }
      const accessibility = await page.evaluate(() => axe.run());
      assert.deepEqual(accessibility.violations.map(v => ({ id: v.id, impact: v.impact })), []);
    }
    assert.deepEqual(errors, []);
    console.log('PASS: geometry for all 64 P/Q extensions, shared names, empty sets, all lessons/variations at four widths, gallery/witness keyboard interaction, incorrect hint colors and resets, expandable picture guide, picture toggle, accessibility, and no JavaScript errors.');
    console.log(`Screenshots: ${output}/`);
  } finally { await browser.close(); }
})().catch(error => { console.error(error); process.exitCode = 1; });
