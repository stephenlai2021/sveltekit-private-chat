<script>
  import {
    loggedinUser,
    showSearchBar,
    showSettingsModal,
    showAddFriendModal,
    showAddGroupModal,
    showAddPeopleModal,
    showAddRoomModal,
    showSettingsModalMobile,
    showToolModalMobile,
    widthLessthan1200,
  } from "$lib/store";
  import SettingsModalMobile from "$lib/components/SettingsModalMobile.svelte";
  import ToolModalMobile from "$lib/components/ToolModalMobile.svelte";
  import Header from "$lib/components/chatlist/Header.svelte";
  import TabMenu2 from "$lib/components/chatlist/TabMenu2.svelte";
  import SearchUser from "$lib/components/chatlist/SearchUser.svelte";
  import ContactList from "$lib/components/chatlist/ContactList.svelte";
  // import SearchFriendModal from "$lib/components/SearchFriendModal.svelte";
  import AddFriendModal from "$lib/components/AddFriendModal.svelte";
  import AddGroupModal from "$lib/components/AddGroupModal.svelte";
  import AddPeopleModal from "$lib/components/AddPeopleModal.svelte";
  import AddRoomModal from "$lib/components/AddRoomModal.svelte";
  import themeStore from "svelte-themes";
  import AddButton from '$lib/components/chatlist/AddButton.svelte'
</script>

<div
  class="chatlist"
  style:backdrop-filter="blur(20px)"
  style:background="rgba(235, 235, 235, .5)"
>
  <Header />

  {#if $showSearchBar}
    <SearchUser />
  {/if}
  
  <ContactList />
  <TabMenu2 />

  {#if $showSettingsModalMobile && $widthLessthan1200}
    <SettingsModalMobile />
  {/if}

  {#if $showAddFriendModal}/
    <AddFriendModal />
  {/if}

  {#if $showAddRoomModal}
    <AddRoomModal />
  {/if}
</div>

<style>
  .chatlist {
    position: relative;
    margin: 10px 10px 10px 0px;
    border-radius: 8px;
    height: calc(100vh - 20px);
    /* box-shadow: 1px 0px 5px 0px #bebbbb; */
  }

  @media (max-width: 1200px) {
    .chatlist {
      margin-left: 10px;
    }
  }

  @media (max-width: 800px) {
    .chatlist {
      margin: 0;
      border-radius: 0;
      height: 100vh;
    }
  }
</style>
