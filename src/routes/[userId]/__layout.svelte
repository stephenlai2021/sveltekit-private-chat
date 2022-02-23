<script>
  import { onMount } from "svelte";
  import { auth } from "$lib/firebase/client";
  import { onAuthStateChanged } from "firebase/auth";
  import { goto } from "$app/navigation";
  import LeftSide from "$lib/components/LeftSide.svelte";
  import { fly } from "svelte/transition";
  import { browser } from "$app/env";
  import { showSettingsModal } from '$lib/store'

  let show = false;
  let hideLeftSide = false;
  let showRightSide = false;

  const resizeWindow = () => {
    if (window.innerWidth <= 800) {
      showRightSide = true;
      hideLeftSide = true;
    } else {
      showRightSide = false;
      hideLeftSide = false;
    }
  };

  onMount(async () => {
    onAuthStateChanged(auth, (_user) => {
      if (!_user) {
        goto("/login");
      } else {
        show = true;
      }
    });
    resizeWindow();
  });

  $: if (browser) {
    window.addEventListener("resize", () => resizeWindow());
    window.addEventListener("click", (e) => {
      console.log("window event", e);
      showSettingsModal.set(false);
    });
  }
</script>

{#if show}
  <div class="wrapper">
    <div class="leftSide" class:hide={hideLeftSide}>
      <LeftSide />
    </div>
    <div
      class="rightSide"
      class:active={showRightSide}
      in:fly={{ x: 30, duration: 200, delay: 200 }}
      out:fly={{ duration: 200 }}
    >
      <slot />
    </div>
  </div>
{/if}

<style>
  .active {
    display: block;
  }

  .hide {
    display: none;
  }
</style>
