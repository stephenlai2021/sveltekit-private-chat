<script>
  import {
    mobile,
    bgColor,
    loggedinUser,
    profileUpdated,
    showThemeModal,
    showCameraModal,
    showSettingsModal,
    currentSelectedUser,
    widthLessthan1200
  } from "$lib/store";
  import themeStore, { setTheme } from "svelte-themes";
  import { onMount } from "svelte";
  import { signout } from "$lib/functions/auth/signout";
  import { fly } from "svelte/transition";
  import Cookies from "js-cookie";
  import { page } from "$app/stores";
  import { auth, db, storage } from "$lib/firebase/client";
  import { onAuthStateChanged, updateProfile } from "firebase/auth";
  import { doc, updateDoc } from "firebase/firestore";
  import { ref, uploadBytes, getDownloadURL } from "firebase/storage";
  import { v4 } from "uuid";
  import CameraModal from "$lib/components/CameraModal.svelte";
  // import { handleFileChange } from '$lib/functions/handleFileChange'

  // export let user;

  // const { file, fileError } = handleFileChange()

  let url = null;
  let file = null;
  let theme = true;
  let fileError = null;

  // onAuthStateChanged(auth, _user => user = _user)

  const toggleTheme = () => {
    theme = !theme;
    if (theme) setTheme("dark");
    if (!theme) setTheme("light");
  };

  const logout = () => {
    $currentSelectedUser = null
    $showSettingsModal = false;
    signout();
  };

  const handleFileChange = (e) => {
    const types = ["image/png", "image/jpg", "image/jpeg"];

    let selectedFile = e.target.files[0];
    console.log(selectedFile);

    if (selectedFile && types.includes(selectedFile.type)) {
      file = selectedFile;
      console.log(file);
      console.log(`${file.name} is selected`);
      fileError = null;
    } else {
      file = null;
      fileError = "Please select an image file (png or jpg)";
    }
  };

  $: if (file) {
    // change file type to .png
    let blob = file.slice(0, file.size, "image/png");
    let newFile = new File([blob], "avatar.png", { type: "image/png" });
    let imageRef = ref(
      storage,
      `letschat/profile/${user.displayName}/${newFile.name}`
    );

    uploadBytes(imageRef, file).then(() => {
      console.log("image upload completed !");
      getDownloadURL(imageRef).then((_url) => {
        url = _url;
      });
    });
  }

  $: if (url) {
    console.log("image url: ", url);

    updateProfile(user, {
      photoURL: url,
    }).then(() => {
      $profileUpdated = true;
      console.log("use profile uupdated successfully !");
    });

    // update user avatar
    let userRef = doc(db, "whatzapp_users", user.email);
    updateDoc(userRef, {
      avatar: url,
    }).then(() => {
      console.log("user avatar updated successfully !");
    });
  }

  onMount(() => {
    if ($themeStore.theme === "light") theme = false;
    if ($themeStore.theme === "dark") theme = true;
  });
</script>

<!-- style:width={$mobile ? "80%" : "100%"} -->
  <!-- style:width={
    $page.url.pathname === "/login" ? "0%" : "100%"
  } -->
  <!-- $page.url.pathname != "/login" ? "block" -->
  <!-- style:display={
    $page.url.pathname != "/login" && $widthLessthan1200 ? "none"
    : $page.url.pathname === "/login" ? "none"
    : "block"
  } -->
<ul
  class="modal-settings"
  on:click|stopPropagation={() => console.log("settings modal clicked !")}
  transition:fly={{ x: -60, duration: 100, delay: 100 }}
  style:display={$widthLessthan1200 || $page.url.pathname === "/login"  ? "none" : "block"}
  style:background={$themeStore.theme === "dark"
    ? "#292F3F"
    : "rgba(235, 235, 235, .5)"}
>
  <div class="top" />
  <div class="main">
    <div class="user-profile">
      <!-- {#if $loggedinUser} -->
      <div class="avatar-section">
        <div class="image-wrapper">
          <!-- {#if $loggedinUser.photoURL} -->
          {#if $loggedinUser}
            <img src={$loggedinUser.photoURL} alt="" width="80" height="80" />
            <label>
              <input
                type="file"
                on:change={handleFileChange}
                accept="image/png, image/jpg, image/jpeg"
              />
              <svg
                xmlns="http://www.w3.org/2000/svg"
                class="ionicon icon-camera"
                viewBox="0 0 512 512"
              >
                <path
                  d="M350.54 148.68l-26.62-42.06C318.31 100.08 310.62 96 302 96h-92c-8.62 0-16.31 4.08-21.92 10.62l-26.62 42.06C155.85 155.23 148.62 160 140 160H80a32 32 0 00-32 32v192a32 32 0 0032 32h352a32 32 0 0032-32V192a32 32 0 00-32-32h-59c-8.65 0-16.85-4.77-22.46-11.32z"
                  fill="none"
                  stroke="currentColor"
                  stroke-linecap="round"
                  stroke-linejoin="round"
                  stroke-width="32"
                />
                <circle
                  cx="256"
                  cy="272"
                  r="80"
                  fill="none"
                  stroke="currentColor"
                  stroke-miterlimit="10"
                  stroke-width="32"
                />
                <path
                  fill="none"
                  stroke="currentColor"
                  stroke-linecap="round"
                  stroke-linejoin="round"
                  stroke-width="32"
                  d="M124 158v-22h-24v22"
                />
              </svg>
            </label>
          {:else}
            <div class="user-avatar animation" />
          {/if}
        </div>
      </div>
      {#if $loggedinUser}
        <h3>
          {$loggedinUser.displayName}
        </h3>
        <p>{$loggedinUser.email}</p>
      {:else}
        <h3 class="user-name">
          <span class="animation">maskman</span> 
        </h3>
        <p class="user-email">
          <span class="animation">maskman@mail.com</span>
        </p>
      {/if}
    </div>

    <!-- style:background={$themeStore.theme === "dark" ? "#3A3F50" : "white"} -->
    {#if $loggedinUser}
      <li >
        <div class="content">
          <svg
            xmlns="http://www.w3.org/2000/svg"
            class="ionicon"
            viewBox="0 0 512 512"
            width="24"
            height="24"
            fill="currentColor"
          >
            <path
              fill="none"
              stroke="currentColor"
              stroke-linecap="round"
              stroke-linejoin="round"
              stroke-width="32"
              d="M48 112h288M192 64v48M272 448l96-224 96 224M301.5 384h133M281.3 112S257 206 199 277 80 384 80 384"
            />
            <path
              d="M256 336s-35-27-72-75-56-85-56-85"
              fill="none"
              stroke="currentColor"
              stroke-linecap="round"
              stroke-linejoin="round"
              stroke-width="32"
            />
          </svg>
          <div class="title-wrapper">
            <span class="menu-item">Language</span>
          </div>
        </div>
      </li>
      <li
        class="theme"
        on:click={toggleTheme}
        >
        <!-- style:background={$themeStore.theme === "dark" ? "#3A3F50" : "white"} -->
        <div class="content">
          {#if $themeStore.theme === "light"}
            <svg
              xmlns="http://www.w3.org/2000/svg"
              class="ionicon"
              viewBox="0 0 512 512"
              width="24"
              height="24"
              fill="currentColor"
            >
              <path
                d="M160 136c0-30.62 4.51-61.61 16-88C99.57 81.27 48 159.32 48 248c0 119.29 96.71 216 216 216 88.68 0 166.73-51.57 200-128-26.39 11.49-57.38 16-88 16-119.29 0-216-96.71-216-216z"
                fill="none"
                stroke="currentColor"
                stroke-linecap="round"
                stroke-linejoin="round"
                stroke-width="32"
              />
            </svg>
            <div class="title-wrapper">
              <span class="menu-item">Dark mode</span>
            </div>
          {:else}
            <svg
              xmlns="http://www.w3.org/2000/svg"
              class="ionicon"
              viewBox="0 0 512 512"
              width="24"
              height="24"
              fill="currentColor"
            >
              <path
                fill="none"
                stroke="currentColor"
                stroke-linecap="round"
                stroke-miterlimit="10"
                stroke-width="32"
                d="M256 48v48M256 416v48M403.08 108.92l-33.94 33.94M142.86 369.14l-33.94 33.94M464 256h-48M96 256H48M403.08 403.08l-33.94-33.94M142.86 142.86l-33.94-33.94"
              />
              <circle
                cx="256"
                cy="256"
                r="80"
                fill="none"
                stroke="currentColor"
                stroke-linecap="round"
                stroke-miterlimit="10"
                stroke-width="32"
              />
            </svg>
            <div class="title-wrapper">
              <span class="menu-item">Light mode</span>
            </div>
          {/if}
        </div>
      </li>
      <!-- style:background={$themeStore.theme === "dark" ? "#3A3F50" : "white"} -->
      <li >
        <div class="content">
          <svg
            xmlns="http://www.w3.org/2000/svg"
            class="ionicon"
            viewBox="0 0 512 512"
            width="24"
            height="24"
            fill="currentColor"
          >
            <path
              d="M248 64C146.39 64 64 146.39 64 248s82.39 184 184 184 184-82.39 184-184S349.61 64 248 64z"
              fill="none"
              stroke="currentColor"
              stroke-miterlimit="10"
              stroke-width="32"
            />
            <path
              fill="none"
              stroke="currentColor"
              stroke-linecap="round"
              stroke-linejoin="round"
              stroke-width="32"
              d="M220 220h32v116"
            />
            <path
              fill="none"
              stroke="currentColor"
              stroke-linecap="round"
              stroke-miterlimit="10"
              stroke-width="32"
              d="M208 340h88"
            />
            <path d="M248 130a26 26 0 1026 26 26 26 0 00-26-26z" />
          </svg>
          <div class="title-wrapper">
            <span class="menu-item">About</span>
          </div>
        </div>
      </li>
      <li
        on:click={logout}
        >
        <!-- style:background={$themeStore.theme === "dark" ? "#3A3F50" : "white"} -->
        <div class="content">
          <svg
            xmlns="http://www.w3.org/2000/svg"
            class="ionicon"
            viewBox="0 0 512 512"
            width="24"
            height="24"
            fill="currentColor"
          >
            <path
              d="M304 336v40a40 40 0 01-40 40H104a40 40 0 01-40-40V136a40 40 0 0140-40h152c22.09 0 48 17.91 48 40v40M368 336l80-80-80-80M176 256h256"
              fill="none"
              stroke="currentColor"
              stroke-linecap="round"
              stroke-linejoin="round"
              stroke-width="32"
            />
          </svg>
          <div class="title-wrapper">
            <span class="menu-item">Logout</span>
          </div>
        </div>
      </li>
    {/if}
  </div>
</ul>

<style>
  h3.user-name {
    margin-bottom: 5px;
    margin-top: 10px;
  }

  .user-name, .user-email {
    text-align: center;
  }
  
  h3 span, p span {
    color: transparent;
    line-height: 0.7;
    border-radius: 4px;
  }

  .user-avatar {
    width: 80px;
    height: 80px;
    border-radius: 50px;
  }

  svg {
    margin-right: 20px;
  }

  label input {
    width: 0;
    height: 0;
    opacity: 0;
  }

  .icon-camera {
    width: 24px;
    height: 24px;
    margin-right: 0;
    position: absolute;
    right: 10px;
    bottom: -10px;
  }

  .image-wrapper img {
    border-radius: 8px;
    object-fit: contain;
    /* border: 1px solid; */
  }

  .image-wrapper {
    position: relative;
    display: flex;
    flex-direction: column;
    justify-content: center;
  }

  .main {
    display: flex;
    flex-direction: column;
    justify-content: center;
  }

  h3,
  p {
    text-align: center;
  }

  .user-profile .avatar-section {
    justify-content: center;
    align-items: center;
    margin-bottom: 15px;
    display: flex;
  }

  .user-profile {
    margin-bottom: 30px;
  }

  .title-wrapper {
    width: 100%;
  }

  .content {
    display: flex;
    align-items: center;
    justify-content: space-between;
    width: 120px;
    cursor: pointer;
    /* border: 1px solid; */
  }

  .top {
    height: 60px;
    margin-bottom: 10px;
  }

  label {
    display: flex;
    align-items: center;
    width: 100px;
  }

  ul {
    list-style: none;
    max-width: 250px;
    /* max-height: 90%; */
    width: 100%;
    z-index: 200;
    /* height: 90vh; */
    backdrop-filter: blur(20px);
    border-radius: 8px;
    margin: 5px;
  }

  li {
    display: flex;
    align-items: baseline;
    justify-content: center;    
    padding: 10px 20px;
    margin: 0 10px;
    margin-bottom: 5px;
    border-radius: 8px;
    /* border: 1px solid; */
  }

  /* @media (max-width: 1200px) {
    ul {
      display: none;
    }
  } */
</style>
