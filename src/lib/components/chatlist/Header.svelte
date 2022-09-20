<script>
  import themeStore from "svelte-themes";
  import {
    mobile,
    bgColor,
    showSidebarMenu,
    loggedinUser,
    showSettingsModal,
    showAddFriendModal,
    showAddGroupModal,
    showAddRoomModal,
    // showSearchFriendModal,
    widthLessthan1200,
    showSettingsModalMobile,
    privateChat,
    groupChat,
    publicChat,
    allUsers,
  } from "$lib/store";

  const showModal = () => {
    if ($privateChat) $showAddFriendModal = true;
    if ($groupChat) $showAddGroupModal = true;
    if ($publicChat) $showAddRoomModal = true;
  };
</script>

<div class="header">
  <div class="left" style:cursor="pointer">
    {#if $widthLessthan1200}
      {#if $allUsers && $allUsers.length}
        <svg
          xmlns="http://www.w3.org/2000/svg"
          class="ionicon"
          viewBox="0 0 512 512"
          width="24"
          height="24"
          fill="currentColor"
          style:margin-right="5px"
          on:click|stopPropagation={() => ($showSettingsModalMobile = true)}
        >
          <path
            fill="none"
            stroke="currentColor"
            stroke-linecap="round"
            stroke-miterlimit="10"
            stroke-width="32"
            d="M80 160h352M80 256h352M80 352h352"
          />
        </svg>
      {:else}
        <div class="icon-plus animation" />
      {/if}
    {/if}
    <img
      src="https://miro.medium.com/max/1400/1*gr3kgm0McAm1eeJJog7jfg.png"
      height="30"
      alt=""
    />
  </div>

  <ul class="nav_icons">
    {#if $allUsers && $allUsers.length}
      <li on:click|stopPropagation={showModal}>
        <svg
          xmlns="http://www.w3.org/2000/svg"
          class="ionicon"
          viewBox="0 0 512 512"
          width="24"
          height="24"
          fill="currentColor"
        >
          <path
            fill="none"
            stroke="currentColor"
            stroke-linecap="round"
            stroke-linejoin="round"
            stroke-width="32"
            d="M256 112v288M400 256H112"
          />
        </svg>
      </li>
    {:else}
      <div class="icon-plus animation" />
    {/if}
  </ul>
</div>

<style>
  .icon-plus {
    width: 24px;
    height: 24px;
    border-radius: 50px;
  }

  .header {
    display: flex;
    justify-content: space-between;
    align-items: center;
    width: 100%;
    height: 60px;
    padding: 0 10px;
  }

  .left {
    display: flex;
    align-items: center;
  }

  .nav_icons {
    cursor: pointer;
    display: flex;
  }

  .nav_icons li {
    list-style: none;
    margin-left: 20px;
    display: flex;
    align-items: center;
  }

  @media (max-width: 800px) {
    .header {
      padding: 0 12px;
    }
  }
</style>
