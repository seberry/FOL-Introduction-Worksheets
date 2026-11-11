import { evaluate, checkCandidate, formatFormula } from '../fol-explanations/index.mjs';

// These lessons and response patterns were approved by the instructor.
export const proposedLessons = [
  {level:2, formula:'∃x (Px ∧ Qx)', introduction:'At least one object has both P and Q.', variation:'∃x (Qx ∧ Rx)'},
  {level:2, formula:'∃x (Px ∨ Qx)', introduction:'At least one object has P or Q, or both.', variation:'∃x (Qx ∨ Rx)'},
  {level:2, formula:'∃x (Px ∧ ¬Qx)', introduction:'At least one object has P and does not have Q.', variation:'∃x (Qx ∧ ¬Px)'},
  {level:2, formula:'∃x (Px ∧ Qx ∧ Rx)', introduction:'At least one object has all three properties P, Q, and R.', variation:'∃x (Px ∧ Qx ∧ ¬Rx)'},
  {level:3, formula:'∀x Px', introduction:'Every object has P.', variation:'∀x Qx'},
  {level:3, formula:'∀x (Px ∧ Qx)', introduction:'Every object has both P and Q.', variation:'∀x (Qx ∧ Rx)'},
  {level:3, formula:'∀x (Px ∨ Qx)', introduction:'Every object has P or Q, or both.', variation:'∀x (Qx ∨ Rx)'},
  {level:3, formula:'∀x (Px ↔ Qx)', introduction:'Every object has P and Q together, or has neither.', variation:'∀x (Qx ↔ Rx)'},
  {level:3, formula:'∀x (Px → (Qx ∧ Rx))', introduction:'Every object with P has both Q and R.', variation:'∀x (Qx → (Px ∧ Rx))'},
  {level:4, formula:'(∃x Px) ∧ (∃x Qx)', introduction:'Something is P and something is Q; they may be different objects.', variation:'(∃x Qx) ∧ (∃x Rx)'},
  {level:4, formula:'(∃x Px) ∧ (∀x ¬Qx)', introduction:'Something is P and nothing is Q.', variation:'(∃x Qx) ∧ (∀x ¬Px)'},
  {level:4, formula:'(∀x Px) → (∃x Qx)', introduction:'If everything is P, then something is Q.', variation:'(∀x Qx) → (∃x Px)'}
];
const list = xs => xs.length ? xs.join(', ') : 'none';
const names = formula => ['P','Q','R'].filter(p => formula.includes(p));
export function reviewGallery(formula, round=0) {
  const predicates=names(formula), groups=[[],[]], target=[3,2,4][round%3];
  // Using 1–4 objects provides distinct empty/full extensions for simple quantifiers.
  for(let size=1;size<=4;size++) {
    const domain=Array.from({length:size},(_,i)=>i+1), count=2**size;
    for(let code=0;code<count**predicates.length;code++) {
      let n=code; const extensions={P:[],Q:[],R:[]};
      for(const p of predicates) { const mask=n%count; n=Math.floor(n/count); extensions[p]=domain.filter((_,i)=>mask & (1<<i)); }
      const m={domain,constants:{a:1,b:1},predicates:extensions};
      groups[Number(evaluate(formula,m).value)].push(m);
    }
  }
  function shuffle(xs,seed) { const a=[...xs]; let state=seed>>>0; for(let i=a.length-1;i>0;i--){state=(Math.imul(state,1664525)+1013904223)>>>0;const j=state%(i+1);[a[i],a[j]]=[a[j],a[i]];}return a; }
  const seed=[...formula].reduce((s,c)=>(Math.imul(s,31)+c.codePointAt(0))>>>0,1)+round*991;
  return shuffle([...shuffle(groups[1],seed).slice(0,target),...shuffle(groups[0],seed+313).slice(0,6-target)],seed+719);
}
const compact = text => text.replace(/\b([A-Z])\(([a-z])\)/g,'$1$2');
const display = formula => compact(formatFormula(formula));
const value = bool => bool?'true':'false';
export function proposedResponse(formula, model) {
 const t=evaluate(formula,model), f=t.formula; let reason;
 if(f.type==='exists') { const found=t.children.find(c=>c.value); reason=found ? `${found.object} is a witness: ${display(f.body)} is true when x is ${found.object}.` : `No object makes ${display(f.body)} true.`; }
 else if(f.type==='forall') { const found=t.children.find(c=>!c.value); reason=found ? `${found.object} is a counterexample: ${display(f.body)} is false when x is ${found.object}.` : `Every object makes ${display(f.body)} true.`; }
 else reason=`${display(f.left)} is ${value(t.children[0].value)} and ${display(f.right)} is ${value(t.children[1].value)}.`;
 return `${t.value?'Correct!':'Not quite.'} ${reason} So ${formula} is ${value(t.value)}.`;
}
export function proposedCandidate(formula, model, object) {
 const r=checkCandidate(formula,model,object);
 const kind=r.kind==='witness'?'witness':'counterexample';
 return `${r.valid?'Correct!':'Not quite.'} ${object} ${r.valid?'is':'is not'} a ${kind}: ${display(r.trace.formula.body)} is ${value(r.bodyTrace.value)} when x is ${object}.`;
}
export function describe(model) { return `Domain: ${list(model.domain)}; P: ${list(model.predicates.P)}; Q: ${list(model.predicates.Q)}; R: ${list(model.predicates.R)}`; }
