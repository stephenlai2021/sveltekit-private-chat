<script>
  import { onMount } from "svelte";
  import { auth } from "$lib/firebase/client";
  import { onAuthStateChanged } from "firebase/auth";
  import { goto } from "$app/navigation";
  import TopSide from "$lib/components/TopSide.svelte";
  import LeftSide from "$lib/components/LeftSide.svelte";
  import { fly } from "svelte/transition";
  import { browser } from "$app/env";
  import { page } from "$app/stores";

  let show = false;
  let leftSide = true;
  let rightSide = true;

  onMount(async () => {
    onAuthStateChanged(auth, (_user) => {
      if (!_user) {
        goto("/login");
      } else {
        show = true;
      }
    });
  });

  $: if (browser) {
    window.addEventListener("resize", () => {
      console.log("page width", window.innerWidth);

      if (window.innerWidth <= 800) {
        if ($page.url.pathname === "/") {
          // hide right side
        } else {
          // hide left side
        }
      }
    });
  }
</script>

{#if show}
  <div class="wrapper">
    <div class="leftSide">
      <LeftSide />
    </div>
    <div
      class="rightSide"
      in:fly={{ y: 50, duration: 300, delay: 300 }}
      out:fly={{ duration: 300 }}
    >
      <slot />
    </div>
  </div>
{/if}
