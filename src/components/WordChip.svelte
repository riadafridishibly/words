<script>
  import { progress } from '../lib/stores/progress.js';
  import { statusOf } from '../lib/srs.js';

  let { word, onclick } = $props();
  let status = $derived(statusOf($progress[word.id]));
</script>

<button class="chip" class:trap={word.greTrap} {onclick} title={word.greTrap ? 'GRE trap word' : ''}>
  <span class="dot {status}"></span>
  <span class="label">{word.word}</span>
  {#if word.greTrap}<span class="trap-mark" aria-label="GRE trap">⚑</span>{/if}
</button>

<style>
  .chip {
    display: inline-flex;
    align-items: center;
    gap: 7px;
    background: var(--chip-bg);
    border: 1px solid var(--border);
    border-radius: 999px;
    padding: 6px 12px;
    font-size: 0.92rem;
    font-weight: 600;
    color: var(--text);
    transition: border-color 0.12s ease, transform 0.06s ease;
  }
  .chip:hover {
    border-color: var(--accent);
  }
  .chip:active {
    transform: translateY(1px);
  }
  .label {
    white-space: nowrap;
  }
  .trap-mark {
    color: var(--accent);
    font-size: 0.8em;
  }
</style>
