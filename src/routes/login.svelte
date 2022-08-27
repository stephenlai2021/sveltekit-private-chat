<script>
  import Login from "$lib/components/Login.svelte";
  import { auth, db } from "$lib/firebase/client";
  import { onAuthStateChanged } from "firebase/auth";
  import { goto } from '$app/navigation'
  import { onMount, onDestroy } from 'svelte'
  import themeStore from 'svelte-themes'
  import { browser } from '$app/env'
  
  onMount(() => {
    // onAuthStateChanged(auth, user => { 
    //   if (user) return () => location.replace('/')
    //   if (!user) return () => location.replace('/login')
    // })
    return () => location.replace('/login')
  })
</script>

<svelte:head>
  <title>Letschat | Login</title>
</svelte:head>

<Login />
