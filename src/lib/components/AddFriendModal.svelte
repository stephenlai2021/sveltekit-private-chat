<script>
  import { fly } from "svelte/transition";
  import { showAddFriendModal } from "$lib/store";
  import { getAllDocs } from "$lib/functions/getAllDocs";
  import { doc, updateDoc } from "firebase/firestore";
  import { onAuthStateChanged } from "firebase/auth";
  import { db, auth } from "$lib/firebase/client";

  let url = null;
  let user = null;
  let users = [];
  let username = null;
  let notFound = false;
  let sameUser = false;

  onAuthStateChanged(auth, (_user) => { 
    user = _user
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
    username = null
  };

  $: if (users && users.length) {
    url = users[0].avatar;
  }

  $: if (!username) users = null;
</script>

<div
  class="modal-addfriend"
  on:click|stopPropagation={() => console.log("add user modal clicked !")}
  transition:fly={{ y: 50, duration: 100, delay: 100 }}
>
  <div class="icon-arrow">
    <ion-icon
      name="chevron-down-outline"
      on:click|stopPropagation={() => ($showAddFriendModal = false)}
    />
  </div>

  <div class="search_user">
    <input
      type="text"
      placeholder="Find user"
      bind:value={username}
      on:keypress={handleSearch}
    />
    <ion-icon name="search-outline" class="icon-search" on:click={getUser} />
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

  .icon-add {
    width: 40px;
    height: 40px;
    margin-top: 10px;
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

  .avatar-wrapper {
    position: relative;
  }

  .users {
    display: flex;
    flex-direction: column;
    align-items: center;
    margin-top: 20px;
    /* border: 1px solid; */
  }

  .icon-arrow {
    display: flex;
    align-items: center;
    padding: 5px;
    padding-top: 10px;
    display: flex;
    justify-content: center;
  }

  .search_user .icon-search {
    position: absolute;
    right: 25px;
    top: 15px;
    width: 20px;
    height: 20px;
    color: rgb(161, 161, 161);
  }

  .search_user {
    position: relative;
    width: 100%;
    height: 50px;
    background: transparent;
    padding: 0 15px;
    line-height: 50px;
  }

  .search_user input {
    width: 100%;
    outline: none;
    border: none;
    background: white;
    padding: 6px;
    height: 38px;
    font-size: 14px;
    padding-left: 20px;
  }

  .search_user input::placeholder {
    color: #bbb;
  }

  .modal-addfriend {
    position: absolute;
    top: 0;
    left: 0;
    z-index: 200;
    width: 100%;
    height: 100vh;
    padding: 10px;
    z-index: 100;
    background: rgba(189, 202, 202, 0.5);
    backdrop-filter: blur(30px);
  }
</style>
