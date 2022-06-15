<script>
  import {
    bgColor,
    mobile,
    keyword,
    isMobile,
    loggedinUser,
    profileUpdated,
    loginUserEmail,
    selectedUsername,
    showSettingsModal,
    allChat,
    privateChat,
    groupChat,
    publicChat,
  } from "$lib/store";
  import { collection, onSnapshot, query, where } from "firebase/firestore";
  import { auth, db } from "$lib/firebase/client";
  import { fade } from "svelte/transition";
  import { page } from "$app/stores";
  import { goto } from "$app/navigation";
  import themeStore from "svelte-themes";
  import Skeleton from "$lib/components/skeleton/LeftSideSkeleton.svelte";

  let users = [];
  let ready = false;
  let usersReady = false
  let currentContact = null;
  let filteredUsers = [];

  const selectUser = (selectedUser) => {
    currentContact = selectedUser;
    console.log(`${selectedUser.name} is selected`);
    $selectedUsername = selectedUser.name;
    goto(`/${$selectedUsername}`);
  };

  $: if ($isMobile || $mobile) currentContact = null;

  $: if ($profileUpdated) {
    console.log("user profile updated detected !");
    $loggedinUser = auth.currentUser;
  }

  $: if ($loggedinUser) {
    ready = true;
    console.log("user is ready");
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
      usersReady = true
      console.log("initialzie user list | snapshot", users);
      return () => unsubUsers();
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
</script>

{#if $allChat}
<div
  class="chatlist"
  transition:fade={{ duration: 100 }}
  style:padding-bottom={$mobile ? "5px" : "0px"}
  >
  <!-- style:overflow-y={usersReady ? "auto" : "hidden"} -->
  <!-- style:height={$mobile ? "calc(100vh - 167px)" : "calc(100vh - 180px)"} -->
  {#if users.length}
      {#each filteredUsers as user}
      <!-- (currentContact === user && !$mobile) || (user.name === $page.params.userId && !$mobile) ?  -->
        <div
          class="block"
          class:unread={user.unread}
          on:click={() => selectUser(user)}
          style:background={
            (currentContact === user && !$mobile) || (user.name === $page.params.userId && !$mobile) ?
              $themeStore.theme === "dark" ? "#3a3f50" : "#ebebeb"
            : currentContact != user && !$mobile ?
              $themeStore.theme === "dark" ? "#292F3F" : "transparent"
            : ""
          }
          style:backdrop-filter={
            (currentContact === user && !$mobile) || (user.name === $page.params.userId && !$mobile) ?
              // $themeStore.theme === "dark" ? "#3a3f50" : $bgColor
              $themeStore.theme === "dark" ? "blur(8px)" : "transparent"
            : currentContact != user && !$mobile ?
              $themeStore.theme === "dark" ? "#292F3F" : "white"
              // $themeStore.theme === "dark" ? "#292F3F" : "transparent"
            : ""
          }
        >
          <!-- style:border={(currentContact === user && !$mobile) ||
          (user.name === $page.params.userId && !$mobile)
            ? $themeStore.theme === "dark"
              ? "1px solid #3a3f50"
              : "1px solid #ebebeb"
            : ""} -->
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
            <div class="message">
              <p>
                How to make Whatsapp clone using html and css
              </p>
              <b>1</b>
            </div>
          </div>
        </div>
      {/each}
    {:else}
      <div class="loading">
        <Skeleton />
      </div>
    {/if}
  </div>
{/if}

{#if $privateChat}
  <div class="group-chat">
    <h1>Private Chat</h1>
  </div>
{/if}

{#if $groupChat}
  <div class="group-chat">
    <h1>Group Chat</h1>
  </div>
{/if}

{#if $publicChat}
  <div class="public-chat">
    <h1>Public Chat</h1>
  </div>
{/if}

<style>
  .group-chat,
  .public-chat {
    width: 100%;
    height: 50vh;
    display: flex;
    justify-content: center;
    align-items: center;
  }

  .chatlist {
    height: calc(100vh - 167px);
    overflow: hidden;
    /* border: 2px solid; */
  }

  .chatlist:hover {
    overflow-y: auto;
  }

  ::-webkit-scrollbar {
    width: 10px;
  }

  ::-webkit-scrollbar-thumb {
    border-radius: 10px;
    background: rgba(0, 0, 0, .3);
    backdrop-filter: blur(8px);
  }
  
  ::-webkit-scrollbar-thumb:hover {
    background: #555;
    background: rgba(0, 0, 0, .5);
  }

  .block {
    display: flex;
    align-items: center;
    justify-content: center;
    padding: 0 10px;
    /* margin-left: 10px; */
    height: 65px;
    cursor: pointer;
    /* border-radius: 10px; */
    border-top-right-radius: 10px;
    border-bottom-right-radius: 10px;
  }

  .block:hover {
    transform: scale(1.01);
  }

  .imgbx {
    min-width: 45px;
    height: 45px;
    cursor: pointer;
    margin-right: 15px;
    border-radius: 50%;
    display: flex;
    justify-content: center;
    align-items: center;
    position: relative;
  }

  .imgbx img {
    width: 45px;
    height: 45px;
    overflow: hidden;
    object-fit: cover;
    border-radius: 50%;
  }

  .details {
    width: 100%;
    height: 100%;
    display: flex;
    flex-direction: column;
    justify-content: center;
    /* border: 1px solid; */
    /* border-bottom: 1px solid #ebebeb; */
  }

  .details .listHead {
    display: flex;
    justify-content: space-between;
    margin-bottom: 5px;
  }

  .details .listHead .user-title {
    font-size: 18px;
    font-weight: 600;
    font-style: normal;
    line-height: 20px;
  }

  .details .listHead .time {
    font-size: 0.75em;
    color: #aaa;
  }

  .block.unread .details .listHead .time {
    color: var(--active-green);
  }

  .message {
    display: flex;
    justify-content: space-between;
  }

  .message p {
    font-size: 16px;
    font-weight: 500;
    letter-spacing: 0.6px;
    display: -webkit-box;
    -webkit-line-clamp: 1;
    -webkit-box-orient: vertical;
    overflow: hidden;
    font-style: italic;
  }

  .block.unread .details .message b {
    background: var(--active-green);
    color: white;
    min-width: 20px;
    height: 20px;
    border-radius: 50%;
    display: grid;
    place-content: center;
    font-size: 0.75em;
    margin-right: 3px;
  }
</style>
