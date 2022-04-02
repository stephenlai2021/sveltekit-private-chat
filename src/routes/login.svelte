<script>
  import Login from "$lib/components/Login.svelte";
  import { auth, db } from "$lib/firebase/client";
  import { onAuthStateChanged } from "firebase/auth";
  import { goto } from '$app/navigation'
  import { onMount } from 'svelte'
  import { users } from '$lib/store'

  onMount(() => {
    onAuthStateChanged(auth, user => { 
      $users = []
      if (user) goto('/')
    })
  })
</script>

<svelte:head>
  <title>Letschat | Login</title>
</svelte:head>

<Login />
