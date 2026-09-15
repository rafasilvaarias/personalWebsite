<script>
  /**
   * @typedef {Object} Props
   * @property {number} [size] - Diameter of the circles in px
   * @property {string} [startColor] - Border color at animation start
   * @property {string} [endColor] - Border color at animation end
   * @property {number} [duration] - Full animation cycle length in seconds
   * @property {number} [count] - Number of rings
   */

  /** @type {Props} */
  let {
    size = 10,
    startColor = '#DEB480',
    endColor = '#F5C518',
    duration = 4,
    count = 6
  } = $props();

  // Evenly space each ring's delay across the duration, negative so they
  // start "mid-cycle" and immediately animate (same effect as the original).
  const rings = $derived(
    Array.from({ length: count }, (_, i) => ({
      delay: -((duration / count) * i)
    }))
  );
</script>

<div
  class="infinity-circles"
  style="
    --ic-size: {size}rem;
    --ic-start-color: {startColor};
    --ic-end-color: {endColor};
    --ic-duration: {duration}s;
  "
>
  {#each rings as ring}
    <span style="animation-delay: {ring.delay}s;"></span>
  {/each}
</div>

<style>
  .infinity-circles {
    position: relative;
    width: var(--ic-size);
    min-width: var(--ic-size);
    height: var(--ic-size);
  }

  .infinity-circles span {
    position: absolute;
    top: 50%;
    left: 50%;

    width: var(--ic-size);
    height: var(--ic-size);

    border: 2px solid var(--ic-start-color);
    border-radius: 50%;

    transform: translate(-50%, -50%);

    animation: circle var(--ic-duration) linear infinite;
  }

  @keyframes circle {
    0% {
      width: var(--ic-size);
      height: var(--ic-size);
      opacity: 0;
      border: 2px solid var(--ic-start-color);
    }

    10% {
      opacity: 1;
    }

    100% {
      width: 0;
      height: 0;
      opacity: 0;
      border: 5px solid var(--ic-end-color);
    }
  }
</style>