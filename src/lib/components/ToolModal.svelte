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
    showToolModal,
  } from "$lib/store";
  import Cookies from "js-cookie";
  import themes from "$lib/data/themes.json";
  import bgPics from "$lib/data/bgPics.json";

  // let disabled = false;

  const setBgColor = (val) => {
    $bgColor = val;
    Cookies.set("bgColor", $bgColor);
  };

  const setBgPic = (url, title) => {
    console.log(`url: ${url}`)
    console.log(`image title: ${title}`)
    
    $imageTitle = title
    $imageURL = url;
    $background.src = $imageURL;
    if ($imageTitle === 'Default') {
      $bgOpacity = 0.06
      $bgColor = "#e5ddd5";
      $disabled = true
    }
    if ($imageTitle != 'Default') {
      $bgOpacity = 0.6
      $disabled = false
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
    $imageTitle = $file.name
    console.log('image title: ', $imageTitle)
    $background.src = $imageURL;
    $bgOpacity = 0.5;
    $disabled = false
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
  <ul>
    {#if !$isMobile}
      <li>
        <label>
          <input
            type="file"
            on:change={handleFileChange}
            accept="image/png, image/jpeg"
          />
          <span>選擇圖片</span>
        </label>
      </li>
    {/if}
    <li style:border-bottom={$disabled ? 'none': '1px solid rgba(0, 0, 0, 0.06)'}>
      <span>精選圖片</span>
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
    </li>
    {#if !$disabled}
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
      <li>
        <span>漸層</span>
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
              <!-- <span class="theme-title">{theme.title}</span> -->
            </div>
          {/each}
        </main>
      </li>
    {/if}
  </ul>
</div>

<style>
  @import url("$lib/styles/theme-modal.css");

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
    background: #ededed;
    /* background: rgba(255, 255, 255, 0.5); */
    backdrop-filter: blur(8px);
    width: 300px;
    text-align: center;
  }

  li {
    margin: 0;
    padding: 8px 0;
    list-style: none;
    color: #51585c;
    cursor: pointer;
    border-bottom: 1px solid rgba(0, 0, 0, 0.06);
  }

  .tool-modal {
    position: absolute;
    /* right: 18px; */
    right: 0;
    /* top: 50px; */
    top: 0;
    background: #ededed;
    /* background: rgba(255, 255, 255, 0.5); */
    /* border-bottom-left-radius: 4px;
    border-bottom-right-radius: 4px; */
    /* height: calc(100vh - 100px); */
    height: 100vh;
    overflow-y: auto;
    overflow-x: hidden;
  }
</style>
