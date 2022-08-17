<script>
  import {
    mobile,
    keyword,
    isMobile,
    allUsers,
    loggedinUser,
    profileUpdated,
    showSettingsModal,
    privateChat,
    groupChat,
    publicChat,
    currentContact,
  } from "$lib/store";
  import {
    collection,
    onSnapshot,
    query,
    where,
    doc,
  } from "firebase/firestore";
  import { auth, db } from "$lib/firebase/client";
  import { fade } from "svelte/transition";
  import { page } from "$app/stores";
  import { goto } from "$app/navigation";
  import themeStore from "svelte-themes";
  import { onMount } from "svelte";

  // components
  import User from "$lib/components/chatlist/User.svelte";
  import Skeleton from "$lib/components/skeleton/LeftSideSkeleton.svelte";

  let users = [];
  let filteredUsers = [];
  let usersReady = false

  $: if ($loggedinUser) usersReady = true

  $: if (usersReady) {
    let usersRef = collection(db, "whatzapp_users");
    let userQuery = query(
      usersRef,
      where("contactList", "array-contains", $loggedinUser.email)
    );
    const unsubUsers = onSnapshot(userQuery, (snapshot) => {
      let tempUsers = [];
      snapshot.docs.forEach((doc) => {
        tempUsers.push({ ...doc.data() });
      });
      users = tempUsers;
      $allUsers = tempUsers;
      console.log("contact list", users);
      return () => unsubUsers();
    });
    usersReady = false
  }

  $: if ($isMobile || $mobile) $currentContact = null;

  // $: if ($profileUpdated) $loggedinUser = auth.currentUser;

  $: filteredUsers = users.filter((usesr) => {
    return (
      usesr.name.toUpperCase().includes($keyword) ||
      usesr.name.toLowerCase().includes($keyword)
    );
  });

  $: if ($page.url.pathname === "/login") $showSettingsModal = false;
</script>

{#if $privateChat}
  <div class="chatlist" transition:fade={{ duration: 100 }}>
    {#if users.length}
      {#each filteredUsers as user}
        <User {user} />
      {/each}
    {:else}
      <div class="loading">
        <Skeleton />
      </div>
    {/if}
  </div>
{/if}

{#if $groupChat}
  <div class="group">
    <h1>Group Chat</h1>
  </div>
{/if}

{#if $publicChat}
  <div class="public">
    <h1>Public Chatroom</h1>
  </div>
{/if}

<style>
  .group,
  .public {
    width: 100%;
    /* height: calc(100vh - 20px); */
    height: calc(100vh - 187px);
    display: flex;
    justify-content: center;
    padding-top: 200px;
    /* border: 1px solid; */
  }

  .chatlist {
    height: calc(100vh - 187px);
    overflow: auto;
    border-radius: 8px;
    /* border: 1px solid; */
  }

  ::-webkit-scrollbar {
    width: 0px;
  }

  ::-webkit-scrollbar-thumb {
    background: inherit;
  }

  /* .block {
    display: flex;
    align-items: center;
    justify-content: center;
    padding: 0 10px;
    height: 65px;
    cursor: pointer;
  }

  .block:hover {
    transform: scale(1.01);
  }

  .imgbx {
    min-width: 40px;
    height: 40px;
    cursor: pointer;
    margin-right: 15px;
    border-radius: 50%;
    display: flex;
    justify-content: center;
    align-items: center;
    position: relative;
  }

  .imgbx img {
    width: 40px;
    height: 40px;
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
  }

  .details .listHead {
    display: flex;
    justify-content: space-between;
    margin-bottom: 5px;
  }

  .details .listHead .user-title {
    font-size: 16px;
    font-weight: 500;
    letter-spacing: 0.5px;
    font-style: normal;
    line-height: 20px;
  }

  .details .listHead .time {
    font-size: 0.75em;
    color: #aaa;
  }

  .block.unread .details .listHead .time {
    color: var(--active-green);
    color: #ff4408;
  }

  .message {
    display: flex;
    justify-content: space-between;
  }

  .message p {
    font-size: 14px;
    font-weight: 500;
    letter-spacing: 0.6px;
    display: -webkit-box;
    -webkit-line-clamp: 1;
    -webkit-box-orient: vertical;
    overflow: hidden;
    color: gray;
  }

  .block.unread .details .message b {
    background: var(--active-green);
    background: #ff4408;
    color: white;
    min-width: 20px;
    height: 20px;
    border-radius: 50%;
    display: grid;
    place-content: center;
    font-size: 0.75em;
    margin-right: 3px;
  } */

  @media (max-width: 800px) {
    .chatlist {
      height: calc(100vh - 160px);
    }
  }
</style>
