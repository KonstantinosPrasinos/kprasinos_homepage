<script lang="ts">
	import type { Favorite } from './FavoritesWidget.svelte';

	let visible = false;
	let url: string = '';
	let urlIsOk: boolean = false;
	let titleIsOk: boolean = false;
	let title: string = '';
	let buttonDisabled: boolean = true;
	let resolvePromise: (value: Favorite | null) => void;

	// 1. Export a function that returns a Promise
	export function open(): Promise<Favorite | null> {
		visible = true;
		return new Promise((resolve) => {
			resolvePromise = resolve;
		});
	}

	// 2. Resolve the promise with the chosen value
	function close() {
		visible = false;
        title = '';
		url = '';
		if (resolvePromise) resolvePromise(null);
	}

	const addFavorite = () => {
		visible = false;
		if (resolvePromise)
			resolvePromise({
				title: title,
				url: url,
				faviconUrl: `https://icons.duckduckgo.com/ip3/${new URL(url).hostname}.ico`
			});
		title = '';
		url = '';
	};

	const onUrlInput = (event: Event) => {
		url = (event.target as HTMLInputElement).value.trim();
		try {
			new URL(url);
			urlIsOk = true;
		} catch {
			urlIsOk = false;
		}
	};

	const onTitleInput = (event: Event) => {
		title = (event.target as HTMLInputElement).value.trim();

		titleIsOk = title.length > 0;
	};
</script>

{#if visible}
	<div class="overlay">
		<div class="modal">
			<h3 class="title">Add Favorite</h3>
			<div class="input-group">
				<label for="title-input">Enter the Title of the favorite:</label>
				<input
					id="title-input"
					type="text"
					bind:value={title}
					placeholder="Type your title..."
					on:input={onTitleInput}
				/>
			</div>
			<div class="input-group">
				<label for="url-input">Enter the URL of the favorite:</label>
				<input
					id="url-input"
					type="text"
					bind:value={url}
					placeholder="Type your URL..."
					on:input={onUrlInput}
				/>
			</div>
			<div class="actions">
				<button on:click={() => close()} class="normal-button">Cancel</button>
				<button
					on:click={() => addFavorite()}
					disabled={!urlIsOk || !titleIsOk}
					class="normal-button">Confirm</button
				>
			</div>
		</div>
	</div>
{/if}

<style>
	.title {
		margin: 0;
		margin-bottom: 30px;
		font-size: 1.25rem;
		font-weight: 600;
	}
	.overlay {
		position: fixed;
		top: 0;
		left: 0;
		width: 100%;
		height: 100%;
		background: rgba(0, 0, 0, 0.5);
		display: grid;
		place-items: center;
		z-index: 2;
	}
	.modal {
		background: white;
		padding: 40px;
		border-radius: 20px;
		display: flex;
		flex-direction: column;
		gap: 10px;
	}
	.actions {
		display: flex;
		gap: 10px;
		margin-top: 15px;
	}

	.input-group {
		display: flex;
		flex-direction: column;
		gap: 8px; /* Space between label and input */
		width: 100%;
		margin-bottom: 16px;
	}

	label {
		font-size: 0.85rem;
		font-weight: 500;
		color: #4b5563; /* Cool Gray */
		margin-left: 2px;
	}

	input {
		font-family: inherit; /* Uses your JetBrains Mono or App font */
		font-size: 1rem;
		padding: 12px 16px;
		border-radius: 8px;
		border: 1px solid #e2e8f0; /* Light Slate Border */
		background-color: #f8fafc; /* Very subtle off-white */
		color: #1e293b;
		outline: none;
		transition: all 0.1s ease-in-out;
		width: 100%;
		box-sizing: border-box; /* Ensures padding doesn't break width */
	}

	/* Placeholder Styling */
	input::placeholder {
		color: #94a3b8;
		opacity: 1;
	}

	/* Interaction States */
	input:hover {
		border-color: #cbd5e1; /* Slightly darker on hover */
		background-color: #ffffff;
	}

	input:focus {
		border-color: #3b82f6; /* Blue Border */
		background-color: #ffffff;
		/* The "Glow" Ring Effect */
		box-shadow: 0 0 0 4px rgba(59, 130, 246, 0.1);
	}
</style>
