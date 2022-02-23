<script>
  import { onMount } from "svelte";
  import { auth } from "$lib/firebase/client";
  import { onAuthStateChanged } from "firebase/auth";
  import { goto } from "$app/navigation";
  import LeftSide from "$lib/components/LeftSide.svelte";
  import { browser } from "$app/env";
  import { showSettingsModal } from '$lib/store'

  let show = false;
  let showLeftSide = false;
  let hideRightSide = false;

  const resizeWindow = () => {
    if (window.innerWidth <= 800) {
      showLeftSide = true;
      hideRightSide = true;
    } else {
      showLeftSide = false;
      hideRightSide = false;
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

<svelte:head>
  <title>Welcome</title>
</svelte:head>


{#if show}
  <div class="wrapper">
    <div class="leftSide" class:active={showLeftSide}>
      <LeftSide />
    </div>
    <div class="rightSide" class:hide={hideRightSide}>
      <main class:hide={hideRightSide}>
        <img src="/whatsapp-logo.jpg" alt="" />
        <h1>與朋友保持連線</h1>
        <p>Whatsapp 會連線到您的手機來同步訊息</p>
      </main>
    </div>
  </div>
{/if}

<style>
  .active {
    width: 100%;
  }

  .hide {
    display: none;
    width: 0%;
    height: 0%;
  }

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
    border-bottom: 6px solid var(--intro-border-color);
  }

  .rightSide img {
    width: 250px;
    height: 250px;
    opacity: 1;
  }
</style>
