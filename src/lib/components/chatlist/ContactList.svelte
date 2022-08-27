<script>
  import {
    keyword,
    allUsers,
    showSettingsModal,
    privateChat,
    groupChat,
    publicChat
  } from "$lib/store";
  import { fade } from "svelte/transition";
  import { page } from "$app/stores";

  // components
  import User from "$lib/components/chatlist/User.svelte";
  import Skeleton from "$lib/components/skeleton/LeftSideSkeleton.svelte";

  let filteredUsers = [];

  $: filteredUsers =
    $allUsers && $allUsers.filter((user) => {
      return (
        user.name.toUpperCase().includes($keyword) ||
        user.name.toLowerCase().includes($keyword)
      );
    });

  $: if ($page.url.pathname === "/login") $showSettingsModal = false;
</script>

{#if $privateChat}
  <div class="chatlist" transition:fade={{ duration: 100 }}>
    {#if $allUsers && $allUsers.length}
      {#each filteredUsers as user}
        <User {user} />
      {/each}
    {:else}
      <div class="loading">
        <Skeleton />
      </div>
    {/if}
  </div>
{/if}

{#if $groupChat}
  <div class="group">
    <h1>Group Chat</h1>
  </div>
{/if}

{#if $publicChat}
  <div class="public">
    <h1>Public Chatroom</h1>
  </div>
{/if}

<style>
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
