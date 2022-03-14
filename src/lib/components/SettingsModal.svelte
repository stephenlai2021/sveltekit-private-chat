<script>
  import {
    bgColor,
    setBgColor,
    showThemeModal,
    showSettingsModal,
  } from "$lib/store";
  import themeStore, { setTheme } from "svelte-themes";
  import { onMount } from "svelte";
  import { signout } from "$lib/functions/auth/signout";
  import { fly } from "svelte/transition";

  export let user;
  console.log("user | settings modal", user);

  let theme = true;

  const toggleTheme = () => {
    theme = !theme;
    if (theme) setTheme("dark");
    if (!theme) setTheme("light");
  };

  onMount(() => {
    if ($themeStore.theme === "light") theme = false;
    if ($themeStore.theme === "dark") theme = true;
  });
</script>

<ul
  class="menu-settings"
  on:click|stopPropagation={() => console.log("hi, there !")}
  transition:fly={{ x: -60, duration: 100, delay: 100 }}
>
  <div class="icon-arrow">
    <ion-icon
      name="arrow-back-outline"
      on:click|stopPropagation={() => ($showSettingsModal = false)}
    />
  </div>
  <div class="user-profile">
    <div class="avatar-wrapper">
      <img src={user.photoURL} alt="" />
    </div>
    <h3>
      {user.displayName}
    </h3>
    <p>{user.email}</p>
  </div>
  <li class="theme" on:click={toggleTheme}>
    <div class="content">
      {#if $themeStore.theme === "light"}
        <ion-icon name="moon-outline" />
        <span class="menu-item">黑暗模式</span>
      {:else}
        <ion-icon name="sunny-outline" />
        <span class="menu-item">明亮模式</span>
      {/if}
    </div>
  </li>
  <li>
    <div class="content">
      <label>
        <input
          type="color"
          bind:value={$bgColor}
          on:input|stopPropagation={() => setBgColor($bgColor)}
          style:height="0"
          style:width="0"
          style:opacity="0"
        />
        <ion-icon name="color-palette-outline" class="icon-palette" />
        <span class="menu-item bg-color" style:margin-left="5px">背景顏色</span>
      </label>
    </div>
  </li>
  <li>
    <div class="content">
      <ion-icon name="image-outline" />
      <span
        class="menu-item"
        on:click|stopPropagation={() => ($showThemeModal = true)}>特色主題</span
      >
    </div>
  </li>
  <li>
    <div class="content">
      <ion-icon name="information-circle-outline" />
      <div class="title-wrapper">
        <span class="menu-item">關於</span>
      </div>
    </div>
  </li>
  <li on:click={signout}>
    <div class="content">
      <ion-icon name="log-out-outline" />
      <div class="title-wrapper">
        <span class="menu-item">登出</span>
      </div>
    </div>
  </li>
</ul>

<style>
  h3, p {
    text-align: center;
  }

  .user-profile .avatar-wrapper {
    display: flex;
    justify-content: center;
    align-items: center;
    margin-bottom: 15px;
    /* border: 1px solid; */
  }
  
  .user-profile {
    margin-bottom: 30px;
    /* border-bottom: 1px solid; */
  }

  .title-wrapper {
    width: 100%;
    text-align: center;
    /* border: 1px solid red; */
  }

  .content {
    display: flex;
    align-items: center;
    justify-content: space-between;
    min-width: 96px;
    /* border: 1px solid; */
  }

  .icon-arrow span {
    cursor: pointer;
  }

  .icon-arrow {
    display: flex;
    align-items: center;
    padding: 5px;
    padding-top: 10px;
    display: flex;
    justify-content: flex-start;
    /* border: 1px solid; */
  }

  .icon-palette {
    margin-left: -3px;
    margin-right: 3px;
  }

  label {
    display: flex;
    align-items: center;
  }

  span {
    color: white;
  }

  span.material-icons {
    margin-right: 10px;
    font-size: 18px;
    border: 1px solid;
  }

  span.menu-item {
    cursor: pointer;
  }

  ul {
    list-style: none;
    padding: 10px;
    position: absolute;
    top: 0;
    left: 0;
    width: 100%;
    height: 100vh;
    z-index: 200;
    background: rgba(189, 202, 202, 0.5);
    backdrop-filter: blur(30px);
  }

  li {
    display: flex;
    align-items: baseline;
    justify-content: center;
    padding: 10px 20px;
    cursor: pointer;
    /* border: 1px solid; */
  }
</style>
