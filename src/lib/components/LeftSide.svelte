<script>
  import {
    mobile,
    bgColor,
    keyword,
    activeItem,
    showThemeModal,
    showSettingsModal,
    showAddFriendModal,
  } from "$lib/store";
  import { onMount } from "svelte";
  import { page } from "$app/stores";
  import { goto } from "$app/navigation";
  import { fade } from "svelte/transition";
  import { auth, db } from "$lib/firebase/client";
  import { onAuthStateChanged } from "firebase/auth";
  import { collection, onSnapshot, query, where } from "firebase/firestore";
  import Skeleton from "$lib/components/skeleton/LeftSideSkeleton.svelte";
  import ThemeModal from "$lib/components/ThemeModal.svelte";
  import SettingsModal from "$lib/components/SettingsModal.svelte";
  import AddFriendModal from "$lib/components/AddFriendModal.svelte";

  let q = null;
  let user = null;
  let users = [];
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
        q = query(colRef, where("contactList", "array-contains", user.displayName));
        console.log("user", user);
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

  $: if ($page.url.pathname === '/login') $showSettingsModal = false
</script>

<div
  class="leftSide"
  style:width={$mobile && $page.url.pathname === "/"
    ? "100%"
    : $mobile && $page.url.pathname != "/"
    ? "0%"
    : $page.url.pathname != "/" && $page.url.pathname != "/login"
    ? "450px"
    : "0%"}
>
  <div class="header">
    <div class="left">
      <h3 class="user-title">LetsChat</h3>
    </div>
    <ul class="nav_icons">
      {#if $mobile}
        <div
          class="btn-add-friend"
          on:click|stopPropagation={() =>
            ($showAddFriendModal = !$showAddFriendModal)}
        >
          <ion-icon name="person-add-outline" />
        </div>
      {/if}

      {#if !$mobile}
        <li
          on:click|stopPropagation={() =>
            ($showAddFriendModal = !$showAddFriendModal)}
        >
          <ion-icon name="person-add-outline" />
        </li>
      {/if}
    </ul>
    {#if $showThemeModal}
      <ThemeModal />
    {/if}
    {#if $showSettingsModal && user}
      <SettingsModal {user} />
    {/if}
    {#if $showAddFriendModal}
      <AddFriendModal />
    {/if}
  </div>
  <div class="search_user">
    <div>
      <input type="text" placeholder="Find user" bind:value={$keyword} />
      <ion-icon name="search-outline" style:left='22px' style:top='17px' style:width='18px' style:height='18px' />
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
      <!-- <Skeleton /> -->
    </div>
  {/if}

  {#if $mobile && user}
    <div
      class="userimg"
      on:click|stopPropagation={() =>
        ($showSettingsModal = !$showSettingsModal)}
    >
      <img src={user.photoURL} alt="" />
      <ion-icon name="settings-outline" class="settings" />
    </div>
  {/if}
</div>

<style>
  .btn-add-friend {
    display: flex;
    align-items: flex-end;
    /* border: 1px solid red; */
  }

  .userimg {
    position: absolute;
    bottom: 20px;
    right: 20px;
    width: 35px;
    height: 35px;
    display: flex;
    align-items: center;
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
