<script>
  import { goto } from "$app/navigation";
  import themeStore from "svelte-themes";
  import {
    bgColor,
    allChat,
    privateChat,
    groupChat,
    publicChat,
  } from "$lib/store";

  const menuItems = ["All", "Private", "Group", "Public"];
  let currentTab = menuItems[0];
  let selecteedTab = true;

  const selectTab = (selectedTab) => {
    currentTab = selectedTab;

    if (currentTab === "All") {
      $allChat = true;
      $privateChat = false;
      $groupChat = false;
      $publicChat = false;
      goto("/");
    }

    if (currentTab === "Private") {
      $allChat = false;
      $privateChat = true;
      $groupChat = false;
      $publicChat = false;
      goto("/private");
    }

    if (currentTab === "Group") {
      $allChat = false;
      $privateChat = false;
      $groupChat = true;
      $publicChat = false;
      goto("/group");
    }

    if (currentTab === "Public") {
      $allChat = false;
      $privateChat = false;
      $groupChat = false;
      $publicChat = true;
      goto("/public");
    }
  };
</script>

<div
  class="tab-menu"
  style:background={$themeStore.theme === "dark" ? "#292F3F" : "transparent"}
>
  {#each menuItems as tab}
    <span
      on:click={() => selectTab(tab)}
      style:border-left={currentTab === tab
        ? $themeStore.theme === "dark"
          ? "3px solid #3A3F50"
          : "3px solid #ebebeb"
        : "none"}
      style:border-top={currentTab === tab
        ? $themeStore.theme === "dark"
          ? "3px solid #3A3F50"
          : "3px solid #ebebeb"
        : "none"}
      style:border-right={currentTab === tab
        ? $themeStore.theme === "dark"
          ? "3px solid #3A3F50"
          : "3px solid #ebebeb"
        : "none"}
      style:border-bottom={
        currentTab != tab ? 
          $themeStore.theme === "dark" 
            ? "3px solid #3A3F50"
            : "3px solid #ebebeb"
        : "none"
      }
      >{tab}</span>
  {/each}
</div>

<style>
  .tab-menu {
    position: relative;
    display: flex;
    align-items: end;
    justify-content: space-evenly;
    height: 60px;
  }

  span {
    width: 25%;
    height: 60%;
    text-align: center;
    font-size: 16px;
    font-weight: 600;
    display: flex;
    align-items: center;
    justify-content: center;
    cursor: pointer;
    padding: 8px;
    border-top-left-radius: 8px;
    border-top-right-radius: 8px;
    border-bottom: none;
  }
</style>
