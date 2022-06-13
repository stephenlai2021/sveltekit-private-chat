<script context="module">
  // import { bgColor, imageURL } from "$lib/store";
  import { bgColor } from "$lib/store";
  // import { imageURL } from "$lib/store";
  export const load = ({ session }) => {
    const locals = session;
    const bgColor_preference = locals.bgColor;
    // const imageURL_preference = locals.imageURL;

    if (bgColor_preference) bgColor.set(bgColor_preference);
    // if (imageURL_preference) imageURL.set(imageURL_preference);
    return {};
  };
</script>

<script>
  import "$lib/styles/global.css";
  import {
    mobile,
    connection,
    loginFormShow,
    loggedinUser,
    showToolModal,
    showEmojiMenu,
    showSidebarMenu,
    showImagePreviewModal,
    showThemeModal,
    showCameraModal,
    showSettingsModal,
    showAddFriendModal,
    showAudioPlayerModal,
    showAudioRecordingModal,
  } from "$lib/store";
  import { browser } from "$app/env";
  import { onAuthStateChanged } from "firebase/auth";
  import { collection, onSnapshot } from "firebase/firestore";
  import { goto } from "$app/navigation";
  import { onMount } from "svelte";
  import { auth, db } from "$lib/firebase/client";
  import { page } from "$app/stores";
  import ChatList from "$lib/components/ChatList.svelte";
  import SvelteTheme from "svelte-themes/SvelteTheme.svelte";
  import SidebarMenu from "$lib/components/SidebarMenu.svelte";
  import themeStore, { setTheme } from "svelte-themes";
  import ToolModal from '$lib/components/ToolModal.svelte'
  import ImagePreviewModal from '$lib/components/ImagePreviewModal.svelte'

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

  const desktopOrMobile = () => {
    if (window.innerWidth <= 800) $mobile = true;
    if (window.innerWidth > 800) $mobile = false;
  };

  const closeModal = () => {
    $showEmojiMenu = false;
    $showToolModal = false;
  };

  onMount(() => {
    desktopOrMobile();
    onAuthStateChanged(auth, (_user) => {
      if (!_user) goto("/login");
      else $loggedinUser = _user;
    });
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
  <!-- {#if $showSidebarMenu}
    <SidebarMenu />
  {/if} -->
  <ChatList />
  <div
  >
    <!-- class="rightSide"
    style:background={$themeStore.theme === "dark" ? "#292F3F" : $bgColor}
    style:display={$mobile && $page.url.pathname === "/" ? "none" : "block"}
    style:width={$mobile && $page.url.pathname === "/"
      ? "0%"
      : $mobile && $page.url.pathname != "/"
      ? "100%"
      : "100%"} -->
    <slot />
  </div>
  
  {#if $showToolModal}
    <ToolModal />
  {/if}

  {#if $showImagePreviewModal}
    <ImagePreviewModal />
  {/if}
</div>
