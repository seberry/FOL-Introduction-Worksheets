# Truth in a Model: quickstart

This is a static practice worksheet. From the repository root run:

```sh
python -m http.server 8765 --bind 127.0.0.1
```

Open <http://localhost:8765/FOL-Truth-Practice/>. Browser ES modules are blocked when `index.html` is opened directly with `file://`. The worksheet imports `../fol-explanations/`, so serve the repository root and keep that sibling directory available when deploying to GitHub Pages. No dependencies or build step are needed.

The `.mjs` extension means module JavaScript: these files contain code loaded by the webpage. Open them in a text/code editor to read the source; open the worksheet link above in a browser to use the activity.

Run the checks from the repository root:

```sh
node --test FOL-Truth-Practice/models.test.mjs FOL-Truth-Practice/feedback.test.mjs FOL-Truth-Practice/quantified.test.mjs fol-explanations/test/semantics.test.mjs
```

## Where things are

- `index.html`: introductory explanation, a collapsed “How to read this picture” note, navigation, gallery, witness section, and a collapsible picture guide with model examples. Both expandable notes work with mouse, touch, and keyboard.
- `preview.mjs`: browser interaction and `card()`, which creates gallery/example cards and their text descriptions from the same model. `renderWitness()` also uses `card()`. `showFeedback()` controls incorrect-answer styling for both activities and clears it for correct answers and new prompts.
- `diagram.mjs`: shared SVG picture renderer for the introduction, examples, gallery, witness/counterexample model, and picture guide. Domains of one to four objects all use circled numbers and overlapping regions for P, Q, and R.
- `style.css`: layout, SVG regions, object/name labels, solid blue P, dashed yellow Q, and dotted purple R outlines. Pictures can be hidden with the existing checkbox; model descriptions remain visible.
- `models.mjs`: lessons, formula variations, finite models, and deterministic six-card rounds. The first `Pa` round is explicit; later rounds vary the target true count. Existential rounds use domains of one to four objects so false models are visually distinct. Evaluation and witness checking come from `../fol-explanations/`.
- `quantified.mjs`: Level 2–4 lessons, model galleries, and reviewed quantified-sentence and object-choice responses. `generate-level-2-4-review.mjs` regenerates the representative `LEVEL-2-4-FEEDBACK-REVIEW.md`.
- `feedback.mjs`: reviewed short responses and compact-notation rendering of the existing full explainer. `generate-review.mjs` generates `FEEDBACK-REVIEW.md` from this same code and the first round of every sentence and variation.

## Model pictures

All pictures use the same white circular object markers, with names beneath them. Object positions depend only on the domain size: one centered object, a horizontal pair, a triangle, or a square. For domain `{1, 2, 3}`, 1 stays above, 2 below left, and 3 below right. For `{1, 2, 3, 4}`, 1 and 2 occupy the top row, and 3 and 4 the bottom row. This preserves object positions when the predicate extensions change.

P uses a blue fill and solid outline, Q a yellow fill and dashed outline, and R a purple fill and dotted outline. Singleton extensions have circular regions and pairs have rounded enclosures. All three objects in a triangle have an elliptical region; three or four members of a square have a rounded convex enclosure. Because the object layouts are convex and sufficiently spaced, these enclosures include exactly the intended objects, including diagonal pairs and three-member extensions of a four-object domain.

Fills render first, then all outlines, then predicate labels and objects. Q and R have progressively wider padding so identical extensions retain separate outlines. Labels also have separate positions. Region geometry carries no meaning beyond which numbered objects it contains: overlapping enclosures can cross in empty space without introducing an object with both properties.

Empty extensions show `P: none`, `Q: none`, or `R: none` in the key and have no region. Names appear beneath their objects, including shared names such as `a, b`. Only numbered objects belong to the domain. The picture guide includes overlapping, identical, empty, and neither-property examples, plus one-, two-, and four-object examples with R. All practice cards retain written model descriptions and display the vocabulary used in the current sentence. The renderer supports the game's nonempty domains of one to four objects; larger domains require a new layout and containment checks.

Incorrect gallery selections and witness choices display dark orange hint text on a pale orange background, including any expanded explanation. Correct answers and new prompts restore the default styling. The reviewed feedback wording is unchanged; “Not quite” and “Correct!” continue to identify the result without relying on color.

Optional browser verification uses the Playwright and axe installations in `connective-fluency/node_modules` and local Chrome. With the server running, run from the repository root:

```sh
node FOL-Truth-Practice/browser-check.cjs
```

This checks actual SVG containment for all 64 three-object P/Q combinations and all 90 combinations of domain size, predicate, and extension for P/Q/R on domains of one to four objects. Each predicate region is generated independently, so these cases exhaust the individual region geometries. Checks include object boundaries and shared-name positions, empty labels, predicate-label collisions and text bounds, and mixed-predicate edge cases such as diagonal pairs.

The browser check also verifies circled objects in the live example, gallery, and witness/counterexample cards across all 20 lessons and their variations at widths 1440, 844, 390, and 320. It exercises keyboard interaction, incorrect hint colors and their reset behavior, the expandable picture explanation, the picture toggle, accessibility, and JavaScript errors. It saves screenshots under `working/monadic-highlights/`. Desktop/mobile pictures and representative edge cases were also visually inspected.

Feedback wording is instructor-reviewed instructional content. Follow the repository's `AGENTS.md` review process before introducing or revising incorrect-answer feedback; keep the implemented wording and `FEEDBACK-REVIEW.md` synchronized. Regenerate the reference with `node FOL-Truth-Practice/generate-review.mjs` when appropriate.
