<script>
  import Login from "$lib/components/Login.svelte";
  import { auth, db } from "$lib/firebase/client";
  import { onAuthStateChanged } from "firebase/auth";
  import { goto } from '$app/navigation'
  import { onMount } from 'svelte'

  onMount(() => {
    onAuthStateChanged(auth, user => { 
      if (user) goto('/')
    })
  })
</script>

<svelte:head>
  <title>Letschat | Login</title>
</svelte:head>

<Login />
