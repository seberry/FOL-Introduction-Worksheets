import test from 'node:test';
import assert from 'node:assert/strict';
import { evaluate, checkCandidate } from '../fol-explanations/index.mjs';
import { proposedLessons, reviewGallery, proposedResponse, proposedCandidate } from './quantified.mjs';
const m=(p,q,r=[])=>({domain:[1,2,3],constants:{a:1,b:1},predicates:{P:p,Q:q,R:r}});
test('all proposed initial and repeat galleries have six distinct models and intended truth counts',()=>{
 for(const lesson of proposedLessons) for(const f of [lesson.formula,lesson.variation]) for(let round=0;round<3;round++){
  const cards=reviewGallery(f,round); assert.equal(cards.length,6,f); assert.equal(new Set(cards.map(x=>JSON.stringify(x))).size,6,f);
  assert.equal(cards.filter(x=>evaluate(f,x).value).length,[3,2,4][round],f);
  for(const model of cards) assert.match(proposedResponse(f,model),evaluate(f,model).value?/^Correct!/:/^Not quite\./);
 }
});
test('quantified and combined cases respect witnesses, counterexamples, and vacuous implication',()=>{
 const separate=m([1],[2]);
 assert.equal(evaluate('∃x (Px ∧ Qx)',separate).value,false);
 assert.equal(evaluate('(∃x Px) ∧ (∃x Qx)',separate).value,true);
 assert.equal(evaluate('∀x (Px → (Qx ∧ Rx))',m([],[],[])).value,true);
 assert.equal(evaluate('∀x (Px ↔ Qx)',m([],[],[])).value,true);
 const full=m([1,2,3],[1,3]); assert.equal(evaluate('∀x Px',full).value,true); assert.equal(evaluate('∀x Qx',full).value,false);
 assert.match(proposedCandidate('∀x Qx',full,2),/2 is a counterexample/);
 assert.match(proposedCandidate('∀x Qx',full,1),/1 is not a counterexample/);
 assert.equal(checkCandidate('∃x (Px ∨ Qx)',separate,1).valid,true); assert.equal(checkCandidate('∃x (Px ∨ Qx)',separate,2).valid,true);
});
test('all generated object feedback agrees with the candidate checker',()=>{
 for(const lesson of proposedLessons) for(const formula of [lesson.formula,lesson.variation]) for(const model of reviewGallery(formula)){
  const trace=evaluate(formula,model);
  if(!['exists','forall'].includes(trace.formula.type)) continue;
  if(!(trace.formula.type==='exists' ? trace.value : !trace.value)) continue;
  for(const object of model.domain){
   const candidate=checkCandidate(formula,model,object), text=proposedCandidate(formula,model,object);
   assert.equal(text.startsWith('Correct!'),candidate.valid);
   assert.ok(text.includes(`is ${candidate.bodyTrace.value?'true':'false'} when x is ${object}`));
  }
 }
});
