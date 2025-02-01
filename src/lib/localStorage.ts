const STORAGE_KEY = "gregmat_words_states_960";

type FlashcardState = {
  [wordId: string]: "k" | "u"; // 'k' for known, 'u' for unknown
};

const isServer = typeof window === "undefined";

export function getFlashcardStates(): FlashcardState {
  if (isServer) {
    return {};
  }
  const storedStates = localStorage.getItem(STORAGE_KEY);
  return storedStates ? JSON.parse(storedStates) : {};
}

export function setFlashcardState(wordId: string, state: "k" | "u" | null) {
  if (isServer) {
    return;
  }
  const states = getFlashcardStates();
  if (state === null) {
    delete states[wordId];
  } else {
    states[wordId] = state;
  }
  localStorage.setItem(STORAGE_KEY, JSON.stringify(states));
}
