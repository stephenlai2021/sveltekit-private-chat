<script>
  import {
    mobile,
    bgColor,
    profileUpdated,
    showThemeModal,
    showCameraModal,
    showSettingsModal,
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

  export let user;

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

<ul
  class="modal-settings"
  on:click|stopPropagation={() => console.log("settings modal clicked !")}
  transition:fly={{ x: -60, duration: 100, delay: 100 }}
>
  <div class="icon-arrow">
    <ion-icon
      name="arrow-back-outline"
      on:click|stopPropagation={() => ($showSettingsModal = false)}
    />
  </div>
  <div class="body-scroll" style:overflow-y={!$mobile ? "hidden" : "auto"}>
    <div class="user-profile">
      <div class="avatar-section">
        <div class="image-wrapper">
          {#if user.photoURL}
            <img src={user.photoURL} alt="" width="96" height="96" />
          {:else}
            <img src="/joke.png" alt="" width="96" height="96" />
          {/if}
          <!-- <ion-icon name="camera-outline" class="icon-camera" on:click|stopPropagation={() => $showCameraModal = true} /> -->
          <label>
            <input
              type="file"
              on:change={handleFileChange}
              accept="image/png, image/jpg, image/jpeg"
            />
            <ion-icon name="camera-outline" class="icon-camera" />
          </label>
        </div>
      </div>
      <h3>
        {user.displayName}
      </h3>
      <p>{user.email}</p>
    </div>
    <li>
      <div class="content">
        <ion-icon name="language-outline" />
        <div class="title-wrapper">
          <span class="menu-item">Lang</span>
        </div>
      </div>
    </li>
    <li class="theme" on:click={toggleTheme}>
      <div class="content">
        {#if $themeStore.theme === "light"}
          <ion-icon name="moon-outline" />
          <div class="title-wrapper">
            <span class="menu-item">Dark</span>
          </div>
        {:else}
          <ion-icon name="sunny-outline" />
          <div class="title-wrapper">
            <span class="menu-item">Light</span>
          </div>
        {/if}
      </div>
    </li>
    <!-- <li>
      <div class="content">
        <label>
          <input
            type="color"
            bind:value={$bgColor}
            on:input|stopPropagation={() => Cookies.set("bgColor", $bgColor)}
            style:height="0"
            style:width="0"
            style:opacity="0"
          />
          <ion-icon name="color-palette-outline" class="icon-palette" />
          <div class="title-wrapper" style:cursor="pointer">
            <span class="menu-item">Color</span>
          </div>
        </label>
      </div>
    </li>
    <li>
      <div class="content">
        <ion-icon name="image-outline" />
        <div class="title-wrapper">
          <span
            class="menu-item"
            on:click|stopPropagation={() => ($showThemeModal = true)}
            >Theme</span
          >
        </div>
      </div>
    </li> -->
    <li>
      <div class="content">
        <ion-icon name="information-circle-outline" />
        <div class="title-wrapper">
          <span class="menu-item">About</span>
        </div>
      </div>
    </li>
    <li on:click={logout}>
      <div class="content">
        <ion-icon name="log-out-outline" />
        <div class="title-wrapper">
          <span class="menu-item">Logout</span>
        </div>
      </div>
    </li>
  </div>
  <!-- {#if showCameraModal}
    <CameraModal />
  {/if} -->
</ul>

<style>
  label input {
    width: 0;
    height: 0;
    opacity: 0;
  }

  .icon-camera {
    width: 28px;
    height: 28px;
    position: absolute;
    right: 0;
    bottom: 0;
  }

  .image-wrapper img {
    border-radius: 8px;
    object-fit: contain;
  }

  .image-wrapper {
    position: relative;
  }

  .body-scroll {
    height: 80vh;
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
    /* border: 1px solid; */
  }

  .user-profile {
    margin-bottom: 30px;
  }

  .title-wrapper {
    width: 100%;
    text-align: center;
    /* border: 1px solid red; */
  }

  .content {
    display: flex;
    align-items: center;
    justify-content: space-between;
    width: 100px;
    cursor: pointer;
    /* border: 1px solid; */
  }

  .icon-arrow {
    display: flex;
    align-items: center;
    padding: 5px;
    padding-top: 10px;
    display: flex;
    justify-content: flex-start;
    /* border: 1px solid; */
  }

  .icon-palette {
    margin-left: -3px;
    margin-right: 3px;
  }

  label {
    display: flex;
    align-items: center;
    width: 100px;
  }

  ul {
    list-style: none;
    padding: 10px;
    position: absolute;
    top: 0;
    left: 0;
    width: 100%;
    height: 100vh;
    z-index: 200;
    background: rgba(189, 202, 202, 0.5);
    backdrop-filter: blur(30px);
  }

  li {
    display: flex;
    align-items: baseline;
    justify-content: center;
    padding: 10px 20px;
    /* cursor: pointer; */
  }
</style>
