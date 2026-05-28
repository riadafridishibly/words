<script>
  import { pairs, getWord } from '../lib/words.js';
  import { back } from '../lib/stores/route.js';
  import { openWord } from '../lib/stores/ui.js';

  let resolved = $derived(
    pairs
      .map(([a, b]) => ({ a: getWord(a), b: getWord(b) }))
      .filter((p) => p.a && p.b)
  );
</script>

<header class="head">
  <button class="exit" onclick={back}>‹ Back</button>
  <h1>Confusable pairs</h1>
  <p class="muted sub">Near-synonyms the GRE loves to swap. Read both, then tap a word for detail.</p>
</header>

<div class="pairs">
  {#each resolved as { a, b }}
    <section class="pair card fade-in">
      {#each [a, b] as w, i}
        <button class="side" class:divider={i === 0} onclick={() => openWord(w.id)}>
          <h2>{w.word}</h2>
          <p class="def">{w.definition || w.primaryGroup || 'Tap for detail'}</p>
          {#if w.confusableNote}<p class="note muted">{w.confusableNote}</p>{/if}
        </button>
      {/each}
    </section>
  {/each}
</div>

<style>
  .head {
    margin: 12px 0 18px;
  }
  .exit {
    border: none;
    background: none;
    color: var(--accent);
    font-weight: 700;
    font-size: 0.95rem;
    padding: 4px 0;
  }
  .head h1 {
    font-size: 1.4rem;
    margin-top: 6px;
  }
  .sub {
    font-size: 0.88rem;
    margin: 6px 0 0;
  }
  .pairs {
    display: flex;
    flex-direction: column;
    gap: 12px;
  }
  .pair {
    display: grid;
    grid-template-columns: 1fr 1fr;
    overflow: hidden;
  }
  .side {
    border: none;
    background: none;
    color: var(--text);
    text-align: left;
    padding: 16px;
    display: flex;
    flex-direction: column;
    gap: 6px;
  }
  .side.divider {
    border-right: 1px solid var(--border);
  }
  .side:hover {
    background: var(--bg-sunken);
  }
  .side h2 {
    font-size: 1.1rem;
  }
  .def {
    font-size: 0.9rem;
    margin: 0;
    line-height: 1.4;
  }
  .note {
    font-size: 0.8rem;
    margin: 0;
  }
</style>
