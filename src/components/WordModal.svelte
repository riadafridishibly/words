<script>
  import { openWordId, closeWord } from '../lib/stores/ui.js';
  import { getWord } from '../lib/words.js';
  import { progress } from '../lib/stores/progress.js';
  import { statusOf } from '../lib/srs.js';
  import WordCard from './WordCard.svelte';

  let word = $derived($openWordId ? getWord($openWordId) : null);
  let status = $derived(word ? statusOf($progress[word.id]) : 'new');

  const marks = [
    ['unknown', "Don't know", 'var(--unknown)'],
    ['learning', 'Learning', 'var(--learning)'],
    ['known', 'Known', 'var(--known)']
  ];

  function onKey(e) {
    if (e.key === 'Escape') closeWord();
  }
</script>

<svelte:window onkeydown={onKey} />

{#if word}
  <!-- backdrop click closes; Escape also closes via <svelte:window> -->
  <!-- svelte-ignore a11y_click_events_have_key_events -->
  <!-- svelte-ignore a11y_no_static_element_interactions -->
  <div class="overlay" onclick={(e) => e.target === e.currentTarget && closeWord()}>
    <div class="sheet card fade-in" role="dialog" aria-modal="true" aria-label={word.word}>
      <button class="close" onclick={closeWord} aria-label="Close">✕</button>
      <WordCard {word} />

      <div class="marks">
        {#each marks as [value, label, color]}
          <button
            class="mark"
            class:active={status === value}
            style="--mc:{color}"
            onclick={() => progress.mark(word.id, value)}
          >
            {label}
          </button>
        {/each}
      </div>
    </div>
  </div>
{/if}

<style>
  .overlay {
    position: fixed;
    inset: 0;
    background: rgba(15, 23, 42, 0.45);
    backdrop-filter: blur(2px);
    display: flex;
    align-items: flex-end;
    justify-content: center;
    z-index: 50;
    padding: 0;
  }
  .sheet {
    width: 100%;
    max-width: var(--maxw);
    max-height: 88vh;
    overflow-y: auto;
    border-radius: var(--radius) var(--radius) 0 0;
    box-shadow: var(--shadow-lg);
    padding: 22px 20px calc(20px + env(safe-area-inset-bottom));
    position: relative;
  }
  .close {
    position: absolute;
    top: 14px;
    right: 14px;
    border: none;
    background: var(--bg-sunken);
    color: var(--text-dim);
    width: 32px;
    height: 32px;
    border-radius: 50%;
    font-size: 0.9rem;
  }
  .marks {
    display: grid;
    grid-template-columns: repeat(3, 1fr);
    gap: 8px;
    margin-top: 22px;
  }
  .mark {
    border: 1.5px solid var(--border);
    background: var(--bg-elev);
    color: var(--text);
    border-radius: var(--radius-sm);
    padding: 11px 8px;
    font-weight: 700;
    font-size: 0.9rem;
  }
  .mark.active {
    border-color: var(--mc);
    background: color-mix(in srgb, var(--mc) 14%, transparent);
    color: var(--mc);
  }
  @media (min-width: 640px) {
    .overlay {
      align-items: center;
      padding: 20px;
    }
    .sheet {
      border-radius: var(--radius);
      max-height: 84vh;
    }
  }
</style>
