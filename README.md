# GRE Word Clusters

A fast, offline-friendly study app for the GregMat GRE vocabulary list, organized
**by meaning** instead of alphabetically. Learn one semantic cluster at a time,
flip through flashcards, and track which words you know — all in the browser, with
no account and no backend.

Built with **Svelte + Vite**, deployable as a static site to **GitHub Pages**.

## Features

- **1,136 words** across ~30 meaning categories and ~120 semantic subgroups, each
  with a GRE-tuned definition, example sentence, part of speech, synonyms, a memory
  hook, and confusable-word notes.
- **Cluster-first flashcards** — study a subgroup as a deck; reveal, then self-grade
  *Don't know / Almost / Know it*. Keyboard (`Space`/`→` reveal, `1`/`2`/`3` grade,
  `←` back) and swipe supported.
- **Spaced repetition** — a light Leitner system schedules words for review; the
  **Review due** queue surfaces what you're about to forget.
- **GRE traps** flagged — words whose tested meaning differs from the everyday one
  (e.g. `sanction`, `pedestrian`, `base`) carry a ⚑ badge and a cue.
- **Confusable pairs** and **review chains** drills, plus the **7-day plan** from the
  source guide mapped to in-app clusters.
- **Search**, **light/dark theme**, and **export / import** of progress (JSON) so you
  can back it up or move devices.
- Progress is stored in `localStorage` on your device only.

## Run locally

```bash
npm install
npm run dev      # http://localhost:5173
```

Other scripts:

```bash
npm run build    # production build into dist/
npm run preview  # serve the production build
npm test         # parser + data-completeness tests (Vitest)
```

## Deploy to GitHub Pages

1. Push this repo to GitHub.
2. In the repo, go to **Settings → Pages → Build and deployment** and set
   **Source = GitHub Actions**.
3. Push to `main` (or run the workflow manually). The included
   [`.github/workflows/deploy.yml`](.github/workflows/deploy.yml) builds the site
   and publishes `dist/`.

The app uses a **relative base path** and **hash-based routing**, so it works at any
Pages URL (`https://<user>.github.io/<repo>/`) with no configuration and never 404s
on refresh.

## How the word data is built

The content is generated from the two source guides by a small pipeline. You only
need this if you want to regenerate or edit the data.

```
gregmat-semantic-study-guide.md ─┐
gregmat-7-day-memory-plan.md ────┤
                                 ▼
  npm run parse                  scripts/parse-guide.mjs
    → data/skeleton.json         (every word + group memberships, trap cues,
    → src/lib/data/categories.json  chains, pairs, study plan)

  node scripts/make-partitions.mjs   → data/parts/*.json   (chunks for enrichment)
  (enrichment agents author defs)    → data/enriched/*.json
  (verification pass)                → data/corrections/*.json

  npm run enrich:merge           scripts/merge-enriched.mjs
    → src/lib/data/words.json    (final dataset the app imports)
```

The app reads only `src/lib/data/words.json` and `src/lib/data/categories.json`.

## Project layout

```
src/
  App.svelte              app shell + hash router
  components/             Home, CategoryView, Flashcard, WordCard, WordModal,
                          Search, PairsDrill, ChainsView, PlanView, Settings, …
  lib/
    words.js              data access helpers
    srs.js                Leitner spaced-repetition logic
    stores/              progress (localStorage), route, settings, ui
    data/                words.json, categories.json
scripts/                  parse / partition / merge + tests
.github/workflows/        Pages deploy
```
