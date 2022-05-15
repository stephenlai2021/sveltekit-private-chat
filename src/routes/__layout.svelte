<script context="module">
  import { bgColor } from "$lib/store";
  export const load = ({ session }) => {
    const locals = session;
    const bgColor_preference = locals.bgColor;
    // const imageURL_preference = locals.bgColor;

    if (bgColor_preference) bgColor.set(bgColor_preference);
    // if (imageURL_preference) imageURL.set(imageURL_preference);
    return {};
  };
</script>

<script>
  import "$lib/styles/global.css";
  import {
    mobile,
    imageURL,
    connection,
    loginFormShow,
    showToolModal,
    showEmojiMenu,
    showThemeModal,
    showSettingsModal,
    showAddFriendModal,
  } from "$lib/store";
  import { browser } from "$app/env";
  import { onAuthStateChanged } from "firebase/auth";
  import { collection, onSnapshot } from "firebase/firestore";
  import { goto } from "$app/navigation";
  import { onMount } from "svelte";
  import { auth, db } from "$lib/firebase/client";
  import { page } from "$app/stores";
  import LeftSide from "$lib/components/LeftSide.svelte";
  import SvelteTheme from "svelte-themes/SvelteTheme.svelte";
  import SidebarMenu from "$lib/components/SidebarMenu.svelte";

  let user = null;
  let users = null;
  let colRef = collection(db, "whatzapp_users");

  const unsub = onSnapshot(colRef, (snapshot) => {
    let tempUsers = [];
    snapshot.docs.forEach((doc) => {
      tempUsers.push({ ...doc.data() });
    });
    users = tempUsers;
    return () => unsub();
  });

  const resizeWindow = () => {
    if (window.innerWidth <= 800) $mobile = true;
    if (window.innerWidth > 800) $mobile = false;
  };

  const closeModal = () => {
    $showEmojiMenu = false;
    $showToolModal = false;
  };

  onMount(() => {
    onAuthStateChanged(auth, (_user) => {
      if (!_user) goto("/login");
      else user = _user;
    });
    resizeWindow();
  });

  $: if (user) $loginFormShow = false;
  $: if (!user) $loginFormShow = true;
  $: if (browser) {
    window.addEventListener("online", () => {
      $connection = true;
      console.log("internet is connected 😀");
    });
    window.addEventListener("offline", () => {
      $connection = false;
      console.log("OOh, internet is disconnected 😮");
    });
    window.addEventListener("click", (e) => {
      $showSettingsModal = false;
      $showAddFriendModal = false;
      $showThemeModal = false;
    });
    window.addEventListener("resize", () => resizeWindow());
  }
</script>

<svelte:head>
  <title>Letschat</title>
</svelte:head>

<SvelteTheme />
<div class="wrapper" on:click={closeModal}>
  <SidebarMenu />
  <LeftSide />
  <!-- style:background-image={$imageURL ? `url(${$imageURL})` : "https://previews.123rf.com/images/dimapolie/dimapolie1808/dimapolie180800074/106049740-patr%C3%B3n-de-la-escuela-del-vector-escuela-de-fondo-sin-fisuras-ilustraci%C3%B3n-vectorial.jpg"}
  style:background-size="cover"
  style:background-repeat="no-repeat" -->
  <div
    class="rightSide"
    style:background={$bgColor}
    style:display={$mobile && $page.url.pathname === "/" ? "none" : "block"}
    style:width={$mobile && $page.url.pathname === "/"
      ? "0%"
      : $mobile && $page.url.pathname != "/"
      ? "100%"
      : "100%"}
  >
    <!-- : $mobile && $page.url.pathname != "/"
  ? "100%" -->
    <slot />
  </div>
</div>
