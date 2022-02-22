<script>
  import { onMount } from "svelte";
  import { auth } from "$lib/firebase/client";
  import { onAuthStateChanged } from "firebase/auth";
  import { goto } from "$app/navigation";
  import TopSide from "$lib/components/TopSide.svelte";
  import LeftSide from "$lib/components/LeftSide.svelte";
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
          // hide right side, show left side
        } else {
          // hide left side, show right side
        }
      }
    });
  }
</script>

{#if show}
  <div class="wrapper">
    <!-- <div class="leftSide" class:leftSide={} class:righSide={}> -->
    <div class="leftSide">
      <LeftSide />
    </div>
    <!-- <div class="rightSide" class:leftSide={} class:rightSide={}> -->
    <div class="rightSide">
      <!-- <img src="https://previews.123rf.com/images/dimapolie/dimapolie1808/dimapolie180800074/106049740-patr%C3%B3n-de-la-escuela-del-vector-escuela-de-fondo-sin-fisuras-ilustraci%C3%B3n-vectorial.jpg" alt="" /> -->
      <main>
        <img src="/whatsapp-logo.jpg" alt="" />
        <h1>與朋友保持連線</h1>
        <!-- <h1>Keep your phone connected</h1> -->
        <p>Whatsapp 會連線到您的手機來同步訊息</p>
      </main>
    </div>
  </div>
{/if}

<style>
  main p {
    margin-top: 8px;
    color: var(--intro-subtitle-color);
  }

  main h1 {
    margin-top: 18px;
    color: var(--intro-title-color);
    font-weight: 100;
  }
  
  main {
    text-align: center;
  }

  .rightSide {
    display: flex;
    justify-content: center;
    align-items: center;
    background: var(--intro-grey);
    padding: 28px;
    border-bottom: 6px solid var(--intro-border-color);
    /* border: 1px solid red; */
  }

  .rightSide img {
    width: 250px;
    height: 250px;
    opacity: 1;
  }
</style>
