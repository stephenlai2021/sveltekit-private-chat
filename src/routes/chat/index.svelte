<script>
  import { bgColor, background, bgOpacity, imageURL } from "$lib/store";
  import { onMount } from "svelte";
  import themeStore from "svelte-themes";

  // onMount(() => {
  //   if ($imageURL) {
  //     $background.src = $imageURL
  //     $bgOpacity = 0.6;
  //   }
  //   if (!$imageURL) {
  //     $background.src = '/whatsapp_cover.png'
  //     $bgOpacity = 0.06;
  //     $bgColor = "#e5ddd5";
  //   }
  // })
</script>

<svelte:head>
  <title>Home</title>
</svelte:head>

<!-- <div class="home">
  <div class="image-wrapper">    
    <img src="/whatsapp_cover.png" alt="">
  </div>
</div> -->

<!-- <div class="page-wrapper">
  <h1>This is All Chat</h1>
</div> -->

<div
  class="home-page"
  style:background={$themeStore.theme === "dark"
    ? "#292F3F"
    : "rgba(235, 235, 235, .5)"}
>
  <h1>One on one chat</h1>
  <span class="description">The most private chat environment 😍</span>
</div>

<style>
  .description {
    margin-top: 10px;
  }

  .home-page {
    height: 100vh;
    display: flex;
    align-items: center;
    flex-direction: column;
    justify-content: center;
    backdrop-filter: blur(20px);
  }
</style>
