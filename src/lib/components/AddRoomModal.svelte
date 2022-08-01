<script>
  import themeStore from "svelte-themes";
  import { showAddRoomModal } from "$lib/store";
</script>

<div
  class="add-group-modal"
  style:background={$themeStore.theme === "dark" ? "#292F3F" : "#ebebeb"}
>
  <div class="top">
    <svg
      xmlns="http://www.w3.org/2000/svg"
      class="ionicon icon-arrow-back"
      viewBox="0 0 512 512"
      width="24"
      height="24"
      fill="currentColor"
      style:margin-right="15px"
      on:click|stopPropagation={() => ($showAddRoomModal = false)}
    >
      <path
        fill="none"
        stroke="currentColor"
        stroke-linecap="round"
        stroke-linejoin="round"
        stroke-width="48"
        d="M328 112L184 256l144 144"
      />
    </svg>
    <span>Add a room</span>
  </div>
</div>

<style>
  .top {
    padding: 0px 10px 0px 0px;
    display: flex;
    align-items: center;
  }

  .add-group-modal {
    position: absolute;
    top: 0;
    left: 0;
    width: 100%;
    height: 100vh;
    z-index: 200;
    padding: 10px;
  }
</style>
