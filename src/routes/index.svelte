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
  <svg
    xmlns="http://www.w3.org/2000/svg"
    class="ionicon"
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
  <span> Please select a contact to start a conversation </span>
  
</div>

<style>
  .home-page {
    display: flex;
    /* flex-direction: column; */
    align-items: center;
    justify-content: center;
    backdrop-filter: blur(20px);
    height: calc(100vh - 10px);
    border-radius: 8px;
    margin: 5px 0;
  }
</style>
