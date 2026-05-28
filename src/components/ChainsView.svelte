<script>
  import { chains, getWord } from '../lib/words.js';
  import { back, navigate } from '../lib/stores/route.js';
  import { openWord } from '../lib/stores/ui.js';
</script>

<header class="head">
  <button class="exit" onclick={back}>‹ Back</button>
  <h1>Review chains</h1>
  <p class="muted sub">Intensity ladders — each step is stronger than the last. Tap a word for detail.</p>
</header>

<div class="chains">
  {#each chains as ch, i}
    <section class="chain card fade-in">
      <div class="chain-head">
        <h2>{ch.label}</h2>
        <button class="btn study" onclick={() => navigate('study', 'chain', i)}>Study</button>
      </div>
      <div class="ladder">
        {#each ch.words as id, j}
          {@const w = getWord(id)}
          {#if w}
            {#if j > 0}<span class="arrow">→</span>{/if}
            <button class="step" onclick={() => openWord(w.id)}>{w.word}</button>
          {/if}
        {/each}
      </div>
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
  .chains {
    display: flex;
    flex-direction: column;
    gap: 12px;
  }
  .chain {
    padding: 16px;
  }
  .chain-head {
    display: flex;
    align-items: center;
    justify-content: space-between;
    margin-bottom: 12px;
  }
  .chain-head h2 {
    font-size: 1.02rem;
  }
  .ladder {
    display: flex;
    flex-wrap: wrap;
    align-items: center;
    gap: 7px;
  }
  .arrow {
    color: var(--text-dim);
  }
  .step {
    border: 1px solid var(--border);
    background: var(--chip-bg);
    color: var(--text);
    border-radius: 999px;
    padding: 6px 13px;
    font-weight: 600;
    font-size: 0.92rem;
  }
  .step:hover {
    border-color: var(--accent);
  }
</style>
