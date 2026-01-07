<script lang="ts">
	import Background from '$lib/components/Background.svelte';
	import Clock from '$lib/components/Clock.svelte';
	import SearchBar from '$lib/components/SearchBar.svelte';
	import WeeklyWeatherWidget from '$lib/components/WeeklyWeatherWidget.svelte';
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

<div class="homepage">
	<Background />
	<div class="widgets side-widgets">
		<WeeklyWeatherWidget />
	</div>
	<div class="widgets middle-widgets">
		<Clock {showSeconds} />
		<SearchBar />
	</div>
	<div class="widgets side-widgets"></div>
</div>

<style>
	.homepage {
		position: relative;
		width: 100vw;
		height: 100vh;
		overflow: hidden;

		display: flex;
		justify-content: space-between;
	}

	.widgets {
		display: flex;
		flex-direction: column;
		align-items: center;
		justify-content: center;
		min-height: 100vh;
		padding: 0 20px;
		box-sizing: border-box;
	}

	.side-widgets {
		justify-content: flex-start;
		padding: 20px;
		width: 396px;
	}

	.middle-widgets {
		justify-content: center;
		gap: 40px;
		flex-grow: 1;
	}
</style>
