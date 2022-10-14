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
    phone,
    myDoc,
    mobile,
    bgColor,
    allUsers,
    initial,
    userEmail,
    connection,
    widthLessthan1200,
    widthLessthan1000,
    currentSelectedUser,
    loggedinUser,
    loginUserEmail,
    showToolModal,
    showEmojiMenu,
    showActionMenu,
    showSearchBar,
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
    showAddGroupModal,
    showAddRoomModal,
    showAudioPlayerModal,
    showAudioRecordingModal,
  } from "$lib/store";
  import { browser } from "$app/env";
  import { onAuthStateChanged } from "firebase/auth";
  import {
    doc,
    query,
    where,
    collection,
    onSnapshot,
  } from "firebase/firestore";
  import { goto } from "$app/navigation";
  import { onMount } from "svelte";
  import { auth, db, requestForToken, onMessageListener } from "$lib/firebase/client";
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
  import MapModal from "$lib/components/MapModal.svelte";
  import AddFriendModal from "$lib/components/AddFriendModal.svelte";
  import AddGroupModal from "$lib/components/AddGroupModal.svelte";
  import AddRoomModal from "$lib/components/AddRoomModal.svelte";
  import LoadingModal from "$lib/components/LoadingModal.svelte";
  import { signout } from "$lib/functions/auth/signout";

  let user = null;
  let userDocReady = false;

  const desktopOrMobile = () => {
    if (window.innerWidth <= 1200) $widthLessthan1200 = true;
    if (window.innerWidth > 1200) $widthLessthan1200 = false;

    if (window.innerWidth <= 1000) $widthLessthan1000 = true;
    if (window.innerWidth > 1000) $widthLessthan1000 = false;

    if (window.innerWidth <= 800) $mobile = true;
    if (window.innerWidth > 800) $mobile = false;

    if (window.innerWidth <= 330) $phone = true;
    if (window.innerWidth > 330) $phone = false;
  };

  const closeModal = () => {
    $showEmojiMenu = false;
    $showToolModal = false;
  };

  onMount(() => {
    // Receiving Firebase Cloud Messaging
    requestForToken()
    onMessageListener()
    .then((payload) => {
      console.log('payload: ', payload)
    })

    .catch((err) => console.log('failed: ', err));
    desktopOrMobile();
    onAuthStateChanged(auth, (_user) => {
      if (!_user) {
        $loggedinUser = null;
        $allUsers = null;
        console.log("signout, user: ", $loggedinUser);
        goto("/login");
      } else {
        // signout()
        $loggedinUser = _user;
        console.log("signin, user: ", $loggedinUser.displayName);

        let usersRef = collection(db, "users");
        let userQuery = query(
          usersRef,
          where("contactList", "array-contains", $loggedinUser.displayName)
        );
        const unsubUsers = onSnapshot(userQuery, (snapshot) => {
          let tempUsers = [];
          snapshot.forEach((doc) => {
            tempUsers.push(doc.data());
          });
          $allUsers = tempUsers;
          console.log(`${$loggedinUser.displayName}'s contact list`, $allUsers);
          return () => unsubUsers();
        });

        /* this block of codes cause sveltechat login failure !!!*/
        let userRef = doc(db, "users", $loggedinUser.displayName);
        const unsubUser = onSnapshot(userRef, (userSnap) => {
          $myDoc = userSnap.data();
          return () => unsubUser;
        });
      }
    });
    $currentSelectedUser = null;
    // alert('width: ', window.innerWidth)
  });

  // $: if ($loggedinUser) userDocReady = true;

  /* This block of codes messed up when a user sign up !!! */
  // $: if (userDocReady) {
  //   let userRef = doc(db, "users", $loggedinUser.displayName);
  //   const unsubUser = onSnapshot(userRef, (userSnap) => {
  //     $myDoc = userSnap.data();
  //     return () => unsubUser;
  //   });
  //   userDocReady = false;
  // }

  $: {
    if (browser) {
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
        $showAddGroupModal = false;
        $showAddRoomModal = false;
        $showThemeModal = false;
        $showThemeMenu = false;
        $showGradientMenu = false;
        $showActionMenu = false;
        // $showSearchBar = false
      });

      window.addEventListener("resize", () => desktopOrMobile());
    }
  }
</script>

<svelte:head>
  <title>Sveltechat</title>
</svelte:head>

<div class="wrapper" on:click={closeModal}>
  <div
    class="inner-wrapper"
    style:display={$page.url.pathname === "/login" ? "block" : "flex"}
    style:background={$page.url.pathname === "/"
      ? `${$myDoc && $myDoc.bgColor} center / cover`
      : $page.url.pathname !== "/" && $page.url.pathname !== "/login"
      ? `${$currentSelectedUser?.bgColor} center / cover`
      : "#ebebeb"}
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
      style:width={$mobile && $page.url.pathname === "/"
        ? "0%"
        : $mobile && $page.url.pathname != "/"
        ? "100%"
        : "100%"}
    >
      <slot />
    </div>

    {#if $showAddFriendModal}/
      <AddFriendModal />
    {/if}

    {#if $showAddGroupModal}
      <AddGroupModal />
    {/if}

    {#if $showAddRoomModal}
      <AddRoomModal />
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
