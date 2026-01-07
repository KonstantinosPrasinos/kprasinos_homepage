<script lang="ts">
  export let size: number = 40;       // Size in pixels
  export let color: string = "var(--on-surface-color)"; // Default Blue
  export let speed: number = 2;       // Animation speed in seconds
  export let thickness: number = 4;   // Stroke width
</script>

<div 
  class="loader" 
  style="
    --size: {size}px; 
    --color: {color}; 
    --speed: {speed}s;
  "
>
  <svg viewBox="0 0 50 50">
    <circle 
      class="track"
      cx="25" cy="25" r="20" 
      fill="none" 
      stroke-width={thickness} 
    />
    
    <circle 
      class="car"
      cx="25" cy="25" r="20" 
      fill="none" 
      stroke-width={thickness} 
    />
  </svg>
</div>

<style>
  .loader {
    width: var(--size);
    height: var(--size);
    display: inline-block;
  }

  svg {
    animation: rotate var(--speed) linear infinite;
    width: 100%;
    height: 100%;
  }

  circle {
    stroke-linecap: round; /* Makes the ends rounded */
  }

  /* The Background Track */
  .track {
    stroke: var(--color);
    opacity: 0.15; /* Make it a faint version of the main color */
  }

  /* The Active Spinner */
  .car {
    stroke: var(--color);
    stroke-dasharray: 80, 200;
    stroke-dashoffset: 0;
    animation: dash 1.5s ease-in-out infinite;
  }

  /* 1. Spin the whole SVG */
  @keyframes rotate {
    100% {
      transform: rotate(360deg);
    }
  }

  /* 2. Animate the length of the line */
  @keyframes dash {
    0% {
      stroke-dasharray: 1, 200;
      stroke-dashoffset: 0;
    }
    50% {
      stroke-dasharray: 90, 200;
      stroke-dashoffset: -35px;
    }
    100% {
      stroke-dasharray: 90, 200;
      stroke-dashoffset: -124px;
    }
  }
</style>