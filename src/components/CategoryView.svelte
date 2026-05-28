<script>
  import { categoryById, wordsForSubgroup, wordsForCategory } from '../lib/words.js';
  import { progress } from '../lib/stores/progress.js';
  import { tally } from '../lib/srs.js';
  import { navigate, back } from '../lib/stores/route.js';
  import { openWord } from '../lib/stores/ui.js';
  import ProgressRing from './ProgressRing.svelte';
  import WordChip from './WordChip.svelte';

  let { id } = $props();
  let cat = $derived(categoryById.get(id));
  let catCount = $derived(cat ? wordsForCategory(cat.id).length : 0);
</script>

{#if !cat}
  <p class="muted" style="margin-top:24px">Category not found. <a href="#/">Home</a></p>
{:else}
  <header class="head">
    <button class="exit" onclick={back}>‹ Back</button>
    <h1>{cat.title}</h1>
    <button class="btn primary study-all" onclick={() => navigate('study', 'cat', cat.id)}>
      Study all {catCount}
    </button>
  </header>

  <div class="groups">
    {#each cat.subgroups as sg}
      {@const sgWords = wordsForSubgroup(sg.id)}
      {@const counts = tally(sgWords.map((w) => w.id), $progress)}
      <section class="group card fade-in">
        <div class="group-head">
          <ProgressRing {counts} size={44} stroke={6} center="pct" />
          <div class="group-titles">
            <h2>{sg.label}</h2>
            <span class="muted">{counts.known}/{sgWords.length} known</span>
          </div>
          <button class="btn study" onclick={() => navigate('study', 'group', sg.id)}>Study</button>
        </div>
        <div class="chips">
          {#each sgWords as w}
            <WordChip word={w} onclick={() => openWord(w.id)} />
          {/each}
        </div>
      </section>
    {/each}
  </div>
{/if}

<style>
  .head {
    display: grid;
    grid-template-columns: auto 1fr;
    align-items: center;
    gap: 8px 12px;
    margin: 12px 0 18px;
  }
  .exit {
    border: none;
    background: none;
    color: var(--accent);
    font-weight: 700;
    font-size: 0.95rem;
    padding: 4px 0;
    grid-column: 1;
  }
  .head h1 {
    grid-column: 1 / -1;
    grid-row: 2;
    font-size: 1.4rem;
  }
  .study-all {
    grid-column: 2;
    grid-row: 1;
    justify-self: end;
    white-space: nowrap;
  }
  .groups {
    display: flex;
    flex-direction: column;
    gap: 12px;
  }
  .group {
    padding: 16px;
  }
  .group-head {
    display: flex;
    align-items: center;
    gap: 13px;
    margin-bottom: 14px;
  }
  .group-titles {
    flex: 1;
    min-width: 0;
  }
  .group-titles h2 {
    font-size: 1.02rem;
  }
  .group-titles .muted {
    font-size: 0.82rem;
  }
  .study {
    white-space: nowrap;
  }
  .chips {
    display: flex;
    flex-wrap: wrap;
    gap: 8px;
  }
</style>
