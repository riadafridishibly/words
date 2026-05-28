import { writable } from 'svelte/store';

const KEY = 'gre-settings-v1';

function load() {
  try {
    return JSON.parse(localStorage.getItem(KEY)) || {};
  } catch {
    return {};
  }
}

function systemPrefersDark() {
  return window.matchMedia && window.matchMedia('(prefers-color-scheme: dark)').matches;
}

const initial = load();
const defaults = {
  theme: initial.theme || (systemPrefersDark() ? 'dark' : 'light')
};

function createSettings() {
  const { subscribe, update, set } = writable({ ...defaults, ...initial });

  subscribe((value) => {
    try {
      localStorage.setItem(KEY, JSON.stringify(value));
    } catch {
      /* ignore quota / private-mode errors */
    }
    document.documentElement.dataset.theme = value.theme;
  });

  return {
    subscribe,
    set,
    toggleTheme: () =>
      update((s) => ({ ...s, theme: s.theme === 'dark' ? 'light' : 'dark' }))
  };
}

export const settings = createSettings();
