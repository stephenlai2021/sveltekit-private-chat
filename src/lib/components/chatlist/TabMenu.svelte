<script>
  import { goto } from "$app/navigation";
  import themeStore from "svelte-themes";
  import { allChat, privateChat, groupChat, publicChat } from "$lib/store";

  const setAllChat = () => {
    $allChat = true;
    $privateChat = false;
    $groupChat = false;
    $publicChat = false;
    goto("/");
  };

  const setPrivateChat = () => {
    $allChat = false;
    $privateChat = true;
    $groupChat = false;
    $publicChat = false;
    goto("/private");
  };

  const setGroupChat = () => {
    $allChat = false;
    $privateChat = false;
    $groupChat = true;
    $publicChat = false;
    goto("/group");
  };

  const setPublicChat = () => {
    $allChat = false;
    $privateChat = false;
    $groupChat = false;
    $publicChat = true;
    goto("/public");
  };
</script>

<div class="tab-menu">
  <span 
    on:click={setAllChat}
    style:background={
      $allChat ?
        $themeStore.theme === "dark" ? 
          "#3a3f50" 
          : "#ebebeb"
      : "none"
    }
  >All</span>
  
  <span 
    on:click={setPrivateChat}
    style:background={
      $privateChat ?
        $themeStore.theme === "dark" ? 
          "#3a3f50" 
          : "#ebebeb"
      : "none"
    }
  >Private</span>
  
  <span 
    on:click={setGroupChat}
    style:background={
      $groupChat ?
        $themeStore.theme === "dark" ? 
          "#3a3f50" 
          : "#ebebeb"
      : "none"
    }
  >Group</span>

  <span 
    on:click={setPublicChat}
    style:background={
      $publicChat ?
        $themeStore.theme === "dark" ? 
          "#3a3f50" 
          : "#ebebeb"
      : "none"
    }
  >Public</span>
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
