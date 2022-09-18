<script>
  import {
    myDoc,
    mobile,
    bgColor,
    initial,
    isLogout,
    loggedinUser,
    showThemeModal,
    showCameraModal,
    showSettingsModal,
    widthLessthan1200,
  } from "$lib/store";
  import { fly } from "svelte/transition";
  import { page } from "$app/stores";
  import { db, storage } from "$lib/firebase/client";
  import { updateProfile } from "firebase/auth";
  import { doc, updateDoc } from "firebase/firestore";
  import { ref, uploadBytes, getDownloadURL } from "firebase/storage";
  import { signout } from "$lib/functions/auth/signout";

  let url = null;
  let file = null;
  let theme = false;
  let fileError = null;
  let uploadedDone = false
  let fileUploaded = false;

  const logout = async () => {
    $showSettingsModal = false;
    $initial = false;
    await signout();
  };

  const handleFileChange = (e) => {
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
      console.log(">>> image uploaded <<<");
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
      console.log(">>> user profile uupdated <<<");
    });

    /* update user document */
    let userRef = doc(db, "users", $loggedinUser.displayName);
    updateDoc(userRef, {
      avatar: url,
    }).then(() => {
      console.log(">>> user document updated <<<");
      fileUploaded = false;
    });
  }
</script>

<ul
  class="modal-settings"
  on:click|stopPropagation
  transition:fly={{ x: -60, duration: 100, delay: 100 }}
  style:display={$page.url.pathname != "/login" && $widthLessthan1200
    ? "none"
    : $page.url.pathname === "/login"
    ? "none"
    : "block"}
>
  <div class="top" />
  <div class="main">
    <div class="user-profile">
      <div class="avatar-section">
        <div class="image-wrapper">
          {#if $myDoc}
            {#if $myDoc.avatar && !fileUploaded}
              <img class="image" src={$myDoc.avatar} alt="" />
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
            {/if}
            {#if fileUploaded}
              <div class="loading">
                <img
                  class="loading-gif"
                  src="https://c.tenor.com/On7kvXhzml4AAAAi/loading-gif.gif"
                  alt=""
                  width="20"
                  height="20"
                />
              </div>
            {/if}
          {:else}
            <div class="user-avatar animation" />
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
            <span class="animation">maskman</span>
          </h3>
        </li>
        <li style:padding="0">
          <p class="user-email">
            <span class="animation">maskman@mail.com</span>
          </p>
        </li>
      {/if}
    </div>

    <!-- {#if $loggedinUser} -->
    <li>
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
    <li>
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
    <li on:click={logout}>
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
    <!-- {/if} -->
  </div>
</ul>

<style>
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
    position: absolute;
    right: -32px;
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
    display: flex;
    flex-direction: column;
    justify-content: center;
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

  li {
    list-style: none;
    display: flex;
    align-items: baseline;
    justify-content: center;
    padding: 5px 20px;
    margin: 0 10px;
    margin-bottom: 5px;
    border-radius: 8px;
  }

  li h3 {
    text-align: center;
    margin-top: 10px;
  }

  ul {
    min-width: 250px;
    backdrop-filter: blur(20px);
    border-radius: 8px;
    margin: 10px;
    background: rgba(235, 235, 235, .5);
    box-shadow: 1px 0px 5px 0px #bebbbb;
  }
</style>
