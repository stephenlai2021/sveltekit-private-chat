<script>
  import {
    file,
    mobile,
    bgColor,
    disabled,
    imageTitle,
    isMobile,
    imageURL,
    bgOpacity,
    background,
    showThemeMenu,
    showGradientMenu,
    showMapModal,
    showToolModal,
    showToolModalMobile,
    currentSelectedUser,
    widthLessthan1000,
    selectedUserReady,
  } from "$lib/store";
  import Cookies from "js-cookie";
  import themes from "$lib/data/themes.json";
  import bgPics from "$lib/data/bgPics.json";
  import { fly, fade } from "svelte/transition";
  import { page } from "$app/stores";
  import themeStore from "svelte-themes";
  import { widthLessthan1200 } from "../store";

  const setBgColor = (val) => {
    $bgColor = val;
    Cookies.set("bgColor", $bgColor);
  };

  const setBgPic = (url, title) => {
    console.log(`url: ${url}`);
    console.log(`image title: ${title}`);

    $imageTitle = title;
    $imageURL = url;
    $background.src = $imageURL;
    if ($imageTitle === "Default") {
      $bgOpacity = 0.06;
      $bgColor = "#e5ddd5";
      $disabled = true;
    }
    if ($imageTitle != "Default") {
      $bgOpacity = 0.6;
      $disabled = false;
    }
  };

  const handleFileChange = async (e) => {
    $file = e.target.files[0];
    console.log($file);
    $showToolModal = false;

    $imageURL = await readURL($file);
    console.log("image url: ", $imageURL);
    $imageTitle = $file.name;
    console.log("image title: ", $imageTitle);
    $background.src = $imageURL;
    $bgOpacity = 0.5;
    $disabled = false;
  };

  const readURL = (file) => {
    return new Promise((res, rej) => {
      const reader = new FileReader();
      reader.onload = (e) => res(e.target.result);
      reader.onerror = (e) => rej(e);
      reader.readAsDataURL(file);
    });
  };
</script>

<div class="tool-modal" on:click|stopPropagation>
  <!-- style:display={$page.url.pathname != "/login" && $widthLessthan1000
    ? "none"
    : $page.url.pathname === "/login"
    ? "none"
    : "block"} -->
  <div class="top">
    {#if $selectedUserReady && $currentSelectedUser}
      <svg
        xmlns="http://www.w3.org/2000/svg"
        class="ionicon icon-back"
        viewBox="0 0 512 512"
        width="24"
        height="24"
        fill="currentColor"
        on:click|stopPropagation={() => ($showToolModalMobile = false)}
      >
        <path
          fill="none"
          stroke="currentColor"
          stroke-linecap="round"
          stroke-linejoin="round"
          stroke-width="48"
          d="M184 112l144 144-144 144"
        />
      </svg>
    {/if}
  </div>
  <div class="user-profile">
    <div class="avatar-section">
      <div class="image-wrapper">
        {#if $selectedUserReady && $currentSelectedUser}
          <img
            src={$currentSelectedUser.avatar}
            alt=""
            width="80"
            height="80"
          />
        {:else if $page.url.pathname === "/"}
          <span />
        {:else}
          <div class="user-avatar animation" />
        {/if}
      </div>
    </div>

    {#if $selectedUserReady && $currentSelectedUser}
      <li style:padding="0">
        <h3>{$currentSelectedUser.name}</h3>
      </li>
      <li style:padding="0">
        <p>{$currentSelectedUser.email}</p>
      </li>
    {:else if $page.url.pathname === "/"}
      <span />
    {:else}
      <li style:padding="0">
        <h3 class="user-name" style:width="140px">
          <span class="animation">maskman</span>
        </h3>
      </li>
      <li style:padding="0">
        <p class="user-email" style:width="140px">
          <span class="animation">maskman@mail.com</span>
        </p>
      </li>
    {/if}
  </div>

  {#if $selectedUserReady && $currentSelectedUser}
    <ul>
      {#if $themeStore.theme === "light"}
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
                  style:margin-left="26px"
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
                  on:click={() =>
                    ($bgColor = `no-repeat center center url(${bgPic.url})`)}
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
        {#if !$disabled}
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
                    class="ionicon"
                    viewBox="0 0 512 512"
                    width="15"
                    height="15"
                    fill="currentColor"
                    style:margin-left="10px"
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
                    style:margin-left="10px"
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
                    on:click={() => setBgColor(theme.background)}
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
          {#if !$isMobile}
            <li>
              <div class="content">
                <label>
                  <input
                    type="file"
                    on:change={handleFileChange}
                    accept="image/png, image/jpg, image/jpeg"
                  />
                </label>
                <div class="title-wrapper">
                  <span class="menu-item">Select image</span>
                </div>
              </div>
            </li>
          {/if}

          <li>
            <div class="content">
              <label>
                <input
                  type="color"
                  bind:value={$bgColor}
                  on:input|stopPropagation={() =>
                    Cookies.set("bgColor", $bgColor)}
                />
                <!-- style:height="0"
              style:width="0"
              style:opacity="0" -->
              </label>
              <div class="title-wrapper">
                <span class="menu-item">Select single color</span>
              </div>
            </div>
          </li>
        {/if}
      {/if}
      <li on:click={() => ($showMapModal = true)}>
        <div class="content">
          <div class="title-wrapper">
            <span class="menu-item">Show location</span>
          </div>
        </div>
      </li>
    </ul>
  {/if}
</div>

<style>
  @import url("$lib/styles/theme-modal.css");

  .icon-back {
    margin-right: 5px;
    /* border: 1px solid; */
  }

  .user-avatar {
    width: 80px;
    height: 80px;
    border-radius: 50px;
  }

  main {
    width: 100%;
    /* border: 1px solid; */
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

  .image-wrapper {
    position: relative;
    display: flex;
    flex-direction: column;
    justify-content: center;
    width: 140px;
    /* border: 1px solid; */
  }

  .image-wrapper img {
    border-radius: 8px;
    object-fit: contain;
  }

  span.menu-item {
    font-size: 14px;
    letter-spacing: 0.8px;
  }

  h3.user-name {
    margin-bottom: 5px;
    margin-top: 10px;
  }

  h3,
  p {
    text-align: left;
    letter-spacing: 0.8px;
    font-size: 16px;
    width: 140px;
    /* border: 1px solid; */
  }

  h3 span,
  p span {
    color: transparent;
    line-height: 0.7;
    border-radius: 4px;
  }

  .theme-item {
    padding: 0;
    /* border: 1px solid red; */
  }

  .top {
    height: 60px;
    display: flex;
    justify-content: flex-end;
    align-items: center;
    margin-bottom: 10px;
    /* border: 1px solid; */
  }

  .content {
    width: 140px;
    display: flex;
    /* border: 1px solid; */
  }

  .option {
    display: flex;
    justify-content: center;
    align-items: center;
  }

  label {
    margin-left: 0px;
    cursor: pointer;
  }

  label input {
    width: 0;
    height: 0;
    opacity: 0;
  }

  ul {
    text-align: center;
    display: flex;
    flex-direction: column;
  }

  li {
    margin: 0 10px;
    padding: 10px 0;
    list-style: none;
    cursor: pointer;
    margin-bottom: 5px;
    border-radius: 8px;
    display: flex;
    flex-direction: column;
    align-items: center;
    justify-content: center;
    /* border: 1px solid; */
  }

  ::-webkit-scrollbar {
    width: 0px;
  }

  ::-webkit-scrollbar-thumb {
    background: inherit;
  }

  .tool-modal {
    position: absolute;
    top: 10px;
    bottom: 10px;
    right: 0;
    width: 80%;
    border-radius: 8px;
    z-index: 500;
    overflow-y: auto;
    overflow-x: hidden;
    /* background: #ebebeb; */
    background: white;
  }

  @media (max-width: 800px) {
    .tool-modal {
      top: 0px;
      bottom: 0px;
    }
  }
</style>
