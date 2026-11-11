# Truth in a Model: quickstart

This is a static practice worksheet. From the repository root run:

```sh
python -m http.server 8765 --bind 127.0.0.1
```

Open <http://localhost:8765/FOL-Truth-Practice/>. Browser ES modules are blocked when `index.html` is opened directly with `file://`. The worksheet imports `../fol-explanations/`, so serve the repository root and keep that sibling directory available when deploying to GitHub Pages. No dependencies or build step are needed.

Run the checks from the repository root:

```sh
node --test FOL-Truth-Practice/models.test.mjs FOL-Truth-Practice/feedback.test.mjs fol-explanations/test/semantics.test.mjs
```

## Where things are

- `index.html`: introductory explanation, its hand-written example diagram, navigation, gallery, and witness sections.
- `preview.mjs`: browser interaction and `card()`, which creates both the gallery/example diagrams and their text descriptions from the same model. `renderWitness()` also uses `card()`. The prototype comparison at the end of this file is a separate fixed example.
- `style.css`: layout, `.diagram`, `.object`, `.number`, `.shaded`, `.tag`, and the overlapping-region prototype classes. Pictures can be hidden with the existing checkbox; model descriptions remain visible.
- `models.mjs`: lessons, formula variations, finite models, and deterministic six-card rounds. The first `Pa` round is explicit; later rounds vary the target true count. Existential rounds use domains of one to four objects so false models are visually distinct. Evaluation and witness checking come from `../fol-explanations/`.
- `feedback.mjs`: reviewed short responses and compact-notation rendering of the existing full explainer. `generate-review.mjs` generates `FEEDBACK-REVIEW.md` from this same code and the first round of every sentence and variation.

## Picture work handoff

The intended next step is to explore actual Venn-style predicate highlighting using the other worksheet pages' three-object model displays as references. Currently the generated cards use labeled membership tags, with pale shading behind individual numbers for a single predicate; the two-predicate overlapping regions at the bottom of the page are a fixed comparison prototype, not the live card renderer. The introductory picture is also hand-written in `index.html`, so update it along with generated pictures if the visual convention changes.

Keep the domain, name labels, and predicate extensions consistent between the picture and textual model; support overlapping and empty extensions and the one-to-four-object domains used in existential rounds. Do not rely on color alone, and retain keyboard interaction and readable text equivalents. Check desktop and mobile layouts and verify the first gallery and witness activity after changes. Browser-based visual and keyboard verification has not yet been completed for this version.

Feedback wording is instructor-reviewed instructional content. Follow the repository's `AGENTS.md` review process before introducing or revising incorrect-answer feedback; keep the implemented wording and `FEEDBACK-REVIEW.md` synchronized. Regenerate the reference with `node FOL-Truth-Practice/generate-review.mjs` when appropriate.
