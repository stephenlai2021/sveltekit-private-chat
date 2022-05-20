<script>
  import { showMapModal } from "$lib/store"
  import { fly, fade } from "svelte/transition";
</script>

<div class="map-modal" transition:fly={{ y: 100, duration: 100, delay: 100 }}>
  <ion-icon name="close-outline" class="icon-close" on:click={() => $showMapModal = false} />
  <div id="map"></div>
</div>

<style>
  #map {
    width: 800px;
    height: 600px;
    border: 1px solid;
    /* position: fixed; */
  }

  .icon-close {
    position: fixed;
    top: 15px;
    right: 50%;
    transform: translateX(-50%);    
  }

  .map-modal {
    display: flex;
    justify-content: center;
    align-items: center;
    position: fixed;
    top: 0;
    left: 0;
    width: 100%;
    height: 100vh;
    z-index: 600;
    backdrop-filter: blur(30px);
    background: rgba(229, 221, 222, 0.5);
  }
</style>
