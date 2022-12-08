<script context="module">
  import { locale, loadTranslations } from "$lib/i18n";

  export const load = async ({ url }) => {
    const { pathname } = url;

    const defaultLocale = "en"; // get from cookie, user session, ...

    const initLocale = locale.get() || defaultLocale; // set default if no locale already set

    await loadTranslations(initLocale, pathname); // keep this just before the `return`

    return {};
  };
</script>

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
    showVideoChatModal,
    showMapModal,
    showThemeMenu,
    showGradientMenu,
    showSettingsModalMobile,
    showAddFriendModal,
    showAddGroupModal,
    showAddRoomModal,
    showAudioPlayerModal,
    showAudioRecordingModal,
    latitude,
    longitude,
  } from "$lib/store";
  import { browser } from "$app/env";
  import { onAuthStateChanged } from "firebase/auth";
  import {
    doc,
    query,
    where,
    collection,
    onSnapshot,
    updateDoc,
  } from "firebase/firestore";
  import { goto } from "$app/navigation";
  import { onMount } from "svelte";
  import { auth, db } from "$lib/firebase/client";
  import { page } from "$app/stores";
  import ChatList from "$lib/components/ChatList.svelte";
  import SvelteTheme from "svelte-themes/SvelteTheme.svelte";
  import SidebarMenu from "$lib/components/SidebarMenu.svelte";
  import themeStore, { setTheme } from "svelte-themes";
  import ToolModal from "$lib/components/modals/ToolModal.svelte";
  import ImagePreviewModal from "$lib/components/modals/ImagePreviewModal.svelte";
  import CameraModal from "$lib/components/modals/CameraModal.svelte";
  import CameraPreviewModal from "$lib/components/modals/CameraPreviewModal.svelte";
  import ActionMenu from "$lib/components/ActionMenu.svelte";
  import AudioPlayerModal from "$lib/components/modals/AudioPlayerModal.svelte";
  import AudioRecordingModal from "$lib/components/modals/AudioRecordingModal.svelte";
  import SettingsModal from "$lib/components/modals/SettingsModal.svelte";
  import MapModal from "$lib/components/modals/MapModal.svelte";
  import AddFriendModal from "$lib/components/modals/AddFriendModal.svelte";
  import AddGroupModal from "$lib/components/modals/AddGroupModal.svelte";
  import AddRoomModal from "$lib/components/modals/AddRoomModal.svelte";
  // import VideoChatModal from "$lib/components/modals/VideoChatModal.svelte";
  import LoadingModal from "$lib/components/modals/LoadingModal.svelte";
  import { signout } from "$lib/functions/auth/signout";
  import { scale, fly, fade } from "svelte/transition";

  let user = null;
  let userDocReady = false;

  const geoOptions = {
    enableHighAccuracy: true,
    maximumAge: 30000,
    timeout: 27000,
  };

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

  const success = async (position) => {
    $latitude = position.coords.latitude;
    $longitude = position.coords.longitude;

    console.log(`${$loggedinUser.displayName}'s latitude: `, $latitude);
    console.log(`${$loggedinUser.displayName}'s longitude: `, $longitude);

    const userRef = doc(db, "users", $loggedinUser.displayName);
    await updateDoc(userRef, {
      geoLocation: [$latitude, $longitude],
    });
  };

  // $: if ($loggedin)

  // $: if ($myDoc) {
  //   const userRef = doc(db, 'users', $myDoc?.name)
  //   updateDoc(userRef, {
  //     geoLocation: [$latitude, $longitude]
  //   }).then(() => {
  //     console.log('geoLocation updated successfully')
  //   })
  // }

  const error = () => {
    console.log("no position available !");
  };

  onMount(async () => {
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
        console.log("login user: ", _user);
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
        updateDoc(userRef, {
          online: true,
        });
        const unsubUser = onSnapshot(userRef, (userSnap) => {
          $myDoc = userSnap.data();
          return () => unsubUser;
        });

        navigator.geolocation.getCurrentPosition(success, error, geoOptions);
      }
    });
    $currentSelectedUser = null;

    // Get current position
    // try {
    //   const position = await navigator.geolocation.getCurrentPosition(geoOptions);
    //   console.log("position", position);
    // } catch (error) {
    //   console.log(error.message);
    // }
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
    style:-o-transition="background 300ms linear"
  >
    <!-- style:transition="background 300ms linear" -->
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

    {#if $showVideoChatModal}
      <VideoChatModal />
    {/if}

    {#if $showMapModal}
      <MapModal />
    {/if}
  </div>
</div>
