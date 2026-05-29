<script>
  import { route, navigate } from '../lib/stores/route.js';
  import Icon from './Icon.svelte';

  const items = [
    { name: 'home', label: 'Home', icon: 'home', go: () => navigate() },
    { name: 'review', label: 'Review', icon: 'review', go: () => navigate('review') },
    { name: 'search', label: 'Search', icon: 'search', go: () => navigate('search') }
  ];

  let active = $derived($route.name);
</script>

<nav class="nav">
  {#each items as it}
    <button class="nav-item" class:active={active === it.name} onclick={it.go}>
      <span class="icon"><Icon name={it.icon} size={22} /></span>
      <span class="lbl">{it.label}</span>
    </button>
  {/each}
</nav>

<style>
  .nav {
    position: fixed;
    bottom: 0;
    left: 0;
    right: 0;
    display: flex;
    justify-content: center;
    gap: 4px;
    background: color-mix(in srgb, var(--bg-elev) 92%, transparent);
    backdrop-filter: blur(10px);
    border-top: 1px solid var(--border);
    padding: 8px 8px calc(8px + env(safe-area-inset-bottom));
    z-index: 30;
  }
  .nav-item {
    border: none;
    background: none;
    color: var(--text-dim);
    display: flex;
    flex-direction: column;
    align-items: center;
    gap: 2px;
    padding: 4px 22px;
    border-radius: var(--radius-sm);
    font-size: 0.7rem;
    font-weight: 600;
  }
  .nav-item.active {
    color: var(--accent);
  }
  .icon {
    font-size: 1.2rem;
    line-height: 1;
  }
</style>
