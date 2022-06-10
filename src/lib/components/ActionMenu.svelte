<script>
  import { showActionMenu } from "$lib/store"
</script>

<div class="action-menu">
  <svg 
    xmlns="http://www.w3.org/2000/svg" 
    class="ionicon icon-arrow" 
    viewBox="0 0 512 512"
    width="20"
    height="20"
    fill="currentColor"
    on:click={() => $showActionMenu = false}
  >
    <path
      fill="none"
      stroke="currentColor"
      stroke-linecap="round"
      stroke-linejoin="round"
      stroke-width="48"
      d="M112 184l144 144 144-144"
    />
  </svg>
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
</div>

<style>
  .icon-arrow {
    position: absolute;
    top: 5px;
    left: 50%;
    transform: translateX(-50%);
  }

  svg {
    margin: 0 15px;
  }

  .action-menu {
    padding-left: 10px;
    display: flex;
    align-items: center;
    position: absolute;
    bottom: 59px;
    width: 100%;
    left: 50%;
    transform: translateX(-50%);
    max-width: 800px;
    height: 80px;
    background: #eee;
    background: black;
    background: #1f232f;
  }
</style>
