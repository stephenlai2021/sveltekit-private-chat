<script>
  import {
    loggedinUser,
    showSettingsModal,
    showAddFriendModal,
    showSearchFriendModal,
    showAddGroupModal,
    showSettingsModalMobile,
    showToolModalMobile,
    widthLessthan1200
  } from "$lib/store";
  import SettingsModalMobile from "$lib/components/SettingsModalMobile.svelte";
  import ToolModalMobile from "$lib/components/ToolModalMobile.svelte";
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
  class="chatlist"
  style:backdrop-filter="blur(20px)"
  style:background={$themeStore.theme === "dark" ? "#292F3F" : "rgba(235, 235, 235, .5)"}
>
  <Header />
  <SearchUser />
  <TabMenu />
  <ContactList />

  {#if $showSettingsModalMobile && $widthLessthan1200}
    <SettingsModalMobile />
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
</div>

<style>
  .chatlist {
    position: relative;
    margin: 5px ;
    margin-left: 0;
    border-radius: 8px;
  }
  
  @media (max-width: 800px) {
    .chatlist {
      margin: 0;
      border-radius: 0;
      height: 100vh;
    }
  }
</style>
