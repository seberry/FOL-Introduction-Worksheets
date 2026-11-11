import test from 'node:test';
import assert from 'node:assert/strict';
import { lessons, gallery, truth, witness, model } from './models.mjs';
test('every round has six models and the intended truth count', () => {
  for (const {formula,variation} of lessons) for (const f of [formula,variation]) for (let round=0;round<6;round++) {
    const cards=gallery(f,round); assert.equal(cards.length,6); assert.equal(cards.filter(m=>truth(f,m)).length,[3,2,4][round%3]);
    assert.equal(new Set(cards.map(m=>JSON.stringify(m))).size,6);
  }
});
test('witnesses include all and only objects in the extension', () => {
  for (const ext of [[],[1],[1,3],[1,2,3]]) { const m=model(1,2,ext,[]); for (const n of m.domain) assert.equal(witness('∃x Px',m,n),ext.includes(n)); }
});
test('conditionals include vacuous truth and false antecedent cases', () => {
  assert.equal(truth('Pa → Qa',model(1,2,[],[])),true);
  assert.equal(truth('Pa → Qa',model(1,2,[1],[])),false);
  assert.equal(truth('Pa → Qa',model(1,2,[1],[1])),true);
});
