(function () {
  'use strict';

  // --- Accessibility relation checkers ---
  // Used by 'relation' constraints to verify frame properties.

  function isReflexive(model) {
    var states = model.getStates();
    for (var i = 0; i < states.length; i++) {
      if (!states[i]) continue;
      var successors = model.getSuccessorsOf(i) || [];
      if (successors.indexOf(i) === -1) return false;
    }
    return true;
  }

  function isSymmetric(model) {
    var states = model.getStates();
    for (var i = 0; i < states.length; i++) {
      if (!states[i]) continue;
      var successors = model.getSuccessorsOf(i) || [];
      for (var j = 0; j < successors.length; j++) {
        var target = successors[j];
        var backEdges = model.getSuccessorsOf(target) || [];
        if (backEdges.indexOf(i) === -1) return false;
      }
    }
    return true;
  }

  function isTransitive(model) {
    var states = model.getStates();
    for (var i = 0; i < states.length; i++) {
      if (!states[i]) continue;
      var successors = model.getSuccessorsOf(i) || [];
      for (var j = 0; j < successors.length; j++) {
        var mid = successors[j];
        var midSuccs = model.getSuccessorsOf(mid) || [];
        for (var k = 0; k < midSuccs.length; k++) {
          var end = midSuccs[k];
          if (model.getSuccessorsOf(i).indexOf(end) === -1) return false;
        }
      }
    }
    return true;
  }

  var relationChecks = {
    reflexive: isReflexive,
    symmetric: isSymmetric,
    transitive: isTransitive
  };

  function createWorksheetApp(config) {
    if (!config || !Array.isArray(config.problems)) {
      throw new Error('Worksheet config with problems is required.');
    }

    var problems = config.problems;
    var activeIndex = 0;
    var worldOffset = config.worldOffset || 0;

    function worldLabel(world) {
      return 'w' + (world + worldOffset);
    }

    function renderProblemList() {
      var list = document.getElementById('problem-list');
      list.innerHTML = '';

      problems.forEach(function (problem, idx) {
        var btn = document.createElement('button');
        btn.className = 'problem-button' + (idx === activeIndex ? ' active' : '');
        var status = problem.diagnostic ? 'ℹ️' : (problem.solved ? '✅' : '⬜');
        btn.innerHTML = '<span class="status">' + status + '</span>' + problem.title;
        btn.onclick = function () { setActiveProblem(idx); };
        list.appendChild(btn);
      });
    }

    function renderConstraintText(constraint) {
      if (constraint.type === 'truth') {
        return 'At ' + worldLabel(constraint.world) + ': ' + constraint.formula +
          ' should be ' + (constraint.expected ? 'true' : 'false') + '.';
      }

      if (constraint.type === 'different') {
        return 'At ' + worldLabel(constraint.world) + ': ' + constraint.formulaA +
          ' and ' + constraint.formulaB + ' must have different truth values.';
      }

      if (constraint.type === 'relation') {
        var expectation = constraint.expected ? 'should hold' : 'should fail';
        return 'Accessibility ' + constraint.property + ' ' + expectation + '.';
      }

      return 'Unknown constraint type.';
    }

    function setActiveProblem(index) {
      activeIndex = index;
      renderProblemList();

      var problem = problems[activeIndex];
      document.getElementById('problem-title').textContent = problem.title;
      var desc = problem.description.trim();
      if (problem.frame) {
        desc += ' (Frame: ' + problem.frame + ')';
      }
      document.getElementById('problem-description').textContent = desc;

      var ul = document.getElementById('constraint-list');
      ul.innerHTML = '';
      problem.constraints.forEach(function (constraint) {
        var li = document.createElement('li');
        li.textContent = renderConstraintText(constraint);
        ul.appendChild(li);
      });

      document.getElementById('result').textContent = '';

      var frame = document.getElementById('playground-frame');
      var url = config.playgroundSrc || 'modallogic/index.html';
      if (problem.modelString) {
        url += '?model=' + encodeURIComponent(problem.modelString);
      }
      frame.src = url;
    }

    function formatModelForForallX(model) {
      var states = model.getStates();
      var worldIndices = [];
      var i;

      for (i = 0; i < states.length; i++) {
        if (states[i] !== null && states[i] !== undefined) {
          worldIndices.push(i);
        }
      }

      var W = 'W: ' + (worldIndices.length ? worldIndices.map(function (idx) {
        return idx + worldOffset;
      }).join(', ') : '—');

      var pairs = [];
      worldIndices.forEach(function (source) {
        var succ = model.getSuccessorsOf(source);
        succ.forEach(function (target) {
          if (worldIndices.indexOf(target) !== -1) {
            pairs.push('⟨' + (source + worldOffset) + ',' + (target + worldOffset) + '⟩');
          }
        });
      });
      var R = 'R: ' + (pairs.length ? pairs.join(', ') : '—');

      var varsSet = new Set();
      states.forEach(function (state) {
        if (!state) return;
        for (var prop in state) varsSet.add(prop);
      });

      var vars = Array.from(varsSet).sort();
      var nuParts = [];
      worldIndices.forEach(function (world) {
        var state = states[world] || {};
        vars.forEach(function (prop) {
          nuParts.push('ν' + (world + worldOffset) + '(' + prop + ') = ' + (state[prop] ? 'T' : 'F'));
        });
      });
      var nu = 'ν: ' + (nuParts.length ? nuParts.join(', ') : '—');

      return W + '\n' + R + '\n' + nu;
    }

    function evaluateConstraint(constraint, iframeMPL, model) {
      if (constraint.type === 'truth') {
        var wff = new iframeMPL.Wff(constraint.formula);
        var value = iframeMPL.truth(model, constraint.world, wff);
        return {
          ok: value === constraint.expected,
          line: 'At ' + worldLabel(constraint.world) + ': ' + constraint.formula + ' is ' +
            (value ? 'T' : 'F') + ' (expected ' + (constraint.expected ? 'T' : 'F') + ')'
        };
      }

      if (constraint.type === 'different') {
        var formulaA = new iframeMPL.Wff(constraint.formulaA);
        var formulaB = new iframeMPL.Wff(constraint.formulaB);
        var valueA = iframeMPL.truth(model, constraint.world, formulaA);
        var valueB = iframeMPL.truth(model, constraint.world, formulaB);
        return {
          ok: valueA !== valueB,
          line: 'At ' + worldLabel(constraint.world) + ': ' + constraint.formulaA + ' = ' +
            (valueA ? 'T' : 'F') + ', ' + constraint.formulaB + ' = ' +
            (valueB ? 'T' : 'F') + ' (need them to differ)'
        };
      }

      if (constraint.type === 'relation') {
        var checker = relationChecks[constraint.property];
        if (!checker) {
          return { ok: false, line: 'Unknown relation property: ' + constraint.property };
        }
        var val = checker(model);
        var ok = val === constraint.expected;
        var descriptor = constraint.property.charAt(0).toUpperCase() + constraint.property.slice(1);
        var status = val ? 'holds' : 'fails';
        return {
          ok: ok,
          line: 'Accessibility: ' + descriptor + ' ' + status +
            ' (expected ' + (constraint.expected ? 'to hold' : 'to fail') + ')'
        };
      }

      throw new Error('Unsupported constraint type: ' + constraint.type);
    }

    function buildTraceSections(problem, model, iframeMPL) {
      if (!config.useTrace) return [];
      if (!iframeMPL || typeof iframeMPL.truthWithTrace !== 'function') {
        throw new Error('Trace mode requires MPL.truthWithTrace in the iframe.');
      }

      var traceLines = [];
      problem.constraints.forEach(function (constraint) {
        if (constraint.type === 'truth') {
          var wff = new iframeMPL.Wff(constraint.formula);
          var trace = iframeMPL.truthWithTrace(model, constraint.world, wff);
          traceLines.push(trace.trace);
          traceLines.push('');
          return;
        }

        if (constraint.type === 'different') {
          var formulaA = new iframeMPL.Wff(constraint.formulaA);
          var formulaB = new iframeMPL.Wff(constraint.formulaB);
          traceLines.push(iframeMPL.truthWithTrace(model, constraint.world, formulaA).trace);
          traceLines.push('');
          traceLines.push(iframeMPL.truthWithTrace(model, constraint.world, formulaB).trace);
          traceLines.push('');
        }
      });

      return traceLines;
    }

    function checkCurrentProblem() {
      var frame = document.getElementById('playground-frame');
      var win = frame.contentWindow;

      if (!win || !win.MPL || !win.model) {
        alert('Playground not ready yet — try again in a moment.');
        return;
      }

      var problem = problems[activeIndex];
      var model = win.model;
      var iframeMPL = win.MPL;

      problem.modelString = model.getModelString();

      var allOk = true;
      var lines = [];

      problem.constraints.forEach(function (constraint) {
        // relation constraints don't need MPL for truth evaluation
        if (constraint.type === 'relation') {
          var evaluation = evaluateConstraint(constraint, iframeMPL, model);
          allOk = allOk && evaluation.ok;
          lines.push(evaluation.line);
          return;
        }
        var evaluation = evaluateConstraint(constraint, iframeMPL, model);
        allOk = allOk && evaluation.ok;
        lines.push(evaluation.line);
      });

      if (!problem.diagnostic) {
        problem.solved = allOk;
      }
      renderProblemList();

      var hasRelationConstraints = problem.constraints.some(function (c) { return c.type === 'relation'; });
      var out = lines.join('\n') + '\n\n';
      if (problem.diagnostic) {
        out += 'ℹ️ Diagnostic prompt: truth values and frame properties are reported but not graded.';
        if (allOk) {
          out += '\n\nModel in Forall x style:\n';
          out += formatModelForForallX(model);
        }
      } else if (allOk) {
        var successMsg = hasRelationConstraints
          ? '✅ Meets the truth and accessibility constraints.'
          : '✅ Solved!';
        out += successMsg + '\n\nModel in Forall x style:\n';
        out += formatModelForForallX(model);
      } else {
        out += '❌ Not yet — adjust your model and try again.';
      }

      if (config.useTrace) {
        out += '\n\n--- Evaluation Trace ---\n\n';
        out += buildTraceSections(problem, model, iframeMPL).join('\n');
      }

      document.getElementById('result').textContent = out;
    }

    function resizePlayground() {
      var iframe = document.getElementById('playground-frame');
      if (!iframe) return;
      try {
        var innerDoc = iframe.contentDocument || iframe.contentWindow.document;
        iframe.style.height = innerDoc.body.scrollHeight + 'px';
      } catch (e) {
        // same-origin expected; fail silently if not available
      }
    }

    function init() {
      document.getElementById('playground-frame').addEventListener('load', resizePlayground);
      renderProblemList();
      setActiveProblem(0);
    }

    return {
      init: init,
      checkCurrentProblem: checkCurrentProblem
    };
  }

  window.createWorksheetApp = createWorksheetApp;
})();
