## Architecture

The worksheet pages are thin wrappers around a shared worksheet engine
and an embedded copy of Ross Kirsling's Modal Logic Playground.

- `index.html` — satisfiability / comparison worksheet page
- `non-entailment.html` — non-entailment worksheet page
- `worksheet-common.js` — shared worksheet logic
  - renders the problem list
  - loads and restores models in the iframe
  - checks constraints
  - formats models in the `Forall x`-style summary
  - optionally appends evaluation traces
- `modallogic/` — fork of the Modal Logic Playground
  - `modallogic/js/MPL.js` — canonical logic engine
  - `modallogic/js/app.js` — D3 graph editor + playground UI
  - `modallogic/lib/` — third-party dependencies

## Current Runtime Model

Each worksheet page embeds `modallogic/index.html` in an iframe.
The iframe owns the live semantic objects:

- `frame.contentWindow.model`
- `frame.contentWindow.MPL`

The worksheet page does not maintain its own separate MPL runtime.
Instead, all checking and trace generation go through the iframe's
`MPL` object.

That means there is a single authoritative definition of:

- `MPL.Model`
- `MPL.Wff`
- `MPL.truth()`
- `MPL.truthWithTrace()`

This is the main simplification to keep in mind when debugging.

## Trace Support

Trace support lives in `modallogic/js/MPL.js`.

`MPL.truthWithTrace(model, state, wff)` returns:

```javascript
{
  result: true | false,
  trace: "human-readable explanation..."
}
```

The trace is:

- recursive
- indented by subformula depth
- discovery-order rather than table-format
- presentation-oriented rather than parser-oriented

For display purposes, the trace uses `v` for disjunction, while input
syntax still uses `|`.

## Constraint Flow

The shared worksheet engine in `worksheet-common.js` follows this flow:

1. read the active problem definition
2. get the current model from the iframe
3. evaluate each constraint with the iframe's `MPL`
4. mark the problem solved / unsolved
5. render summary lines
6. optionally render traces

Supported constraint types:

- `truth`
  - example: formula should be true or false at a given world
- `different`
  - example: two formulas should differ in truth value at a given world

## Problem Schema

Each worksheet page defines a `problems` array in page-local script.
Each problem object is plain data consumed by `createWorksheetApp(...)`.

Example:

```javascript
const problems = [
  {
    id: 1,
    title: "1. □(P v Q) ⊭ □P",
    description: "Show a model where □(P v Q) is true at w₀ but □P is false.",
    constraints: [
      { type: "truth", world: 0, formula: "[](P | Q)", expected: true },
      { type: "truth", world: 0, formula: "[]P", expected: false }
    ],
    modelString: null,
    solved: false
  }
];
```

Field meanings:

- `id` — stable numeric identifier for the problem
- `title` — short label shown in the sidebar and main heading
- `description` — explanatory text shown above the constraint list
- `constraints` — array of semantic conditions checked against the current model
- `modelString` — saved model state for switching between problems
- `solved` — current completion status for sidebar display

Constraint examples:

- `truth`

```javascript
{ type: "truth", world: 0, formula: "[]P", expected: true }
```

- `different`

```javascript
{ type: "different", world: 0, formulaA: "P", formulaB: "[]P" }
```

## Where To Change Things

Use this map when making edits:

- Add or edit worksheet problems:
  - `index.html`
  - `non-entailment.html`
- Change shared checking / rendering behavior:
  - `worksheet-common.js`
- Change parsing, truth conditions, or trace generation:
  - `modallogic/js/MPL.js`
- Change the model editor / playground UI:
  - `modallogic/js/app.js`

## Local Testing

Do not rely on opening the HTML file directly with `file://...`.
Because the worksheet embeds an iframe and loads related assets, it is
safer to run a local HTTP server.

From the repo root:

```powershell
python -m http.server 8766 --bind 127.0.0.1
```

Then open:

```text
http://127.0.0.1:8766/kripke-worksheet/non-entailment.html
```

If a port is blocked or already in use, use another high port such as
`18000`.

## Smoke Test Checklist

A quick worksheet smoke test:

1. page loads
2. embedded playground loads
3. you can build or restore a model
4. clicking `Check current model` updates the result pane
5. solved problems show the model summary
6. trace-enabled pages show an `Evaluation Trace` section

## Adding A New Worksheet

For a third or fourth worksheet, prefer a thin page wrapper rather than
copying logic out of an existing page.

Recommended steps:

1. Copy an existing worksheet HTML page as a starting shell.
2. Keep the page-specific text, title, and `problems` data.
3. Keep a single call to `createWorksheetApp(...)`.
4. Set the page options:
   - `problems`
   - `useTrace`
   - `worldOffset`
   - `playgroundSrc`
5. Reuse `worksheet-common.js` unchanged unless the shared engine truly
   needs a new feature.
6. Run a local smoke test over HTTP before deploying.

Minimal pattern:

```html
<script src="worksheet-common.js"></script>
<script>
  const problems = [/* ... */];

  window.worksheetApp = createWorksheetApp({
    problems,
    useTrace: true,
    worldOffset: 0,
    playgroundSrc: "modallogic/index.html"
  });

  window.addEventListener("load", () => {
    worksheetApp.init();
  });
</script>
```

Rule of thumb:

- if the change is about problem content, edit the page
- if the change is about worksheet behavior, edit `worksheet-common.js`
- if the change is about semantics or traces, edit `modallogic/js/MPL.js`
