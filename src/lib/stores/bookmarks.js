import { writable } from 'svelte/store';

// Bookmarked words, persisted to localStorage. Stored as a map of
// { [wordId]: addedAt } so the saved list can be ordered most-recent-first.
const KEY = 'gre-bookmarks-v1';

function load() {
  try {
    return JSON.parse(localStorage.getItem(KEY)) || {};
  } catch {
    return {};
  }
}

function save(map) {
  try {
    localStorage.setItem(KEY, JSON.stringify(map));
  } catch {
    /* ignore quota / private-mode errors */
  }
}

function create() {
  const store = writable(load());
  store.subscribe(save);

  return {
    subscribe: store.subscribe,

    add(id) {
      store.update((m) => (m[id] ? m : { ...m, [id]: Date.now() }));
    },

    remove(id) {
      store.update((m) => {
        if (!m[id]) return m;
        const next = { ...m };
        delete next[id];
        return next;
      });
    },

    toggle(id) {
      store.update((m) => {
        if (m[id]) {
          const next = { ...m };
          delete next[id];
          return next;
        }
        return { ...m, [id]: Date.now() };
      });
    },

    clear() {
      store.set({});
    }
  };
}

export const bookmarks = create();
