<script>
  import {
    myDoc,
    mobile,
    bgColor,
    imageURL,
    isMobile,
    userAvatar,
    imageTitle,
    loggedinUser,
    profileUpdated,
    showThemeMenu,
    showThemeModal,
    showCameraModal,
    showGradientMenu,
    selectedUsername,
    showSettingsModalMobile,
  } from "$lib/store";
  // import themeStore, { setTheme } from "svelte-themes";
  import { onMount } from "svelte";
  // import { signout } from "$lib/functions/auth/signout";
  import { fly } from "svelte/transition";
  import Cookies from "js-cookie";
  import { page } from "$app/stores";
  import { auth, db, storage } from "$lib/firebase/client";
  import { onAuthStateChanged, updateProfile, signOut } from "firebase/auth";
  import { doc, updateDoc, getDoc } from "firebase/firestore";
  import { ref, uploadBytes, getDownloadURL } from "firebase/storage";
  import CameraModal from "$lib/components/CameraModal.svelte";
  import { signout } from "$lib/functions/auth/signout";
  import themes from "$lib/data/themes.json";
  import bgPics from "$lib/data/bgPics.json";

  let url = null;
  let file = null;
  let theme = true;
  let colorVal = "#b69696";
  let fileError = null;
  let fileUploaded = false;

  const logout = async () => {
    $showSettingsModalMobile = false;
    await signout();
  };

  const handleAvatarChange = (e) => {
    const types = ["image/png", "image/jpg", "image/jpeg"];

    let selectedFile = e.target.files[0];
    console.log(selectedFile);

    if (selectedFile && types.includes(selectedFile.type)) {
      file = selectedFile;
      console.log(`>>> ${file.name} selected <<<`);
      fileError = null;
    } else {
      file = null;
      fileError = "Please select an image file (png or jpg)";
    }
  };

  const handleFileChange = async (e) => {
    console.log("handle file change");
    $file = e.target.files[0];
    console.log($file);

    $imageURL = await readURL($file);
    console.log("image url: ", $imageURL);

    let userRef = doc(db, "users", $myDoc.name);
    await updateDoc(userRef, {
      bgColor: `url(${$imageURL})`,
    });

    $imageTitle = $file.name;
    console.log("image title: ", $imageTitle);
  };

  const readURL = (file) => {
    return new Promise((res, rej) => {
      const reader = new FileReader();
      reader.onload = (e) => res(e.target.result);
      reader.onerror = (e) => rej(e);
      reader.readAsDataURL(file);
    });
  };

  const uploadTheme = async (theme) => {
    console.log("theme: ", theme);
    console.log("selected user: ", $selectedUsername);

    let userRef = doc(db, "users", $myDoc.name);
    await updateDoc(userRef, {
      bgColor: `url(${theme.url})`,
    });
  };

  const uploadGradient = async (gradient) => {
    console.log("gradient: ", gradient);
    console.log("selected user: ", $selectedUsername);

    let userRef = doc(db, "users", $myDoc.name);
    await updateDoc(userRef, {
      bgColor: gradient.background,
    });
  };

  const uploadColor = async (color) => {
    console.log("color: ", color);
    console.log("selected user: ", $selectedUsername);

    let userRef = doc(db, "users", $myDoc.name);
    await updateDoc(userRef, {
      bgColor: color,
    });
  };

  $: if (file) {
    /* change file type to .png */
    let blob = file.slice(0, file.size, "image/png");
    let newFile = new File([blob], "avatar.png", { type: "image/png" });
    let imageRef = ref(
      storage,
      `letschat/profile/${$loggedinUser.displayName}/${newFile.name}`
    );

    /* upload image */
    fileUploaded = true;
    uploadBytes(imageRef, file).then(() => {
      console.log(">>> image upload completed <<<");
      getDownloadURL(imageRef).then((_url) => {
        url = _url;
      });
    });
  }

  $: if (url) {
    /* update user profile */
    updateProfile($loggedinUser, {
      photoURL: url,
    }).then(() => {
      $profileUpdated = true;
      console.log(">>> use profile uupdated <<<");
    });

    /* update user document */
    let userRef = doc(db, "whatzapp_users", $loggedinUser.email);
    updateDoc(userRef, {
      avatar: url,
    }).then(() => {
      console.log(">>> user avatar updated <<<");
      fileUploaded = false;
    });
  }
</script>

<ul
  class="modal-settings"
  on:click|stopPropagation={() => console.log("settings modal clicked !")}
  transition:fly={{ x: -60, duration: 100, delay: 100 }}
  >
  <!-- style:width={$mobile ? "80%" : "100%"} -->
  <div class="top">
    <svg
      xmlns="http://www.w3.org/2000/svg"
      class="ionicon"
      viewBox="0 0 512 512"
      width="24"
      height="24"
      fill="currentColor"
      style:margin-left="5px"
      on:click|stopPropagation={() => ($showSettingsModalMobile = false)}
    >
      <path
        fill="none"
        stroke="currentColor"
        stroke-linecap="round"
        stroke-linejoin="round"
        stroke-width="48"
        d="M244 400L100 256l144-144M120 256h292"
      />
    </svg>
  </div>

  <div class="main">
    <div class="user-profile">
      <div class="avatar-section">
        <div class="image-wrapper">
          {#if $myDoc}
            {#if $myDoc.avatar && !fileUploaded}
              <img class="image" src={$myDoc.avatar} alt="" />
            {/if}
            {#if fileUploaded}
              <div class="loading">
                <img
                  src="https://c.tenor.com/On7kvXhzml4AAAAi/loading-gif.gif"
                  alt=""
                  width="20"
                  height="20"
                />
              </div>
            {/if}
            <label>
              <input
                type="file"
                on:change={handleAvatarChange}
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
            <div class="user-avatar loading-animation" />
          {/if}
        </div>
      </div>

      {#if $myDoc}
        <li style:padding="0">
          <h3 style:width="120px">
            {$myDoc.name}
          </h3>
        </li>
        <li style:padding="0">
          <p>{$myDoc.email}</p>
        </li>
      {:else}
        <li style:padding="0">
          <h3 class="user-name" style:width="120px">
            <span class="loading-animation">maskman</span>
          </h3>
        </li>
        <li style:padding="0">
          <p class="user-email">
            <span class="loading-animation">maskman@mail.com</span>
          </p>
        </li>
      {/if}
    </div>

    {#if $myDoc}
      <li>
        <div
          class="option"
          on:click|stopPropagation={() => ($showThemeMenu = !$showThemeMenu)}
        >
          <div class="content">
            <div class="title-wrapper">
              <span class="menu-item">Image gallery</span>
            </div>
            {#if !$showThemeMenu}
              <svg
                xmlns="http://www.w3.org/2000/svg"
                class="ionicon"
                viewBox="0 0 512 512"
                width="15"
                height="15"
                fill="currentColor"
              >
                <path
                  d="M98 190.06l139.78 163.12a24 24 0 0036.44 0L414 190.06c13.34-15.57 2.28-39.62-18.22-39.62h-279.6c-20.5 0-31.56 24.05-18.18 39.62z"
                />
              </svg>
            {:else}
              <svg
                xmlns="http://www.w3.org/2000/svg"
                class="ionicon"
                viewBox="0 0 512 512"
                width="15"
                height="15"
                fill="currentColor"
                style:margin-left="26px"
              >
                <path
                  d="M414 321.94L274.22 158.82a24 24 0 00-36.44 0L98 321.94c-13.34 15.57-2.28 39.62 18.22 39.62h279.6c20.5 0 31.56-24.05 18.18-39.62z"
                />
              </svg>
            {/if}
          </div>
        </div>
        {#if $showThemeMenu}
          <main>
            {#each bgPics as bgPic}
              <div
                class="theme-item"
                style:cursor="pointer"
                on:click={() => uploadTheme(bgPic)}
              >
                <div
                  class="theme-image"
                  style:background-image={`url(${bgPic.url})`}
                />
              </div>
            {/each}
          </main>
        {/if}
      </li>

      <li>
        <div
          class="option"
          on:click={() => ($showGradientMenu = !$showGradientMenu)}
        >
          <div class="content">
            <div class="title-wrapper">
              <span class="menu-item">Gradient gallery</span>
            </div>
            {#if !$showGradientMenu}
              <svg
                xmlns="http://www.w3.org/2000/svg"
                class="ionicon icon-arrow-down"
                viewBox="0 0 512 512"
                width="15"
                height="15"
                fill="currentColor"
              >
                <path
                  d="M98 190.06l139.78 163.12a24 24 0 0036.44 0L414 190.06c13.34-15.57 2.28-39.62-18.22-39.62h-279.6c-20.5 0-31.56 24.05-18.18 39.62z"
                />
              </svg>
            {:else}
              <svg
                xmlns="http://www.w3.org/2000/svg"
                class="ionicon icon-arrow-up"
                viewBox="0 0 512 512"
                width="15"
                height="15"
                fill="currentColor"
              >
                <path
                  d="M414 321.94L274.22 158.82a24 24 0 00-36.44 0L98 321.94c-13.34 15.57-2.28 39.62 18.22 39.62h279.6c20.5 0 31.56-24.05 18.18-39.62z"
                />
              </svg>
            {/if}
          </div>
        </div>
        {#if $showGradientMenu}
          <main>
            {#each themes as theme}
              <div
                class="theme-item"
                style:cursor="pointer"
                on:click={() => uploadGradient(theme)}
              >
                <div
                  class="theme-image"
                  style:background-image={theme.background}
                />
              </div>
            {/each}
          </main>
        {/if}
      </li>

      <li>
        <div class="content" style:cursor="auto" style:height="18px">
          <div class="title-wrapper">
            <span class="menu-item">Select Color</span>
          </div>
          <input
            type="color"
            bind:value={colorVal}
            on:input|stopPropagation={() => uploadColor(colorVal)}
            style:cursor="pointer"
          />
        </div>
      </li>

      {#if !$isMobile}
        <li>
          <div class="content">
            <label>
              <span class="menu-item" style:cursor="pointer">Select image</span>
              <input
                type="file"
                on:change={handleFileChange}
                accept="image/png, image/jpg, image/jpeg"
              />
            </label>
          </div>
        </li>
      {/if}

      <li>
        <div class="content">
          <span class="menu-item">Switch Language</span>
        </div>
      </li>

      <li>
        <div class="content">
          <span class="menu-item">About</span>
        </div>
      </li>

      <li on:click={logout}>
        <div class="content">
          <span class="menu-item">Logout</span>
        </div>
      </li>
    {:else}
      <div class="loading-skeleton">
        <div class="loading-menu-item loading-animation" />
        <div class="loading-menu-item loading-animation" />
        <div class="loading-menu-item loading-animation" />
        <div class="loading-menu-item loading-animation" />
        <div class="loading-menu-item loading-animation" />
        <div class="loading-menu-item loading-animation" />
      </div>
    {/if}
  </div>
</ul>

<style>
  .loading-skeleton {
    display: flex;
    flex-direction: column;
    align-items: center;
    justify-content: center;
    /* border: 1px solid; */
  }

  .loading-menu-item {
    height: 20px;
    width: 150px;
    margin-bottom: 22px;
    background-color: hsl(196, 13%, 78%);
    background-color: hsl(200, 20%, 95%);
    border-radius: 4px;
  }

  .modal-settings {
    background: #ebebeb;
    /* width: 100vw; */

    /* box-shadow: h-offset v-offset blur spread */
    /* box-shadow: 1px 0px 5px 0px #bebbbb; */
  }

  .loading {
    width: 100px;
    height: 100px;
    display: flex;
    justify-content: center;
    align-items: center;
  }

  span.menu-item {
    font-size: 14px;
    letter-spacing: 0.8px;
    width: 100%;
    /* border: 1px solid red; */
  }

  h3.user-name {
    margin-bottom: 5px;
    margin-top: 10px;
  }

  p {
    text-align: left;
    letter-spacing: 0.8px;
    font-size: 16px;
  }

  h3 span,
  p span {
    color: transparent;
    line-height: 0.7;
    border-radius: 4px;
  }

  .user-avatar {
    width: 100px;
    height: 100px;
    border-radius: 50px;
  }

  label input {
    width: 0;
    height: 0;
    opacity: 0;
  }

  .icon-camera {
    width: 24px;
    height: 24px;
    position: absolute;
    right: -10px;
    bottom: -10px;
  }

  .image-wrapper .image {
    border-radius: 8px;
    object-fit: cover;
    height: 100px;
  }

  .image-wrapper {
    position: relative;
    display: flex;
    flex-direction: column;
    justify-content: center;
    width: 100px;
  }

  .main {
    /* display: flex;
    flex-direction: column;
    justify-content: center; */
  }

  .user-profile .avatar-section {
    justify-content: center;
    align-items: center;
    margin-bottom: 15px;
    display: flex;
  }

  main {
    width: 100%;
    display: grid;
    grid-template-columns: auto auto auto auto;
    max-height: 400px;
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
    width: 140px;
    cursor: pointer;
    /* border: 1px solid; */
  }

  .top {
    height: 50px;
    margin-bottom: 10px;
    display: flex;
    align-items: center;
    /* border: 1px solid; */
  }

  label {
    display: flex;
    align-items: center;
    width: 100px;
  }

  li {
    margin: 0 10px;
    padding: 10px 0;
    list-style: none;
    margin-bottom: 5px;
    border-radius: 8px;

    display: flex;
    flex-direction: column;
    align-items: center;
    justify-content: center;
  }

  li h3 {
    text-align: center;
    margin-top: 10px;
  }

  ul {
    position: absolute;
    top: 0px;
    left: 0;
    width: 100%;
    z-index: 100;
    height: calc(100vh - 20px);
    border-radius: 8px;
    overflow-y: auto;
    padding-bottom: 30px;
    background: #ebebeb;
  }

  ::-webkit-scrollbar {
    width: 0px;
  }

  ::-webkit-scrollbar-thumb {
    background: inherit;
  }

  @media (max-width: 800px) {
    ul {
      height: 100vh;
      border-radius: 0px;
    }
  }
</style>
