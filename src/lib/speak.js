// Tiny wrapper around the browser's Web Speech API for pronouncing words out
// loud. No dependencies and no network — it uses the voices already installed
// on the device, so it works offline and costs nothing.

const synth = typeof window !== 'undefined' ? window.speechSynthesis : null;

export function canSpeak() {
  return !!synth && typeof SpeechSynthesisUtterance !== 'undefined';
}

// Browsers (Chrome/Safari) populate getVoices() asynchronously, so cache the
// best English voice and refresh it when the list becomes available.
let preferredVoice = null;
function pickVoice() {
  if (!synth) return null;
  const voices = synth.getVoices();
  if (!voices.length) return null;
  preferredVoice =
    voices.find((v) => v.lang === 'en-US' && v.localService) ||
    voices.find((v) => v.lang === 'en-US') ||
    voices.find((v) => v.lang && v.lang.startsWith('en')) ||
    voices[0];
  return preferredVoice;
}

if (synth) {
  pickVoice();
  synth.addEventListener?.('voiceschanged', pickVoice);
}

export function speak(text) {
  if (!canSpeak() || !text) return;
  // Cancel anything still speaking so rapid taps don't queue up.
  synth.cancel();
  const u = new SpeechSynthesisUtterance(String(text));
  const voice = preferredVoice || pickVoice();
  if (voice) u.voice = voice;
  u.lang = voice?.lang || 'en-US';
  u.rate = 0.95; // a touch slower than default — clearer for unfamiliar words
  synth.speak(u);
}
