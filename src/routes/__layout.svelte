<script>
  import "$lib/styles/global.css";
  import { connection } from "$lib/store";
  import { browser } from "$app/env";
  import { onAuthStateChanged } from "firebase/auth";
  import { goto } from "$app/navigation";
  import { onMount } from "svelte";
  import { auth } from "$lib/firebase/client";
  import { showSettingsModal } from "$lib/store";
  import LeftSide from "$lib/components/LeftSide.svelte";
  import { page } from "$app/stores";

  let mobile = false;
  let loginFormShow = false;

  const resizeWindow = () => {
    if (window.innerWidth <= 800) { 
      mobile = true;
    } else {
      mobile = false;
    }
  };

  onMount(() => {
    onAuthStateChanged(auth, (user) => {
      if (!user) {
        loginFormShow = true;
        goto("/login");
      } else {
        loginFormShow = false;
      }

      // if (user) loginFormShow = false
      // if (!user) goto('/login')
    });
    resizeWindow();
  });

  // $: console.log("url: ", $page.params.userId);

  $: if (browser) {
    window.addEventListener("online", () => connection.set(true));
    window.addEventListener("offline", () => connection.set(false));
    window.addEventListener("click", (e) => {
      showSettingsModal.set(false);
    });
    window.addEventListener("resize", () => resizeWindow());
  }
</script>

<svelte:head>
  <title>Letschat</title>
</svelte:head>

<div class="wrapper">
  <div
    class="leftSide"
    class:loginform-hide={loginFormShow}
    style:width={mobile && $page.url.pathname === "/"
      ? "100%"
      : mobile && $page.url.pathname != '/'
      ? "0%"
      : "33%"}
  >
    <LeftSide />
  </div>
  <div
    class="rightSide"
    style:width={mobile && $page.url.pathname === "/"
      ? "0%"
      : mobile && $page.url.pathname != "/"
      ? "100%"
      : "100%"}
  >
    <slot />
  </div>
</div>

<style>
  .loginform-hide {
    display: none;
  }
</style>
