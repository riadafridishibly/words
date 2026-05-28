import { writable } from 'svelte/store';
import { grade as gradeFn } from '../srs.js';

const KEY = 'gre-progress-v1';

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

    // record a flashcard grade ('again' | 'hard' | 'good')
    grade(id, g) {
      store.update((m) => ({ ...m, [id]: gradeFn(m[id], g, Date.now()) }));
    },

    // manual status set from the detail view, without SRS scheduling noise
    mark(id, status) {
      const box = status === 'known' ? 4 : status === 'learning' ? 1 : 0;
      store.update((m) => ({
        ...m,
        [id]: {
          status,
          box,
          dueAt: Date.now(),
          seen: (m[id]?.seen ?? 0) + 1,
          correct: m[id]?.correct ?? 0,
          updatedAt: Date.now()
        }
      }));
    },

    reset(id) {
      store.update((m) => {
        const next = { ...m };
        delete next[id];
        return next;
      });
    },

    replaceAll(map) {
      store.set(map && typeof map === 'object' ? map : {});
    },

    clear() {
      store.set({});
    }
  };
}

export const progress = create();
