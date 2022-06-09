<script>
  import { fade, blur, fly, slide, scale } from "svelte/transition";
  import { quintOut } from "svelte/easing";
  import {
    storedImageURL,
    storedPictureURL,
    showImagePreviewModal,
  } from "$lib/store";
  import themeStore from "svelte-themes";
</script>

<div
  class="image-preview-modal"
  transition:scale={{ delay: 150, duration: 200, easing: quintOut }}
  style:background={$themeStore.theme === "dark" ? `#292F3F url('/image-icon/png') no-repeat center` : "#ebebeb"}
  >
  <!-- transition:scale={{ delay: 250, duration: 300, easing: quintOut }} -->
  <svg
    xmlns="http://www.w3.org/2000/svg"
    class="ionicon icon-close"
    viewBox="0 0 512 512"
    width="30"
    height="30"
    fill="currentColor"
    style:color={$themeStore.theme === "dark" ? "white" : "#292F3F"}
    on:click={() => ($showImagePreviewModal = false)}
  >
    <path
      fill="none"
      stroke="currentColor"
      stroke-linecap="round"
      stroke-linejoin="round"
      stroke-width="32"
      d="M368 368L144 144M368 144L144 368"
    />
  </svg>

  {#if $storedImageURL || $storedPictureURL}
    <img
      src={$storedImageURL ? $storedImageURL : $storedPictureURL}
      alt=""
    />
  {/if}

  {#if !$storedImageURL || !$storedPictureURL}
    <svg
      xmlns="http://www.w3.org/2000/svg"
      class="ionicon icon-image"
      viewBox="0 0 512 512"
      width="50"
      height="50"
      fill="currentColor"
      style:display={$storedImageURL || $storedPictureURL ? "none" : "none"}
      >
      <rect
        x="48"
        y="80"
        width="416"
        height="352"
        rx="48"
        ry="48"
        fill="none"
        stroke="currentColor"
        stroke-linejoin="round"
        stroke-width="32"
      /><circle
        cx="336"
        cy="176"
        r="32"
        fill="none"
        stroke="currentColor"
        stroke-miterlimit="10"
        stroke-width="32"
      /><path
        d="M304 335.79l-90.66-90.49a32 32 0 00-43.87-1.3L48 352M224 432l123.34-123.34a32 32 0 0143.11-2L464 368"
        fill="none"
        stroke="currentColor"
        stroke-linecap="round"
        stroke-linejoin="round"
        stroke-width="32"
      />
    </svg>
  {/if}
</div>

<style>
  img {
    max-height: 100vh;
  }

  .icon-close {
    position: absolute;
    top: 5px;
    right: 5px;
    color: white;
  }

  .image-preview-modal {
    display: flex;
    align-items: center;
    justify-content: center;
    position: absolute;
    top: 0;
    left: 0;
    width: 100%;
    height: 100vh;
    z-index: 600;
    background-size: 260px 195px;
  }
</style>
