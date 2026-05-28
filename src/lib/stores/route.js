import { readable } from 'svelte/store';

// Minimal hash-based router. Hash routing works on GitHub Pages with no
// server config and never 404s on refresh.
//
// Routes:
//   #/                      -> home
//   #/category/<id>         -> a top-level category's subgroups
//   #/study/<groupId>       -> flashcard fly-through of a subgroup
//   #/review                -> due/struggling words across everything
//   #/pairs                 -> confusable-pair drill
//   #/chains                -> review-chain drills
//   #/plan                  -> 7-day plan
//   #/search                -> search

function decode(hash) {
  const clean = (hash || '').replace(/^#/, '');
  const parts = clean.split('/').filter(Boolean); // ['category', 'id']
  const name = parts[0] || 'home';
  const params = parts.slice(1).map((p) => decodeURIComponent(p));
  return { name, params, hash: clean };
}

export const route = readable(decode(location.hash), (set) => {
  const handler = () => set(decode(location.hash));
  window.addEventListener('hashchange', handler);
  return () => window.removeEventListener('hashchange', handler);
});

export function navigate(...parts) {
  const path = parts.map((p) => encodeURIComponent(String(p))).join('/');
  location.hash = '#/' + path;
}

export function back() {
  history.back();
}
