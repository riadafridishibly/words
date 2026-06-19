<script>
  import { bookmarks } from '../lib/stores/bookmarks.js';
  import { getWord } from '../lib/words.js';
  import { progress } from '../lib/stores/progress.js';
  import { statusOf } from '../lib/srs.js';
  import { openWord } from '../lib/stores/ui.js';
  import { navigate } from '../lib/stores/route.js';
  import Icon from './Icon.svelte';

  // Saved words, newest first, dropping any ids that no longer resolve.
  let saved = $derived(
    Object.entries($bookmarks)
      .sort((a, b) => b[1] - a[1])
      .map(([id]) => getWord(id))
      .filter(Boolean)
  );
</script>

<div class="bookmarks">
  <div class="head">
    <h2 class="title"><Icon name="bookmark" size={20} /> Saved words</h2>
    {#if saved.length}<span class="count muted">{saved.length}</span>{/if}
  </div>

  {#if saved.length === 0}
    <div class="empty">
      <span class="empty-icon"><Icon name="bookmark" size={34} /></span>
      <p class="muted">No saved words yet.</p>
      <p class="muted hint">
        Open any word and tap the bookmark to save it here.
      </p>
      <button class="browse" onclick={() => navigate('search')}>Find words</button>
    </div>
  {:else}
    <ul class="results">
      {#each saved as w}
        <li>
          <button class="result" onclick={() => openWord(w.id)}>
            <span class="dot {statusOf($progress[w.id])}"></span>
            <span class="w">{w.word}</span>
            {#if w.greTrap}<span class="flag">⚑</span>{/if}
            <span class="def muted">{w.definition || w.primaryGroup || ''}</span>
          </button>
          <button
            class="remove"
            onclick={() => bookmarks.remove(w.id)}
            aria-label="Remove {w.word} from saved"
            title="Remove from saved"
          >
            <Icon name="bookmark" size={16} fill="currentColor" />
          </button>
        </li>
      {/each}
    </ul>
  {/if}
</div>

<style>
  .bookmarks {
    margin-top: 16px;
  }
  .head {
    display: flex;
    align-items: center;
    gap: 10px;
    margin-bottom: 8px;
  }
  .title {
    display: flex;
    align-items: center;
    gap: 8px;
    font-size: 1.05rem;
    margin: 0;
  }
  .count {
    font-size: 0.85rem;
    background: var(--bg-sunken);
    border-radius: 999px;
    padding: 1px 9px;
    font-weight: 700;
  }
  .empty {
    display: flex;
    flex-direction: column;
    align-items: center;
    gap: 6px;
    text-align: center;
    padding: 48px 16px;
  }
  .empty-icon {
    color: var(--text-dim);
    opacity: 0.6;
    margin-bottom: 4px;
  }
  .hint {
    font-size: 0.85rem;
    max-width: 22rem;
  }
  .browse {
    margin-top: 12px;
    border: 1px solid var(--border);
    background: var(--bg-elev);
    color: var(--text);
    border-radius: var(--radius-sm);
    padding: 9px 18px;
    font-weight: 700;
    font-size: 0.9rem;
  }
  .results {
    list-style: none;
    margin: 8px 0 0;
    padding: 0;
    display: flex;
    flex-direction: column;
  }
  li {
    display: flex;
    align-items: center;
    border-bottom: 1px solid var(--border);
  }
  .result {
    flex: 1;
    min-width: 0;
    display: flex;
    align-items: center;
    gap: 10px;
    border: none;
    background: none;
    color: var(--text);
    padding: 11px 6px;
    text-align: left;
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
  .remove {
    flex: none;
    border: none;
    background: none;
    color: var(--accent);
    width: 34px;
    height: 34px;
    border-radius: 50%;
    display: grid;
    place-items: center;
  }
  .remove:hover {
    background: var(--bg-elev);
    color: var(--text-dim);
  }
</style>
