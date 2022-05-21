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

<div class="map-modal" transition:fly={{ y: 100, duration: 100, delay: 100 }}>
  <ion-icon
    name="close-outline"
    class="icon-close"
    on:click={() => ($showMapModal = false)}
  />
  <div id="map" />
</div>

<style>
  @import "https://unpkg.com/leaflet@1.7.1/dist/leaflet.css";

  #map {
    width: 100%;
    height: 100vh;

    /* width: 1280px;
    height: 768px; */

    /* border: 1px solid; */
  }

  .icon-close {
    position: fixed;
    top: 15px;
    left: 50%;
    z-index: 700;
    transform: translateX(-50%);
    border-radius: 50%;
    background: rgb(156, 160, 131);
    /* border: 1px solid; */
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
    backdrop-filter: blur(50px);
    background: rgba(229, 221, 222, 0.5);
  }
</style>
