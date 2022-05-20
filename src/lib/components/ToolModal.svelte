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
  } from "$lib/store";
  import Cookies from "js-cookie";
  import themes from "$lib/data/themes.json";
  import bgPics from "$lib/data/bgPics.json";
  import { fly, fade } from "svelte/transition";
  import { page } from "$app/stores";

  // let disabled = false;

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
    // if ($imageTitle.includes('Animation')) {
    //   $bgOpacity = 1
    //   $disabled = true
    // }
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
  transition:fly={{ x: 60, duration: 100, delay: 100 }}
>
  <h3 class="title">背景設置</h3>
  <ul>
    {#if !$isMobile}
      <li>
        <label>
          <input
            type="file"
            on:change={handleFileChange}
            accept="image/png, image/jpg, image/jpeg"
          />
          <span>選擇圖片</span>
        </label>
      </li>
    {/if}
    <!-- <li
      style:border-bottom={$disabled ? "none" : "1px solid rgba(0, 0, 0, 0.06)"}
    > -->
    <li>
      <div class="option" on:click={() => ($showThemeMenu = !$showThemeMenu)}>
        <div class="content">
          {#if !$showThemeMenu}
            <ion-icon name="caret-down-outline" />
          {:else}
            <ion-icon name="caret-up-outline" />
          {/if}
          <span class="content-title">精選圖片</span>
        </div>
      </div>
      {#if $showThemeMenu}
        <main>
          {#each bgPics as bgPic}
            <div
              class="theme-item"
              style:cursor="pointer"
              on:click={() => setBgPic(bgPic.url, bgPic.title)}
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
            {#if !$showGradientMenu}
              <ion-icon name="caret-down-outline" />
            {:else}
              <ion-icon name="caret-up-outline" />
            {/if}
            <span class="content-title">漸層</span>
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
      <li>
        <label>
          <input
            type="color"
            bind:value={$bgColor}
            on:input|stopPropagation={() => Cookies.set("bgColor", $bgColor)}
            style:height="0"
            style:width="0"
            style:opacity="0"
          />
          <span>顏色/透明度</span>
        </label>
      </li>
    {/if}
  </ul>
  <h4 class="title" on:click={() => $showMapModal = true}>顯示 {$page.params.userId} 的地理位置</h4>
</div>

<style>
  @import url("$lib/styles/theme-modal.css");

  .content-title {
    width: 70px;
    text-align-last: left;
    /* border: 1px solid; */
  }

  .content {
    width: 120px;
    display: flex;
    justify-content: space-between;
    align-items: center;
    /* border: 1px solid; */
  }

  .option ion-icon {
    width: 15px;
    height: 15px;
    /* border: 1px solid; */
    margin-right: 20px;
    /* color: #a8b0b4; */
  }

  .option {
    display: flex;
    justify-content: center;
    align-items: center;
    /* border: 1px solid; */
  }

  .title {
    padding: 10px;
    text-align: center;
    cursor: pointer;
    /* border: 1px solid; */
  }

  li:hover {
    background: none;
  }

  li:active {
    background: none;
  }

  .title,
  li {
    color: #51585c;
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
    /* padding: 10px; */
    border-radius: 8px;
    /* background: #ededed; */
    /* background: rgba(255, 255, 255, 0.5); */
    /* backdrop-filter: blur(8px); */
    /* width: 300px; */
    text-align: center;
    border-bottom: 1px solid rgba(0, 0, 0, 0.06);
  }

  li {
    margin: 0;
    padding: 8px 0;
    list-style: none;
    cursor: pointer;
    /* border-bottom: 1px solid rgba(0, 0, 0, 0.06); */
  }

  .tool-modal {
    position: fixed;
    right: 0;
    top: 0;
    z-index: 600;
    width: 300px;
    background: rgba(229, 221, 222, 0.5);
    height: 100vh;
    overflow-y: auto;
    overflow-x: hidden;
    backdrop-filter: blur(50px);
  }
</style>
