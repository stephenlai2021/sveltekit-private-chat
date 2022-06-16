<script>
  import { goto } from "$app/navigation";
  import themeStore from "svelte-themes";
  import {
    mobile,
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
      style:border-top-right-radius={
        currentTab === tab && currentTab != "Public" ? 
          "10px"
        : currentTab === tab && currentTab === "Public" && $mobile ? 
          "0"
        : "10px"
      }
      style:border-top-left-radius={
        currentTab === tab && currentTab != "All" ? 
          "10px"
        : currentTab === tab && currentTab === "All" && $mobile ? 
          "0"
        : "10px"
      }
      style:border-left={
        currentTab === tab && currentTab != "All" ? 
          $themeStore.theme === "dark" ? 
            "3px solid #3A3F50"
            : "3px solid #ebebeb"
        : currentTab === tab && currentTab === "All" && !$mobile ? 
          $themeStore.theme === "dark" ? 
            "3px solid #3A3F50"
            : "3px solid #ebebeb"
        : "none"
      }
      style:border-top={
        currentTab === tab ? 
          $themeStore.theme === "dark" ? 
            "3px solid #3A3F50"
            : "3px solid #ebebeb"
        : "none"
      }
      style:border-right={
        currentTab === tab && currentTab != "Public" ? 
          $themeStore.theme === "dark" ? 
            "3px solid #3A3F50"
            : "3px solid #ebebeb"
        : currentTab === tab && currentTab === "Public" && !$mobile ? 
          $themeStore.theme === "dark" ? 
            "3px solid #3A3F50"
            : "3px solid #ebebeb"
        : "none"
      }
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
    height: 60px;
    padding-top: 22px;
  }

  span {
    width: 25%;
    /* height: 60%; */
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
