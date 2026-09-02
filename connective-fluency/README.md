# Connective Fluency

A small, accessible React app for learning characteristic truth functions through single-case retrieval practice. Progress is stored only in the browser's `localStorage`.

## Local development

Requires Node.js 22 or newer.

```powershell
npm install
npm run dev
```

Open the URL Vite prints in the terminal. Run the automated checks with:

```powershell
npm test
npm run build
```

## Static deployment

`npm run build` writes a self-contained static site to `dist/`. The Vite base path is relative, so the build can be hosted at a GitHub Pages project subpath without changing the code.

For GitHub Pages, configure a workflow or another Pages publishing method to build this directory and publish `connective-fluency/dist`. No server-side routes, environment variables, or backend services are required.

## Content and progression

Connective definitions live in `src/domain/connectives.ts`; the stage order and prerequisites live in `src/domain/stages.ts`. Per-case mastery, persistence, and adaptive weights are isolated in the other files under `src/domain/`.

A connective stage becomes comfortable after every input case has been recalled correctly several times. Mixed practice offers a stopping point after 12 answers. Errors are weighted for additional practice and are delayed by other questions before recurring.

Open `?instructor=1` to unlock every stage immediately. Instructor tools are also available from Settings for focused connective practice and inspection of recent locally stored responses.
