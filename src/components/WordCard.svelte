<script>
  import SpeakButton from './SpeakButton.svelte';

  // The rich detail body for a word. Reused as the flashcard "back" and inside
  // the modal. `compact` trims spacing for the flashcard.
  let { word, compact = false } = $props();
</script>

<div class="detail" class:compact>
  <div class="head">
    <h2 class="word">{word.word}</h2>
    <SpeakButton text={word.word} />
    {#if word.pos}<span class="pos">{word.pos}</span>{/if}
    {#if word.greTrap}<span class="pill trap">⚑ GRE trap</span>{/if}
  </div>

  {#if word.definition}
    <p class="definition">{word.definition}</p>
  {:else}
    <p class="definition muted">Definition coming soon.</p>
  {/if}

  {#if word.greTrap && word.greCue}
    <div class="cue">
      <span class="cue-label">GRE cue</span>
      <span>{word.greCue}</span>
    </div>
  {/if}

  {#if word.example}
    <blockquote class="example">{word.example}</blockquote>
  {/if}

  {#if word.synonyms && word.synonyms.length}
    <div class="row">
      <span class="row-label">Synonyms</span>
      <span class="syns">{word.synonyms.join(', ')}</span>
    </div>
  {/if}

  {#if word.mnemonic}
    <div class="mnemonic">
      <span class="bulb">💡</span>
      <span>{word.mnemonic}</span>
    </div>
  {/if}

  {#if word.confusableNote}
    <div class="confusable">
      <span class="row-label warn">Don't confuse</span>
      <span>{word.confusableNote}</span>
    </div>
  {/if}

  {#if !compact && word.groups && word.groups.length}
    <div class="groups">
      {#each word.groups as g}
        <span class="group-chip">{g.subgroupLabel}</span>
      {/each}
    </div>
  {/if}
</div>

<style>
  .detail {
    display: flex;
    flex-direction: column;
    gap: 14px;
    text-align: left;
  }
  .compact {
    gap: 11px;
  }
  .head {
    display: flex;
    align-items: center;
    gap: 10px;
    flex-wrap: wrap;
  }
  .word {
    font-size: 1.9rem;
    font-weight: 800;
    letter-spacing: -0.01em;
  }
  .compact .word {
    font-size: 1.5rem;
  }
  .pos {
    font-style: italic;
    color: var(--text-dim);
    font-size: 0.95rem;
  }
  .pill.trap {
    background: var(--accent-soft);
    color: var(--accent);
  }
  .definition {
    font-size: 1.12rem;
    margin: 0;
    line-height: 1.45;
  }
  .compact .definition {
    font-size: 1.05rem;
  }
  .cue {
    display: flex;
    align-items: baseline;
    gap: 9px;
    background: var(--accent-soft);
    border-radius: var(--radius-sm);
    padding: 8px 12px;
    font-size: 0.95rem;
  }
  .cue-label {
    font-size: 0.68rem;
    font-weight: 800;
    text-transform: uppercase;
    letter-spacing: 0.04em;
    color: var(--accent);
    flex: none;
  }
  .example {
    margin: 0;
    padding: 10px 14px;
    border-left: 3px solid var(--accent);
    background: var(--bg-sunken);
    border-radius: 0 var(--radius-sm) var(--radius-sm) 0;
    font-size: 1rem;
    line-height: 1.5;
  }
  .row {
    display: flex;
    gap: 9px;
    flex-wrap: wrap;
    align-items: baseline;
    font-size: 0.97rem;
  }
  .row-label,
  .cue-label {
    flex: none;
  }
  .row-label {
    font-size: 0.68rem;
    font-weight: 800;
    text-transform: uppercase;
    letter-spacing: 0.04em;
    color: var(--text-dim);
  }
  .row-label.warn {
    color: var(--learning);
  }
  .syns {
    color: var(--text);
  }
  .mnemonic {
    display: flex;
    gap: 9px;
    font-size: 0.97rem;
    color: var(--text-dim);
    line-height: 1.45;
  }
  .bulb {
    flex: none;
  }
  .confusable {
    display: flex;
    flex-direction: column;
    gap: 3px;
    font-size: 0.95rem;
  }
  .groups {
    display: flex;
    flex-wrap: wrap;
    gap: 6px;
    margin-top: 2px;
  }
  .group-chip {
    font-size: 0.74rem;
    font-weight: 600;
    color: var(--text-dim);
    background: var(--bg-sunken);
    border-radius: 999px;
    padding: 3px 10px;
  }
</style>
