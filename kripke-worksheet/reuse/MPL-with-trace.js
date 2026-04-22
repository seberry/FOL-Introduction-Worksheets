/**
 * MPL with trace support
 * Based on MPL v1.3.2 from Ross Kirsling's modallogic project:
 * http://github.com/rkirsling/modallogic
 *
 * Original work:
 * Copyright (c) 2013-2015 Ross Kirsling
 * Released under the MIT License.
 *
 * Modifications in this copy:
 * - extracted for reuse without the visual playground UI
 * - includes truthWithTrace() and trace-display helpers
 * - trace output uses 'v' for disjunction in explanatory text
 *
 * To comply with the MIT license in another project:
 * - keep this attribution header, and
 * - include the original MIT license text somewhere in that project
 *   (for example in a THIRD_PARTY_NOTICES or LICENSES directory)
 *
 * Dependency:
 * - formula-parser (must provide global FormulaParser)
 */
var MPL = (function (FormulaParser) {
  'use strict';

  if (typeof FormulaParser === 'undefined') throw new Error('MPL could not find dependency: formula-parser');

  var variableKey = 'prop';

  var unaries = [
    { symbol: '~',  key: 'neg',  precedence: 4 },
    { symbol: '[]', key: 'nec',  precedence: 4 },
    { symbol: '<>', key: 'poss', precedence: 4 }
  ];

  var binaries = [
    { symbol: '&',   key: 'conj', precedence: 3, associativity: 'right' },
    { symbol: '|',   key: 'disj', precedence: 2, associativity: 'right' },
    { symbol: '->',  key: 'impl', precedence: 1, associativity: 'right' },
    { symbol: '<->', key: 'equi', precedence: 0, associativity: 'right' }
  ];

  var MPLParser = new FormulaParser(variableKey, unaries, binaries);

  function _asciiToJSON(ascii) {
    return MPLParser.parse(ascii);
  }

  function _jsonToASCII(json) {
    if (json.prop)
      return json.prop;
    else if (json.neg)
      return '~' + _jsonToASCII(json.neg);
    else if (json.nec)
      return '[]' + _jsonToASCII(json.nec);
    else if (json.poss)
      return '<>' + _jsonToASCII(json.poss);
    else if (json.conj && json.conj.length === 2)
      return '(' + _jsonToASCII(json.conj[0]) + ' & ' + _jsonToASCII(json.conj[1]) + ')';
    else if (json.disj && json.disj.length === 2)
      return '(' + _jsonToASCII(json.disj[0]) + ' | ' + _jsonToASCII(json.disj[1]) + ')';
    else if (json.impl && json.impl.length === 2)
      return '(' + _jsonToASCII(json.impl[0]) + ' -> ' + _jsonToASCII(json.impl[1]) + ')';
    else if (json.equi && json.equi.length === 2)
      return '(' + _jsonToASCII(json.equi[0]) + ' <-> ' + _jsonToASCII(json.equi[1]) + ')';
    else
      throw new Error('Invalid JSON for formula!');
  }

  function _jsonToTraceDisplay(json) {
    return _jsonToASCII(json).replace(/ \| /g, ' v ');
  }

  function _asciiToLaTeX(ascii) {
    return ascii.replace(/~/g,      '\\lnot{}')
                .replace(/\[\]/g,   '\\Box{}')
                .replace(/<>/g,     '\\Diamond{}')
                .replace(/ & /g,    '\\land{}')
                .replace(/ \| /g,   '\\lor{}')
                .replace(/ <-> /g,  '\\leftrightarrow{}')
                .replace(/ -> /g,   '\\rightarrow{}');
  }

  function _asciiToUnicode(ascii) {
    return ascii.replace(/~/g,    '\u00ac')
                .replace(/\[\]/g, '\u25a1')
                .replace(/<>/g,   '\u25ca')
                .replace(/&/g,    '\u2227')
                .replace(/\|/g,   '\u2228')
                .replace(/<->/g,  '\u2194')
                .replace(/->/g,   '\u2192');
  }

  function Wff(asciiOrJSON) {
    var _ascii = '', _json = '', _latex = '', _unicode = '';

    this.ascii = function () { return _ascii; };
    this.json = function () { return _json; };
    this.latex = function () { return _latex; };
    this.unicode = function () { return _unicode; };

    _json    = (typeof asciiOrJSON === 'object') ? asciiOrJSON : _asciiToJSON(asciiOrJSON);
    _ascii   = _jsonToASCII(_json);
    _latex   = _asciiToLaTeX(_ascii);
    _unicode = _asciiToUnicode(_ascii);
  }

  function Model() {
    var _states = [];

    this.addTransition = function (source, target) {
      if (!_states[source] || !_states[target]) return;

      var successors = _states[source].successors,
          index = successors.indexOf(target);
      if (index === -1) successors.push(target);
    };

    this.removeTransition = function (source, target) {
      if (!_states[source]) return;

      var successors = _states[source].successors,
          index = successors.indexOf(target);
      if (index !== -1) successors.splice(index, 1);
    };

    this.getSuccessorsOf = function (source) {
      if (!_states[source]) return undefined;
      return _states[source].successors;
    };

    this.addState = function (assignment) {
      var processedAssignment = {};
      assignment = assignment || {};

      for (var propvar in assignment)
        if (assignment[propvar] === true)
          processedAssignment[propvar] = assignment[propvar];

      _states.push({assignment: processedAssignment, successors: []});
    };

    this.editState = function (state, assignment) {
      if (!_states[state]) return;

      var stateAssignment = _states[state].assignment;
      for (var propvar in assignment)
        if (assignment[propvar] === true) stateAssignment[propvar] = true;
        else if (assignment[propvar] === false) delete stateAssignment[propvar];
    };

    this.removeState = function (state) {
      if (!_states[state]) return;
      var self = this;

      _states[state] = null;
      _states.forEach(function (source, index) {
        if (source) self.removeTransition(index, state);
      });
    };

    this.getStates = function () {
      var stateList = [];
      _states.forEach(function (state) {
        if (state) stateList.push(state.assignment);
        else stateList.push(null);
      });

      return stateList;
    };

    this.valuation = function (propvar, state) {
      if (!_states[state]) throw new Error('State ' + state + ' not found!');
      return !!_states[state].assignment[propvar];
    };

    this.getModelString = function () {
      var modelString = '';

      _states.forEach(function (state) {
        if (state) {
          modelString += 'A' + Object.keys(state.assignment).join();
          modelString += 'S' + state.successors.join();
        }
        modelString += ';';
      });

      return modelString;
    };

    this.loadFromModelString = function (modelString) {
      var regex = /^(?:;|(?:A|A(?:\w+,)*\w+)(?:S|S(?:\d+,)*\d+);)+$/;
      if (!regex.test(modelString)) return;

      _states = [];

      var self = this,
          successorLists = [],
          inputStates = modelString.split(';').slice(0, -1);

      inputStates.forEach(function (state) {
        if (!state) {
          _states.push(null);
          successorLists.push(null);
          return;
        }

        var stateProperties = state.match(/A(.*)S(.*)/).slice(1, 3)
          .map(function (substr) { return (substr ? substr.split(',') : []); });

        var assignment = {};
        stateProperties[0].forEach(function (propvar) { assignment[propvar] = true; });
        _states.push({assignment: assignment, successors: []});

        var successors = stateProperties[1].map(function (succState) { return +succState; });
        successorLists.push(successors);
      });

      successorLists.forEach(function (successors, source) {
        if (!successors) return;

        successors.forEach(function (target) {
          self.addTransition(source, target);
        });
      });
    };
  }

  function _truth(model, state, json) {
    if (json.prop)
      return model.valuation(json.prop, state);
    else if (json.neg)
      return !_truth(model, state, json.neg);
    else if (json.conj)
      return (_truth(model, state, json.conj[0]) && _truth(model, state, json.conj[1]));
    else if (json.disj)
      return (_truth(model, state, json.disj[0]) || _truth(model, state, json.disj[1]));
    else if (json.impl)
      return (!_truth(model, state, json.impl[0]) || _truth(model, state, json.impl[1]));
    else if (json.equi)
      return (_truth(model, state, json.equi[0]) === _truth(model, state, json.equi[1]));
    else if (json.nec)
      return model.getSuccessorsOf(state).every(function (succState) { return _truth(model, succState, json.nec); });
    else if (json.poss)
      return model.getSuccessorsOf(state).some(function (succState) { return _truth(model, succState, json.poss); });
    else
      throw new Error('Invalid formula!');
  }

  function truth(model, state, wff) {
    if (!(model instanceof MPL.Model)) throw new Error('Invalid model!');
    if (!model.getStates()[state]) throw new Error('State ' + state + ' not found!');
    if (!(wff instanceof MPL.Wff)) throw new Error('Invalid wff!');

    return _truth(model, state, wff.json());
  }

  function _tv(b) { return b ? 'TRUE' : 'FALSE'; }

  var _sym = {
    conj: '&', disj: 'v', impl: '->', equi: '<->'
  };

  function _trace(model, state, json, indent) {
    var pad = new Array(indent + 1).join('  ');
    var lines = [];
    var result;
    var ascii = _jsonToTraceDisplay(json);

    if (json.prop) {
      result = model.valuation(json.prop, state);
      lines.push(pad + json.prop + ' is ' + _tv(result) + ' at w' + state);
    }

    else if (json.neg) {
      lines.push(pad + 'Evaluating ' + ascii + ' at w' + state + ':');
      var child = _trace(model, state, json.neg, indent + 1);
      lines = lines.concat(child.lines);
      result = !child.result;
      lines.push(pad + '  ~(' + _tv(child.result) + ') = ' + _tv(result));
    }

    else if (json.conj || json.disj || json.impl || json.equi) {
      var key  = json.conj ? 'conj' : json.disj ? 'disj' : json.impl ? 'impl' : 'equi';
      var pair = json[key];
      var sym  = _sym[key];

      lines.push(pad + 'Evaluating ' + ascii + ' at w' + state + ':');
      var left  = _trace(model, state, pair[0], indent + 1);
      var right = _trace(model, state, pair[1], indent + 1);
      lines = lines.concat(left.lines);
      lines = lines.concat(right.lines);

      if (key === 'conj') result = left.result && right.result;
      else if (key === 'disj') result = left.result || right.result;
      else if (key === 'impl') result = !left.result || right.result;
      else result = left.result === right.result;

      lines.push(pad + '  ' + _tv(left.result) + ' ' + sym + ' ' + _tv(right.result) +
                 ' = ' + _tv(result));
    }

    else if (json.nec) {
      var successors = model.getSuccessorsOf(state);
      var worldList = successors.map(function (s) { return 'w' + s; }).join(', ');
      lines.push(pad + 'Evaluating ' + ascii + ' at w' + state + ':');
      lines.push(pad + '  Worlds accessible from w' + state + ': ' +
                 (successors.length ? worldList : '(none)'));

      var allTrue = true;
      successors.forEach(function (succ) {
        var child = _trace(model, succ, json.nec, indent + 1);
        lines = lines.concat(child.lines);
        if (!child.result) allTrue = false;
      });
      result = allTrue;

      if (successors.length === 0) {
        lines.push(pad + '  No accessible worlds, so []' +
                   _jsonToTraceDisplay(json.nec) + ' is vacuously TRUE');
      } else {
        lines.push(pad + '  ' + (result ? 'All' : 'Not all') +
                   ' accessible worlds satisfy ' + _jsonToTraceDisplay(json.nec) +
                   ' so []' + _jsonToTraceDisplay(json.nec) + ' is ' + _tv(result) +
                   ' at w' + state);
      }
    }

    else if (json.poss) {
      var successors = model.getSuccessorsOf(state);
      var worldList = successors.map(function (s) { return 'w' + s; }).join(', ');
      lines.push(pad + 'Evaluating ' + ascii + ' at w' + state + ':');
      lines.push(pad + '  Worlds accessible from w' + state + ': ' +
                 (successors.length ? worldList : '(none)'));

      var someTrue = false;
      successors.forEach(function (succ) {
        var child = _trace(model, succ, json.poss, indent + 1);
        lines = lines.concat(child.lines);
        if (child.result) someTrue = true;
      });
      result = someTrue;

      if (successors.length === 0) {
        lines.push(pad + '  No accessible worlds, so <>' +
                   _jsonToTraceDisplay(json.poss) + ' is FALSE');
      } else {
        var verdict = result ? 'Found a world satisfying' : 'No accessible world satisfies';
        lines.push(pad + '  ' + verdict + ' ' + _jsonToTraceDisplay(json.poss) +
                   ' so <>' + _jsonToTraceDisplay(json.poss) + ' is ' + _tv(result) +
                   ' at w' + state);
      }
    }

    else {
      throw new Error('Invalid formula!');
    }

    return { result: result, lines: lines };
  }

  function truthWithTrace(model, state, wff) {
    if (typeof model.valuation !== 'function') throw new Error('Invalid model!');
    if (typeof model.getSuccessorsOf !== 'function') throw new Error('Invalid model!');
    if (!(wff instanceof MPL.Wff)) throw new Error('Invalid wff!');

    var traceResult = _trace(model, state, wff.json(), 0);
    return {
      result: traceResult.result,
      trace: traceResult.lines.join('\n')
    };
  }

  return {
    Wff: Wff,
    Model: Model,
    truth: truth,
    truthWithTrace: truthWithTrace
  };

})(FormulaParser);
