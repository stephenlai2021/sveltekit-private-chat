<script>
  import {
    mobile,
    bgColor,
    showThemeModal,
    showSettingsModal,
  } from "$lib/store";
  import themeStore, { setTheme } from "svelte-themes";
  import { onMount } from "svelte";
  import { signout } from "$lib/functions/auth/signout";
  import { fly } from "svelte/transition";
  import Cookies from "js-cookie";
  import { page } from "$app/stores";

  export let user;
  // console.log("user | settings modal", user);

  let theme = true;

  const toggleTheme = () => {
    theme = !theme;
    if (theme) setTheme("dark");
    if (!theme) setTheme("light");
  };

  const logout = () => {
    $showSettingsModal = false;
    signout();
  };

  onMount(() => {
    if ($themeStore.theme === "light") theme = false;
    if ($themeStore.theme === "dark") theme = true;
  });
</script>

<ul
  class="menu-settings"
  on:click|stopPropagation={() => console.log("settings modal clicked !")}
  transition:fly={{ x: -60, duration: 100, delay: 100 }}
>
  <div class="icon-arrow">
    <ion-icon
      name="arrow-back-outline"
      on:click|stopPropagation={() => ($showSettingsModal = false)}
    />
  </div>
  <div class="body-scroll" style:overflow-y={!$mobile ? "hidden" : "auto"}>
    <div class="user-profile">
      <div class="avatar-section">
        <div class="image-wrapper">
          {#if user.photoURL}
            <img src={user.photoURL} alt="" />
          {:else}
            <img src="/joke.png" alt="" width="96" height="96" />
          {/if}
          <ion-icon name="camera-outline" class="icon-camera" />
        </div>
      </div>
      <h3>
        {user.displayName}
      </h3>
      <p>{user.email}</p>
    </div>
    <li>
      <div class="content">
        <ion-icon name="language-outline" />
        <div class="title-wrapper">
          <span class="menu-item">Lang</span>
        </div>
      </div>
    </li>
    <li class="theme" on:click={toggleTheme}>
      <div class="content">
        {#if $themeStore.theme === "light"}
          <ion-icon name="moon-outline" />
          <div class="title-wrapper">
            <span class="menu-item">Dark</span>
          </div>
        {:else}
          <ion-icon name="sunny-outline" />
          <div class="title-wrapper">
            <span class="menu-item">Light</span>
          </div>
        {/if}
      </div>
    </li>
    {#if !$mobile && $page.url.pathname != "/"}
      <li>
        <div class="content">
          <label>
            <input
              type="color"
              bind:value={$bgColor}
              on:input|stopPropagation={() => Cookies.set("bgColor", $bgColor)}
              style:height="0"
              style:width="0"
              style:opacity="0"
            />
            <ion-icon name="color-palette-outline" class="icon-palette" />
            <div class="title-wrapper" style:cursor="pointer">
              <span class="menu-item">Color</span>
            </div>
          </label>
        </div>
      </li>
      <li>
        <div class="content">
          <ion-icon name="image-outline" />
          <div class="title-wrapper">
            <span
              class="menu-item"
              on:click|stopPropagation={() => ($showThemeModal = true)}
              >Theme</span
            >
          </div>
        </div>
      </li>
    {/if}
    <li>
      <div class="content">
        <ion-icon name="information-circle-outline" />
        <div class="title-wrapper">
          <span class="menu-item">About</span>
        </div>
      </div>
    </li>
    <li on:click={logout}>
      <div class="content">
        <ion-icon name="log-out-outline" />
        <div class="title-wrapper">
          <span class="menu-item">Logout</span>
        </div>
      </div>
    </li>
  </div>
</ul>

<style>
  .icon-camera {
    width: 28px;
    height: 28px;
    position: absolute;
    right: 0;
    bottom: 0;
  }

  .image-wrapper {
    position: relative;
  }

  .body-scroll {
    height: 80vh;
  }

  h3,
  p {
    text-align: center;
  }

  .user-profile .avatar-section {
    justify-content: center;
    align-items: center;
    margin-bottom: 15px;
    display: flex;
    /* border: 1px solid; */
  }

  .user-profile {
    margin-bottom: 30px;
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
    width: 100px;
    cursor: pointer;
    /* border: 1px solid; */
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
    width: 100px;
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
    /* cursor: pointer; */
  }
</style>
