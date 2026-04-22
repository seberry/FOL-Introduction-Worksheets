# Reusing `MPL-with-trace.js` In Another Project

`MPL-with-trace.js` is a reusable logic-only extraction of the modal
logic parser/evaluator used in this worksheet project.

## Origin

It is based on Ross Kirsling's `MPL.js` from:

- http://github.com/rkirsling/modallogic

Original license:

- MIT License

Original copyright:

- Copyright (c) 2013-2015 Ross Kirsling

## Modifications In This Project

This reuse copy also includes local modifications:

- `truthWithTrace()` for explanatory evaluation traces
- trace display helpers
- trace rendering that uses `v` for disjunction in output

## What To Carry Into Another Project

At minimum:

1. copy `MPL-with-trace.js`
2. make sure `FormulaParser` is available
3. include the MIT license text from `kripke-worksheet/modallogic/LICENSE`
   somewhere in the new project
4. keep the attribution header at the top of `MPL-with-trace.js`

## Good Practice

In the other project, add a file such as:

- `THIRD_PARTY_NOTICES.md`
- `LICENSES/modallogic-MIT.txt`

and note that the logic engine is derived from Ross Kirsling's
`modallogic` project, with local modifications.
