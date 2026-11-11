import { lessons, gallery, pool, truth, witness, model } from './models.mjs';
import { shortResponse, expandedResponse, witnessResponse } from './feedback.mjs';
import { modelPicture } from './diagram.mjs';
const $ = id => document.getElementById(id);
let lesson = 0, round = 0, variation = false, chosen = new Set(), witnessRound=0;
try { const saved=Number(localStorage.getItem('fol-truth-practice-lesson')); if(Number.isInteger(saved) && saved>=0 && saved<lessons.length) lesson=saved; } catch {}
const list = xs => xs.length ? xs.join(', ') : 'none';
const activeFormula=()=>variation ? lessons[lesson].variation : lessons[lesson].formula;
function symbols(formula) { return { predicates:['P','Q'].filter(p=>formula.includes(p)), constants:['a','b'].filter(c=>formula.includes(c)) }; }
function card(m, heading, showPicture = true, formula=activeFormula()) {
  const used=symbols(formula), el = document.createElement('div'); el.className = 'card';
  const title = document.createElement('h3'); title.textContent = heading; el.append(title);
  if (showPicture) el.append(modelPicture(m, used));
  const description = document.createElement('div'); description.className = 'description';
  for (const text of [`Domain: ${list(m.domain)}`, ...used.constants.map(c=>`${c} names: ${m.constants[c]}`), ...used.predicates.map(p=>`${p} applies to: ${list(m.predicates[p])}`)]) { const p = document.createElement('p'); p.textContent = text; description.append(p); }
  el.append(description); return el;
}
function showFeedback(id, text, incorrect = false) {
  const message = $(id);
  message.textContent = text;
  message.closest('.feedback').classList.toggle('is-incorrect', incorrect);
}
function clearRound() { chosen=new Set(); showFeedback('feedback','Choose a model to start.'); $('more').hidden=true; $('more').open=false; $('complete').hidden=true; }
function render() {
 const item=lessons[lesson], formula=activeFormula(); $('lesson').value=lesson;
 $('level').textContent = lesson === 7 ? 'LEVEL 2 · EXISTENTIAL SENTENCES' : `LEVEL 1 · MINI-LESSON ${lesson+1}`;
 $('formula').textContent=formula; $('intro').textContent=variation ? `A related sentence: ${formula}.` : item.introduction; $('prompt').textContent=formula;
 $('variation').textContent=variation?'Return to original':'Try a variation'; $('previous').disabled=lesson===0; $('next').disabled=lesson===lessons.length-1;
 $('examples').replaceChildren();
 for (const value of [true,false]) { const m=pool.find(candidate=>truth(formula,candidate)===value); const e=card(m,`${formula} is ${value?'true':'false'}`,$('pictures').checked,formula); const p=document.createElement('p'); p.textContent=shortResponse(formula,m).replace(/^(Correct!|Not quite\.)\s*/, ''); e.append(p); $('examples').append(e); }
 const cards=gallery(formula,round); $('gallery').replaceChildren();
 cards.forEach((m,i)=>{
   const button=document.createElement('button'); button.type='button'; button.className='model-button';
   button.setAttribute('aria-pressed',chosen.has(i));
   button.append(card(m,`Model ${i+1}${chosen.has(i)?' ✓':''}`,$('pictures').checked,formula));
   button.onclick=()=>{
     const correct = truth(formula,m);
     if(correct) chosen.add(i);
     showFeedback('feedback',shortResponse(formula,m),!correct);
     $('explanation').textContent=expandedResponse(formula,m);
     $('more').hidden=!/[¬∧∨→∃]/.test(formula); $('more').open=false;
     $('complete').hidden=chosen.size!==cards.filter(c=>truth(formula,c)).length;
     renderCards();
   };
   $('gallery').append(button);
 });
 $('witness-section').hidden=lesson!==7; if(lesson===7) renderWitness();
}
function renderCards(){ const buttons=$('gallery').children; for(let i=0;i<buttons.length;i++){ const selected=chosen.has(i); buttons[i].setAttribute('aria-pressed',selected); buttons[i].querySelector('h3').textContent=`Model ${i+1}${selected?' ✓':''}`; } }
function renderWitness(){ const ms=[model(1,2,[1,3],[]),model(1,2,[2],[]),model(1,2,[1,2,3],[])], m=ms[witnessRound%ms.length]; $('witness-model').replaceChildren(card(m,'Witness model',$('pictures').checked,'∃x Px')); $('witness-choices').replaceChildren(); for(const object of m.domain){ const b=document.createElement('button'); b.type='button'; b.textContent=`Object ${object}`; b.onclick=()=>{const valid=witness('∃x Px',m,object);showFeedback('witness-feedback',witnessResponse(object,valid),!valid);}; $('witness-choices').append(b); } }
function go(i){lesson=i;round=0;variation=false;witnessRound=0;clearRound();showFeedback('witness-feedback','Choose an object.');try{localStorage.setItem('fol-truth-practice-lesson',String(lesson));}catch{} render();}
lessons.forEach((l,i)=>{const o=document.createElement('option');o.value=i;o.textContent=`${i===7?'Level 2':'Level 1'} · ${l.formula}`;$('lesson').append(o);});
$('lesson').onchange=e=>go(Number(e.target.value)); $('previous').onclick=()=>go(lesson-1); $('next').onclick=()=>go(lesson+1);
$('round').onclick=()=>{round++;clearRound();render();}; $('variation').onclick=()=>{variation=!variation;round=0;clearRound();render();}; $('pictures').onchange=render;
$('witness-next').onclick=()=>{witnessRound++;showFeedback('witness-feedback','Choose an object.');renderWitness();};
$('introduction-picture').append(modelPicture(model(1,2,[1,3],[2,3]), { predicates:['P','Q'], constants:['a'] }));
for (const [heading, m] of [
  ['Overlapping properties', model(1,2,[1,3],[2,3])],
  ['The same objects have P and Q', model(2,2,[1,2],[1,2])],
  ['No objects have P', model(1,2,[],[2])],
  ['An object with neither property', model(1,3,[1],[2])]
]) $('prototypes').append(card(m,heading,true,'Pa ∧ Qb'));
render();
