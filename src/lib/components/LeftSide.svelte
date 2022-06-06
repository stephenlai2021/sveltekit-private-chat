<script>
  import {
    leftSide,
    mobile,
    isMobile,
    keyword,
    loggedinUser,
    selectedUsername,
    loginUserEmail,
    profileUpdated,
    showThemeModal,
    showCameraModal,
    showSettingsModal,
    showAddFriendModal,
    showAudioPlayerModal,
    showAudioRecordingModal,
    getSelectedUser,
  } from "$lib/store";
  import { onMount } from "svelte";
  import { page } from "$app/stores";
  import { goto } from "$app/navigation";
  import { fade } from "svelte/transition";
  import { auth, db } from "$lib/firebase/client";
  import { onAuthStateChanged } from "firebase/auth";
  import {
    collection,
    doc,
    onSnapshot,
    query,
    where,
  } from "firebase/firestore";
  import Skeleton from "$lib/components/skeleton/LeftSideSkeleton.svelte";
  import ThemeModal from "$lib/components/ThemeModal.svelte";
  import SettingsModal from "$lib/components/SettingsModal.svelte";
  import AddFriendModal from "$lib/components/AddFriendModal.svelte";
  import Navbar from "$lib/components/Navbar.svelte";
  import CameraModal from "$lib/components/CameraModal.svelte";
  import themeStore, { setTheme } from "svelte-themes";

  let user = null;
  let users = [];
  let ready = false;
  let currentContact = null;
  let loading = false;
  let filteredUsers = [];
  let lastMsg = {};

  // onAuthStateChanged(auth, (_user) => (user = _user));
  // onAuthStateChanged(auth, (user) => ($loggedinUser = user));

  const selectUser = (selectedUser) => {
    currentContact = selectedUser;
    console.log(`${selectedUser.name} is selected`);
    $selectedUsername = selectedUser.name;
    goto(`/${$selectedUsername}`);
  };

  $: if ($isMobile || $mobile) currentContact = null;

  $: if ($profileUpdated) {
    console.log("user profile updated detected !");
    // user = auth.currentUser;
    $loggedinUser = auth.currentUser;
  }

  // $: if (!user) console.log("user is not ready");
  $: if (!$loggedinUser) console.log("user is not ready");

  // $: if (user) {
  $: if ($loggedinUser) {
    ready = true;
    console.log("user is ready");
    // console.log("user", user);
    console.log("user", $loggedinUser);
  }

  $: if (ready && $loginUserEmail) {
    let colRef = collection(db, "whatzapp_users");
    const q = query(
      colRef,
      where("contactList", "array-contains", $loginUserEmail)
    );
    const unsubUsers = onSnapshot(q, (snapshot) => {
      let tempUsers = [];
      snapshot.docs.forEach((doc) => {
        tempUsers.push({ ...doc.data() });
      });
      users = tempUsers;
      console.log("initialzie user list | snapshot", users);
      return () => unsubUsers();
    });
    ready = false;

    // let msgId =
    // $loggedinUser.displayName > $selectedUsername
    // ? `${$loggedinUser.displayName} & ${$selectedUsername}`
    // : `${$selectedUsername} & ${$loggedinUser.displayName}`;
    // let tempRef = doc(db, 'lastMsg', msgId)
    // onSnapshot(tempRef, doc => {
    //   lastMsg = doc.data()
    // })
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
  : $showCameraModal || $showAudioRecordingModal || $showAudioPlayerModal
  ? "0%"
  : !$mobile && $page.url.pathname != "/login"
  ? "550px"
  : "0%"} -->
<div
  class="leftSide"
  style:background={$themeStore.theme === "dark" ? "#292F3F" : "white"}
  style:width={$mobile && $page.url.pathname === "/"
    ? "100%"
    : $showCameraModal || $showAudioRecordingModal || $showAudioPlayerModal
    ? "0%"
    : !$mobile && $page.url.pathname != "/login"
    ? "500px"
    : "0%"}
>
  <div class="header" style:background={$themeStore.theme === "dark" ? "#292F3F" : "#ebebeb"}>
    <div class="left" on:click={() => goto("/")} style:cursor="pointer">
      <!-- {#if $mobile && $loggedinUser} -->
      {#if $loggedinUser}
        <div
          class="userimg"
          on:click|stopPropagation={() =>
            ($showSettingsModal = !$showSettingsModal)}
        >
          {#if $loggedinUser.photoURL}
            <img src={$loggedinUser.photoURL} alt="" class="cover" />
          {:else}
            <img src="/joke.png" alt="" class="cover" />
          {/if}
        </div>
      {/if}
      <h3 class="user-title">LetsChat</h3>
    </div>

    <ul class="nav_icons">
      <li
        on:click|stopPropagation={() =>
          ($showAddFriendModal = !$showAddFriendModal)}
      >
        <svg
          xmlns="http://www.w3.org/2000/svg"
          class="ionicon"
          viewBox="0 0 512 512"
          width="24"
          height="24"
          fill="currentColor"
        >
          <path
            d="M376 144c-3.92 52.87-44 96-88 96s-84.15-43.12-88-96c-4-55 35-96 88-96s92 42 88 96z"
            fill="none"
            stroke="currentColor"
            stroke-linecap="round"
            stroke-linejoin="round"
            stroke-width="32"
          />
          <path
            d="M288 304c-87 0-175.3 48-191.64 138.6-2 10.92 4.21 21.4 15.65 21.4H464c11.44 0 17.62-10.48 15.65-21.4C463.3 352 375 304 288 304z"
            fill="none"
            stroke="currentColor"
            stroke-miterlimit="10"
            stroke-width="32"
          />
          <path
            fill="none"
            stroke="currentColor"
            stroke-linecap="round"
            stroke-linejoin="round"
            stroke-width="32"
            d="M88 176v112M144 232H32"
          />
        </svg>
      </li>
    </ul>
  </div>

  <div class="search_user">
    <div class="search-user-wrapper">
      <input
        type="text"
        placeholder="Find user"
        bind:value={$keyword}
        style:background={$themeStore.theme === "dark" ? "#1F232F" : "#ebebeb"}
      />

      <svg
        xmlns="http://www.w3.org/2000/svg"
        class="ionicon icon-finduser"
        viewBox="0 0 512 512"
        width="20"
        height="20"
        fill="currentCoklor"
        style:cursor="none"
      >
        <path
          d="M221.09 64a157.09 157.09 0 10157.09 157.09A157.1 157.1 0 00221.09 64z"
          fill="none"
          stroke="currentColor"
          stroke-miterlimit="10"
          stroke-width="32"
        />
        <path
          fill="none"
          stroke="currentColor"
          stroke-linecap="round"
          stroke-miterlimit="10"
          stroke-width="32"
          d="M338.29 338.29L448 448"
        />
      </svg>
    </div>
  </div>

  {#if users.length}
    <div
      class="chatlist"
      style:padding-bottom={$mobile ? "5px" : "0px"}
      style:height="calc(100vh - 115px)"
      transition:fade={{ duration: 100 }}
    >
      {#each filteredUsers as user}
        <div
          class="block"
          class:unread={user.unread}
          on:click={() => selectUser(user)}
          style:background={(currentContact === user && !$mobile) ||
          (user.name === $page.params.userId && !$mobile)
            ? $themeStore.theme === "dark" ? "#3a3f50"
            : "#ebebeb"
            : ""
          }
        >
          <div class="imgbx">
            {#if user.avatar}
              <img src={user.avatar} alt="" class="cover" />
            {:else}
              <img src="/joke.png" alt="" class="cover" />
            {/if}
            <div class={user.isOnline ? "status online" : "status offline"} />
          </div>
          <div class="details">
            <div class="listHead">
              <span class="user-title">{user.name}</span>
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

  {#if $showSettingsModal && $loggedinUser}
    <SettingsModal />
  {/if}

  {#if $showAddFriendModal}
    <AddFriendModal />
  {/if}

  <!-- {#if $mobile}
    <Navbar />
  {/if} -->
</div>

<style>
  .add-friend {
    font-size: 25px;
  }

  .icon-addFriend-wrapper {
    width: 35px;
    height: 35px;
    background: #03a9f1;
    /* background: #00bfa5; */
    border-radius: 10px;
    display: flex;
    justify-content: center;
    align-items: center;
  }

  ::placeholder {
    /* color: rgba(255, 255, 255, 0.6); */
  }

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
    width: 40px;
    height: 40px;
    display: flex;
    align-items: center;
    cursor: pointer;
    margin-right: 5px;
    /* border: 1px solid; */
  }

  .userimg img {
    width: 40px;
    height: 40px;
    object-fit: cover;
    border-radius: 50%;
  }
</style>
