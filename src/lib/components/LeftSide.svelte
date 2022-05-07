<script>
  import {
    leftSide,
    mobile,
    keyword,
    selectedUsername,
    loginUserEmail,
    profileUpdated,
    showThemeModal,
    showCameraModal,
    showSettingsModal,
    showAddFriendModal,
    showAudioPlayerModal,
    showAudioRecordingModal
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
  import Navbar from "$lib/components/Navbar.svelte";
  import CameraModal from "$lib/components/CameraModal.svelte";

  let user = null;
  let users = [];
  let ready = false;
  let loading = false;
  let filteredUsers = [];

  onAuthStateChanged(auth, (_user) => (user = _user));

  const selectUser = (selectedUser) => {
    console.log(`${selectedUser.name} is selected`);
    $selectedUsername = selectedUser.name;
    goto(`/${$selectedUsername}`)
  };

  $: if ($profileUpdated) {
    console.log("user profile updated detected !");
    user = auth.currentUser;
  }

  $: if (!user) console.log("user is not ready");

  $: if (user) {
    ready = true;
    console.log("user is ready");
    console.log("user", user);
  }

  $: if (ready && $loginUserEmail) {
    let colRef = collection(db, "whatzapp_users");
    const q = query(
      colRef,
      where("contactList", "array-contains", $loginUserEmail)
    );
    const unsub = onSnapshot(q, (snapshot) => {
      let tempUsers = [];
      snapshot.docs.forEach((doc) => {
        tempUsers.push({ ...doc.data() });
      });
      users = tempUsers;
      console.log("initialzie user list | snapshot", users);
      return () => unsub();
    });
    ready = false;
  }

  $: filteredUsers = users.filter((item) => {
    return (
      item.name.toUpperCase().includes($keyword) ||
      item.name.toLowerCase().includes($keyword)
    );
  });

  $: if ($page.url.pathname === "/login") {
    $showSettingsModal = false;
  }

  $: setTimeout(() => {
    if (!users.length) loading = true;
  }, 8000);
</script>

<!-- style:width={$mobile && $page.url.pathname === "/"
    ? "100%"
    : $mobile && $page.url.pathname != "/"
    ? "0%"
    : "450px"} -->
<div
  class="leftSide"
  style:width={$mobile && $page.url.pathname === "/"
    ? "100%"
    : $mobile && $page.url.pathname != "/" || $showCameraModal || $showAudioRecordingModal || $showAudioPlayerModal
    ? "0%"
    : $page.url.pathname != "/login"
    ? "450px"
    : "0%"}
>
  <div class="header">
    <div class="left" on:click={() => goto("/")} style:cursor="pointer">
      {#if $mobile && user}
        <div
          class="userimg"
          on:click|stopPropagation={() =>
            ($showSettingsModal = !$showSettingsModal)}
        >
          {#if user.photoURL}
            <img src={user.photoURL} alt="" class="cover" />
          {:else}
            <img src="/joke.png" alt="" class="cover" />
          {/if}
        </div>
      {/if}
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
  </div>

  <div class="search_user">
    <div>
      <input type="text" placeholder="Find user" bind:value={$keyword} />
      <ion-icon
        name="search-outline"
        class="icon-finduser"
        style:left="22px"
        style:top="17px"
        style:width="18px"
        style:height="18px"
      />
    </div>
  </div>

  {#if users.length}
    <div
      class="chatlist"
      style:height="calc(100vh - 120px)"
      style:padding-bottom={$mobile ? '60px' : '0px'}
      transition:fade={{ duration: 100 }}
    >
      {#each filteredUsers as user}
        <div
          class="block"
          class:unread={user.unread}
          on:click={() => selectUser(user)}
        >
          <!-- class:active={$activeItem === user.name} -->
          <div class="imgbx">
            <!-- class:active={$activeItem === user.name}
            style:background={$activeItem === user.name ? $bgColor : ""} -->
            {#if user.avatar}
              <img src={user.avatar} alt="" class="cover" />
            {:else}
              <img src="/joke.png" alt="" class="cover" />
            {/if}
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
  {:else if !loading}
    <div class="loading">
      <Skeleton />
    </div>
  {:else}
    <div class="warning">
      <img
        src="https://images.vexels.com/media/users/3/134884/isolated/lists/48e6880a62eaa4c1da1cbbc0880804ec-worry-sad-emoji-emoticon.png"
        alt=""
      />
      <br />
      <p>Sorry, you don't have any friends yet</p>
    </div>
  {/if}

  {#if $showThemeModal}
    <ThemeModal />
  {/if}
  {#if $showSettingsModal && user}
    <!-- {#if user} -->
    <SettingsModal {user} />
  {/if}
  {#if $showAddFriendModal}
    <AddFriendModal />
  {/if}
  <!-- {#if showCameraModal}
    <CameraModal />
  {/if} -->

  <!-- {#if $mobile && user}
    <div
      class="userimg"
      on:click|stopPropagation={() =>
        ($showSettingsModal = !$showSettingsModal)}
    >
      {#if user.photoURL}
        <img src={user.photoURL} alt="" class="cover" />
      {:else}
        <img src="/joke.png" alt="" class="cover" />
      {/if}
      <ion-icon name="settings-outline" class="settings" />
    </div>
  {/if} -->

  {#if $mobile}
    <Navbar />
  {/if}
</div>

<style>
  .warning img {
    width: 150px;
    height: 150px;
  }

  .warning {
    display: flex;
    flex-direction: column;
    align-items: center;
    justify-content: center;
    height: 50vh;
  }

  .btn-add-friend {
    display: flex;
    align-items: flex-end;
  }

  .userimg {
    width: 30px;
    height: 30px;
    display: flex;
    align-items: center;
    cursor: pointer;
    margin-right: 5px;
    /* border: 1px solid; */
  }

  .userimg img {
    width: 30px;
    height: 30px;
    object-fit: cover;
    border-radius: 50%;
  }
</style>
