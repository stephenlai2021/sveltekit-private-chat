<script>
  import {
    mobile,
    loggedinUser,
    showCameraModal,
    showSettingsModal,
    showAddFriendModal,
    showAudioPlayerModal,
    showAudioRecordingModal
  } from "$lib/store";
  import { page } from "$app/stores"; 
  import SettingsModal from "$lib/components/SettingsModal.svelte";
  import AddFriendModal from "$lib/components/AddFriendModal.svelte";
  import Navbar from "$lib/components/Navbar.svelte";
  import themeStore from "svelte-themes";
  import Header from "$lib/components/chatlist/Header.svelte"
  import TabMenu from "$lib/components/chatlist/TabMenu.svelte"
  import SearchUser from "$lib/components/chatlist/SearchUser.svelte"
  import ContactList from "$lib/components/chatlist/ContactList.svelte" 
</script>

<div
  class="leftSide"
  style:background={$themeStore.theme === "dark" ? "#292F3F" : "white"}
  style:width={
    $mobile && ($page.url.pathname === "/" || $page.url.pathname === "/private" || $page.url.pathname === "/group" || $page.url.pathname === "/public") ? 
      "100%"
    : $showCameraModal || $showAudioRecordingModal || $showAudioPlayerModal
    ? "0%"
    : !$mobile && $page.url.pathname != "/login"
    ? "500px"
    : "0%"}
>
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
