<script>
  import { goto } from "$app/navigation";
  import themeStore from "svelte-themes";
  import { bgColor, allChat, privateChat, groupChat, publicChat } from "$lib/store";

  const menuItems = ['All', 'Private', 'Group', 'Public']
  let currentTab = menuItems[0]

  const selectTab = (selectedTab) => {
    currentTab = selectedTab

    if (currentTab === 'All') {
      $allChat = true;
      $privateChat = false;
      $groupChat = false;
      $publicChat = false;
      goto("/");
    }

    if (currentTab === 'Private') {
      $allChat = false;
      $privateChat = true;
      $groupChat = false;
      $publicChat = false;
      goto("/private");
    }

    if (currentTab === 'Group') {
      $allChat = false;
      $privateChat = false;
      $groupChat = true;
      $publicChat = false;
      goto("/group");
    }
    
    if (currentTab === 'Public') {
      $allChat = false;
      $privateChat = false;
      $groupChat = false;
      $publicChat = true;
      goto("/public");
    }
  }
</script>

<div 
  class="tab-menu"
  style:background={$themeStore.theme === 'dark' ? "#292F3F" : "transparent"}
>
  {#each menuItems as tab}
    <span 
      on:click={() => selectTab(tab)}
      style:background={
        currentTab === tab ?
          $themeStore.theme === "dark" ? 
            "#3A3F50"
            : "#ebebeb"
        : "none"
      }
    >{tab}</span>
  {/each}
</div>

<style>
  .tab-menu {
    display: flex;
    align-items: center;
    justify-content: space-evenly;
    height: 60px;
    border-top-right-radius: 10px;
    border-top-left-radius: 10px;
  }

  span {
    /* width: 20%; */
    height: 70%;
    /* padding: 10px 0; */
    text-align: center;
    font-size: 16px;
    font-weight: 600;
    display: flex;
    align-items: center;
    /* justify-content: space-between; */
    cursor: pointer;
    padding: 8px;
    border-radius: 8px;
    /* background: transparent; */
    /* border: 1px solid; */
  }
</style>
