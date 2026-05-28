import { writable } from 'svelte/store';

// id of the word shown in the detail modal (null = closed)
export const openWordId = writable(null);

export function openWord(id) {
  openWordId.set(id);
}

export function closeWord() {
  openWordId.set(null);
}
