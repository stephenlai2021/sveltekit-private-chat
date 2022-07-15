<script>
  import { showMapModal } from "$lib/store";
  import { fly, fade } from "svelte/transition";
  import { onMount } from "svelte";

  onMount(async () => {
    const leaflet = await import("leaflet");

    const map = leaflet.map("map").setView([51.505, -0.09], 13);

    leaflet
      .tileLayer("https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png", {
        attribution:
          '&copy; <a href="https://www.openstreetmap.org/copyright">OpenStreetMap</a> contributors',
      })
      .addTo(map);

    leaflet
      .marker([51.5, -0.09])
      .addTo(map)
      .bindPopup("A pretty CSS3 popup.<br> Easily customizable.")
      .openPopup();
  });
</script>

<div 
  class="map-modal" 
  transition:fly={{ y: 100, duration: 100, delay: 100 }}  
>
  <svg 
    xmlns="http://www.w3.org/2000/svg" 
    class="ionicon icon-close" 
    viewBox="0 0 512 512"
    width="30"
    height="30"
    fill="currentColor"
    on:click={() => ($showMapModal = false)}
    >
    <path
      d="M448 256c0-106-86-192-192-192S64 150 64 256s86 192 192 192 192-86 192-192z"
      fill="none"
      stroke="currentColor"
      stroke-miterlimit="10"
      stroke-width="32"
    />
    <path
      fill="none"
      stroke="currentColor"
      stroke-linecap="round"
      stroke-linejoin="round"
      stroke-width="32"
      d="M320 320L192 192M192 320l128-128"
    />
  </svg>
  <div id="map" />
</div>

<style>
  @import "https://unpkg.com/leaflet@1.7.1/dist/leaflet.css";

  #map {
    width: 100%;
    /* width: 1920px; */
    height: 100vh;
  }

  .icon-close {
    position: fixed;
    top: 15px;
    left: 50%;
    z-index: 700;
    transform: translateX(-50%);
  }

  .map-modal {
    position: fixed;
    top: 0;
    left: 50%;
    transform: translateX(-50%);
    width: 100%;
    max-width: 1920px;
    height: 100vh;
    z-index: 300;
  }
</style>
