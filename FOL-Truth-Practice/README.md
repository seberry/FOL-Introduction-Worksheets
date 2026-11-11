# Truth in a Model: quickstart

This is a static practice worksheet. From the repository root run:

```sh
python -m http.server 8765 --bind 127.0.0.1
```

Open <http://localhost:8765/FOL-Truth-Practice/>. Browser ES modules are blocked when `index.html` is opened directly with `file://`. The worksheet imports `../fol-explanations/`, so serve the repository root and keep that sibling directory available when deploying to GitHub Pages. No dependencies or build step are needed.

The `.mjs` extension means module JavaScript: these files contain code loaded by the webpage. Open them in a text/code editor to read the source; open the worksheet link above in a browser to use the activity.

Run the checks from the repository root:

```sh
node --test FOL-Truth-Practice/models.test.mjs FOL-Truth-Practice/feedback.test.mjs fol-explanations/test/semantics.test.mjs
```

## Where things are

- `index.html`: introductory explanation, a collapsed “How to read this picture” note, navigation, gallery, witness section, and a collapsible picture guide with model examples. Both expandable notes work with mouse, touch, and keyboard.
- `preview.mjs`: browser interaction and `card()`, which creates gallery/example cards and their text descriptions from the same model. `renderWitness()` also uses `card()`. `showFeedback()` controls incorrect-answer styling for both activities and clears it for correct answers and new prompts.
- `diagram.mjs`: shared picture renderer for the introduction, examples, gallery, witness model, and picture guide. Three-object models use overlapping regions; other domain sizes retain labeled columns.
- `style.css`: layout, SVG regions, object/name labels, solid blue P and dashed yellow Q outlines, and column-style pictures. Pictures can be hidden with the existing checkbox; model descriptions remain visible.
- `models.mjs`: lessons, formula variations, finite models, and deterministic six-card rounds. The first `Pa` round is explicit; later rounds vary the target true count. Existential rounds use domains of one to four objects so false models are visually distinct. Evaluation and witness checking come from `../fol-explanations/`.
- `feedback.mjs`: reviewed short responses and compact-notation rendering of the existing full explainer. `generate-review.mjs` generates `FEEDBACK-REVIEW.md` from this same code and the first round of every sentence and variation.

## Model pictures

For domain `{1, 2, 3}`, objects stay in a triangle: 1 above, 2 below left, and 3 below right. P uses a blue fill and solid outline; Q uses a yellow fill and dashed outline. Singleton extensions have circular regions, pairs have rounded enclosures, and the full domain has an elliptical region. Fills render first, then both outlines, then predicate labels and objects. Q's outline is slightly larger, so identical extensions retain two visible boundaries. Region geometry carries no meaning beyond which numbered objects it contains.

Empty extensions show `P: none` or `Q: none` in the key and have no region. Names appear beneath their objects, including shared names such as `a, b`. Only numbered objects belong to the domain. The picture guide includes overlapping, identical, empty, and neither-property examples. All practice cards retain written model descriptions and display the vocabulary used in the current sentence. Domains of sizes one, two, and four still use explicit membership tags, preserving the existing existential rounds.

Incorrect gallery selections and witness choices display dark orange hint text on a pale orange background, including any expanded explanation. Correct answers and new prompts restore the default styling. The reviewed feedback wording is unchanged; “Not quite” and “Correct!” continue to identify the result without relying on color.

Optional browser verification uses the Playwright and axe installations in `connective-fluency/node_modules` and local Chrome. With the server running, run from the repository root:

```sh
node FOL-Truth-Practice/browser-check.cjs
```

This checks actual SVG containment for all 64 P/Q extension combinations (including object boundaries and name positions), empty labels, shared names, gallery and witness keyboard interaction, incorrect hint colors and their reset behavior, the expandable picture explanation, the picture toggle, all lessons and variations at widths 1440, 844, 390, and 320, accessibility, and JavaScript errors. It saves screenshots under `working/monadic-highlights/`. Desktop/mobile pictures and representative edge cases were also visually inspected.

Feedback wording is instructor-reviewed instructional content. Follow the repository's `AGENTS.md` review process before introducing or revising incorrect-answer feedback; keep the implemented wording and `FEEDBACK-REVIEW.md` synchronized. Regenerate the reference with `node FOL-Truth-Practice/generate-review.mjs` when appropriate.
