<script>
  import { bgColor, background, bgOpacity, imageURL } from "$lib/store";
  import { onMount } from "svelte";
  import themeStore from "svelte-themes";
</script>

<svelte:head>
  <title>Chat room</title>
</svelte:head>

<div
  class="home-page"
  style:background={$themeStore.theme === "dark"
    ? "#292F3F"
    : "rgba(235, 235, 235, .5)"}
>
  <h1>Chatroom</h1>
  <span class="description">Anyone can join to chat 🥰</span>
</div>

<style>
  .description {
    margin-top: 10px;
  }
  
  .home-page {
    height: 100vh;
    display: flex;
    flex-direction: column;
    align-items: center;
    justify-content: center;
    backdrop-filter: blur(20px);
  }
</style>
