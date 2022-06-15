<script>
  import themeStore from "svelte-themes";
  import {
    bgColor,
    showSidebarMenu,
    loggedinUser,
    showSettingsModal,
    showAddFriendModal,
  } from "$lib/store";
</script>

<div class="header">
  <div class="left" style:cursor="pointer">
    {#if !$showSidebarMenu}
      <svg
        xmlns="http://www.w3.org/2000/svg"
        class="ionicon"
        viewBox="0 0 512 512"
        width="24"
        height="24"
        fill="currentColor"
        style:margin-right="5px"
        on:click={() => ($showSidebarMenu = true)}
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
    {/if}
    {#if $loggedinUser}
      <div
        class="userimg"
        on:click|stopPropagation={() =>
          ($showSettingsModal = !$showSettingsModal)}
      >
        {#if $loggedinUser.photoURL}
          <img src={$loggedinUser.photoURL} alt="" class="cover" />
        {:else}
          <img src="/joke.png" alt="" class="cover" />
        {/if}
      </div>
    {/if}
    <h3 class="user-title">LetsChat</h3>
  </div>

  <ul class="nav_icons">
    <li
      on:click|stopPropagation={() =>
        ($showAddFriendModal = !$showAddFriendModal)}
    >
      <svg
        xmlns="http://www.w3.org/2000/svg"
        class="ionicon"
        viewBox="0 0 512 512"
        width="24"
        height="24"
        fill="currentColor"
      >
        <path
          d="M376 144c-3.92 52.87-44 96-88 96s-84.15-43.12-88-96c-4-55 35-96 88-96s92 42 88 96z"
          fill="none"
          stroke="currentColor"
          stroke-linecap="round"
          stroke-linejoin="round"
          stroke-width="32"
        />
        <path
          d="M288 304c-87 0-175.3 48-191.64 138.6-2 10.92 4.21 21.4 15.65 21.4H464c11.44 0 17.62-10.48 15.65-21.4C463.3 352 375 304 288 304z"
          fill="none"
          stroke="currentColor"
          stroke-miterlimit="10"
          stroke-width="32"
        />
        <path
          fill="none"
          stroke="currentColor"
          stroke-linecap="round"
          stroke-linejoin="round"
          stroke-width="32"
          d="M88 176v112M144 232H32"
        />
      </svg>
    </li>
  </ul>
</div>

<style>
  .header {
    display: flex;
    justify-content: space-between;
    align-items: center;
    width: 100%;
    height: 60px;
    /* padding: 0 15px; */
    /* border: 1px solid; */
  }

  .left {
    display: flex;
    align-items: center;
  }

  .userimg {
    width: 35px;
    height: 35px;
    overflow: hidden;
    display: flex;
    align-items: center;
    position: relative;
    cursor: pointer;
    margin-right: 5px;
    /* border: 1px solid; */
  }

  .userimg img {
    width: 35px;
    height: 35px;
    border-radius: 50%;
    object-fit: cover;
    overflow: hidden;
  }

  .user-title {
    margin-left: 5px;
    /* font-family: "Roboto", sans-serif; */
    font-weight: 600;
    font-size: 20px;
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
