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
    <!-- {#if $widthLessthan1200}
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
        <div class="icon-plus loading-animation" style:margin-right="5px"/>
      {/if}
    {/if} -->
    <img
      src="https://miro.medium.com/max/1400/1*gr3kgm0McAm1eeJJog7jfg.png"
      height="30"
      alt=""
    />
  </div>

  <ul class="nav_icons">
    {#if $allUsers && $allUsers.length}
      <li class="icon-add-wrapper" on:click|stopPropagation={showModal}>
        <svg
          xmlns="http://www.w3.org/2000/svg"
          class="ionicon"
          viewBox="0 0 512 512"
          width="24"
          height="24"
          fill="currentColor"
          on:click|stopPropagation={showModal}
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
      <div class="icon-plus loading-animation" />
    {/if}
  </ul>

  {#if $allUsers && $allUsers.length}
  <div class="icon-add-wrapper">
    <svg
      xmlns="http://www.w3.org/2000/svg"
      class="ionicon icon-add"
      viewBox="0 0 512 512"
      width="24"
      height="24"
      fill="currentColor"
      on:click|stopPropagation={showModal}
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
  </div>
  {:else}
  <div class="icon-add-wrapper-animation loading-animation" />
  {/if}
</div>

<style>
  .icon-add {
    color: white;
  }

  .icon-add-wrapper-animation {
    position: absolute;
    bottom: 80px;
    right: 20px;
    width: 50px;
    height: 50px;
    border-radius: 50px;
  }

  .icon-add-wrapper {
    position: absolute;
    bottom: 80px;
    right: 20px;
    width: 50px;
    height: 50px;
    border-radius: 50px;
    background: rgb(78, 170, 78);
    background: var(--theme-color);
    background: linear-gradient(90deg, #d53369 0%, #daae51 100%);
    /* background: linear-gradient(90deg, #00d2ff 0%, #3a47d5 100%); */
    /* background: linear-gradient(90deg, #FDBB2D 0%, #22C1C3 100%); */
    /* background: linear-gradient(90deg, #9ebd13 0%, #008552 100%); */
    display: flex;
    align-items: center;
    justify-content: center;
  }

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
