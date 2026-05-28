<script>
  import { searchWords } from '../lib/words.js';
  import { progress } from '../lib/stores/progress.js';
  import { statusOf } from '../lib/srs.js';
  import { openWord } from '../lib/stores/ui.js';

  let q = $state('');
  let results = $derived(searchWords(q));

  function focus(node) {
    node.focus();
  }
</script>

<div class="search">
  <div class="search-box">
    <span class="mag">⌕</span>
    <input
      use:focus
      type="search"
      placeholder="Search 1,100+ words…"
      bind:value={q}
      autocomplete="off"
      autocapitalize="off"
      spellcheck="false"
    />
    {#if q}<button class="clear" onclick={() => (q = '')} aria-label="Clear">✕</button>{/if}
  </div>

  {#if q && results.length === 0}
    <p class="muted hint">No matches for “{q}”.</p>
  {:else if !q}
    <p class="muted hint">Type to find any word by spelling or meaning.</p>
  {:else}
    <ul class="results">
      {#each results as w}
        <li>
          <button class="result" onclick={() => openWord(w.id)}>
            <span class="dot {statusOf($progress[w.id])}"></span>
            <span class="w">{w.word}</span>
            {#if w.greTrap}<span class="flag">⚑</span>{/if}
            <span class="def muted">{w.definition || w.primaryGroup || ''}</span>
          </button>
        </li>
      {/each}
    </ul>
  {/if}
</div>

<style>
  .search {
    margin-top: 16px;
  }
  .search-box {
    display: flex;
    align-items: center;
    gap: 8px;
    background: var(--bg-elev);
    border: 1px solid var(--border);
    border-radius: var(--radius);
    padding: 10px 14px;
    box-shadow: var(--shadow);
  }
  .mag {
    color: var(--text-dim);
    font-size: 1.2rem;
  }
  input {
    flex: 1;
    border: none;
    background: none;
    color: var(--text);
    font-size: 1rem;
    outline: none;
  }
  .clear {
    border: none;
    background: var(--bg-sunken);
    color: var(--text-dim);
    width: 24px;
    height: 24px;
    border-radius: 50%;
    font-size: 0.75rem;
  }
  .hint {
    margin-top: 18px;
    text-align: center;
  }
  .results {
    list-style: none;
    margin: 14px 0 0;
    padding: 0;
    display: flex;
    flex-direction: column;
  }
  .result {
    width: 100%;
    display: flex;
    align-items: center;
    gap: 10px;
    border: none;
    background: none;
    color: var(--text);
    padding: 11px 6px;
    text-align: left;
    border-bottom: 1px solid var(--border);
  }
  .result:hover {
    background: var(--bg-elev);
  }
  .w {
    font-weight: 700;
    flex: none;
  }
  .flag {
    color: var(--accent);
    font-size: 0.8rem;
  }
  .def {
    font-size: 0.86rem;
    overflow: hidden;
    text-overflow: ellipsis;
    white-space: nowrap;
  }
</style>
