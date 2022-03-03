<script>
  import { bgColor, setBgColor } from "$lib/store";
  import themeStore, { setTheme } from "svelte-themes";
  import { onMount } from "svelte";
  import { signout } from "$lib/functions/auth/signout";
  import { fly } from "svelte/transition";

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
  style:background={$bgColor}
  on:click|stopPropagation={() => console.log("hi, there !")}
  transition:fly={{ x: -70, duration: 200, delay: 200 }}
>
  <li class="theme" on:click={toggleTheme}>
    {#if $themeStore.theme === "light"}
      <span class="material-icons">dark_mode</span>
      <span class="menu-item">黑暗模式</span>
    {:else}
      <span class="material-icons">light_mode</span>
      <span class="menu-item">明亮模式</span>
    {/if}
  </li>
  <li>
    <label>
      <!-- on:input={() => setBgColor($bgColor)} -->
      <input
        type="color"
        bind:value={$bgColor}
        style:height="0"
        style:width="0"
        style:opacity="0"
      />
      <span class="material-icons icon-palette" style:cursor="pointer"
        >palette</span
      >
      <span class="menu-item">主題</span>
    </label>
  </li>
  <li on:click={signout}>
    <span class="material-icons">logout</span>
    <span class="menu-item">登出</span>
  </li>
</ul>

<style>
  .icon-palette {
    margin-left: -3px;
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
    width: 333px;
    height: 100vh;
    z-index: 200;
    background: rgb(189, 202, 202);
  }

  li {
    display: flex;
    align-items: center;
    padding: 10px 20px;
    cursor: pointer;
  }
</style>
