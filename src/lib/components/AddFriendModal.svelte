<script>
  import { fly } from "svelte/transition";
  import {
    allUsers,
    showAddFriendModal,
    showSearchFriendModal
  } from "$lib/store";
  import { getAllDocs } from "$lib/functions/getAllDocs";
  import { doc, updateDoc } from "firebase/firestore";
  import { onAuthStateChanged } from "firebase/auth";
  import { db, auth } from "$lib/firebase/client";
  import themeStore from "svelte-themes";

  let url = null;
  let user = null;
  let users = [];
  let username = null;
  let notFound = false;
  let sameUser = false;
  let matchedUser = false;

  onAuthStateChanged(auth, (_user) => {
    user = _user;
  });

  const getUser = async () => {
    if (!username) {
      return;
    }
    const { docs } = await getAllDocs("whatzapp_users", [
      "name",
      "==",
      username,
    ]);
    users = docs;
    if (!users.length) notFound = true;
  };

  $: if (!username) sameUser = false;

  $: if (user && users && !notFound) {
    console.log(`${users[0].name} is found`);
    console.log(`loggedin user name is ${user.displayName}`);
    url = users[0].avatar;

    if (users[0].name === user.displayName) {
      console.log("this is your name 🤗");
      users = [];
      sameUser = true;
    }
  } else {
    console.log(`user cannot be found ! 😥`);
  }

  const handleSearch = (e) => {
    if (e.charCode === 13) getUser();
  };

  const addUser = async () => {
    $showSearchFriendModal = false;
    let userDoc = doc(db, "whatzapp_users", users[0].email);
    await updateDoc(userDoc, {
      contactList: users[0].contactList.includes(user.email)
        ? [...users[0].contactList]
        : [...users[0].contactList, user.email],
    });
    console.log(`${users[0].name} is successfully added to contact list 😁}`);
  };

  $: if (users && users.length) {
    url = users[0].avatar;

    // compare searched user with contactlist
    if ($allUsers.find((user) => user.name === users[0].name)) {
      console.log("find matched user");
      matchedUser = true;
    }
  }

  $: if (!username) {
    users = null;
    notFound = false;
    // sameUser = false
  }
</script>

<div
  class="search-friend-modal"
  transition:fly={{ y: 100, duration: 100, delay: 100 }}
  style:background={$themeStore.theme === "dark" ? "#292F3F" : "#ebebeb"}
>
  <div class="top">
    <svg
      xmlns="http://www.w3.org/2000/svg"
      class="ionicon icon-arrow-back"
      viewBox="0 0 512 512"
      width="24"
      height="24"
      fill="currentColor"
      on:click|stopPropagation={() => ($showAddFriendModal = false)}
    >
      <path
        fill="none"
        stroke="currentColor"
        stroke-linecap="round"
        stroke-linejoin="round"
        stroke-width="48"
        d="M328 112L184 256l144 144"
      />
    </svg>
    <span>Add a friend</span>
  </div>

  <div class="search_user">
    <div class="search-user-wrapper">
      <input
        type="text"
        placeholder="Search friend"
        bind:value={username}
        on:keypress={handleSearch}
        style:background={$themeStore.theme === "dark" ? "#3A3F50" : "white"}
      />
      <svg
        xmlns="http://www.w3.org/2000/svg"
        class="ionicon icon-finduser"
        viewBox="0 0 512 512"
        width="20"
        height="20"
        fill="currentColor"
        on:click={getUser}
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

  {#if users}
    {#each users as user}
      <div class="users">
        <div class="avatar-wrapper">
          {#if user.avatar}
            <img src={user.avatar} alt="" />
          {:else}
            <img src="/happy.png" alt="" width="120" height="120" />
          {/if}
          <div class={user.isOnline ? "status online" : "status offline"} />
        </div>
        <div class="content">
          <h4 style:text-align="center">{user.name}</h4>
        </div>
        {#if matchedUser}
          <span style:margin-top="20px"
            >This user is alreay in contact list</span
          >
        {:else}
          <div class="add-friend-wrapper" on:click={addUser}>
            <svg
              xmlns="http://www.w3.org/2000/svg"
              class="ionicon icon-add"
              viewBox="0 0 512 512"
              width="24"
              height="24"
              fill="currentColor"
              on:click={addUser}
            >
              <path
                fill="none"
                stroke="currentColor"
                stroke-linecap="round"
                stroke-linejoin="round"
                stroke-width="32"
                d="M256 112v288M400 256H112"
              />
            </svg>
            <span>Add friend</span>
          </div>
        {/if}
      </div>
    {/each}
  {/if}

  {#if notFound}
    <div class="info">
      <img
        class="userimg"
        src="https://cdn.iconscout.com/icon/free/png-256/cry-face-sad-tear-emoji-37717.png"
        alt=""
        width="120"
        height="120"
      />
      <p class="info-message">This user could not be found</p>
    </div>
  {/if}

  {#if sameUser}
    <div class="info">
      <img class="userimg" src={url} alt="" width="120" height="120" />
      <p class="info-message" style:text-align="center">
        You can't add yourself to contact list !
      </p>
    </div>
  {/if}
</div>

<style>
  .add-friend-wrapper {
    display: flex;
    align-items: center;
    margin-top: 30px;
    /* border: 1px solid; */
  }

  .content {
    margin-top: 15px;
  }
  .avatar-wrapper img {
    width: 120px;
    height: 120px;
    border-radius: 50%;
    object-fit: cover;
  }

  .avatar-wrapper {
    position: relative;
    width: 120px;
    height: 120px;
  }

  .users {
    display: flex;
    flex-direction: column;
    align-items: center;
    margin-top: 20px;
    /* border: 1px solid; */
  }

  /* .icon-close {
    width: 100%;
    text-align: right;
    padding: 5px;
  } */

  .info-message {
    margin-top: 10px;
  }

  .userimg {
    margin-top: 30px;
  }

  .info {
    display: flex;
    justify-content: center;
    align-items: center;
    flex-direction: column;
    /* border: 1px solid; */
  }

  span {
    margin-left: 10px;
    line-height: 0.7;
  }

  .top {
    padding: 10px;
    display: flex;
    align-items: center;
    /* border: 1px solid; */
  }

  .icon-finduser {
    position: absolute;
    right: 10px;
    top: 50%;
    transform: translateY(-50%);
  }

  input {
    width: 100%;
    outline: none;
    border: none;
    padding: 10px;
    border-radius: 10px;
    font-size: 14px;
    padding-left: 15px;
  }

  .search-user-wrapper {
    position: relative;
  }

  .search_user {
    position: relative;
    /* top: 0px; */
    width: 100%;
    padding: 15px;
    margin-top: 10px;
    /* border: 1px solid; */
  }

  .search-friend-modal {
    position: absolute;
    top: 0;
    left: 0;
    width: 100%;
    height: 100vh;
    z-index: 200;
  }
</style>
