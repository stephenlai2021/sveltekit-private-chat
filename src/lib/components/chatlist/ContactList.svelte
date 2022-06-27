<script>
  import {
    allUsers,
    bgColor,
    mobile,
    keyword,
    isMobile,
    loggedinUser,
    profileUpdated,
    loginUserEmail,
    selectedUsername,
    // currentSelectedUser,
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
  let usersReady = false;
  let currentContact = null;
  let filteredUsers = [];

  const selectUser = (selectedUser) => {
    currentContact = selectedUser;
    // $currentSelectedUser = selectedUser;
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
      $allUsers = tempUsers
      usersReady = true;
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
  >
    {#if users.length}
      {#each filteredUsers as user}
        <div
          class="block"
          class:unread={user.unread}
          on:click={() => selectUser(user)}
          style:border-radius={(currentContact === user && !$mobile) ||
            (user.name === $page.params.userId && !$mobile) ? "8px" : "0"}
          style:background={(currentContact === user && !$mobile) ||
          (user.name === $page.params.userId && !$mobile) ? 
            $themeStore.theme === "dark" ? 
              "#3a3f50"
              : "rgba(235, 235, 235, 1)"
            : currentContact != user && !$mobile ? 
              $themeStore.theme === "dark" ? 
                "#292F3F"
                : "transparent"
            : ""
          }
        >
          <!-- style:backdrop-filter={(currentContact === user && !$mobile) ||
          (user.name === $page.params.userId && !$mobile)
            ? "blur(8px)"
            : "none"} -->
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
              <p>How to make Whatsapp clone using html and css</p>
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
  <div class="private">
    <h1>Private Chat</h1>
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
  .private,
  .group,
  .public {
    width: 100%;
    height: 100vh;
    height: calc(100%- 110px);
    display: flex;
    justify-content: center;
    padding-top: 200px;
    /* border: 1px solid; */
  }

  .chatlist {
    height: calc(100vh - 160px);
    overflow: auto;
    /* border: 1px solid; */
  }

  ::-webkit-scrollbar {
    width: 0px;
  }

  ::-webkit-scrollbar-thumb {
    background: inherit;
  }

  .block {
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
    font-size: 18px;
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
    color: #FF4408;
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
    color: gray;
  }

  .block.unread .details .message b {
    background: var(--active-green);
    background: #FF4408;
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
