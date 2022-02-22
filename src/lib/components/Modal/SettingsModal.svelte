<script>
  import { connection, showModal, showSettingsModal } from "$lib/store";
  import themeStore, { setTheme } from "svelte-themes";
  import { onMount } from "svelte";
  import { auth } from "$lib/firebase/client";
  import { signOut } from "firebase/auth";
  import { fly } from "svelte/transition";

  let theme = true;

  const toggleTheme = () => {
    theme = !theme;
    if (theme) setTheme("dark");
    if (!theme) setTheme("light");
  };

  const handleSignout = () => {
    signOut(auth).then(() => {
      logout = true;
    });
  };

  onMount(() => {
    if ($themeStore.theme === "light") theme = false;
    if ($themeStore.theme === "dark") theme = true;
  });
</script>

<ul
  class="menu-settings"
  in:fly={{ y: -20, x: 20, duration: 100, delay: 100 }}
  out:fly={{ y: -20, x: 20, duration: 100, delay: 100 }}
  on:click|stopPropagation={() => console.log('hi, there !')}
>
  <li>
    {#if $connection}
      <span class="material-icons">wifi</span>
      <span>連線成功</span>
    {:else}
      <span class="material-icons">wifi_off</span>
      <span>連線失敗</span>
    {/if}
  </li>
  <!-- <li on:click={() => ($showModal = !$showModal)}>
    <span class="material-icons">person_add_alt</span>
    <span class="menu-item">新增朋友</span>
  </li> -->
  <li class="theme" on:click={toggleTheme}>
    {#if $themeStore.theme === "light"}
      <span class="material-icons">dark_mode</span>
      <span class="menu-item">黑暗模式</span>
    {:else}
      <span class="material-icons">light_mode</span>
      <span class="menu-item">明亮模式</span>
    {/if}
  </li>
  <li on:click={handleSignout}>
    <span class="material-icons">logout</span>
    <span class="menu-item">登出</span>
  </li>
</ul>

<style>
  span.material-icons {
    margin-right: 10px;
    font-size: 18px;
  }

  span.menu-item {
    cursor: pointer;
  }

  ul {
    list-style: none;
    padding: 10px;
    position: absolute;
    right: 30px;
    top: 50px;
    z-index: 200;
    background: white;
    border-radius: 8px;
    box-shadow: 2px 2px 2px var(--text-color);
    min-width: 136px;
  }

  li {
    display: flex;
    align-items: center;
    padding: 5px 10px;
    /* display: flex;
    justify-content: center; */
    /* border: 1px solid; */
  }
</style>
