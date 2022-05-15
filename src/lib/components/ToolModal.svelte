<script>
  import { imageURL, bgOpacity, background, file, isMobile } from "$lib/store";

  const handleFileChange = async (e) => {
    $file = e.target.files[0];
    console.log($file);

    $imageURL = await readURL($file);
    $background.src = $imageURL;
    $bgOpacity = 0.6;
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
  <!-- <div class="icon-wrapper">
    <ion-icon name="close-outline"></ion-icon>
  </div> -->
  <ul>
    {#if !$isMobile}
      <li>
        <label>
          <input
            type="file"
            on:change={handleFileChange}
            accept="image/png, image/jpeg"
          />
          背景圖片
        </label>
      </li>
    {/if}
    <li>背景顏色</li>
    <li>背景漸層</li>
  </ul>
</div>

<style>
  .icon-wrapper {
    display: flex;
    justify-content: flex-end;
  }

  label {
    /* padding: 0; */
    display: flex;
    /* appearance: none; */
    cursor: pointer;
    /* border: 1px solid; */
  }

  label input {
    width: 0;
    height: 0;
    opacity: 0;
  }

  ul {
    /* margin: 0; */
    padding: 10px;
    border-radius: 8px;
    background: rgba(255, 255, 255, 0.5);
    backdrop-filter: blur(8px);
    /* border: 1px solid; */
  }

  li {
    margin: 0;
    padding: 3px;
    list-style: none;
  }

  .tool-modal {
    position: absolute;
    right: 18px;
    top: 50px;
  }
</style>
