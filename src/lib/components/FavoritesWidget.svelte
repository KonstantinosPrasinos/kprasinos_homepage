<script context="module" lang="ts">
	export type Favorite = {
		title: string;
		url: string;
		faviconUrl: string;
	};
</script>

<script lang="ts">
	import { Pencil, Plus, Trash } from 'phosphor-svelte';
	import AddFavoriteModal from './AddFavoriteModal.svelte';
	import { onMount } from 'svelte';

	let favorites: Favorite[] = [];
	let modal: AddFavoriteModal;

	onMount(() => {
		// Load favorites from localStorage if available
		const storedFavorites = localStorage.getItem('favorites');
		if (storedFavorites) {
			favorites = JSON.parse(storedFavorites);
		}
	});

	const addFavorite = (favorite: Favorite) => {
		favorites = [...favorites, favorite];

		localStorage.setItem('favorites', JSON.stringify(favorites));
	};

	async function handleAddFavorite() {
		// 2. Wait for the user to click a button
		const favorite = await modal.open();

		if (favorite) {
			addFavorite(favorite);
		}
	}
</script>

<div class="favorites-widget glass widget">
	<div class="widget-title-bar">
		<div>Favorites:</div>
		<button
			title="Add favorite"
			class="add-favorite-button icon-button"
			on:click={handleAddFavorite}
		>
			<Plus size={22} />
		</button>
	</div>
	<div class="favorites-list">
		{#each favorites as favorite}
			<a href={favorite.url} class="favorite-item" target="_blank" rel="noopener noreferrer">
				<img src={favorite.faviconUrl} alt="Favicon of {favorite.title}" class="favorite-favicon" />
				<span class="favorite-title">{favorite.title}</span>
			</a>
		{/each}
	</div>
</div>

<AddFavoriteModal bind:this={modal} />

<style>
	.favorites-widget {
		display: flex;
		flex-direction: column;
		justify-content: space-between;
	}
	.widget-title-bar {
		display: flex;
		justify-content: space-between;
		align-items: center;
		font-size: 1.2rem;
		font-weight: 600;
	}

	.add-favorite-button {
		width: 22px;
		height: 22px;
	}

	.favorites-list {
		display: grid;
		grid-template-columns: repeat(4, 1fr);
		grid-template-rows: repeat(2, 1fr);
		gap: 10px;
	}

	@keyframes fadeIn {
		from {
			opacity: 0;
			transform: scale(0.8);
		}
		to {
			opacity: 1;
			transform: scale(1);
		}
	}

	.favorite-item {
		display: flex;
		align-items: center;
		gap: 4px;
		flex-direction: column;
		color: var(--on-surface-color);
		text-decoration: none;
		overflow: hidden;
		border-radius: 10px;
		padding: 2px;

		animation: fadeIn 0.1s ease-in-out;
		order: 1px solid transparent;
		transition:
			border-color 0.05s ease-in-out,
			background-color 0.05s ease-in-out;
		cursor: pointer;
	}

	.favorite-item:hover {
		border-color: var(--outline-color);
		background-color: var(--opaque-surface-color);
	}

	.favorite-favicon {
		width: 36px;
		height: 36px;
	}

	.favorite-title {
		font-size: 0.8rem;
		text-align: center;
		white-space: nowrap;
		overflow: hidden;
		text-overflow: ellipsis;
		max-width: 100%;
	}
</style>
