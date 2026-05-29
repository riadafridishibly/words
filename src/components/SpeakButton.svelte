<script>
  import { canSpeak, speak } from '../lib/speak.js';

  // text: the word to pronounce. size: 'md' (default) or 'lg' for the flashcard.
  let { text, size = 'md', label = 'Hear pronunciation' } = $props();

  const supported = canSpeak();

  function pronounce(e) {
    // Keep the tap from bubbling to a card flip or modal backdrop.
    e.stopPropagation();
    speak(text);
  }
</script>

{#if supported}
  <button
    type="button"
    class="speak"
    class:lg={size === 'lg'}
    onclick={pronounce}
    title={label}
    aria-label={label}
  >
    <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2"
      stroke-linecap="round" stroke-linejoin="round" aria-hidden="true">
      <path d="M11 5 6 9H2v6h4l5 4z" />
      <path d="M15.5 8.5a5 5 0 0 1 0 7" />
      <path d="M19 5a9 9 0 0 1 0 14" />
    </svg>
  </button>
{/if}

<style>
  .speak {
    border: 1px solid var(--border);
    background: var(--bg-elev);
    color: var(--text-dim);
    border-radius: 50%;
    width: 34px;
    height: 34px;
    display: inline-grid;
    place-items: center;
    line-height: 1;
    flex: none;
    transition: transform 0.06s ease, background 0.15s ease, color 0.15s ease,
      border-color 0.15s ease;
  }
  .speak svg {
    width: 18px;
    height: 18px;
  }
  .speak:hover {
    color: var(--accent);
    border-color: var(--accent);
    background: var(--accent-soft);
  }
  .speak:active {
    transform: scale(0.92);
  }
  .speak.lg {
    width: 46px;
    height: 46px;
  }
  .speak.lg svg {
    width: 24px;
    height: 24px;
  }
</style>
