<script>
  import { route, navigate } from './lib/stores/route.js';
  import { settings } from './lib/stores/settings.js';
  import Home from './components/Home.svelte';
  import CategoryView from './components/CategoryView.svelte';
  import StudyView from './components/StudyView.svelte';
  import Search from './components/Search.svelte';
  import PairsDrill from './components/PairsDrill.svelte';
  import ChainsView from './components/ChainsView.svelte';
  import PlanView from './components/PlanView.svelte';
  import Settings from './components/Settings.svelte';
  import WordModal from './components/WordModal.svelte';
  import Nav from './components/Nav.svelte';
  import Icon from './components/Icon.svelte';

  let r = $derived($route);
</script>

<header class="topbar">
  <div class="topbar-inner">
    <button class="brand" onclick={() => navigate()}>
      <span class="logo">▦</span> Word Clusters
    </button>
    <div class="top-actions">
      <button class="icon-btn" onclick={() => navigate('search')} aria-label="Search">
        <Icon name="search" size={19} />
      </button>
      <button class="icon-btn" onclick={() => settings.toggleTheme()} aria-label="Toggle theme">
        <Icon name={$settings.theme === 'dark' ? 'sun' : 'moon'} size={19} />
      </button>
      <button class="icon-btn" onclick={() => navigate('settings')} aria-label="Settings">
        <Icon name="settings" size={19} />
      </button>
    </div>
  </div>
</header>

<main class="app-shell">
  {#if r.name === 'home'}
    <Home />
  {:else if r.name === 'category'}
    <CategoryView id={r.params[0]} />
  {:else if r.name === 'study'}
    <StudyView scope={r.params[0]} id={r.params[1]} />
  {:else if r.name === 'review'}
    <StudyView scope="due" />
  {:else if r.name === 'search'}
    <Search />
  {:else if r.name === 'pairs'}
    <PairsDrill />
  {:else if r.name === 'chains'}
    <ChainsView />
  {:else if r.name === 'plan'}
    <PlanView />
  {:else if r.name === 'settings'}
    <Settings />
  {:else}
    <p class="muted" style="margin-top:24px">Not found. <a href="#/">Home</a></p>
  {/if}
</main>

<WordModal />
<Nav />

<style>
  .topbar {
    position: sticky;
    top: 0;
    z-index: 20;
    background: color-mix(in srgb, var(--bg) 86%, transparent);
    backdrop-filter: blur(10px);
    border-bottom: 1px solid var(--border);
  }
  .topbar-inner {
    max-width: var(--maxw);
    margin: 0 auto;
    padding: 10px 16px;
    display: flex;
    align-items: center;
    justify-content: space-between;
  }
  .brand {
    border: none;
    background: none;
    color: var(--text);
    font-weight: 800;
    font-size: 1.02rem;
    display: flex;
    align-items: center;
    gap: 8px;
  }
  .logo {
    color: var(--accent);
  }
  .top-actions {
    display: flex;
    gap: 6px;
  }
  .icon-btn {
    border: 1px solid var(--border);
    background: var(--bg-elev);
    color: var(--text);
    width: 36px;
    height: 36px;
    border-radius: 50%;
    font-size: 1.05rem;
    display: grid;
    place-items: center;
  }
</style>
