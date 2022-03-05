<script>
  import Skeleton from "$lib/components/skeleton/LeftSideSkeleton.svelte";
  import {
    mobile,
    bgColor,
    keyword,
    activeItem,
    showThemeModal,
    showSettingsModal,
    showAddFriendModal,
  } from "$lib/store";
  import { goto } from "$app/navigation";
  import { onMount } from "svelte";
  import { page } from "$app/stores";
  import { collection, onSnapshot, query, where } from "firebase/firestore";
  import { auth, db } from "$lib/firebase/client";
  import { onAuthStateChanged } from "firebase/auth";
  import { fade } from "svelte/transition";
  // import SettingsModal from "$lib/components/modal/SettingsModal.svelte";
  // import AddFriendModal from "$lib/components/modal/AddFriendModal.svelte";
  // import ThemeModal from "$lib/components/modal/ThemeModal.svelte";

  let q = null;
  let user = null;
  let users = [];
  let show = false;
  let filteredUsers = [];
  let colRef = collection(db, "whatzapp_users");

  const selectedUser = (user) => {
    console.log("selected user | left side: ", user.name);
    activeItem.set(user.name);
    goto(`/${user.name}`);
  };

  onMount(() => {
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

    if ($page.url.pathname === "/") activeItem.set(null);
    if ($page.url.pathname != "/") activeItem.set($page.params.userId);
    console.log("selected user | left side on mount: ", $activeItem);
  });

  $: if (q) {
    const unsub = onSnapshot(q, (snapshot) => {
      let tempUsers = [];
      snapshot.docs.forEach((doc) => {
        tempUsers.push({ ...doc.data() });
      });
      users = tempUsers;
      return () => unsub();
    });
  }

  $: filteredUsers = users.filter((item) => {
    return (
      item.name.toUpperCase().includes($keyword) ||
      item.name.toLowerCase().includes($keyword)
    );
  });
</script>

<div class="header">
  <div class="left">
    <h3 class="user-title">Chat</h3>
  </div>
  <ul class="nav_icons">
    {#if $mobile && user}
      <div
        class="userimg"
        on:click|stopPropagation={() =>
          ($showSettingsModal = !$showSettingsModal)}
      >
        <img src={user.photoURL} alt="" />
        <span class="material-icons settings">settings</span>
        <!-- <ion-icon name="settings-outline" class="settings"></ion-icon> -->
      </div>
    {/if}
    {#if !$mobile}
      <li
        on:click|stopPropagation={() =>
          ($showAddFriendModal = !$showAddFriendModal)}
      >
        <span class="material-icons">person_add_alt</span>
        <!-- <ion-icon name="person-add-outline" /> -->
      </li>
    {/if}
  </ul>
  <!-- {#if $showThemeModal}
    <ThemeModal />
  {/if}
  {#if $showSettingsModal}
    <SettingsModal />
  {/if}
  {#if $showAddFriendModal}
    <AddFriendModal />
  {/if} -->
</div>
<div class="search_user">
  <div>
    <input type="text" placeholder="Find user" bind:value={$keyword} />
    <!-- <span class="material-icons">search</span> -->
    <ion-icon name="search-outline" />
  </div>
</div>
{#if users.length}
  <div class="chatlist" transition:fade={{ duration: 100 }}>
    {#each filteredUsers as user}
      <div
        class="block"
        class:unread={user.unread}
        class:active={$activeItem === user.name}
        on:click={() => selectedUser(user)}
      >
        <!-- style:border-bottom={$activeItem === user.name ? `2px solid ${$bgColor}` : ''}         -->
        <div
          class="imgbx"
          class:active={$activeItem === user.name}
          style:background={$activeItem === user.name ? $bgColor : ""}
        >
          <img src={user.avatar} alt="" class="cover" />
          <div class={user.isOnline ? "status online" : "status offline"} />
        </div>
        <div class="details">
          <div class="listHead">
            <h4>{user.name}</h4>
            <p class="time">10:56</p>
          </div>
          <div class="message_p">
            <p>How to make Whatsapp clone using html and css</p>
            <b>1</b>
          </div>
        </div>
      </div>
    {/each}
  </div>
{:else}
  <div class="loading">
    <Skeleton />
  </div>
{/if}

<style>
  /* .nav-icons .userimg span {
    line-height: 60px;
  } */

  .userimg {
    width: 35px;
    height: 35px;
    display: flex;
    align-items: center;
    position: relative;
    cursor: pointer;
  }

  .userimg img {
    width: 35px;
    height: 35px;
    border-radius: 50%;
  }

  .settings {
    position: absolute;
    bottom: -8px;
    right: -5px;
    font-size: 1.2em;
    /* color: white; */
  }
</style>
