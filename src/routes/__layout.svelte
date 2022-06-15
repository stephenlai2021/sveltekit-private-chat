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
    loginFormShow,
    loggedinUser,
    showToolModal,
    showEmojiMenu,
    showActionMenu,
    showSidebarMenu,
    showImagePreviewModal,
    showCameraPreviewModal,
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
  import ToolModal from "$lib/components/ToolModal.svelte";
  import ImagePreviewModal from "$lib/components/ImagePreviewModal.svelte";
  import CameraModal from "$lib/components/CameraModal.svelte";
  import CameraPreviewModal from "$lib/components/CameraPreviewModal.svelte";
  import ActionMenu from "$lib/components/ActionMenu.svelte";
  import AudioPlayerModal from "$lib/components/AudioPlayerModal.svelte";
  import AudioRecordingModal from "$lib/components/AudioRecordingModal.svelte";

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
    window.addEventListener("resize", () => desktopOrMobile());
  }
</script>

<svelte:head>
  <title>Letschat</title>
</svelte:head>

<SvelteTheme />
<div
  class="wrapper"
  on:click={closeModal}
  style:background={$themeStore.theme === "dark" ? "#292F3F" : $bgColor}
>
  <div class="inner-wrapper">
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
        ? "500px"
        : "0%"}
    >
      <ChatList />
    </div>
    <div
      class="rightSide"
      style:display={$mobile && $page.url.pathname === "/" ? "none" : "block"}
      style:width={$mobile && $page.url.pathname === "/"
        ? "0%"
        : $mobile && $page.url.pathname != "/"
        ? "100%"
        : "100%"}
    >
      <slot />
    </div>

    {#if $showToolModal}
      <ToolModal />
    {/if}

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
  </div>
</div>
