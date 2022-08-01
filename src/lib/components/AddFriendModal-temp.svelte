<script>
  import { fly } from "svelte/transition";
  import { showAddGroupModal, showAddFriendModal, showSearchFriendModal } from "$lib/store";
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

  onAuthStateChanged(auth, (_user) => {
    user = _user;
  });

  const getUser = async () => {
    const { docs } = await getAllDocs("whatzapp_users", [
      "name",
      "==",
      username,
    ]);
    users = docs;
    if (!users.length) {
      username = null;
      notFound = true;
    }
  };

  $: if (user && users && !notFound) {
    console.log(`${users[0].name} is found`);
    console.log(`loggedin user name is ${user.displayName}`);

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
    $showAddFriendModal = false;
    let userDoc = doc(db, "whatzapp_users", users[0].email);
    await updateDoc(userDoc, {
      contactList: users[0].contactList.includes(user.email)
        ? [...users[0].contactList]
        : [...users[0].contactList, user.email],
    });
    console.log(`${users[0].name} is successfully added to contact list 😁}`);
  };

  const closeDialog = () => {
    sameUser = false;
    username = null;
  };

  $: if (users && users.length) {
    url = users[0].avatar;
  }

  $: if (!username) users = null;
</script>

<div
  class="modal-addfriend"
  on:click|stopPropagation={() => console.log("add user modal clicked !")}
  transition:fly={{ x: -60, duration: 100, delay: 100 }}
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
  <span>Add friend</span>
</div>

  <ul class="menu">
    <li class="menu-item" on:click={() => ($showSearchFriendModal = true)}>
      <svg
        xmlns="http://www.w3.org/2000/svg"
        class="ionicon icon-add"
        viewBox="0 0 512 512"
        width="24"
        heiht="24"
        fill="currentColor"
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
      <span>Search friend</span>
    </li>
    <li class="menu-item" on:click={() => ($showAddGroupModal = true)}>
      <svg
        xmlns="http://www.w3.org/2000/svg"
        class="ionicon"
        viewBox="0 0 512 512"
        width="24"
        height="24"
      >
        <path
          d="M402 168c-2.93 40.67-33.1 72-66 72s-63.12-31.32-66-72c-3-42.31 26.37-72 66-72s69 30.46 66 72z"
          fill="none"
          stroke="currentColor"
          stroke-linecap="round"
          stroke-linejoin="round"
          stroke-width="32"
        />
        <path
          d="M336 304c-65.17 0-127.84 32.37-143.54 95.41-2.08 8.34 3.15 16.59 11.72 16.59h263.65c8.57 0 13.77-8.25 11.72-16.59C463.85 335.36 401.18 304 336 304z"
          fill="none"
          stroke="currentColor"
          stroke-miterlimit="10"
          stroke-width="32"
        />
        <path
          d="M200 185.94c-2.34 32.48-26.72 58.06-53 58.06s-50.7-25.57-53-58.06C91.61 152.15 115.34 128 147 128s55.39 24.77 53 57.94z"
          fill="none"
          stroke="currentColor"
          stroke-linecap="round"
          stroke-linejoin="round"
          stroke-width="32"
        />
        <path
          d="M206 306c-18.05-8.27-37.93-11.45-59-11.45-52 0-102.1 25.85-114.65 76.2-1.65 6.66 2.53 13.25 9.37 13.25H154"
          fill="none"
          stroke="currentColor"
          stroke-linecap="round"
          stroke-miterlimit="10"
          stroke-width="32"
        />
      </svg>
      <span>Add a group</span>
    </li>
    <li class="menu-item">
      <svg
        xmlns="http://www.w3.org/2000/svg"
        class="ionicon"
        viewBox="0 0 512 512"
        width="24"
        height="24"
        fill="currentColor"
      >
        <path
          d="M431 320.6c-1-3.6 1.2-8.6 3.3-12.2a33.68 33.68 0 012.1-3.1A162 162 0 00464 215c.3-92.2-77.5-167-173.7-167-83.9 0-153.9 57.1-170.3 132.9a160.7 160.7 0 00-3.7 34.2c0 92.3 74.8 169.1 171 169.1 15.3 0 35.9-4.6 47.2-7.7s22.5-7.2 25.4-8.3a26.44 26.44 0 019.3-1.7 26 26 0 0110.1 2l56.7 20.1a13.52 13.52 0 003.9 1 8 8 0 008-8 12.85 12.85 0 00-.5-2.7z"
          fill="none"
          stroke="currentColor"
          stroke-linecap="round"
          stroke-miterlimit="10"
          stroke-width="32"
        />
        <path
          d="M66.46 232a146.23 146.23 0 006.39 152.67c2.31 3.49 3.61 6.19 3.21 8s-11.93 61.87-11.93 61.87a8 8 0 002.71 7.68A8.17 8.17 0 0072 464a7.26 7.26 0 002.91-.6l56.21-22a15.7 15.7 0 0112 .2c18.94 7.38 39.88 12 60.83 12A159.21 159.21 0 00284 432.11"
          fill="none"
          stroke="currentColor"
          stroke-linecap="round"
          stroke-miterlimit="10"
          stroke-width="32"
        />
      </svg>
      <span>Create a chat room</span>     
    </li>
  </ul>

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
          <p>{user.email}</p>
        </div>
        <ion-icon
          name="add-circle-outline"
          class="icon-add"
          on:click={addUser}
        />
      </div>
    {/each}
  {/if}

  {#if notFound}
    <div class="warning">
      <img
        src="https://cdn.iconscout.com/icon/free/png-256/cry-face-sad-tear-emoji-37717.png"
        alt=""
        width="120"
        height="120"
      />
      <p class="error-message">This user could not be found</p>
      <ion-icon
        name="close-outline"
        class="btn-close"
        on:click={() => (notFound = false)}
      />
    </div>
  {/if}

  {#if sameUser}
    <div class="surprise">
      <img
        src="https://images.vexels.com/media/users/3/134485/isolated/lists/bcde859a8ad3a45cb93aed78d8a63686-cool-emoji-emoticon.png"
        alt=""
        width="120"
        height="120"
      />
      <p class="error-message" style:text-align="center">
        You can't add yourself to contact list !
      </p>
      <ion-icon name="close-outline" class="btn-close" on:click={closeDialog} />
    </div>
  {/if}
</div>

<style>
  .top {
    height: 60px;
    display: flex;
    align-items: center;
    padding-left: 10px;
    /* border: 1px solid; */
  }

  .top span {
    line-height: 0.7;
  }

  ul.menu {
    margin-top: 50px;
    padding-left: 10px;
    /* border: 1px solid; */
  }

  li.menu-item {
    list-style: none;
    display: flex;
    align-items: center;
    padding: 10px 0 10px 5px;
    cursor: pointer;
  }

  .ionicon {
    margin-right: 15px;
  }

  .content {
    margin-top: 10px;
  }

  .error-message {
    margin-top: 10px;
  }

  .btn-close {
    position: absolute;
    right: 5px;
    top: 5px;
  }

  .surprise {
    z-index: 350;
    background: rgb(192, 189, 192);
  }

  .surprise,
  .warning {
    position: absolute;
    top: 120px;
    left: 50%;
    transform: translateX(-50%);
    width: 80%;
    z-index: 300;
    display: flex;
    flex-direction: column;
    justify-content: space-around;
    align-items: center;
    padding: 10px;
    border-radius: 8px;
    box-shadow: 0px 0px 10px rgba(248, 248, 248, 0.5);
    border: 1px solid;
  }

  .offline {
    background: #b6b5b5;
  }

  .online {
    background: var(--active-green);
  }

  .status {
    position: absolute;
    bottom: 10px;
    right: 15px;
    border: 2px solid white;
    width: 15px;
    height: 15px;
    border-radius: 50%;
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
  }

  .modal-addfriend {
    position: absolute;
    top: 0;
    left: 0;
    z-index: 200;
    width: 100%;
    height: 100vh;
    /* padding: 10px; */
    z-index: 100;
  }
</style>
