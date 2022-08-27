<script>
  import { bgColor, background, bgOpacity, imageURL } from "$lib/store";
  import { onMount } from "svelte";
  import themeStore from "svelte-themes";
</script>

<svelte:head>
  <title>Home</title>
</svelte:head>

<div
  class="home-page"
  style:background={$themeStore.theme === "dark"
    ? "#292F3F"
    : "rgba(235, 235, 235, .5)"}
>
  <div class="content">
    <div class="icon-wrapper">

      <svg
        xmlns="http://www.w3.org/2000/svg"
        class="ionicon icon-indicator"
        viewBox="0 0 512 512"
        width="30"
        height="30"
        fill="currentColor"
      >
        <path
          d="M240 424v-96c116.4 0 159.39 33.76 208 96 0-119.23-39.57-240-208-240V88L64 256z"
          fill="none"
          stroke="currentColor"
          stroke-linejoin="round"
          stroke-width="32"
        />
      </svg>
    </div>
    <p>Please select a contact to start a conversation</p>  
  </div>
</div>

<style>
  .icon-indicator {
    margin-right: 10px;
  }

  .content {
    display: flex;
    align-items: center;
    justify-content: center;
    width: 100%;
    padding: 0 20px;
  }

  .home-page {
    display: flex;
    align-items: center;
    justify-content: center;
    backdrop-filter: blur(20px);
    height: calc(100vh - 20px);
    border-radius: 8px;
    margin: 10px 0;
  }
</style>
