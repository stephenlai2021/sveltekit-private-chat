<script>
  import { bgColor } from "$lib/store";
</script>

<svelte:head>
  <title>Home</title>
</svelte:head>

<div class="home">
  <!-- <h1>Letschat</h1> -->
  <!-- <p>Connect friends together</p> --> 
  <div class="image-wrapper">    
    <img src="/whatsapp_cover.png" alt="">
  </div>
</div>

<style>
  h1,
  p {
    color: rgb(43, 32, 32);
  }

  .home {
    height: 100vh;
    /* display: flex;
    justify-content: center;
    align-items: center;
    flex-direction: column; */
    background: rgb(248, 248, 248);
  }

  .image-wrapper {
    width: 100%;
    height: 100vh;
  }

  .image-wrapper img {
    object-fit: cover;
    opacity: 1;
  }
</style>
