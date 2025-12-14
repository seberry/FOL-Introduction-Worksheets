// Helpers for basic frame property checks on a Kripke model.
// These helpers are not wired into the worksheet yet; they can be
// imported later to enforce reflexivity, symmetry, and transitivity.

(function (global) {
  // A relation R is reflexive when every world sees itself. "states.length"
  // is the number of worlds in the current model. We loop over them by index
  // (JavaScript arrays are 0-based), ask the model for that world's
  // successors, and then check that the world index "i" shows up in its own
  // successor array. If any world is missing that self-loop, the relation is
  // not reflexive.
  function isReflexive(model) {
    const states = model.getStates();
    for (let i = 0; i < states.length; i++) {
      if (!states[i]) continue;
      const successors = model.getSuccessorsOf(i) || [];
      if (!successors.includes(i)) return false;
    }
    return true;
  }

  // Symmetry means every edge i → j has a matching edge j → i. "successors"
  // is just an array of world indices; "target" is one such index reached from
  // world i. We fetch that target's own successor array and confirm it
  // includes i. Because "includes" is a plain array method, this logic should
  // read naturally even if you're not used to JavaScript syntax. The first
  // missing “back edge” disproves symmetry.
  function isSymmetric(model) {
    const states = model.getStates();
    for (let i = 0; i < states.length; i++) {
      if (!states[i]) continue;
      const successors = model.getSuccessorsOf(i) || [];
      for (const target of successors) {
        const backEdges = model.getSuccessorsOf(target) || [];
        if (!backEdges.includes(i)) return false;
      }
    }
    return true;
  }

  // Transitivity requires that whenever i → j and j → k, we also have i → k.
  // Here we nest loops to match that description directly: for every start
  // world i, we look at each successor "mid"; for each of those, we look at
  // every successor "end"; then we confirm that "end" also appears in the
  // original successor list for i. No JavaScript tricks—just arrays and
  // for-loops—so readers coming from another language can follow the control
  // flow. If any two-step path is missing its direct i → k edge, transitivity
  // fails.
  function isTransitive(model) {
    const states = model.getStates();
    for (let i = 0; i < states.length; i++) {
      if (!states[i]) continue;
      const successors = model.getSuccessorsOf(i) || [];
      for (const mid of successors) {
        const midSuccs = model.getSuccessorsOf(mid) || [];
        for (const end of midSuccs) {
          const hasEdge = model.getSuccessorsOf(i).includes(end);
          if (!hasEdge) return false;
        }
      }
    }
    return true;
  }

  global.AccessibilityChecks = {
    isReflexive,
    isSymmetric,
    isTransitive,
  };
})(typeof window !== 'undefined' ? window : globalThis);
