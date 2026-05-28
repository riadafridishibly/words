<script>
  import { get } from 'svelte/store';
  import {
    words,
    chains,
    subgroupById,
    categoryById,
    wordsForSubgroup,
    wordsForCategory
  } from '../lib/words.js';
  import { progress } from '../lib/stores/progress.js';
  import { isDue } from '../lib/srs.js';
  import { back } from '../lib/stores/route.js';
  import Flashcard from './Flashcard.svelte';

  // scope: 'group' | 'cat' | 'due' | 'chain'
  let { scope, id } = $props();

  // Resolved once per (scope,id). For 'due' we snapshot the queue so cards
  // don't disappear from under the user as they grade them.
  let deck = $derived.by(() => {
    if (scope === 'group') {
      const sg = subgroupById.get(id);
      if (!sg) return null;
      return { ids: sg.words, title: sg.categoryTitle, subtitle: sg.label };
    }
    if (scope === 'cat') {
      const cat = categoryById.get(id);
      if (!cat) return null;
      return { ids: wordsForCategory(cat.id).map((w) => w.id), title: cat.title, subtitle: 'All words' };
    }
    if (scope === 'chain') {
      const ch = chains[Number(id)];
      if (!ch) return null;
      return { ids: ch.words, title: 'Review chain', subtitle: ch.label };
    }
    if (scope === 'due') {
      const p = get(progress);
      const now = Date.now();
      const ids = words.filter((w) => isDue(p[w.id], now)).map((w) => w.id);
      return { ids, title: 'Review', subtitle: 'Due for review' };
    }
    return null;
  });
</script>

{#if !deck}
  <p class="empty muted">Nothing to study here. <a href="#/">Back home</a></p>
{:else if deck.ids.length === 0}
  <div class="empty card">
    <div class="big">🎉</div>
    <h2>All caught up</h2>
    <p class="muted">No words are due for review right now. Come back later or study a new cluster.</p>
    <button class="btn primary" onclick={back}>Back home</button>
  </div>
{:else}
  {#key scope + ':' + id}
    <Flashcard ids={deck.ids} title={deck.title} subtitle={deck.subtitle} onexit={back} />
  {/key}
{/if}

<style>
  .empty {
    margin-top: 40px;
    padding: 32px 22px;
    text-align: center;
    display: flex;
    flex-direction: column;
    align-items: center;
    gap: 12px;
  }
  .big {
    font-size: 2.4rem;
  }
</style>
