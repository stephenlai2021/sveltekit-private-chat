<script>
  import { onMount } from "svelte";
  import { auth, db } from "$lib/firebase/client";
  import { onAuthStateChanged } from "firebase/auth";
  import { goto } from "$app/navigation";
  import { collection, onSnapshot, query, where } from "firebase/firestore";
  import { keyword } from "$lib/store";
  import TopSide from "$lib/components/TopSide.svelte";
  import LeftSide from "$lib/components/LeftSide.svelte";
  import { fly } from 'svelte/transition'

  let user = null;
  let users = [];
  let show = false;
  let filteredUsers = [];
  let q = null;
  let colRef = collection(db, "whatzapp_users");

  onMount(async () => {
    onAuthStateChanged(auth, (_user) => {
      if (!_user) {
        goto("/login");
      } else {
        user = _user;
        q = query(colRef, where("contactList", "array-contains", user.uid));
        console.log("user | booklist", user);
        show = true;
      }
    });
  });

  $: filteredUsers = users.filter((item) => {
    return (
      item.name.toUpperCase().includes($keyword) ||
      item.name.toLowerCase().includes($keyword)
    );
  });
</script>

{#if show}
  <div class="layout" in:fly={{ y: 50, duration: 500, delay: 500 }} out:fly={{ duration: 500 }}>
    <TopSide />
    <div class="wrapper">
      <LeftSide />
      <div class="rightSide">
        <slot />
      </div>
    </div>
  </div>
{/if}
