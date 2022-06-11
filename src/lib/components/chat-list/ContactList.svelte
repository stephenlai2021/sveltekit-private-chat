<script>
  import {
    mobile,
    keyword,
    isMobile,
    loggedinUser,
    profileUpdated,
    loginUserEmail,
    selectedUsername,
    showSettingsModal
  } from "$lib/store";
  import {
    collection,
    doc,
    onSnapshot,
    query,
    where,
  } from "firebase/firestore";
  import { auth, db } from "$lib/firebase/client";
  import { fade } from "svelte/transition";
  import { page } from "$app/stores";
  import { goto } from "$app/navigation";
  import themeStore from "svelte-themes";
  import Skeleton from "$lib/components/skeleton/LeftSideSkeleton.svelte";

  let users = [];
  let ready = false;
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
          ? $themeStore.theme === "dark"
            ? "#3a3f50"
            : "#ebebeb"
          : ""}
        style:border={(currentContact === user && !$mobile) ||
        (user.name === $page.params.userId && !$mobile)
          ? $themeStore.theme === "dark"
            ? "1px solid #3a3f50"
            : "1px solid #ebebeb"
          : ""}
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
            <p
              style:border={(currentContact === user && !$mobile) ||
              (user.name === $page.params.userId && !$mobile)
                ? $themeStore.theme === "dark"
                  ? "1px solid #3a3f50"
                  : "1px solid #ebebeb"
                : $themeStore.theme === "dark"
                ? "1px solid #292F3F"
                : "1px solid white"}
            >
              How to make Whatsapp clone using html and css
            </p>
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
