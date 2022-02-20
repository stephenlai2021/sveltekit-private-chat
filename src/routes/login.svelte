<script>
	import { onAuthStateChanged } from 'firebase/auth';
	import { auth } from '$lib/firebase/client';
	import { goto } from '$app/navigation';
	import { onMount } from 'svelte';
	import Login from '$lib/components/Login.svelte';
	import { fly } from 'svelte/transition'

	let show = false;

	onMount(() => {
		const unsub = onAuthStateChanged(auth, (user) => {
			if (user) {
				goto('/');
			} else {
				show = true;
			}
			return () => unsub;
		});
	});
</script>

{#if show}
	<Login />
{/if}