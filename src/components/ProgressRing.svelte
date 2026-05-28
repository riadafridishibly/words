<script>
  // Segmented donut showing known / learning / unknown / new proportions.
  let { counts, size = 60, stroke = 7, center = 'pct' } = $props();

  const order = [
    ['known', 'var(--known)'],
    ['learning', 'var(--learning)'],
    ['unknown', 'var(--unknown)'],
    ['new', 'var(--new)']
  ];

  let total = $derived(
    (counts.new || 0) + (counts.unknown || 0) + (counts.learning || 0) + (counts.known || 0)
  );
  let r = $derived((size - stroke) / 2);
  let c = $derived(2 * Math.PI * r);

  let segments = $derived.by(() => {
    if (!total) return [];
    let offset = 0;
    const segs = [];
    for (const [key, color] of order) {
      const value = counts[key] || 0;
      if (!value) continue;
      const len = (value / total) * c;
      segs.push({ color, dash: `${len} ${c - len}`, offset: -offset });
      offset += len;
    }
    return segs;
  });

  let pct = $derived(total ? Math.round(((counts.known || 0) / total) * 100) : 0);
</script>

<div class="ring" style="width:{size}px;height:{size}px">
  <svg width={size} height={size} viewBox="0 0 {size} {size}">
    <circle
      cx={size / 2}
      cy={size / 2}
      {r}
      fill="none"
      stroke="var(--bg-sunken)"
      stroke-width={stroke}
    />
    {#each segments as seg}
      <circle
        cx={size / 2}
        cy={size / 2}
        {r}
        fill="none"
        stroke={seg.color}
        stroke-width={stroke}
        stroke-dasharray={seg.dash}
        stroke-dashoffset={seg.offset}
        stroke-linecap="butt"
        transform="rotate(-90 {size / 2} {size / 2})"
      />
    {/each}
  </svg>
  <div class="center" style="font-size:{Math.round(size * 0.26)}px">
    {#if center === 'pct'}{pct}<span class="unit">%</span>{:else}{counts.known || 0}{/if}
  </div>
</div>

<style>
  .ring {
    position: relative;
    display: inline-grid;
    place-items: center;
    flex: none;
  }
  svg {
    position: absolute;
    inset: 0;
  }
  .center {
    font-weight: 800;
    color: var(--text);
    line-height: 1;
  }
  .unit {
    font-size: 0.6em;
    font-weight: 700;
    color: var(--text-dim);
  }
</style>
