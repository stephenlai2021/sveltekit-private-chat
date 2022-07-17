<!-- <script context="module">
  import { bgColor } from "$lib/store";
  export const load = ({ session }) => {
    const locals = session;
    const bgColor_preference = locals.bgColor;

    if (bgColor_preference) bgColor.set(bgColor_preference);
    return {};
  };
</script> -->
<script>
  import "$lib/styles/global.css";
  import {
    mobile,
    bgColor,
    connection,
    widthLessthan1200,
    widthLessthan1000,
    currentSelectedUser,
    loginFormShow,
    loggedinUser,
    showToolModal,
    showEmojiMenu,
    showActionMenu,
    showSidebarMenu,
    showImagePreviewModal,
    showCameraPreviewModal,
    showThemeModal,
    showToolModalMobile,
    showCameraModal,
    showMapModal,
    showThemeMenu,
    showGradientMenu,
    showSettingsModalMobile,
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
  import ToolModal from "$lib/components/ToolModal.svelte";
  import ImagePreviewModal from "$lib/components/ImagePreviewModal.svelte";
  import CameraModal from "$lib/components/CameraModal.svelte";
  import CameraPreviewModal from "$lib/components/CameraPreviewModal.svelte";
  import ActionMenu from "$lib/components/ActionMenu.svelte";
  import AudioPlayerModal from "$lib/components/AudioPlayerModal.svelte";
  import AudioRecordingModal from "$lib/components/AudioRecordingModal.svelte";
  import SettingsModal from "$lib/components/SettingsModal.svelte";
  import MapModal from "$lib/components/MapModal.svelte"

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
    if (window.innerWidth <= 1200) $widthLessthan1200 = true;
    if (window.innerWidth > 1200) $widthLessthan1200 = false;
    if (window.innerWidth <= 1000) $widthLessthan1000 = true;
    if (window.innerWidth > 1000) $widthLessthan1000 = false;
  };

  const closeModal = () => {
    $showEmojiMenu = false;
    $showToolModal = false;
  };

  onMount(() => {
    // console.log('current selected user', JSON.parse($currentSelectedUser))
    desktopOrMobile();
    onAuthStateChanged(auth, (user) => {
      if (!user) goto("/login");
      else {
        $loggedinUser = user;
        console.log('get loggedin user name: ', $loggedinUser.displayName)
      }
    });
    $currentSelectedUser = null
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
      $showSettingsModalMobile = false;
      $showToolModalMobile = false;
      $showAddFriendModal = false;
      $showThemeModal = false;
      $showThemeMenu = false
      $showGradientMenu = false
    });
    window.addEventListener("resize", () => desktopOrMobile());
  }
  $: if ($themeStore.theme === 'dark') console.log('you are in light mode')
  $: if ($themeStore.theme === 'light') console.log('you are in dark mode')
</script>

<svelte:head>
  <title>Sveltechat</title>
</svelte:head>

<SvelteTheme />
<div
  class="wrapper"
  on:click={closeModal}
>
<!-- style:background={$themeStore.theme === "dark" ? "#292F3F" : $bgColor} -->
  <div
    class="inner-wrapper"
    style:background={$themeStore.theme === "dark" ? "#1F232F" : $bgColor}
    style:display={$page.url.pathname === '/login' ? 'block' : 'flex'}
  >
    <SettingsModal />
    <div
      class="leftSide"
      style:display={$mobile && $page.url.pathname === "/"
        ? "block"
        : $mobile && $page.url.pathname != "/"
        ? "none"
        : !$mobile && $page.url.pathname != "/login"
        ? "block"
        : "none"}
      style:width={$mobile && $page.url.pathname === "/"
        ? "100%"
        : $mobile && $page.url.pathname != "/"
        ? "0"
        : $showCameraModal || $showAudioRecordingModal || $showAudioPlayerModal
        ? "0%"
        : !$mobile && $page.url.pathname != "/login"
        ? "350px"
        : "0%"}
    >
      <ChatList />
    </div>
    <div
      class="rightSide"
      style:display={$mobile && $page.url.pathname === "/" ? "none" : "block"}
      style:width={
        $mobile && $page.url.pathname === "/" ? "0%"
        : $mobile && $page.url.pathname != "/" ? "100%"
        : "100%"
      }
    >
      <slot />
    </div>

    <ToolModal />

    {#if $showImagePreviewModal}
      <ImagePreviewModal />
    {/if}

    {#if $showCameraModal}
      <CameraModal />
    {/if}

    {#if $showCameraPreviewModal}
      <CameraPreviewModal />
    {/if}

    {#if $showActionMenu}
      <ActionMenu />
    {/if}

    {#if $showAudioRecordingModal}
      <AudioRecordingModal />
    {/if}

    {#if $showAudioPlayerModal}
      <AudioPlayerModal />
    {/if}

    {#if $showMapModal}
      <MapModal />
    {/if}
  </div>
</div>
