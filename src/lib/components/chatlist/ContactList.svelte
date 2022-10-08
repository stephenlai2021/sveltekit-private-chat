<script>
  import {
    keyword,
    allUsers,
    groupChat,
    publicChat,
    privateChat,
    showSettingsModal,
  } from "$lib/store";
  import { fade } from "svelte/transition";
  import { page } from "$app/stores";

  // components
  import User from "$lib/components/chatlist/User.svelte";
  import Skeleton from "$lib/components/skeleton/LeftSideSkeleton.svelte";

  let filteredUsers = [];

  $: filteredUsers =
    $allUsers &&
    $allUsers.filter((user) => {
      return (
        user.name.toUpperCase().includes($keyword) ||
        user.name.toLowerCase().includes($keyword)
      );
    });

  $: if ($page.url.pathname === "/login") $showSettingsModal = false;
</script>

<div class="chatlist" transition:fade={{ duration: 100 }}>
  <h2>
    {$privateChat
      ? "Messages"
      : $groupChat
      ? "Group Chat"
      : $publicChat
      ? "Chatroom"
      : ""}
  </h2>

  <!-- {#if $privateChat} -->
  {#if $privateChat && $allUsers && $allUsers.length}
    {#each filteredUsers as user}
      <User {user} />
    {/each}
  {:else if $groupChat}{:else if $publicChat}{:else}
    <Skeleton />
  {/if}

  <!-- {#if $groupChat} -->
</div>

<style>
  h2 {
    margin-left: 15px;
    margin-bottom: 10px;
  }

  .group,
  .public {
    width: 100%;
    height: calc(100vh - 187px);
    display: flex;
    justify-content: center;
    padding-top: 200px;
  }

  .chatlist {
    height: calc(100vh - 187px);
    overflow: auto;
    border-radius: 8px;
    padding-top: 20px;
    margin-top: 10px;
    border-top-left-radius: 30px;
    border-top-right-radius: 30px;
    border-top: 2px solid white;
  }

  ::-webkit-scrollbar {
    width: 0px;
  }

  ::-webkit-scrollbar-thumb {
    background: inherit;
  }

  @media (max-width: 800px) {
    .chatlist {
      height: calc(100vh - 160px);
    }
  }
</style>
