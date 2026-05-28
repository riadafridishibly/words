<script>
  import { get } from 'svelte/store';
  import { words } from '../lib/words.js';
  import { progress } from '../lib/stores/progress.js';
  import { settings } from '../lib/stores/settings.js';
  import { tally } from '../lib/srs.js';
  import { back } from '../lib/stores/route.js';

  const allIds = words.map((w) => w.id);
  let counts = $derived(tally(allIds, $progress));
  let message = $state('');

  function flash(m) {
    message = m;
    setTimeout(() => (message = ''), 2600);
  }

  function exportProgress() {
    const data = JSON.stringify({ app: 'gre-word-clusters', version: 1, progress: get(progress) });
    const blob = new Blob([data], { type: 'application/json' });
    const url = URL.createObjectURL(blob);
    const a = document.createElement('a');
    const stamp = new Date().toISOString().slice(0, 10);
    a.href = url;
    a.download = `gre-progress-${stamp}.json`;
    a.click();
    URL.revokeObjectURL(url);
    flash('Progress exported.');
  }

  function importProgress(e) {
    const file = e.target.files?.[0];
    if (!file) return;
    const reader = new FileReader();
    reader.onload = () => {
      try {
        const parsed = JSON.parse(reader.result);
        const map = parsed.progress ?? parsed;
        if (map && typeof map === 'object') {
          progress.replaceAll(map);
          flash('Progress imported.');
        } else flash('That file did not contain progress.');
      } catch {
        flash('Could not read that file.');
      }
    };
    reader.readAsText(file);
    e.target.value = '';
  }

  function resetProgress() {
    if (confirm('Reset all progress? This cannot be undone (export first if unsure).')) {
      progress.clear();
      flash('Progress reset.');
    }
  }
</script>

<header class="head">
  <button class="exit" onclick={back}>‹ Back</button>
  <h1>Settings</h1>
</header>

<section class="card block">
  <h2>Your progress</h2>
  <div class="stats">
    <span><b>{counts.known}</b> known</span>
    <span><b>{counts.learning}</b> learning</span>
    <span><b>{counts.unknown}</b> tough</span>
    <span><b>{counts.new}</b> new</span>
  </div>
  <p class="muted small">Stored only on this device, in your browser.</p>
</section>

<section class="card block">
  <h2>Appearance</h2>
  <div class="rowline">
    <span>Theme</span>
    <button class="btn" onclick={() => settings.toggleTheme()}>
      {$settings.theme === 'dark' ? '☀ Light' : '☾ Dark'}
    </button>
  </div>
</section>

<section class="card block">
  <h2>Back up &amp; restore</h2>
  <p class="muted small">
    Progress lives in this browser only. Export to back it up or move it to another device.
  </p>
  <div class="buttons">
    <button class="btn" onclick={exportProgress}>Export</button>
    <label class="btn import">
      Import
      <input type="file" accept="application/json,.json" onchange={importProgress} />
    </label>
    <button class="btn danger" onclick={resetProgress}>Reset all</button>
  </div>
  {#if message}<p class="msg">{message}</p>{/if}
</section>

<style>
  .head {
    display: flex;
    flex-direction: column;
    margin: 12px 0 18px;
  }
  .exit {
    border: none;
    background: none;
    color: var(--accent);
    font-weight: 700;
    font-size: 0.95rem;
    padding: 4px 0;
    align-self: flex-start;
  }
  .head h1 {
    font-size: 1.4rem;
    margin-top: 6px;
  }
  .block {
    padding: 18px;
    margin-bottom: 12px;
  }
  .block h2 {
    font-size: 1rem;
    margin-bottom: 12px;
  }
  .stats {
    display: flex;
    flex-wrap: wrap;
    gap: 8px 18px;
    color: var(--text-dim);
    font-size: 0.95rem;
  }
  .stats b {
    color: var(--text);
    font-size: 1.05rem;
  }
  .small {
    font-size: 0.82rem;
    margin: 10px 0 0;
  }
  .rowline {
    display: flex;
    align-items: center;
    justify-content: space-between;
  }
  .buttons {
    display: flex;
    flex-wrap: wrap;
    gap: 10px;
  }
  .import {
    position: relative;
    overflow: hidden;
    display: inline-flex;
    align-items: center;
  }
  .import input {
    position: absolute;
    inset: 0;
    opacity: 0;
    cursor: pointer;
  }
  .danger {
    color: var(--unknown);
    border-color: color-mix(in srgb, var(--unknown) 40%, var(--border));
  }
  .msg {
    margin: 14px 0 0;
    color: var(--known);
    font-weight: 600;
    font-size: 0.9rem;
  }
</style>
