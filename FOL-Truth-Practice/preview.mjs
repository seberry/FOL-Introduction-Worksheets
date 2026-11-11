import { lessons, gallery, pool, truth, witness, model } from './models.mjs';
import { shortResponse, expandedResponse, witnessResponse } from './feedback.mjs';
const $ = id => document.getElementById(id);
let lesson = 0, round = 0, variation = false, chosen = new Set(), witnessRound=0;
try { const saved=Number(localStorage.getItem('fol-truth-practice-lesson')); if(Number.isInteger(saved) && saved>=0 && saved<lessons.length) lesson=saved; } catch {}
const list = xs => xs.length ? xs.join(', ') : 'none';
const activeFormula=()=>variation ? lessons[lesson].variation : lessons[lesson].formula;
function symbols(formula) { return { predicates:['P','Q'].filter(p=>formula.includes(p)), constants:['a','b'].filter(c=>formula.includes(c)) }; }
function card(m, heading, showPicture = true, formula=activeFormula()) {
  const used=symbols(formula), el = document.createElement('div'); el.className = 'card';
  const title = document.createElement('h3'); title.textContent = heading; el.append(title);
  if (showPicture) {
    const pic = document.createElement('div'); pic.className = 'diagram'; pic.setAttribute('aria-hidden','true');
    for (const n of m.domain) {
      const obj = document.createElement('div'); obj.className = 'object';
      const num = document.createElement('div'); num.className = 'number'; num.textContent = n;
      if(used.predicates.length===1 && m.predicates[used.predicates[0]].includes(n)) num.classList.add('shaded');
      const names = document.createElement('div'); names.className = 'names'; names.textContent = used.constants.filter(k => m.constants[k] === n).join(', ');
      const tags = document.createElement('div'); tags.className = 'tags';
      for (const p of used.predicates) if (m.predicates[p].includes(n)) { const tag = document.createElement('span'); tag.className = `tag ${p.toLowerCase()}`; tag.textContent = p; tags.append(tag); }
      obj.append(num,names,tags); pic.append(obj);
    } el.append(pic);
  }
  const description = document.createElement('div'); description.className = 'description';
  for (const text of [`Domain: ${list(m.domain)}`, ...used.constants.map(c=>`${c} names: ${m.constants[c]}`), ...used.predicates.map(p=>`${p} applies to: ${list(m.predicates[p])}`)]) { const p = document.createElement('p'); p.textContent = text; description.append(p); }
  el.append(description); return el;
}
function clearRound() { chosen=new Set(); $('feedback').textContent='Choose a model to start.'; $('more').hidden=true; $('more').open=false; $('complete').hidden=true; }
function render() {
 const item=lessons[lesson], formula=activeFormula(); $('lesson').value=lesson;
 $('level').textContent = lesson === 7 ? 'LEVEL 2 · EXISTENTIAL SENTENCES' : `LEVEL 1 · MINI-LESSON ${lesson+1}`;
 $('formula').textContent=formula; $('intro').textContent=variation ? `A related sentence: ${formula}.` : item.introduction; $('prompt').textContent=formula;
 $('variation').textContent=variation?'Return to original':'Try a variation'; $('previous').disabled=lesson===0; $('next').disabled=lesson===lessons.length-1;
 $('examples').replaceChildren();
 for (const value of [true,false]) { const m=pool.find(candidate=>truth(formula,candidate)===value); const e=card(m,`${formula} is ${value?'true':'false'}`,$('pictures').checked,formula); const p=document.createElement('p'); p.textContent=shortResponse(formula,m).replace(/^(Correct!|Not quite\.)\s*/, ''); e.append(p); $('examples').append(e); }
 const cards=gallery(formula,round); $('gallery').replaceChildren();
 cards.forEach((m,i)=>{ const button=document.createElement('button'); button.type='button'; button.className='model-button'; button.setAttribute('aria-pressed',chosen.has(i)); button.append(card(m,`Model ${i+1}${chosen.has(i)?' ✓':''}`,$('pictures').checked,formula)); button.onclick=()=>{ if(truth(formula,m)) chosen.add(i); $('feedback').textContent=shortResponse(formula,m); $('explanation').textContent=expandedResponse(formula,m); $('more').hidden=!/[¬∧∨→∃]/.test(formula); $('more').open=false; $('complete').hidden=chosen.size!==cards.filter(c=>truth(formula,c)).length; renderCards(); }; $('gallery').append(button); });
 $('witness-section').hidden=lesson!==7; if(lesson===7) renderWitness();
}
function renderCards(){ const buttons=$('gallery').children; for(let i=0;i<buttons.length;i++){ const selected=chosen.has(i); buttons[i].setAttribute('aria-pressed',selected); buttons[i].querySelector('h3').textContent=`Model ${i+1}${selected?' ✓':''}`; } }
function renderWitness(){ const ms=[model(1,2,[1,3],[]),model(1,2,[2],[]),model(1,2,[1,2,3],[])], m=ms[witnessRound%ms.length]; $('witness-model').replaceChildren(card(m,'Witness model',$('pictures').checked,'∃x Px')); $('witness-choices').replaceChildren(); for(const object of m.domain){ const b=document.createElement('button'); b.type='button'; b.textContent=`Object ${object}`; b.onclick=()=>{$('witness-feedback').textContent=witnessResponse(object,witness('∃x Px',m,object));}; $('witness-choices').append(b); } }
function go(i){lesson=i;round=0;variation=false;witnessRound=0;clearRound();$('witness-feedback').textContent='Choose an object.';try{localStorage.setItem('fol-truth-practice-lesson',String(lesson));}catch{} render();}
lessons.forEach((l,i)=>{const o=document.createElement('option');o.value=i;o.textContent=`${i===7?'Level 2':'Level 1'} · ${l.formula}`;$('lesson').append(o);});
$('lesson').onchange=e=>go(Number(e.target.value)); $('previous').onclick=()=>go(lesson-1); $('next').onclick=()=>go(lesson+1);
$('round').onclick=()=>{round++;clearRound();render();}; $('variation').onclick=()=>{variation=!variation;round=0;clearRound();render();}; $('pictures').onchange=render;
$('witness-next').onclick=()=>{witnessRound++;$('witness-feedback').textContent='Choose an object.';renderWitness();};
const sample=model(1,2,[1,2],[2,3]); $('prototypes').append(card(sample,'Labeled columns',true,'Pa ∧ Qb'));
const overlap=card(sample,'Overlapping regions',false,'Pa ∧ Qb'); const region=document.createElement('div'); region.className='venn'; region.setAttribute('aria-hidden','true'); region.innerHTML='<div class="region p"></div><div class="region q"></div><span class="region-label pl">P</span><span class="region-label ql">Q</span><span class="vobj v1">1 <i>a</i></span><span class="vobj v2">2 <i>b</i></span><span class="vobj v3">3</span>'; overlap.insertBefore(region,overlap.lastChild); $('prototypes').append(overlap); render();
