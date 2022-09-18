<script>
  import Login from "$lib/components/Login.svelte";
  import { auth } from "$lib/firebase/client";
  import { onAuthStateChanged } from "firebase/auth";
  import { goto } from "$app/navigation";
  import { onMount } from "svelte";
  import { browser } from "$app/env";
  import { invalidate } from "$app/navigation";

  browser &&
    onAuthStateChanged(auth, (user) => {
      if (user) {
        location.replace('/')
        // goto("/");
      }
    });

  onMount(() => {
    // return () => location.reload();
    // location.reload();
    // invaliate('/login')
  });
</script>

<svelte:head>
  <title>Letschat | Login</title>
</svelte:head>

<Login />
