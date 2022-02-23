<script>
  import Skeleton from "$lib/components/Skeleton.svelte";
  import { keyword, showSettingsModal } from "$lib/store";
  import { goto } from "$app/navigation";
  import { onMount } from "svelte";
  import { page } from "$app/stores";
  import { collection, onSnapshot, query, where } from "firebase/firestore";
  import { auth, db } from "$lib/firebase/client";
  import { onAuthStateChanged } from "firebase/auth";
  import { fly } from "svelte/transition";
  import SettingsModal from "$lib/components/Modal/SettingsModal.svelte";

  let user = null;
  let users = [];
  let show = false;
  let filteredUsers = [];
  let activeItem = null;
  let q = null;
  let colRef = collection(db, "whatzapp_users");
  let showSearchbar = false;

  const selectedUser = (user) => {
    console.log("selected user | left side", user);
    activeItem = user.name;
    goto(`/chat/${user.name}`);
  };

  onMount(async () => {
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
  });

  const handleProfileModal = () => {
    alert("hi, there !");
  };

  const toggleSearchbar = () => {
    showSearchbar = !showSearchbar;
    console.log("search bar state: ", showSearchbar ? "open" : "close");
  };

  onMount(() => {
    activeItem = $page.params.userId;
    console.log("active item | onMount ", activeItem);
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
  {#if user}
    <div class="left">
      <div class="userimg" on:click={handleProfileModal}>
        <img class="cover" src={user.photoURL} alt="" />
      </div>
      <div class="user-details">
        <!-- <h4 class="user-title">{user.displayName}</h4>
        <div class="user-email">{user.email}</div> -->
        <h3 class="user-title">聊天室</h3>
        <!-- <h3 class="user-title"><i>Letschat</i></h3> -->
      </div>
    </div>
  {/if}
  <!-- <li on:click={() => ($showModal = !$showModal)}>
    <span class="material-icons">person_add_alt</span>
  </li> -->
  <ul class="nav_icons">
    <li>
      <span class="material-icons person-add">person_add_alt</span>
    </li>
    <!-- <li on:click={toggleSearchbar}>
      <span class="material-icons">search</span>
    </li> -->
    <li
      on:click|stopPropagation={() =>
        ($showSettingsModal = !$showSettingsModal)}
    >
      <span class="material-icons settings">settings</span>
    </li>
  </ul>
  {#if $showSettingsModal}
    <SettingsModal />
  {/if}
</div>
<div class="search_user">
  <div>
    <input type="text" placeholder="Find user" bind:value={$keyword} />
    <span class="material-icons">search</span>
  </div>
</div>
{#if users.length}
  <div
    class="chatlist"
    in:fly={{ x: 50, duration: 300, delay: 300 }}
    out:fly={{ duration: 300 }}
  >
    {#each filteredUsers as user}
      <div
        class="block"
        class:unread={user.unread}
        class:active={activeItem === user.name}
        on:click={() => selectedUser(user)}
      >
        <div class="imgbx">
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
  .person-add {
    font-size: 26px;
  }
</style>
