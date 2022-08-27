<script>
  import Login from "$lib/components/Login.svelte";
  import { auth, db } from "$lib/firebase/client";
  import { onAuthStateChanged } from "firebase/auth";
  import { goto } from '$app/navigation'
  import { onMount, onDestroy } from 'svelte'
  import themeStore from 'svelte-themes'
  import { browser } from '$app/env'
  import { loggedinUser } from '$lib/store'

  let flag = false
  
  onMount(() => {
    onAuthStateChanged(auth, user => { 
      if (user) goto('/')
    })
  })

  $: if ($loggedinUser) flag = true

  $: if (flag) {
    location.reload()
    flag = false
  }
</script>

<svelte:head>
  <title>Letschat | Login</title>
</svelte:head>

<Login />
