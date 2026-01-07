<script lang="ts">
	import favicon from '$lib/assets/favicon.svg';

	let { children } = $props();
</script>

<svelte:head>
	<link rel="icon" href={favicon} />
</svelte:head>

{@render children()}

<style>
	:global(body) {
		/* "Inter" is the family name. */
		font-family: 'Inter', sans-serif;
		
		/* Makes the text crisp on standard monitors */
		-webkit-font-smoothing: antialiased; 
		
		/* Optional: Improves legibility (adds tail to 'l', open '4', etc.) */
		font-feature-settings: "cv05", "cv11", "ss01";
		width: 100vw;
		height: 100vh;
		margin: 0;

		--background-color: #F9F8F4;
		--surface-color: rgba(255, 252, 245, 0.5);
		--opaque-surface-color: rgb(255, 252, 245);
		--on-background-color: #45403C;
		--on-surface-color: #2D2A26;
		--outline-color: rgba(223, 225, 229, 0.3);

		background-color: var(--background-color);
		color: var(--on-background-color)
	}

	:global(.glass) {
		backdrop-filter: blur(20px);
		background-color: var(--surface-color);
		box-shadow: 0 1px 12px rgba(0, 0, 0, 0.25);
		border: 1px solid var(--outline-color);
	}

	:global(.opaque-surface) {
		background-color: var(--opaque-surface-color);
		box-shadow: 0 1px 12px rgba(0, 0, 0, 0.25);
		border: 1px solid var(--outline-color);
	}
</style>