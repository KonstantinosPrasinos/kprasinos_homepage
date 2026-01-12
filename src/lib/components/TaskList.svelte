<script lang="ts">
	import { onMount } from 'svelte';

	type GoogleResponse = {
		clientId: string;
		client_id: string;
		credential: string;
		select_by: string;
	};

    type User = {
        googleId: string,
        local: {
            email: string
        },
        _id: string
    }

	let divRef: HTMLElement;
	let isLoading: boolean = false;
    let user: User | null = null;

	const fetchTasks = async () => {
		const response = await fetch(`${import.meta.env.VITE_BACK_END_IP}/api/task`, {
			method: 'GET',
			headers: { 'Content-Type': 'application/json' },
			credentials: 'include'
		});

		if (!response.ok) {
			throw new Error((await response.json()).message);
		}

		return response.json();
	};

	const handleCredentialResponse = (response: GoogleResponse) => {
		loginWithGoogle(response);
	};

	const loginWithGoogle = async (googleResponse: GoogleResponse) => {
		const response = await fetch(`${import.meta.env.VITE_BACK_END_IP}/api/user/google`, {
			method: 'POST',
			headers: { 'Content-Type': 'application/json' },
			body: JSON.stringify(googleResponse),
			credentials: 'include'
		});

		const data: User = await response.json();

		localStorage.setItem('user', JSON.stringify(data));
	};

	const attemptRenderGoogle = () => {
		try {
			if (window?.google) {
				window?.google?.accounts?.id?.initialize({
					client_id: import.meta.env.VITE_GOOGLE_CLIENT_ID,
					callback: handleCredentialResponse
				});

				window.google.accounts.id.renderButton(divRef, {
					theme: 'outline',
					size: 'large',
					shape: 'pill'
				});

				// window.google.accounts.id.prompt();
			} else {
				// Sometimes it doesn't load instantly for some reason so try again after 200ms
				setTimeout(attemptRenderGoogle, 200);
			}
		} catch (_) {
			setTimeout(attemptRenderGoogle, 200);
		}
	};

    const initialize = async () => {
        await fetchTasks()
    }

	onMount(() => {
        const localStorageUser = localStorage.getItem("user")

        if (localStorageUser) {
            initialize()
        } else {
            attemptRenderGoogle();
        }
	});
</script>

<div bind:this={divRef}></div>
