<script>
  import Login from "$lib/components/Login.svelte";
  import { auth } from "$lib/firebase/client";
  import { onAuthStateChanged } from "firebase/auth";
  import { goto } from "$app/navigation";
  import { onMount, beforeUpdate, afterUpdate, onDestroy } from "svelte";
  import { browser } from "$app/env";

  browser &&
    onAuthStateChanged(auth, (user) => {
      if (user) goto("/");
    });

  const reload = () => {
    if (browser) return () => location.reload()
  }
  reload()

  onMount(() => {
    // return () => location.reload();
  });
</script>

<svelte:head>
  <title>Letschat | Login</title>
</svelte:head>

<Login />
