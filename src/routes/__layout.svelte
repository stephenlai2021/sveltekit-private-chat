<script>
  import "$lib/styles/global.css";
  import { connection, bgColor, mobile, loginFormShow, showSettingsModal, showAddFriendModal } from "$lib/store";
  import { browser } from "$app/env";
  import { onAuthStateChanged } from "firebase/auth";
  import { goto } from "$app/navigation";
  import { onMount } from "svelte";
  import { auth } from "$lib/firebase/client";  import LeftSide from "$lib/components/LeftSide.svelte";
  import { page } from "$app/stores";
  import SvelteTheme from "svelte-themes/SvelteTheme.svelte";
  import SidebarMenu from "$lib/components/SidebarMenu.svelte";

  let user = null;

  const resizeWindow = () => {
    if (window.innerWidth <= 800) $mobile = true;
    else $mobile = false;
  };

  onMount(() => {
    onAuthStateChanged(auth, (_user) => user = _user);
    resizeWindow();
  });

  $: if (user) $loginFormShow = false;
  $: if (!user) $loginFormShow = true;

  $: if (browser) {
    // window.addEventListener("online", () => connection.set(true));
    // window.addEventListener("offline", () => connection.set(false));
    window.addEventListener("online", () => { 
      // $connection = true
      alert("internet is connected 😀");
    });
    window.addEventListener("offline", () => { 
      // $connection = false
      alert("OOh, internet is disconnected 😮");
    });
    window.addEventListener("click", (e) => {
      $showSettingsModal = false
      $showAddFriendModal = false
    });
    window.addEventListener("resize", () => resizeWindow());

    // if ($connection) alert("internet is connected 😀");
    // if (!$connection) alert("OOh, internet is disconnected 😮");
  }
</script>

<svelte:head>
  <title>Letschat</title>
</svelte:head>

<SvelteTheme />
<div class="wrapper">
  <SidebarMenu />
  <div
    class="leftSide"
    class:loginform-hide={$loginFormShow}
    style:width={$mobile && $page.url.pathname === "/"
      ? "100%"
      : $mobile && $page.url.pathname != "/"
      ? "0%"
      : $page.url.pathname != "/movie" && $page.url.pathname != "/tinder"
      ? "450px"
      : "0%"}
  >
    <LeftSide />
  </div>
  <div
    class="rightSide"
    style:background={$bgColor}
    style:width={$mobile && $page.url.pathname === "/"
      ? "0%"
      : $mobile && $page.url.pathname != "/"
      ? "100%"
      : "100%"}
  >
    <slot />
  </div>
</div>
