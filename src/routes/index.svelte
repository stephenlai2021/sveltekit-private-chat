<script>
  import { bgColor, background, bgOpacity, imageURL } from "$lib/store";
  import { onMount } from 'svelte'

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

<div class="page-wrapper">
  <h1>This is All Chat</h1>
</div>
