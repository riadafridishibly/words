<script>
  import { words, categories, wordsForCategory } from '../lib/words.js';
  import { progress } from '../lib/stores/progress.js';
  import { tally, isDue } from '../lib/srs.js';
  import { navigate } from '../lib/stores/route.js';
  import ProgressRing from './ProgressRing.svelte';

  const allIds = words.map((w) => w.id);

  let overall = $derived(tally(allIds, $progress));
  let dueCount = $derived(
    allIds.reduce((n, id) => n + (isDue($progress[id], Date.now()) ? 1 : 0), 0)
  );

  let catStats = $derived(
    categories.map((c) => {
      const ids = wordsForCategory(c.id).map((w) => w.id);
      return { cat: c, count: ids.length, counts: tally(ids, $progress) };
    })
  );

  // study streak: count consecutive days (ending today) with any activity
  let streak = $derived.by(() => {
    const days = new Set();
    for (const rec of Object.values($progress)) {
      if (rec?.updatedAt) days.add(new Date(rec.updatedAt).toDateString());
    }
    let s = 0;
    const d = new Date();
    while (days.has(d.toDateString())) {
      s++;
      d.setDate(d.getDate() - 1);
    }
    return s;
  });
</script>

<section class="hero card fade-in">
  <ProgressRing counts={overall} size={92} stroke={11} />
  <div class="hero-info">
    <div class="legend">
      <span><b>{overall.known}</b> known</span>
      <span><b>{overall.learning}</b> learning</span>
      <span><b>{overall.unknown}</b> tough</span>
      <span><b>{overall.new}</b> new</span>
    </div>
    <div class="hero-meta muted">
      {words.length} words{#if streak > 0} · 🔥 {streak}-day streak{/if}
    </div>
  </div>
</section>

<div class="actions">
  <button class="action primary" onclick={() => navigate('review')} disabled={dueCount === 0}>
    <span class="a-top">Review due</span>
    <span class="a-sub">{dueCount} word{dueCount === 1 ? '' : 's'}</span>
  </button>
  <button class="action" onclick={() => navigate('plan')}>
    <span class="a-top">7-day plan</span>
    <span class="a-sub">guided schedule</span>
  </button>
  <button class="action" onclick={() => navigate('pairs')}>
    <span class="a-top">Confusable pairs</span>
    <span class="a-sub">drill look-alikes</span>
  </button>
  <button class="action" onclick={() => navigate('chains')}>
    <span class="a-top">Review chains</span>
    <span class="a-sub">intensity ladders</span>
  </button>
</div>

<h2 class="section-title">Meaning clusters</h2>
<div class="cats">
  {#each catStats as { cat, count, counts }}
    <button class="cat card" onclick={() => navigate('category', cat.id)}>
      <ProgressRing {counts} size={50} stroke={6} center="pct" />
      <div class="cat-info">
        <span class="cat-title">{cat.title}</span>
        <span class="cat-sub muted">{counts.known}/{count} known · {cat.subgroups.length} groups</span>
      </div>
      <span class="chev muted">›</span>
    </button>
  {/each}
</div>

<style>
  .hero {
    display: flex;
    align-items: center;
    gap: 18px;
    padding: 20px;
    margin-top: 16px;
  }
  .hero-info {
    flex: 1;
    min-width: 0;
  }
  .legend {
    display: flex;
    flex-wrap: wrap;
    gap: 6px 16px;
    font-size: 0.92rem;
    color: var(--text-dim);
  }
  .legend b {
    color: var(--text);
  }
  .hero-meta {
    margin-top: 8px;
    font-size: 0.85rem;
  }
  .actions {
    display: grid;
    grid-template-columns: repeat(2, 1fr);
    gap: 10px;
    margin: 16px 0 24px;
  }
  .action {
    border: 1px solid var(--border);
    background: var(--bg-elev);
    border-radius: var(--radius);
    padding: 14px 16px;
    display: flex;
    flex-direction: column;
    gap: 2px;
    text-align: left;
    box-shadow: var(--shadow);
    color: var(--text);
  }
  .action:disabled {
    opacity: 0.5;
  }
  .action.primary {
    background: var(--accent);
    border-color: var(--accent);
    color: #fff;
  }
  .a-top {
    font-weight: 700;
    font-size: 0.98rem;
  }
  .a-sub {
    font-size: 0.8rem;
    opacity: 0.85;
  }
  .section-title {
    font-size: 1.05rem;
    margin: 0 0 12px 2px;
  }
  .cats {
    display: flex;
    flex-direction: column;
    gap: 10px;
  }
  .cat {
    display: flex;
    align-items: center;
    gap: 14px;
    padding: 13px 16px;
    text-align: left;
    color: var(--text);
    width: 100%;
  }
  .cat-info {
    flex: 1;
    display: flex;
    flex-direction: column;
    min-width: 0;
  }
  .cat-title {
    font-weight: 700;
    font-size: 0.98rem;
  }
  .cat-sub {
    font-size: 0.82rem;
  }
  .chev {
    font-size: 1.4rem;
  }
  @media (min-width: 640px) {
    .actions {
      grid-template-columns: repeat(4, 1fr);
    }
  }
</style>
