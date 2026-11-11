# Relations in a Model: playtest quickstart

From the repository root, run `python -m http.server 8765 --bind 127.0.0.1` and open <http://localhost:8765/FOL-Polyadic-Practice/>. Browser modules require HTTP; opening the HTML as a `file://` URL will not load the game. The game depends on the sibling `fol-explanations/` and `FOL-Truth-Practice/` directories.

The playtest contains all eight planned levels, with an initial mini-lesson and a related variation for each nested quantifier order. Levels 3–8 provide separate outer witness or counterexample practice; they do not ask for an inner object. The Level 8 introduction compares the two mixed orders in the same model.

- `models.mjs` holds lesson text, model construction, gallery selection, and feedback. Nested galleries enumerate all relations on domains of one to three objects. For ∃∃ there are only three distinct empty relations on those domain sizes, and for ∀∀ only three complete relations; rounds cap their true/false counts accordingly.
- `app.mjs` handles interaction, descriptions, and the current SVG arrow renderer. The diagram has known special-case visual issues that need a separate design and browser review; the written pair list is available beside each picture.
- `FEEDBACK-REVIEW.md` records representative patterns and links to the approved pedagogical references. Follow the repository feedback review guidance for new wording.
- `node --test FOL-Polyadic-Practice/models.test.mjs fol-explanations/test/semantics.test.mjs` checks the semantics, feedback and gallery cases.
- With the server running and the repository's existing Playwright and Chrome available, `node FOL-Polyadic-Practice/browser-check.cjs` checks lessons, keyboard interaction, feedback reset, picture toggle, completion-message visibility and reset, and desktop/mobile widths. The gallery feedback panel remains visible while students work, including the message shown after all true models are found.
