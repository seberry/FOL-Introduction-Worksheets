import { evaluate } from '../fol-explanations/index.mjs';
import { shortResponse } from '../FOL-Truth-Practice/feedback.mjs';
import { proposedResponse, proposedCandidate } from '../FOL-Truth-Practice/quantified.mjs';
export const lessons = [
 {formula:'Rab', introduction:'Rab says that the object named by a bears R to the object named by b.', variation:'Rcd'},
 {formula:'Rba', introduction:'Rba asks whether the object named by b bears R to the object named by a. Notice the order.', variation:'Rdc'},
 {formula:'Raa', introduction:'Raa asks whether the object named by a bears R to itself. Look for a loop at a.', variation:'Rbb'},
 {formula:'Rab', introduction:'The names a and b may name the same object. If they do, Rab asks about a loop at that object.', variation:'Rba', shared:true},
 {formula:'¬Rab', introduction:'¬Rab says that a does not bear R to b. Other arrows may still be present.', variation:'¬Rba'},
 {formula:'Rab ∧ Rba', introduction:'Rab ∧ Rba says that a bears R to b and b bears R to a. Both parts must be true.', variation:'Rcd ∧ Rdc'},
 {formula:'Rab ∨ Rba', introduction:'Rab ∨ Rba says that at least one of the two relations holds. Both may hold.', variation:'Rcd ∨ Rdc'},
 {formula:'Rab → Rba', introduction:'Rab → Rba is false only when Rab is true and Rba is false.', variation:'Rba → Rab'},
 {formula:'∃x Rax', introduction:'The object named by a bears R to something: look for an arrow starting at a.', variation:'∃x Rbx'},
 {formula:'∃x Rxa', introduction:'Something bears R to a: look for an arrow ending at the object named by a.', variation:'∃x Rxb'},
 {formula:'∃x Rxx', introduction:'Some object bears R to itself: look for a loop.', variation:'∃y Ryy'},
 {formula:'∃x (Rax ∧ Rxa)', introduction:'Some object is related to a in both directions. The same object must work for both parts.', variation:'∃x (Rbx ∧ Rxb)'},
 {formula:'∀x Rax', introduction:'The object named by a bears R to every object, including itself.', variation:'∀x Rbx'},
 {formula:'∀x Rxa', introduction:'Every object bears R to the object named by a, including a itself.', variation:'∀x Rxb'},
 {formula:'∀x Rxx', introduction:'Every object bears R to itself: each object has a loop.', variation:'∀y Ryy'},
 {formula:'∀x (Rax → Rxa)', introduction:'For every object, if a bears R to it, then it bears R to a.', variation:'∀x (Rbx → Rxb)'},
 {formula:'∃x ∃y Rxy', introduction:'Some object bears R to some object. A loop counts: x and y may be the same.', variation:'∃x ∃y Ryx'},
 {formula:'∃x ∃y (Rxy ∧ Rya)', introduction:'Something bears R to an object that bears R to a. The same object y connects the two claims.', variation:'∃x ∃y (Rxy ∧ Ryy)'},
 {formula:'∀x ∀y Rxy', introduction:'Every object bears R to every object, including itself.', variation:'∀x ∀y Ryx'},
 {formula:'∃x ∀y Rxy', introduction:'One object bears R to every object. The same x must work for all choices of y.', variation:'∃x ∀y Ryx'},
 {formula:'∀x ∃y Rxy', introduction:'Every object bears R to something. Different objects may have different targets.', variation:'∀x ∃y Ryx'}
].map((lesson, i) => ({...lesson, level: i<4?1:i<8?2:i<12?3:i<16?4:i<18?5:i-12}));
export function model(a,b,pairs,domain=[1,2]) { return {domain,constants:{a,b,c:a,d:b},predicates:{R:pairs}}; }
export const truth=(formula,m)=>evaluate(formula,m).value;
const first=[[],[[1,2]],[[2,1]],[[1,2],[2,1]],[[1,1]],[[1,2],[2,2]]].map(r=>model(1,2,r));
export function gallery(lesson,formula,round=0) {
 if(lesson===0 && formula==='Rab' && round===0) return first;
 if(lesson===16 && formula==='∃x ∃y Rxy' && round===0) return [
  model(1,1,[[1,2]],[1,2,3]), model(1,1,[],[1,2]),
  model(1,1,[[2,1]],[1,2]), model(1,1,[],[1,2,3]),
  model(1,1,[[1,1]],[1,2]), model(1,1,[],[1])
 ];
 if(lesson>=16) return nestedGallery(formula,round);
 const groups=[[],[]], all=[[1,1],[1,2],[2,1],[2,2]], seen=new Set();
 for(const a of [1,2]) for(const b of [1,2]) {
   if(lessons[lesson].shared && a!==b) continue;
   for(let mask=0;mask<16;mask++) {const m=model(a,b,all.filter((_,i)=>mask&(1<<i))); const relevant=lesson>=8 ? [formula.includes('a')?a:null,formula.includes('b')?b:null,mask] : [a,b,mask]; const key=JSON.stringify(relevant);if(seen.has(key))continue;seen.add(key);groups[Number(truth(formula,m))].push(m);}
 }
 function shuffle(xs,seed) { const a=[...xs]; let state=seed>>>0; for(let i=a.length-1;i>0;i--){state=(Math.imul(state,1664525)+1013904223)>>>0; const j=state%(i+1); [a[i],a[j]]=[a[j],a[i]];} return a; }
 const seed=(lesson+1)*157+round*911+(formula==='Rba'?23:0); const target=[3,2,4][round%3];
 if(lesson===15 && round===0) {
  const special=[model(1,2,[[1,2],[2,1]]),model(1,2,[])];
  const seenSpecial=new Set(special.map(m=>JSON.stringify([m.constants.a,m.constants.b,m.predicates.R])));
  const others=shuffle(groups[1],seed).filter(m=>!seenSpecial.has(JSON.stringify([m.constants.a,m.constants.b,m.predicates.R])));
  return shuffle([...special,...others.slice(0,target-2),...shuffle(groups[0],seed+73).slice(0,6-target)],seed+151);
 }
 return shuffle([...shuffle(groups[1],seed).slice(0,target),...shuffle(groups[0],seed+73).slice(0,6-target)],seed+151);
}
export function feedback(formula,m) {
 const t=evaluate(formula,m);
 if(formula==='∃x ∀y Rxy' && !t.value) return 'Not quite. No object makes ∀y Rxy true. No object in the domain bears R to everything. So ∃x ∀y Rxy is false.';
 if(t.formula.type === 'exists' || t.formula.type === 'forall') return compactQuantifier(proposedResponse(formula,m),t.formula.variable);
 if(t.formula.type !== 'atomic') return shortResponse(formula,m).replace(/\b([A-Z])\(([a-z]),\s*([a-z])\)/g,'$1$2$3');
 const [firstTerm,secondTerm]=t.formula.args, [x,y]=t.resolvedTerms;
 const names=firstTerm.name===secondTerm.name ? `${firstTerm.name} names ${x}` : `${firstTerm.name} names ${x} and ${secondTerm.name} names ${y}`;
 return `${t.value?'Correct!':'Not quite.'} ${names}. ⟨${x}, ${y}⟩ is ${t.value?'':'not '}in R, so ${formula} is ${t.value?'true':'false'}.`;
}

function compactQuantifier(text,variable) { return text.replace(/\b([A-Z])\(([a-z]),\s*([a-z])\)/g,'$1$2$3').replace(/when x is/g,`when ${variable} is`); }
export function candidateFeedback(formula,m,object) { return compactQuantifier(proposedCandidate(formula,m,object),evaluate(formula,m).formula.variable); }
export function exampleModel(formula,value) {
 const pairs=[[1,1],[1,2],[2,1],[2,2]];
 for(let mask=0;mask<16;mask++){const m=model(1,2,pairs.filter((_,i)=>mask&(1<<i)));if(truth(formula,m)===value)return m;}
 throw new Error(`No example for ${formula}`);
}

// Exhaustive small relations, with no irrelevant name assignments in the gallery.
function nestedGallery(formula, round) {
 const groups=[[],[]];
 for(const size of [1,2,3]) {
  const domain=Array.from({length:size},(_,i)=>i+1), pairs=domain.flatMap(x=>domain.map(y=>[x,y]));
  for(let mask=0;mask<2**pairs.length;mask++) {
   const m=model(1,1,pairs.filter((_,i)=>mask&(1<<i)),domain);
   groups[Number(truth(formula,m))].push(m);
  }
 }
 const shuffle=(xs,seed)=>{const a=[...xs];let state=seed>>>0;for(let i=a.length-1;i>0;i--){state=(Math.imul(state,1664525)+1013904223)>>>0;const j=state%(i+1);[a[i],a[j]]=[a[j],a[i]];}return a;};
 const seed=[...formula].reduce((n,c)=>(Math.imul(n,31)+c.codePointAt(0))>>>0,1)+round*991;
 // Empty and complete relations provide only three distinct cases on 1–3 objects.
 const target=Math.max(6-groups[0].length,Math.min([3,2,4][round%3],groups[1].length));
 return shuffle([...shuffle(groups[1],seed).slice(0,target),...shuffle(groups[0],seed+73).slice(0,6-target)],seed+151);
}
