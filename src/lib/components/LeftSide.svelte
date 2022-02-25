<script>
  import Skeleton from "$lib/components/Skeleton.svelte";
  import { keyword, showModal, showSettingsModal } from "$lib/store";
  import { goto } from "$app/navigation";
  import { onMount } from "svelte";
  import { page } from "$app/stores";
  import { collection, onSnapshot, query, where } from "firebase/firestore";
  import { auth, db } from "$lib/firebase/client";
  import { onAuthStateChanged } from "firebase/auth";
  import { fly } from "svelte/transition";
  import SettingsModal from "$lib/components/Modal/SettingsModal.svelte";
  import AddFriendModal from '$lib/components/modal/AddFriendModal.svelte'

  let user = null;
  let users = [];
  let show = false;
  let filteredUsers = [];
  let activeItem = null;
  let q = null;
  let colRef = collection(db, "whatzapp_users");

  const selectedUser = (user) => {
    console.log("selected user | left side", user);
    activeItem = user.name;
    goto(`/${user.name}`);
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
        <h3 class="user-title">聊天室</h3>
      </div>
    </div>
  {/if}
  <ul class="nav_icons">
    <li>
      <span class="material-icons person-add">person_add_alt</span>
    </li>
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
<!-- {#if users.length}
  <div
    class="chatlist"
    in:fly={{ x: 20, duration: 100, delay: 100 }}
    out:fly={{ duration: 100 }}
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
{:else} -->
  <div class="loading">
    <Skeleton />
  </div>
<!-- {/if} -->


{#if $showModal}
  <AddFriendModal />
{/if}

<style>
  .person-add {
    font-size: 26px;
  }
</style>
