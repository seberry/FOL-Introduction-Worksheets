import { lessons, gallery, pool, truth, witness, model } from './models.mjs';
import { shortResponse, expandedResponse, witnessResponse } from './feedback.mjs';
import { modelPicture } from './diagram.mjs';
import { proposedResponse, proposedCandidate } from './quantified.mjs';
import { evaluate, checkCandidate } from '../fol-explanations/index.mjs';
const $ = id => document.getElementById(id);
let lesson = 0, round = 0, variation = false, chosen = new Set(), witnessRound=0;
try { const saved=Number(localStorage.getItem('fol-truth-practice-lesson')); if(Number.isInteger(saved) && saved>=0 && saved<lessons.length) lesson=saved; } catch {}
const list = xs => xs.length ? xs.join(', ') : 'none';
const activeFormula=()=>variation ? lessons[lesson].variation : lessons[lesson].formula;
function symbols(formula) { return { predicates:['P','Q','R'].filter(p=>formula.includes(p)), constants:['a','b'].filter(c=>formula.includes(c)) }; }
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
 const level=item.level ?? (lesson===7 ? 2 : 1);
 $('level-one-introduction').hidden=level!==1; $('level-two-introduction').hidden=level!==2; $('level-three-introduction').hidden=level!==3; $('level-four-introduction').hidden=level!==4;
 $('level').textContent = `LEVEL ${level} · MINI-LESSON ${lessons.slice(0,lesson+1).filter(x=>x.level===level).length}`;
 $('formula').textContent=formula; $('intro').textContent=variation ? `A related sentence: ${formula}.` : item.introduction; $('prompt').textContent=formula;
 $('variation').textContent=variation?'Return to original':'Try a variation'; $('previous').disabled=lesson===0; $('next').disabled=lesson===lessons.length-1;
 $('examples').replaceChildren();
 const cards=gallery(formula,round);
 const response=m=>lesson<8 ? shortResponse(formula,m) : proposedResponse(formula,m);
 for (const value of [true,false]) { const m=cards.find(candidate=>truth(formula,candidate)===value); const e=card(m,`${formula} is ${value?'true':'false'}`,$('pictures').checked,formula); const p=document.createElement('p'); p.textContent=response(m).replace(/^(Correct!|Not quite\.)\s*/, ''); e.append(p); $('examples').append(e); }
 $('gallery').replaceChildren();
 cards.forEach((m,i)=>{
   const button=document.createElement('button'); button.type='button'; button.className='model-button';
   button.setAttribute('aria-pressed',chosen.has(i));
   button.append(card(m,`Model ${i+1}${chosen.has(i)?' ✓':''}`,$('pictures').checked,formula));
   button.onclick=()=>{
     const correct = truth(formula,m);
     if(correct) chosen.add(i);
     showFeedback('feedback',response(m),!correct);
     $('explanation').textContent=expandedResponse(formula,m);
     $('more').hidden=!/[¬∧∨→↔∃∀]/.test(formula); $('more').open=false;
     $('complete').hidden=chosen.size!==cards.filter(c=>truth(formula,c)).length;
     renderCards();
   };
   $('gallery').append(button);
 });
 const type=evaluate(formula,cards[0]).formula.type;
 $('witness-section').hidden=type!=='exists' && type!=='forall';
 if(!$('witness-section').hidden) renderWitness();
}
function renderCards(){ const buttons=$('gallery').children; for(let i=0;i<buttons.length;i++){ const selected=chosen.has(i); buttons[i].setAttribute('aria-pressed',selected); buttons[i].querySelector('h3').textContent=`Model ${i+1}${selected?' ✓':''}`; } }
function renderWitness(){
 const formula=activeFormula(), type=evaluate(formula,gallery(formula,0)[0]).formula.type, isWitness=type==='exists';
 const oldModels=[model(1,2,[1,3],[]),model(1,2,[2],[]),model(1,2,[1,2,3],[])];
 const m=lesson===7 && !variation ? oldModels[witnessRound%oldModels.length] : gallery(formula,witnessRound).find(candidate=>truth(formula,candidate)===isWitness);
 $('candidate-title').textContent=isWitness?'Find a witness':'Find a counterexample';
 $('candidate-instructions').textContent=isWitness ? `In this model, ${formula} is true. Choose an object that makes its condition true.` : `In this model, ${formula} is false. Choose an object that makes its condition false.`;
 $('witness-model').replaceChildren(card(m,isWitness?'Witness model':'Counterexample model',$('pictures').checked,formula)); $('witness-choices').replaceChildren();
 for(const object of m.domain){ const b=document.createElement('button'); b.type='button'; b.textContent=`Object ${object}`; b.onclick=()=>{const valid=checkCandidate(formula,m,object).valid;showFeedback('witness-feedback',lesson===7&&!variation?witnessResponse(object,valid):proposedCandidate(formula,m,object),!valid);}; $('witness-choices').append(b); }
}
function go(i){lesson=i;round=0;variation=false;witnessRound=0;clearRound();showFeedback('witness-feedback','Choose an object.');try{localStorage.setItem('fol-truth-practice-lesson',String(lesson));}catch{} render();}
lessons.forEach((l,i)=>{const o=document.createElement('option');o.value=i;o.textContent=`Level ${l.level} · ${l.formula}`;$('lesson').append(o);});
$('lesson').onchange=e=>go(Number(e.target.value)); $('previous').onclick=()=>go(lesson-1); $('next').onclick=()=>go(lesson+1);
$('round').onclick=()=>{round++;clearRound();render();}; $('variation').onclick=()=>{variation=!variation;round=0;witnessRound=0;clearRound();showFeedback('witness-feedback','Choose an object.');render();}; $('pictures').onchange=render;
$('witness-next').onclick=()=>{witnessRound++;showFeedback('witness-feedback','Choose an object.');renderWitness();};
$('introduction-picture').append(modelPicture(model(1,2,[1,3],[2,3]), { predicates:['P','Q'], constants:['a'] }));
$('existential-introduction-picture').append(modelPicture(model(1,2,[1],[2,3]), { predicates:['P','Q'], constants:[] }));
$('universal-introduction-picture').append(modelPicture(model(1,2,[1,2,3],[1,3]), { predicates:['P','Q'], constants:[] }));
for (const [heading, m] of [
  ['Overlapping properties', model(1,2,[1,3],[2,3])],
  ['The same objects have P and Q', model(2,2,[1,2],[1,2])],
  ['No objects have P', model(1,2,[],[2])],
  ['An object with neither property', model(1,3,[1],[2])]
]) $('prototypes').append(card(m,heading,true,'Pa ∧ Qb'));
render();
