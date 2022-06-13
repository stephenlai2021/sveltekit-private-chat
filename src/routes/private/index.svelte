<script>
  import { bgColor, mobile } from "$lib/store";
  import themeStore from "svelte-themes";
  import { page } from "$app/stores";
</script>

<div
  class="rightSide"
  style:background={$themeStore.theme === "dark" ? "#292F3F" : $bgColor}
  style:display={$mobile && $page.url.pathname === "/" ? "none" : "block"}
  style:width={$mobile && $page.url.pathname === "/"
    ? "0%"
    : $mobile && $page.url.pathname != "/"
    ? "100vw"
    : "100vw"}
>
  <div class="page-wrapper">
    <h1>This is Private Chat</h1>
    <svg
      xmlns="http://www.w3.org/2000/svg"
      class="ionicon"
      viewBox="0 0 512 512"
      fill="currentColor"
      on:click={() => goto("/")}
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
</div>
