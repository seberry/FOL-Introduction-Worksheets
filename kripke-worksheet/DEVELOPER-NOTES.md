## Architecture

- `index.html` — Game wrapper page. Loads problems, embeds 
  the playground in an iframe, checks answers.
- `MPL-trace.js` — Drop-in replacement for MPL.js. Contains 
  all original MPL code plus `truthWithTrace()` which returns 
  `{ result: bool, trace: string }`. The trace is a 
  discovery-order, indented, human-readable evaluation walkthrough.
- `modallogic/` — Fork of Ross Kirsling's Modal Logic Playground 
  (github.com/rkirsling/modallogic). Mostly unmodified.
  - `modallogic/js/MPL.js` — Original evaluation library
  - `modallogic/js/app.js` — D3 graph editor + evaluate UI
  - `modallogic/lib/` — Third-party deps (D3, formula-parser, 
    Bootstrap)

## Key integration pattern

The game page (`index.html`) loads the playground in an iframe. 
It accesses `frame.contentWindow.model` and 
`frame.contentWindow.MPL` for checking answers. 

For traces, the outer page loads its own `MPL-trace.js` and 
calls `MPL.truthWithTrace(model, world, wff)`. This works 
because truthWithTrace uses duck-typing (checks for 
model.valuation and model.getSuccessorsOf methods) rather 
than instanceof, so it accepts model objects created by the 
iframe's MPL.

## To add traces to the playground's own evaluate mode

The relevant function is `evaluateFormula()` in 
`modallogic/js/app.js`. It calls `MPL.truth(model, state, wff)` 
for each state. To add traces:

1. Replace `modallogic/js/MPL.js` with `MPL-trace.js` 
   (or just add the trace code to the end of the existing file, 
   before the return/export block)
2. In `evaluateFormula()`, call `MPL.truthWithTrace()` instead 
   of / in addition to `MPL.truth()`
3. Add a display element (probably a <pre> inside the eval pane) 
   to show `result.trace`

The tricky part: the current evaluate mode evaluates at ALL 
states simultaneously and colors the graph. Traces should 
probably be shown per-state — either for a selected state, or 
all states with headers.