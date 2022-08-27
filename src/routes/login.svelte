<script>
  import Login from "$lib/components/Login.svelte";
  import { auth, db } from "$lib/firebase/client";
  import { onAuthStateChanged } from "firebase/auth";
  import { goto } from '$app/navigation'
  import { onMount } from 'svelte'
  import themeStore from 'svelte-themes'
  import { browser } from '$app/env'
  
  onMount(() => {
    onAuthStateChanged(auth, user => { 
      if (user) goto('/')
    })
    return () => location.reload()
  })

</script>

<svelte:head>
  <title>Letschat | Login</title>
</svelte:head>

<Login />
