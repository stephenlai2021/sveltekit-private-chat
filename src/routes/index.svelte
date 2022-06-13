<script>
  import { bgColor, mobile } from "$lib/store";
  import themeStore from "svelte-themes";
  import { page } from "$app/stores";
</script>

<svelte:head>
  <title>Home</title>
</svelte:head>

<!-- $mobile && ($page.url.pathname === "/" || $page.url.pathname === "/private" || $page.url.pathname === "/group" || $page.url.pathname === "/public") ?  -->
<div 
  class="rightSide"
  style:background={$themeStore.theme === "dark" ? "#292F3F" : $bgColor}
  style:display={$mobile && $page.url.pathname === "/" ? "none" : "block"}
  style:width={
    $mobile && $page.url.pathname === "/" ? 
      "0%"
    : $mobile && $page.url.pathname != "/" ? 
      "100vw"
    : "100vw"}
>
  <div class="page-wrapper">
    <h1>This is All Chat</h1>
  </div>
</div>
