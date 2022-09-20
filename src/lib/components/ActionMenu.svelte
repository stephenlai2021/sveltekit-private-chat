<script>
  import { showActionMenu, showAudioRecordingModal } from "$lib/store";
  import { fly } from "svelte/transition";
</script>

<div class="action-menu" transition:fly={{ y: 0, duration: 100, delay: 100 }}>
  <div class="icon-arrow">
    <svg
      xmlns="http://www.w3.org/2000/svg"
      class="ionicon"
      viewBox="0 0 512 512"
      width="20"
      height="20"
      fill="currentColor"
      on:click={() => ($showActionMenu = false)}
    >
      <path
        d="M256 64C150 64 64 150 64 256s86 192 192 192 192-86 192-192S362 64 256 64z"
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
        d="M352 216l-96 96-96-96"
      />
    </svg>
    <!-- <svg
      xmlns="http://www.w3.org/2000/svg"
      class="ionicon"
      viewBox="0 0 512 512"
      width="20"
      height="20"
      fill="currentColor"
      on:click={() => ($showActionMenu = false)}
    >
      <path
        fill="none"
        stroke="currentColor"
        stroke-linecap="round"
        stroke-linejoin="round"
        stroke-width="48"
        d="M112 184l144 144 144-144"
      />
    </svg> -->
  </div>

  <div class="icon-menu">
    <svg
      xmlns="http://www.w3.org/2000/svg"
      class="ionicon icon-image"
      viewBox="0 0 512 512"
      width="35"
      height="35"
      fill="currentColor"
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
      />
      <circle
        cx="336"
        cy="176"
        r="32"
        fill="none"
        stroke="currentColor"
        stroke-miterlimit="10"
        stroke-width="32"
      />
      <path
        d="M304 335.79l-90.66-90.49a32 32 0 00-43.87-1.3L48 352M224 432l123.34-123.34a32 32 0 0143.11-2L464 368"
        fill="none"
        stroke="currentColor"
        stroke-linecap="round"
        stroke-linejoin="round"
        stroke-width="32"
      />
    </svg>
    <span>Image</span>
  </div>

  <div class="icon-menu">
    <svg
      xmlns="http://www.w3.org/2000/svg"
      class="ionicon icon-camera"
      viewBox="0 0 512 512"
      width="35"
      height="35"
      fill="currentColor"
    >
      <path
        d="M350.54 148.68l-26.62-42.06C318.31 100.08 310.62 96 302 96h-92c-8.62 0-16.31 4.08-21.92 10.62l-26.62 42.06C155.85 155.23 148.62 160 140 160H80a32 32 0 00-32 32v192a32 32 0 0032 32h352a32 32 0 0032-32V192a32 32 0 00-32-32h-59c-8.65 0-16.85-4.77-22.46-11.32z"
        fill="none"
        stroke="currentColor"
        stroke-linecap="round"
        stroke-linejoin="round"
        stroke-width="32"
      />
      <circle
        cx="256"
        cy="272"
        r="80"
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
        d="M124 158v-22h-24v22"
      />
    </svg>
    <span>Snap</span>
  </div>

  <div class="icon-menu">
    <svg
      xmlns="http://www.w3.org/2000/svg"
      class="ionicon icon-location"
      viewBox="0 0 512 512"
      width="35"
      height="35"
      fill="currentColor"
    >
      <path
        d="M256 48c-79.5 0-144 61.39-144 137 0 87 96 224.87 131.25 272.49a15.77 15.77 0 0025.5 0C304 409.89 400 272.07 400 185c0-75.61-64.5-137-144-137z"
        fill="none"
        stroke="currentColor"
        stroke-linecap="round"
        stroke-linejoin="round"
        stroke-width="32"
      />
      <circle
        cx="256"
        cy="192"
        r="48"
        fill="none"
        stroke="currentColor"
        stroke-linecap="round"
        stroke-linejoin="round"
        stroke-width="32"
      />
    </svg>
    <span>Geo</span>
  </div>

  <div class="icon-menu">
    <svg
      xmlns="http://www.w3.org/2000/svg"
      class="ionicon"
      viewBox="0 0 512 512"
      width="35"
      height="35"
      fill="currentColor"
      on:click={() => ($showAudioRecordingModal = true)}
    >
      <path
        fill="none"
        stroke="currentColor"
        stroke-linecap="round"
        stroke-linejoin="round"
        stroke-width="32"
        d="M192 448h128M384 208v32c0 70.4-57.6 128-128 128h0c-70.4 0-128-57.6-128-128v-32M256 368v80"
      />
      <path
        d="M256 64a63.68 63.68 0 00-64 64v111c0 35.2 29 65 64 65s64-29 64-65V128c0-36-28-64-64-64z"
        fill="none"
        stroke="currentColor"
        stroke-linecap="round"
        stroke-linejoin="round"
        stroke-width="32"
      />
    </svg>
    <span>Voice</span>
  </div>

  <div class="icon-menu">
    <svg
      xmlns="http://www.w3.org/2000/svg"
      class="ionicon"
      viewBox="0 0 512 512"
      width="35"
      height="35"
      fill="currentColor"
    >
      <path
        d="M374.79 308.78L457.5 367a16 16 0 0022.5-14.62V159.62A16 16 0 00457.5 145l-82.71 58.22A16 16 0 00368 216.3v79.4a16 16 0 006.79 13.08z"
        fill="none"
        stroke="currentColor"
        stroke-linecap="round"
        stroke-linejoin="round"
        stroke-width="32"
      />
      <path
        d="M268 384H84a52.15 52.15 0 01-52-52V180a52.15 52.15 0 0152-52h184.48A51.68 51.68 0 01320 179.52V332a52.15 52.15 0 01-52 52z"
        fill="none"
        stroke="currentColor"
        stroke-miterlimit="10"
        stroke-width="32"
      />
    </svg>
    <span>Video</span>
  </div>
</div>

<style>
  .icon-menu {
    display: flex;
    align-items: center;
    flex-direction: column;
    padding: 20px 15px 15px 15px;
    /* border: 1px solid; */
  }

  .icon-arrow {
    position: absolute;
    top: -10px;
    background: #ebebeb;
    border-radius: 50px;
  }

  .action-menu {
    position: absolute;
    left: 50%;
    transform: translateX(-50%);
    bottom: 10px;
    width: 100%;
    max-width: 800px;
    height: 80px;
    background: #ebebeb;
    border-top-left-radius: 8px;
    border-top-right-radius: 8px;
    display: flex;
    justify-content: center;
    /* min-width: 300px; */
  }

  @media (max-width: 800px) {
    .action-menu {
      bottom: 0px;
    }
  }

  @media (max-width: 360px) {
    .icon-menu {
      padding: 20px 9px 15px 9px
    }
  }

  @media (max-width: 300px) {
    .icon-menu {
      padding: 20px 7px 15px 7px
    }

    svg {
      width: 24px;
      height: 24px;
    }

    span {
      font-size: 14px;
    }
  }  
</style>
