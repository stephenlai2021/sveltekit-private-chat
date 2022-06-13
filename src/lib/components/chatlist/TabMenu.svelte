<script>
  import { goto } from "$app/navigation";
  import themeStore from "svelte-themes";
  import { allChat, privateChat, groupChat, publicChat } from "$lib/store";

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

<div class="tab-menu">
  {#each menuItems as tab}
    <span 
      on:click={() => selectTab(tab)}
      style:background={
        currentTab === tab ?
          $themeStore.theme === "dark" ? 
            "#3a3f50" 
            : "#ebebeb"
        : "none"
      }
    >{tab}</span>
  {/each}
</div>

<style>
  .tab-menu {
    display: flex;
    height: 40px;
    padding: 0 15px;
    margin: 10px 0;
  }

  span {
    width: 25%;
    height: 100%;
    text-align: center;
    font-size: 18px;
    font-weight: 600;
    display: flex;
    align-items: center;
    justify-content: center;
    cursor: pointer;
    padding: 2px;
    border-radius: 8px;
  }
</style>
