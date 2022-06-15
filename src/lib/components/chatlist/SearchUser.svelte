<script>
  import { keyword, bgColor } from "$lib/store";
  import themeStore from "svelte-themes";
</script>

<!-- style:border-top={$themeStore.theme === "dark" ? "0.5px solid #3a3f50" : "1px solid #ebebeb"}
style:border-bottom={$themeStore.theme === "dark" ? "0.5px solid #3a3f50" : "1px solid #ebebeb"} -->
<div 
  class="search_user"
  >
  <!-- style:background={$themeStore.theme === "dark" ? "#292F3F" : $bgColor} -->
  <div class="search-user-wrapper">
    <input
      type="text"
      placeholder="Find user"
      bind:value={$keyword}
      style:background={$themeStore.theme === "dark" ? "#3A3F50" : "#ebebeb"}
      />
      <!-- style:background={$themeStore.theme === "dark" ? "#1F232F" : "#ebebeb"} -->

    <svg
      xmlns="http://www.w3.org/2000/svg"
      class="ionicon icon-finduser"
      viewBox="0 0 512 512"
      width="20"
      height="20"
      fill="currentCoklor"
      style:cursor="none"
    >
      <path
        d="M221.09 64a157.09 157.09 0 10157.09 157.09A157.1 157.1 0 00221.09 64z"
        fill="none"
        stroke="currentColor"
        stroke-miterlimit="10"
        stroke-width="32"
      />
      <path
        fill="none"
        stroke="currentColor"
        stroke-linecap="round"
        stroke-miterlimit="10"
        stroke-width="32"
        d="M338.29 338.29L448 448"
      />
    </svg>
  </div>
</div>

<style>
  .search_user {
    position: relative;
    top: 0px;
    width: 100%;
    padding: 0px 15px 10px 15px;
    padding: 0px 0px 10px 0px;
  }
  
  .search-user-wrapper {
    position: relative;
  }

  input {
    width: 100%;
    outline: none;
    border: none;
    padding: 10px;
    border-radius: 10px;
    font-size: 14px;
    padding-left: 40px;
  }

  .icon-finduser {
    position: absolute;
    left: 10px;
    top: 50%;
    transform: translateY(-50%);
  }

  ::placeholder {
    font-size: 16px;
  }
</style>
