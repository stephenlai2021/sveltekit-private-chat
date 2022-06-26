<script>
  import {
    file,
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
    currentSelectedUser,
    widthLessthan1000,
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

<div
  class="tool-modal"
  on:click|stopPropagation
  style:background={$themeStore.theme === "dark"
    ? "#292F3F"
    : "rgba(235, 235, 235, .5)"}
>
  {#if $currentSelectedUser}
    <div class="top">
      <svg
        xmlns="http://www.w3.org/2000/svg"
        class="ionicon icon-back"
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
          stroke-width="48"
          d="M184 112l144 144-144 144"
        />
      </svg>
    </div>
    <div class="user-profile">
      <div class="avatar-section">
        <div class="image-wrapper">
          {#if $currentSelectedUser.avatar}
            <img
              src={$currentSelectedUser.avatar}
              alt=""
              width="96"
              height="96"
            />
          {:else}
            <img src="/joke.png" alt="" width="96" height="96" />
          {/if}
        </div>
      </div>
      <h3>
        {$currentSelectedUser.name}
      </h3>
      <p>{$currentSelectedUser.email}</p>
    </div>
    <ul>
      {#if !$isMobile}
        <li
          style:background={$themeStore.theme === "dark"
            ? "#3A3F50"
            : "white"}
        >
          <label>
            <input
              type="file"
              on:change={handleFileChange}
              accept="image/png, image/jpg, image/jpeg"
            />
            <span>Select image from file</span>
          </label>
        </li>
      {/if}
      <li
        style:background={$themeStore.theme === "dark" ? "#3A3F50" : "white"}
      >
        <div
          class="option"
          on:click|stopPropagation={() => ($showThemeMenu = !$showThemeMenu)}
        >
          <div class="content">
            {#if !$showThemeMenu}
              <svg
                xmlns="http://www.w3.org/2000/svg"
                class="ionicon"
                viewBox="0 0 512 512"
                width="15"
                height="15"
                fill="currentColor"
                style:margin-right="20px"
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
                style:margin-right="20px"
              >
                <path
                  d="M414 321.94L274.22 158.82a24 24 0 00-36.44 0L98 321.94c-13.34 15.57-2.28 39.62 18.22 39.62h279.6c20.5 0 31.56-24.05 18.18-39.62z"
                />
              </svg>
            {/if}
            <span class="content-title">Image gallery</span>
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
                <!-- on:click={() => setBgPic(bgPic.url, bgPic.title)} -->
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
        <li
          style:background={$themeStore.theme === "dark"
            ? "#3A3F50"
            : "white"}
        >
          <div
            class="option"
            on:click={() => ($showGradientMenu = !$showGradientMenu)}
          >
            <div class="content">
              {#if !$showGradientMenu}
                <svg
                  xmlns="http://www.w3.org/2000/svg"
                  class="ionicon"
                  viewBox="0 0 512 512"
                  width="15"
                  height="15"
                  fill="currentColor"
                  style:margin-right="20px"
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
                  style:margin-right="20px"
                >
                  <path
                    d="M414 321.94L274.22 158.82a24 24 0 00-36.44 0L98 321.94c-13.34 15.57-2.28 39.62 18.22 39.62h279.6c20.5 0 31.56-24.05 18.18-39.62z"
                  />
                </svg>
              {/if}
              <span class="content-title">Gradient gallery</span>
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
        <li
          style:background={$themeStore.theme === "dark"
            ? "#3A3F50"
            : "white"}
        >
          <label>
            <input
              type="color"
              bind:value={$bgColor}
              on:input|stopPropagation={() => Cookies.set("bgColor", $bgColor)}
              style:height="0"
              style:width="0"
              style:opacity="0"
            />
            <span>Select single color</span>
          </label>
        </li>
      {/if}
      <li
        style:background={$themeStore.theme === "dark" ? "#3A3F50" : "white"}
        on:click={() => ($showMapModal = true)}
      >
        <!-- <span>Show {JSON.parse($selectedUser)}'s location</span> -->
        <!-- <span>Show location of {$currentSelectedUser.name}</span> -->
        <span>Show location</span>
      </li>
    </ul>
    <!-- <h4 class="title" on:click={() => $showMapModal = true}>顯示 {$page.params.userId} 的地理位置</h4> -->
  {/if}
</div>

<style>
  @import url("$lib/styles/theme-modal.css");

  .icon-back {
    display: none;
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

  .image-wrapper img {
    border-radius: 8px;
  }

  h3,
  p {
    text-align: center;
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
    width: 180px;
    display: flex;
    align-items: center;
    /* border: 1px solid; */
  }

  .option {
    display: flex;
    justify-content: center;
    align-items: center;
  }

  label {
    margin-left: -5px;
    cursor: pointer;
  }

  label input {
    width: 0;
    height: 0;
    opacity: 0;
  }

  ul {
    text-align: center;
    /* border-bottom: 1px solid rgba(0, 0, 0, 0.06); */
    display: flex;
    flex-direction: column;
    /* margin-top: 120px; */
  }

  li {
    margin: 0 10px;
    padding: 10px 0;
    list-style: none;
    cursor: pointer;
    background: white;
    margin-bottom: 5px;
    border-radius: 8px;
  }

  ::-webkit-scrollbar {
    width: 0px;
  }

  ::-webkit-scrollbar-thumb {
    background: inherit;
  }

  .tool-modal {
    /* position: absolute;
    right: 0;
    top: 0;
    z-index: 600; */
    /* display: flex;
    flex-direction: column;
    justify-content: center; */
    min-width: 250px;
    height: 100vh;
    overflow-y: auto;
    overflow-x: hidden;
    backdrop-filter: blur(20px);
  }

  @media (max-width: 1000px) {
    .tool-modal {
      display: none;
    }
  }
</style>
