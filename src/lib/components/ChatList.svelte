<script>
  import {
    loggedinUser,
    showSettingsModal,
    showAddFriendModal
  } from "$lib/store";
  import SettingsModal from "$lib/components/SettingsModal.svelte";
  import AddFriendModal from "$lib/components/AddFriendModal.svelte";
  import Header from "$lib/components/chatlist/Header.svelte"
  import TabMenu from "$lib/components/chatlist/TabMenu.svelte"
  import SearchUser from "$lib/components/chatlist/SearchUser.svelte"
  import ContactList from "$lib/components/chatlist/ContactList.svelte" 
</script>

<div>
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

  <!-- {#if $mobile}
    <Navbar />
  {/if} -->
</div>
