# Planning: a visual practice game for polyadic sentences

**Status: planning draft.** This is a proposal for a second game, analogous to the existing Truth in a Model worksheet. The teaching text and feedback examples below are suggestions for instructor review, not approved activity wording.

## Goal and approach

Help students become comfortable deciding whether sentences with relations are true in finite models. Start with very easy, quick judgments, keep one sentence fixed while the model changes, and introduce one new idea at a time. Students should be able to repeat a gallery, skip ahead, and return to earlier activities without a score or mastery gate.

Use the same basic interaction as the monadic game: a short explanation, true and false worked examples, and six small models. Ask students to select all the models in which a fixed sentence is true. Give immediate, brief feedback and let them request a fuller explanation. Include the diagram and a written description of the same model together by default, with a control to hide the picture.

Start with **binary** relations. That is already a significant step beyond monadic predicates. The underlying evaluator supports higher arities, but there is no need to add ternary diagrams or exercises to the first version of this game.

## Main recommendation: four short nested-quantifier levels

Use four distinct, skippable levels for **∃∃**, **∀∀**, **∃∀**, and **∀∃**, each with several small mini-lessons. The two same-quantifier levels provide a gentler bridge before the mixed cases. Then give ∃∀ and ∀∃ their own introductions and sustained practice, followed by a short comparison activity. These do not have to be four large units: the important thing is to give each pattern enough uninterrupted practice.

The four-level split is particularly helpful for ∃∀ versus ∀∃. In ∃x ∀y Rxy, a single choice of x must work for every y. In ∀x ∃y Rxy, each x needs an appropriate y, but the choice of y may vary with x. Avoid saying that the choices *must* differ: the same object may work for several or all x's.

## How the models should look

Start with two or three numbered objects, with positions held fixed across a gallery. Names such as *a* and *b* appear immediately beneath their objects. An arrow from 1 to 2 means that 1 bears R to 2, so the ordered pair ⟨1, 2⟩ is in R. A loop at 1 means ⟨1, 1⟩ is in R. Bidirectional relationships need two clearly distinguishable arrows; do not assume R is symmetric. Only numbered objects belong to the domain.

Under each diagram, show the formal description, for example:

> Domain: 1, 2, 3  
> a names: 1  
> b names: 2  
> R: ⟨1, 2⟩, ⟨2, 1⟩, ⟨2, 2⟩

The picture and the ordered-pair list should describe exactly the same relation. Explain that ⟨1, 2⟩ and ⟨2, 1⟩ are different pairs; order tells us which way the arrow points. Display an empty extension as “R: none.” Later, a labeled relation matrix could be an optional alternative, especially for dense relations; it should not replace the diagram and pair list in introductory practice without user testing.

The two-dimensional domain diagram becomes crowded when all nine pairs are present on three objects. Begin dense examples with two objects, keep arrows and loops distinguishable, and make the textual description available at all times. Test the dense cases on mobile and with keyboard and screen-reader users before deciding how much to show at once.

## Opening explanation: suggested text

> A model describes a possible situation. A relation tells us which objects stand in a relationship to which other objects.
>
> In this model, the domain contains 1, 2, and 3. The name *a* names 1, and *b* names 2. The relation R contains ⟨1, 2⟩, ⟨2, 1⟩, and ⟨2, 2⟩.
>
> An arrow from 1 to 2 represents ⟨1, 2⟩. The arrow from 2 to 1 represents a different pair. The loop at 2 represents ⟨2, 2⟩.
>
> **Rab** says that the object named by *a* bears R to the object named by *b*. Here *a* names 1 and *b* names 2, and ⟨1, 2⟩ is in R. So Rab is true.
>
> **Rba** says that the object named by *b* bears R to the object named by *a*. It is also true here because ⟨2, 1⟩ is in R. A model can contain one of these pairs without containing the other.

Show that model as both a picture and a list. In the first contrasting example, use a second model with only ⟨1, 2⟩ in R, so Rab is true and Rba is false. A familiar interpretation can help, but choose a directionally clear relation such as “is looking at”; explicitly say that arrows indicate the interpretation of R in this model, not an assumption about how every real-world relationship works.

## Proposed progression

Each line below represents a family of short mini-lessons rather than one mixed quiz. For each new form, introduce it briefly, show true and false examples, give a fixed-sentence gallery, offer another round, and then offer closely related variations. Students can choose previous or later lessons at any time.

### Level 1: names, ordered pairs, and arrow direction

1. **Rab**: locate the two named objects and look for an arrow from the first to the second. Keep Rab fixed for the first gallery.
2. **Rba**: reversing the terms reverses the requested direction. Include models with just one direction and with both.
3. **Raa**: an object may bear R to itself. Introduce loops explicitly; do not assume a self-loop is present or absent.
4. Small variations with different names and models, including *a* and *b* naming the same object. If they name the same object, Rab asks about that object's loop. Introduce this case after students are comfortable with distinct names.

**Suggested first gallery:** keep the domain {1, 2}, a = 1, and b = 2 fixed. Vary R as follows; exactly three cards make Rab true.

| Card | R | Rab |
| --- | --- | --- |
| 1 | ∅ | false |
| 2 | {⟨1, 2⟩} | true |
| 3 | {⟨2, 1⟩} | false |
| 4 | {⟨1, 2⟩, ⟨2, 1⟩} | true |
| 5 | {⟨1, 1⟩} | false |
| 6 | {⟨1, 2⟩, ⟨2, 2⟩} | true |

In later rounds vary the number of true cards and the referents of the names. Do not reveal which cards are true in the student gallery.

### Level 2: connectives with relations

Introduce one new connective or combination at a time, building on the corresponding monadic practice:

- **¬Rab**: there is no arrow from a to b. The absence of that one pair suffices; other arrows can still be present.
- **Rab ∧ Rba**: both directions hold. If a and b co-refer, the two conjuncts ask about the same loop.
- **Rab ∨ Rba**: at least one direction holds, including when both hold.
- **Rab → Rba**: false only when the arrow from a to b is present and the reverse arrow is absent. Include false-antecedent examples.
- If useful after a brief explanation, combine a relation with a familiar property, such as **Pa ∧ Rab**. Show both the P region and R arrows without making either representation hard to read.

### Level 3: one existential quantifier

Start with **∃x Rax**, then introduce **∃x Rxa** as a separate lesson. The first asks whether a bears R to at least one object; the second asks whether at least one object bears R to a. Contrast the direction explicitly. Allow the object named by a as a possible witness when its loop is present; add **x ≠ a** only in a later, separately explained lesson.

Then introduce **∃x Rxx** (some object has a loop), **∃x (Rax ∧ Rxa)**, and, if useful, **∃x (x ≠ a ∧ Rax)**. In the conjunction, the same object must work in both positions.

**Suggested introduction:**

> **∃x Rax** says that the object named by a bears R to something. Look for at least one arrow starting at a. The object at the arrow's endpoint is a witness. It can be a itself if there is a loop at a.
>
> **∃x Rxa** instead asks whether something bears R to a. Look for an arrow ending at a.

After gallery practice, offer a separate object-choice activity in a true model. Accept every valid witness. In a false existential, no object is a witness; do not present a forced witness choice as though one must exist.

### Level 4: one universal quantifier

Introduce **∀x Rax** and **∀x Rxa** separately, then **∀x Rxx**. Include the named object itself in “every object”: **∀x Rax** requires an arrow from a to each object, including a loop at a. Give false examples with exactly one missing arrow as well as examples with several missing arrows.

**Suggested introduction:**

> **∀x Rax** says that a bears R to every object in the domain. Every object must be an endpoint of an arrow from a, including a itself.
>
> If even one object does not receive such an arrow from a, it is a counterexample and the sentence is false.

Offer a separate counterexample activity in a model where the universal is false. Accept each object that makes the matrix false. If the universal is true, there is no counterexample. Later mini-lessons can include **∀x (Rax → Rxa)** and **∀x (x ≠ a → Rax)**, with an explanation of the restriction and false antecedents.

### Level 5: two existentials — ∃x ∃y

Begin with **∃x ∃y Rxy**. It says that some object bears R to some object: at least one ordered pair is in R. The two chosen objects may be the same; a loop alone makes the sentence true. Introduce **∃x ∃y (x ≠ y ∧ Rxy)** only after explaining that it requires distinct objects.

**Suggested text:**

> **∃x ∃y Rxy** says that there is an object x and an object y such that x bears R to y. Look for at least one arrow. A loop counts too: x and y can be the same object.

For a true sentence, a supplementary activity can first ask for an outer witness x, then offer an optional choice of y. An outer choice is valid exactly when **∃y Rxy** is true for that x; accept every such x. If a second choice is requested, accept every y that works for the selected x. Make clear which object the student is choosing.

### Level 6: two universals — ∀x ∀y

Begin with **∀x ∀y Rxy**. Every ordered pair of domain objects must be in R, including loops. For a two-object domain, display the four required pairs: ⟨1, 1⟩, ⟨1, 2⟩, ⟨2, 1⟩, and ⟨2, 2⟩. Start with one missing pair and later vary the missing pairs. Introduce more complex examples such as **∀x ∀y (Rxy → Ryx)** only after the basic form.

**Suggested text:**

> **∀x ∀y Rxy** says that every object bears R to every object. For each choice of x, check every choice of y. This includes the case where x and y are the same.

For a false sentence, an outer counterexample x is any object for which **∀y Rxy** is false. After choosing such an x, optionally ask for a y that makes Rxy false. Accept all valid outer choices and, for the selected x, all missing target objects. Do not reduce the outer candidate check to choosing an arbitrary missing pair without checking which quantifier the student is answering.

### Level 7: existential then universal — ∃x ∀y

Use **∃x ∀y Rxy** as the fixed sentence. A single object must bear R to every object, including itself. Give practice in which an almost-complete outgoing row fails because one arrow or loop is missing, and examples with more than one valid outer witness.

**Suggested text:**

> **∃x ∀y Rxy** says that something bears R to everything. Look for one object x that has an arrow to every object in the domain. You must use the same x for all of those arrows.

For a true sentence, any object whose entire outgoing row is present is a valid outer witness. For a false sentence, no outer witness works. If a student asks why a proposed object fails, show an object y for which that particular x does not bear R to y; do not call y the outer witness.

### Level 8: universal then existential — ∀x ∃y

Use **∀x ∃y Rxy**. Each object must bear R to at least one object. Different x's may have different targets, and the same target may also work for several x's. A loop counts as an outgoing arrow.

**Suggested text:**

> **∀x ∃y Rxy** says that everything bears R to something. Check each object x and make sure it has at least one outgoing arrow. The object y does not have to be the same for every x.

For a false sentence, an outer counterexample x is an object with no outgoing arrows: **∃y Rxy** is false for that x. If the sentence is true, there is no outer counterexample. A supplemental activity can ask students to find a y for a given x, but that is an inner witness exercise, not the outer counterexample required for a false universal.

### Follow-up: compare the two mixed orders

Use the same model for both sentences: domain {1, 2}, with R = {⟨1, 2⟩, ⟨2, 1⟩}.

- **∀x ∃y Rxy is true**: 1 has an arrow to 2, and 2 has an arrow to 1.
- **∃x ∀y Rxy is false**: neither 1 nor 2 has an arrow to both objects; both loops are missing.

Suggested prompt: “Which sentence is true in this model?” Follow with a short explanation that one sentence permits the target to depend on the starting object, whereas the other asks for one starting object that reaches everything. For the same relation on a nonempty domain, ∃x ∀y Rxy entails ∀x ∃y Rxy; do not try to generate a model in which the former is true and the latter false.

## Suggested feedback for review

Keep the response tied to the clicked model and relevant sentence. These are representative samples of pedagogical choices, not a list of every generated case. Provide “More explanation” for the existing recursive explanation, adapted only after checking the wording and diagram against the formula.

| Situation | Proposed initial response |
| --- | --- |
| Rab, a = 1, b = 2, ⟨1, 2⟩ in R | **Correct!** a names 1 and b names 2. ⟨1, 2⟩ is in R, so Rab is true. |
| Rab, a = 1, b = 2, only ⟨2, 1⟩ in R | **Not quite.** a names 1 and b names 2, but ⟨1, 2⟩ is not in R. So Rab is false. |
| ∃x Rax, a = 1, R = {⟨1, 2⟩} | **Correct!** 2 is a witness: Rax is true when x is 2. |
| ∃x Rax, a = 1, R = {⟨2, 1⟩} | **Not quite.** There is no arrow from 1 to an object, so ∃x Rax is false. |
| ∀x Rax, a = 1, domain {1, 2}, R = {⟨1, 1⟩} | **Not quite.** 2 is a counterexample: there is no arrow from 1 to 2. |
| ∃x ∀y Rxy, domain {1, 2}, R = {⟨1, 1⟩, ⟨1, 2⟩} | **Correct!** 1 is a witness: it bears R to every object. |
| ∀x ∃y Rxy, domain {1, 2}, R = {⟨1, 2⟩} | **Not quite.** 2 is a counterexample: it has no outgoing arrow. |
| ∃x ∃y Rxy, domain {1, 2}, R = {⟨2, 2⟩} | **Correct!** 2 can be chosen for both x and y because ⟨2, 2⟩ is in R. |

For a valid or invalid chosen object, say whether that object works and why in terms of the matrix for that choice. Avoid calling a choice an outer witness or counterexample when the formula's outer quantifier and truth value do not call for one. Follow the repository feedback-review guidance: seek approval of representative wording and pedagogical decisions before putting new or revised incorrect-answer feedback into the game; use tests to check generated instances.

## Implementation and verification notes

- Keep this as a new, independently accessible static worksheet. Reuse the navigation, six-card gallery, immediate feedback, picture toggle, and persistence patterns from `FOL-Truth-Practice/` without changing the existing game substantially.
- The SVG arrow and loop renderer in `Intro-FOL-Worksheet-2/index.html` and `FOL-Truth-Review-1/index.html` is a useful starting point; inspect both before adapting one. Preserve legibility of opposing arrows and loop placement at the smaller card size.
- Reuse `fol-explanations/index.mjs` for parsing, evaluation, evidence trees, and `checkCandidate`; represent binary R as ordered tuples such as `[[1, 2], [2, 1]]`. `Quiz-Polyadic-Truth/problem-bank.mjs` contains related sentence families and can inform problem design, but do not depend on its availability without checking the target checkout.
- Candidate checking removes **only the first quantifier**. Thus for ∃x ∀y Rxy, an x is a witness only if the whole remaining ∀y Rxy holds. For ∀x ∃y Rxy, an x is a counterexample only if the remaining ∃y Rxy is false.
- Construct examples deliberately. Check exactly the intended count of true models in each gallery; vary counts in later rounds. Check empty R, loops, reversed pairs, shared names, all pairs, and different versus shared witnesses. Do not rely on the picture as the source of truth.
- Test diagrams against the tuple list, including dense and bidirectional arrows, loops, empty relations, and mobile layouts. Test the evaluator against independently specified truth tables and models; test every valid and invalid candidate, especially both mixed quantifier orders. Check immediate feedback, keyboard controls, the text equivalent, picture toggling, round resets, and browser persistence.

## Decisions for the next discussion

1. Should the first release include all eight levels, or ship through the single-quantifier levels first and add the four nested levels after reviewing the interaction?
2. Should the arrow diagram or a labeled relation matrix be the default for dense nested-quantifier models? The matrix may make rows and missing pairs easier to inspect; the diagram is the more direct bridge from the first exercises.
3. Should supplementary nested practice ask only for the outer object, or offer an optional second choice for the inner quantifier? The latter can teach the reasoning but needs careful labeling.
4. How much identity and predicate-plus-relation practice belongs in the first release? Introduce each new notation before using it in a model search.
