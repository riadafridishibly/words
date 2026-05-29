<script>
  import { getWord } from '../lib/words.js';
  import { progress } from '../lib/stores/progress.js';
  import { speak } from '../lib/speak.js';
  import WordCard from './WordCard.svelte';
  import SpeakButton from './SpeakButton.svelte';

  // ids: word ids to study. title/subtitle: header. onexit: leave the deck.
  let { ids, title = 'Study', subtitle = '', onexit } = $props();

  let queue = $state([...ids]);
  let index = $state(0);
  let flipped = $state(false);
  let cleared = $state(new Set());
  let results = $state({ again: 0, hard: 0, good: 0 });

  const total = ids.length;
  let finished = $derived(index >= queue.length);
  let current = $derived(finished ? null : getWord(queue[index]));
  let pct = $derived(total ? Math.round((cleared.size / total) * 100) : 100);

  const grades = [
    ['again', "Don't know", '1', 'var(--unknown)'],
    ['hard', 'Almost', '2', 'var(--learning)'],
    ['good', 'Know it', '3', 'var(--known)']
  ];

  function flip() {
    flipped = !flipped;
  }

  function grade(g) {
    if (!current) return;
    const id = current.id;
    progress.grade(id, g);
    results[g]++;
    if (g === 'again') {
      queue = [...queue, id];
    } else {
      cleared.add(id);
      cleared = new Set(cleared);
    }
    flipped = false;
    index++;
  }

  function prev() {
    if (index > 0) {
      index--;
      flipped = true;
    }
  }

  function restart() {
    queue = [...ids];
    index = 0;
    flipped = false;
    cleared = new Set();
    results = { again: 0, hard: 0, good: 0 };
  }

  function onKey(e) {
    if (e.target?.tagName === 'INPUT' || e.target?.tagName === 'TEXTAREA') return;
    if (finished) return;
    if (e.key === ' ' || e.key === 'Enter') {
      e.preventDefault();
      flip();
    } else if (e.key === 'ArrowLeft') {
      prev();
    } else if (e.key === 'ArrowRight' || e.key === 'ArrowDown') {
      if (!flipped) flip();
    } else if (e.key === 's' || e.key === 'S') {
      if (current) speak(current.word);
    } else if (flipped && (e.key === '1' || e.key === 'j')) grade('again');
    else if (flipped && (e.key === '2' || e.key === 'k')) grade('hard');
    else if (flipped && (e.key === '3' || e.key === 'l')) grade('good');
  }

  // basic touch: horizontal swipe = prev/next, tap (small move) = flip
  let touch = { x: 0, y: 0, t: 0 };
  function onTouchStart(e) {
    const t = e.changedTouches[0];
    touch = { x: t.clientX, y: t.clientY, t: Date.now() };
  }
  function onTouchEnd(e) {
    const t = e.changedTouches[0];
    const dx = t.clientX - touch.x;
    const dy = t.clientY - touch.y;
    if (Math.abs(dx) > 60 && Math.abs(dx) > Math.abs(dy)) {
      if (dx < 0 && !flipped) flip();
      else if (dx > 0) prev();
    }
  }
</script>

<svelte:window onkeydown={onKey} />

<div class="deck">
  <header class="deck-head">
    <button class="exit" onclick={onexit} aria-label="Back">‹ Back</button>
    <div class="titles">
      <strong>{title}</strong>
      {#if subtitle}<span class="muted">{subtitle}</span>{/if}
    </div>
    <span class="counter muted">{Math.min(cleared.size + 1, total)}/{total}</span>
  </header>

  <div class="bar"><div class="bar-fill" style="width:{pct}%"></div></div>

  {#if finished}
    <div class="summary card fade-in">
      <div class="big-check">✓</div>
      <h2>Deck complete</h2>
      <div class="tally">
        <span><span class="dot known"></span>{results.good} known</span>
        <span><span class="dot learning"></span>{results.hard} almost</span>
        <span><span class="dot unknown"></span>{results.again} missed</span>
      </div>
      <div class="summary-actions">
        <button class="btn" onclick={restart}>Study again</button>
        <button class="btn primary" onclick={onexit}>Done</button>
      </div>
    </div>
  {:else if current}
    <!-- swipe is a convenience; full keyboard control lives on <svelte:window> -->
    <!-- svelte-ignore a11y_no_static_element_interactions -->
    <div
      class="card-area"
      ontouchstart={onTouchStart}
      ontouchend={onTouchEnd}
    >
      {#key queue[index] + ':' + flipped}
        <!-- keyboard flip/grade is handled globally on <svelte:window> -->
        <!-- svelte-ignore a11y_click_events_have_key_events -->
        <!-- svelte-ignore a11y_no_static_element_interactions -->
        <div class="flashcard card fade-in" class:flipped onclick={flip}>
          {#if !flipped}
            <div class="front">
              {#if current.greTrap}<span class="pill trap">⚑ GRE trap</span>{/if}
              {#if current.primaryGroup}<span class="hint">{current.primaryGroup}</span>{/if}
              <h1 class="big-word">{current.word}</h1>
              <SpeakButton text={current.word} size="lg" />
              <span class="tap-hint muted">tap or press space to reveal · S to hear</span>
            </div>
          {:else}
            <div class="back">
              <WordCard word={current} compact />
            </div>
          {/if}
        </div>
      {/key}
    </div>

    <div class="controls">
      {#if !flipped}
        <button class="btn primary reveal" onclick={flip}>Reveal</button>
      {:else}
        {#each grades as [g, label, key, color]}
          <button class="grade" style="--gc:{color}" onclick={() => grade(g)}>
            <span class="g-label">{label}</span>
            <span class="g-key">{key}</span>
          </button>
        {/each}
      {/if}
    </div>
  {/if}
</div>

<style>
  .deck {
    display: flex;
    flex-direction: column;
    gap: 14px;
    padding-top: 12px;
  }
  .deck-head {
    display: flex;
    align-items: center;
    gap: 12px;
  }
  .exit {
    border: none;
    background: none;
    color: var(--accent);
    font-weight: 700;
    font-size: 0.95rem;
    padding: 4px 0;
  }
  .titles {
    flex: 1;
    display: flex;
    flex-direction: column;
    line-height: 1.15;
    min-width: 0;
  }
  .titles strong {
    font-size: 0.98rem;
  }
  .titles .muted {
    font-size: 0.8rem;
  }
  .counter {
    font-variant-numeric: tabular-nums;
    font-weight: 700;
    font-size: 0.9rem;
  }
  .bar {
    height: 6px;
    background: var(--bg-sunken);
    border-radius: 999px;
    overflow: hidden;
  }
  .bar-fill {
    height: 100%;
    background: var(--known);
    border-radius: 999px;
    transition: width 0.25s ease;
  }
  .card-area {
    min-height: 320px;
    display: flex;
  }
  .flashcard {
    flex: 1;
    padding: 26px 22px;
    cursor: pointer;
    display: flex;
    min-height: 320px;
  }
  .front {
    flex: 1;
    display: flex;
    flex-direction: column;
    align-items: center;
    justify-content: center;
    gap: 16px;
    text-align: center;
  }
  .hint {
    font-size: 0.82rem;
    font-weight: 700;
    text-transform: uppercase;
    letter-spacing: 0.04em;
    color: var(--text-dim);
  }
  .big-word {
    font-size: clamp(2.2rem, 9vw, 3.2rem);
    font-weight: 800;
    letter-spacing: -0.02em;
  }
  .tap-hint {
    font-size: 0.82rem;
  }
  .back {
    flex: 1;
  }
  .pill.trap {
    background: var(--accent-soft);
    color: var(--accent);
  }
  .controls {
    display: grid;
    grid-template-columns: repeat(3, 1fr);
    gap: 9px;
    position: sticky;
    bottom: calc(12px + env(safe-area-inset-bottom));
  }
  .reveal {
    grid-column: 1 / -1;
    padding: 16px;
    font-size: 1rem;
  }
  .grade {
    border: 1.5px solid var(--border);
    background: var(--bg-elev);
    color: var(--text);
    border-radius: var(--radius);
    padding: 13px 6px 10px;
    display: flex;
    flex-direction: column;
    align-items: center;
    gap: 4px;
    box-shadow: var(--shadow);
  }
  .grade:active {
    transform: translateY(1px);
  }
  .g-label {
    font-weight: 700;
    font-size: 0.92rem;
    color: var(--gc);
  }
  .g-key {
    font-size: 0.7rem;
    color: var(--text-dim);
    font-variant-numeric: tabular-nums;
    border: 1px solid var(--border);
    border-radius: 5px;
    padding: 0 6px;
  }
  .summary {
    padding: 34px 22px;
    display: flex;
    flex-direction: column;
    align-items: center;
    gap: 16px;
    text-align: center;
  }
  .big-check {
    width: 64px;
    height: 64px;
    border-radius: 50%;
    background: color-mix(in srgb, var(--known) 16%, transparent);
    color: var(--known);
    display: grid;
    place-items: center;
    font-size: 2rem;
    font-weight: 800;
  }
  .tally {
    display: flex;
    flex-wrap: wrap;
    gap: 16px;
    justify-content: center;
    color: var(--text-dim);
    font-weight: 600;
    font-size: 0.95rem;
  }
  .tally span {
    display: inline-flex;
    align-items: center;
    gap: 7px;
  }
  .summary-actions {
    display: flex;
    gap: 10px;
    margin-top: 6px;
  }
</style>
