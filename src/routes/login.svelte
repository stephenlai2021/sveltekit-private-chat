<script>
  import Login from "$lib/components/Login.svelte";
  import { auth } from "$lib/firebase/client";
  import { onAuthStateChanged } from "firebase/auth";
  import { goto } from '$app/navigation'
  import { onMount } from 'svelte'
  import { loggedinUser, yo } from '$lib/store'

  let flag = false
  
  onMount(() => {
    onAuthStateChanged(auth, user => { 
      if (user) goto('/')
    })
  })

  $: if ($loggedinUser) flag = true

  $: if ($yo) {
    location.reload()
    $yo = false
  }
</script>

<svelte:head>
  <title>Letschat | Login</title>
</svelte:head>

<Login />
