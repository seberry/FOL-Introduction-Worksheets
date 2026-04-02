(function () {
  'use strict';

  function createWorksheetApp(config) {
    if (!config || !Array.isArray(config.problems)) {
      throw new Error('Worksheet config with problems is required.');
    }

    var problems = config.problems;
    var activeIndex = 0;
    var traceMPL = config.traceMPL || null;
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
        var status = problem.solved ? '✅' : '⬜';
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

      return 'Unknown constraint type.';
    }

    function setActiveProblem(index) {
      activeIndex = index;
      renderProblemList();

      var problem = problems[activeIndex];
      document.getElementById('problem-title').textContent = problem.title;
      document.getElementById('problem-description').textContent = problem.description.trim();

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

      throw new Error('Unsupported constraint type: ' + constraint.type);
    }

    function buildTraceSections(problem, model) {
      if (!config.useTrace) return [];
      if (!traceMPL || typeof traceMPL.truthWithTrace !== 'function') {
        throw new Error('Trace mode requires traceMPL.truthWithTrace.');
      }

      var traceLines = [];
      problem.constraints.forEach(function (constraint) {
        if (constraint.type === 'truth') {
          var wff = new traceMPL.Wff(constraint.formula);
          var trace = traceMPL.truthWithTrace(model, constraint.world, wff);
          traceLines.push(trace.trace);
          traceLines.push('');
          return;
        }

        if (constraint.type === 'different') {
          var formulaA = new traceMPL.Wff(constraint.formulaA);
          var formulaB = new traceMPL.Wff(constraint.formulaB);
          traceLines.push(traceMPL.truthWithTrace(model, constraint.world, formulaA).trace);
          traceLines.push('');
          traceLines.push(traceMPL.truthWithTrace(model, constraint.world, formulaB).trace);
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
        var evaluation = evaluateConstraint(constraint, iframeMPL, model);
        allOk = allOk && evaluation.ok;
        lines.push(evaluation.line);
      });

      problem.solved = allOk;
      renderProblemList();

      var out = lines.join('\n') + '\n\n';
      if (allOk) {
        out += '✅ Solved!\n\nModel in Forall x style:\n';
        out += formatModelForForallX(model);
      } else {
        out += '❌ Not yet — adjust your model and try again.';
      }

      if (config.useTrace) {
        out += '\n\n--- Evaluation Trace ---\n\n';
        out += buildTraceSections(problem, model).join('\n');
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
