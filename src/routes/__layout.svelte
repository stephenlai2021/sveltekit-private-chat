<script>
  import "$lib/styles/global.css";
  import SvelteTheme from "svelte-themes/SvelteTheme.svelte";
  import { connection } from "$lib/store";
  import { browser } from "$app/env";
 
  $: if (browser) {
    window.addEventListener("online", () => connection.set(true));
    window.addEventListener("offline", () => connection.set(false));
  }
</script>

<SvelteTheme />
<svelte:head>
  <title>Private Chat</title>
</svelte:head>

<slot />

