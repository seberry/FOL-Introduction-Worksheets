import test from 'node:test';
import assert from 'node:assert/strict';
import { model, lessons, gallery, truth } from './models.mjs';
import { shortResponse, expandedResponse, witnessResponse } from './feedback.mjs';
test('atomic feedback uses only relevant terms and covers empty and nonempty extensions',()=>{
 assert.equal(shortResponse('Pa',model(2,1,[1,3],[2])), 'Not quite. a names 2 and P only applies to 1 and 3, so Pa is false.');
 assert.equal(shortResponse('Pa',model(2,1,[],[2])), 'Not quite. a names 2 and P applies to nothing, so Pa is false.');
 assert.equal(shortResponse('Pa',model(1,1,[1,3],[])), 'Correct! a names 1 and P applies to 1 and 3, so Pa is true.');
});
test('disjunction and conditional feedback correctly report part truth and conclusion',()=>{
 const m=model(1,2,[1],[]);
 assert.equal(shortResponse('Pa ∨ Qb',m), 'Correct! Pa is true and Qb is false, so Pa ∨ Qb is true.');
 assert.equal(shortResponse('Pa → Qb',m), 'Not quite. Pa is true and Qb is false, so Pa → Qb is false.');
 assert.match(shortResponse('Pa → Qb',model(1,2,[],[])), /Pa is false and Qb is false, so Pa → Qb is true/);
});
test('all gallery responses and expanded explanations reflect evaluator truth and compact notation',()=>{
 for(const lesson of lessons) for(const f of [lesson.formula,lesson.variation]) for(let r=0;r<6;r++) for(const m of gallery(f,r)) {
  assert.match(shortResponse(f,m), truth(f,m)? /^Correct!/: /^Not quite\./);
  assert.doesNotMatch(expandedResponse(f,m), /\b[PQ]\([abx]\)/);
 }
});
test('witness feedback uses the chosen object',()=>{
 assert.equal(witnessResponse(3,true),'Correct! P applies to 3, so 3 is a witness.');
 assert.equal(witnessResponse(2,false),'Not quite. P does not apply to 2, so 2 is not a witness.');
});
