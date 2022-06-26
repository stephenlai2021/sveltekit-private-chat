<script>
  import {
    loggedinUser,
    showSettingsModal,
    showAddFriendModal,
    showSearchFriendModal,
    showAddGroupModal,
  } from "$lib/store";
  import SettingsModal from "$lib/components/SettingsModal.svelte";
  import AddFriendModal from "$lib/components/AddFriendModal.svelte";
  import Header from "$lib/components/chatlist/Header.svelte";
  import TabMenu from "$lib/components/chatlist/TabMenu.svelte";
  import SearchUser from "$lib/components/chatlist/SearchUser.svelte";
  import ContactList from "$lib/components/chatlist/ContactList.svelte";
  import SearchFriendModal from "$lib/components/SearchFriendModal.svelte";
  import AddGroupModal from "$lib/components/AddGroupModal.svelte";
  import themeStore from "svelte-themes"
</script>

<div 
  style:backdrop-filter="blur(20px)"
  style:background={$themeStore.theme === "dark" ? "#292F3F" : "rgba(235, 235, 235, .5)"}
>
  <!-- style:border-right={$themeStore.theme === "dark"
    ? "2px solid #3A3F50"
    : "2px solid rgba(235, 235, 235, .3)"}
  style:border-left={$themeStore.theme === "dark"
    ? "2px solid #3A3F50"
    : "2px solid rgba(235, 235, 235, .3)"} -->
  <Header />
  <SearchUser />
  <TabMenu />
  <ContactList />

  {#if $showSettingsModal && $loggedinUser}
    <SettingsModal />
  {/if}

  {#if $showAddFriendModal}
    <AddFriendModal />
  {/if}

  {#if $showSearchFriendModal}
    <SearchFriendModal />
  {/if}

  {#if $showAddGroupModal}
    <AddGroupModal />
  {/if}

  <!-- {#if $mobile}
    <Navbar />
  {/if} -->
</div>
