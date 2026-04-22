# NEXT TIME: Trace Explorer / Free-Form Explanation Tool

This note is for the future idea of letting students enter an arbitrary
formula and get semantic trace information for that formula in a model
they build in the visualizer.

## Core Idea

The likely goal is not:

- "show every truth value at every world"

The more pedagogically useful goal is:

- "explain why this specific formula is true or false at this chosen world"

So the feature should probably center on:

- one user-entered formula
- one selected world
- one explanation trace

## Likely UX Shape

Most natural interaction:

1. student builds a model in the visualizer
2. student selects a world
3. student enters a formula
4. system reports whether the formula is true or false at that world
5. system shows a trace focused on the information relevant to that
   truth value

This seems better than dumping traces for all worlds at once.

## Why A Selected World Matters

The trace function explains truth at a particular world, not "globally."
That means the UI should make the target world explicit.

Most natural options:

- selected node in the graph determines the world
- a dropdown chooses the world
- support both, but selected node is primary

Current intuition:

- selecting a world in the graph is conceptually natural
- a visible fallback dropdown may still be good for clarity

## Best Place To Add It

If this is implemented, the most natural place is probably inside the
existing playground evaluate mode rather than as another worksheet page.

Reason:

- the playground already has formula input
- it already evaluates formulas against the current model
- `modallogic/js/MPL.js` now already exposes `truthWithTrace()`
- no more two-MPL architecture problem

Relevant files:

- `modallogic/js/app.js`
- `modallogic/js/MPL.js`

## Possible UI Directions

### Option 1: Extend current Evaluate Formula mode

Keep the existing true/false world summary, then add:

- `Trace for selected world`
- maybe a `<pre>` block below the existing evaluation result

Pros:

- least new surface area
- uses existing workflow
- probably easiest to maintain

Cons:

- evaluate panel may get crowded

### Option 2: Dedicated "Trace Explorer" page

Create a separate page with:

- embedded playground
- formula input
- world selector
- trace panel

Pros:

- cleaner teaching-focused interface
- easier to tailor specifically for explanation

Cons:

- another page to maintain
- overlaps somewhat with playground evaluate mode

Current leaning:

- extend the playground first unless that becomes visually messy

## Important Design Constraint

The feature should probably explain only what is relevant to the chosen
formula at the chosen world.

That suggests avoiding:

- all-world trace dumps
- huge walls of output unless requested

The phrase to remember is:

- "explain the truth value of this sentence at the actual world"

## Visual Possibility

There was an idea in this conversation about highlighting relevant
branches spreading out from the selected world.

That is potentially nice, but it should probably be treated as a second
step rather than part of the first implementation.

Suggested sequence:

1. textual trace for one formula at one world
2. if useful, graph highlighting of worlds/edges relevant to the trace

Reason:

- textual trace is already available
- graph highlighting would require additional design work to decide what
  counts as "relevant" for conjunction, negation, modal operators, etc.

## Technical Starting Point

The semantic support already exists:

- `MPL.truth(model, world, wff)`
- `MPL.truthWithTrace(model, world, wff)`

So this is mainly a UI / interaction design task now, not a core
architecture problem.

## Good Minimal Version

If implementing this later, the smallest sensible version is:

1. student selects a world
2. student enters a formula
3. system evaluates that formula at the selected world
4. system shows:
   - truth value
   - trace in a `<pre>`

No graph highlighting yet.
No all-world trace output.

## Questions To Revisit Later

- Should selected graph node or dropdown be the primary world selector?
- What should happen if no world is selected?
- Should the feature live in the playground or on a separate page?
- Should the current evaluate mode keep showing true/false sets for all
  worlds, or switch into a more local explanation mode?
- Should graph highlighting be added later?

## Recommendation When Revisiting

Start with:

- selected world
- one formula
- one truth value
- one trace

Only after that works well should you consider visual highlighting or a
more ambitious explanation interface.
