<script>
  import { plan, categoryById, wordsForCategory } from '../lib/words.js';
  import { progress } from '../lib/stores/progress.js';
  import { tally } from '../lib/srs.js';
  import { back, navigate } from '../lib/stores/route.js';
  import ProgressRing from './ProgressRing.svelte';
</script>

<header class="head">
  <button class="exit" onclick={back}>‹ Back</button>
  <h1>7-day plan</h1>
  <p class="muted sub">One themed batch of clusters per day. Recite the cluster label, then recall its words.</p>
</header>

<div class="days">
  {#each plan as day}
    {@const dayIds = day.categories.flatMap((cid) => wordsForCategory(cid).map((w) => w.id))}
    {@const counts = tally(dayIds, $progress)}
    <section class="day card fade-in">
      <div class="day-head">
        <ProgressRing {counts} size={46} stroke={6} center="pct" />
        <div class="day-titles">
          <h2>Day {day.day} · {day.title}</h2>
          <span class="muted">{counts.known}/{dayIds.length} known</span>
        </div>
      </div>
      <div class="cats">
        {#each day.categories as cid}
          {@const cat = categoryById.get(cid)}
          {#if cat}
            <button class="cat-link" onclick={() => navigate('category', cid)}>{cat.title}</button>
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
  .days {
    display: flex;
    flex-direction: column;
    gap: 12px;
  }
  .day {
    padding: 16px;
  }
  .day-head {
    display: flex;
    align-items: center;
    gap: 13px;
    margin-bottom: 13px;
  }
  .day-titles h2 {
    font-size: 1.02rem;
  }
  .day-titles .muted {
    font-size: 0.82rem;
  }
  .cats {
    display: flex;
    flex-wrap: wrap;
    gap: 8px;
  }
  .cat-link {
    border: 1px solid var(--border);
    background: var(--chip-bg);
    color: var(--text);
    border-radius: 999px;
    padding: 6px 13px;
    font-size: 0.88rem;
    font-weight: 600;
  }
  .cat-link:hover {
    border-color: var(--accent);
  }
</style>
