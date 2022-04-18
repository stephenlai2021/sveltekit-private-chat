<script>
  import { fly } from "svelte/transition";
  import { showCameraModal } from "$lib/store";

  $: if ($showCameraModal) console.log('camera modal is ', $showCameraModal ? 'opened' : 'closed')
</script>

<div
class="modal-camera"
transition:fly={{ y: -60, duration: 100, delay: 100 }}
on:click|stopPropagation={() => console.log("camera modal clicked !")}
>
  <div class="icon-arrow">
    <ion-icon
      name="arrow-back-outline"
      on:click|stopPropagation={() => $showCameraModal = false}
      />
      <!-- on:click={() => $showCameraModal = false} -->
  </div>
  Lorem ipsum dolor, sit amet consectetur adipisicing elit. Maxime in velit dolor alias aut consequatur unde dolore neque! Maxime suscipit, laborum provident sint ea dolores laboriosam, doloremque ex quae nulla aliquam labore exercitationem quibusdam distinctio iure impedit recusandae corporis rem reiciendis molestias? Deleniti quis dolores ipsam dicta voluptatibus architecto recusandae?
</div>

<style>
  /* .icon-arrow {
    position: absolute;
    top: 0;
    left: 0;
    z-index: 350;
  } */

  .icon-arrow {
    border: 1px solid;
  }

  .modal-camera {
    position: absolute;
    top: 0;
    left: 0;
    z-index: 300;
    background: rgba(163, 156, 156, 0.8);
    backdrop-filter: blur(30px);
    width: 100%;
    height: 100vh;
  }
</style>
