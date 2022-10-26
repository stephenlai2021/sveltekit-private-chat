<script>
  import {
    showMapModal,
    latitude,
    longitude,
    myDoc,
    currentSelectedUser,
  } from "$lib/store";
  import { fly, fade } from "svelte/transition";
  import { onMount } from "svelte";
  import { t } from "$lib/i18n";
  import { db } from "$lib/firebase/client";
  import { doc, getDoc } from "firebase/firestore";

  let iconClose = false;
  let tempLocation = [];

  onMount(async () => {
    const myRef = doc(db, "users", $myDoc.name);
    const mySnap = await getDoc(myRef);
    const myGeoLocation = mySnap.data().geoLocation;
    console.log(`${$myDoc.name}'s geoLocation: ${myGeoLocation}`);

    const userRef = doc(db, "users", $currentSelectedUser.name);
    const userSnap = await getDoc(userRef);
    const userGeoLocation = userSnap.data().geoLocation;
    console.log(
      `${$currentSelectedUser.name}'s geoLocation: ${userGeoLocation}`
    );

    const leaflet = await import("leaflet");

    const map = leaflet.map("map").setView([$latitude, $longitude], 3);
    // const map = leaflet.map("map").setView([myGeoLocation[0], myGeoLocation[1]], 3);

    leaflet
      .tileLayer("https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png", {
        attribution:
          '&copy; <a href="https://www.openstreetmap.org/copyright">OpenStreetMap</a> contributors',
      })
      .addTo(map);

    leaflet
      .marker([myGeoLocation[0], myGeoLocation[1]])
      .addTo(map)
      .bindPopup(`${$t("menu.hi")}, ${$myDoc.name}`)
      .openPopup();

    leaflet
      .marker([userGeoLocation[0], userGeoLocation[1]])
      .addTo(map)
      .bindPopup(`${$currentSelectedUser.name} ${$t("menu.isHere")}`)
      .openPopup();

    // for (var i = 0; i < tempLocation.length; i++) {
    //   marker = new L.marker([tempLocation[i][0], tempLocation[i][1]])
    //     .bindPopup(tempLocation[i][0])
    //     .addTo(map)
    //     .openPopup();
    // }

    iconClose = true;
  });
</script>

<div class="map-modal" transition:fly={{ y: 100, duration: 100, delay: 100 }}>
  {#if iconClose}
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
  {/if}
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
