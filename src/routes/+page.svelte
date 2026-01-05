<script lang="ts">
	import Background from '$lib/components/Background.svelte';
	import Clock from '$lib/components/Clock.svelte';
	import SearchBar from '$lib/components/SearchBar.svelte';
	import { onMount } from 'svelte';

	type ThemeMode = 'light' | 'dark' | 'auto';

	const showSeconds: boolean = false;
	let modeSetting: ThemeMode = 'light';

	onMount(() => {
		if (modeSetting === 'light') {
			document.documentElement.classList.remove('dark');
		} else if (modeSetting === 'dark') {
			document.documentElement.classList.add('dark');
		} else {
			// auto mode
			const mode: boolean =
				window.matchMedia && window.matchMedia('(prefers-color-scheme: dark)').matches;
			if (mode) {
				document.documentElement.classList.add('dark');
			} else {
				document.documentElement.classList.remove('dark');
			}
		}
	});
</script>

<div class="center-widgets">
	<Background />
	<Clock {showSeconds} />
	<SearchBar />
</div>

<style>
	.center-widgets {
		display: flex;
		flex-direction: column;
		align-items: center;
		justify-content: center;
		min-height: 100vh;
		padding: 0 20px;
		box-sizing: border-box;
	}

	.circle {
		position: absolute;
		top: 50%;
		left: 50%;
		width: 150vh;
		height: 150vh;
		background: radial-gradient(circle, #4facfe 0%, #00f2fe 100%);
		border-radius: 50%;
		transform: translate(-50%, -50%);
		animation: pulse 10s infinite alternate;
	}
</style>
