<script>
  import { auth } from "$lib/firebase/client";
  import { onAuthStateChanged } from "firebase/auth";
  import {
    mobile,
    bgColor,
    loginFormShow,
    showSettingsModal,
  } from "$lib/store";
  import { goto } from "$app/navigation";
  import { activeItem } from "$lib/store";
  import { page } from "$app/stores";

  let user = null;
  // let menuIcon = ["sms", "volunteer_activism", "movie"];
  let menuIcon = ["chatbox-ellipses-outline", "heart-circle-outline", "film-outline"];
  let activeMenu = menuIcon[0];

  onAuthStateChanged(auth, (_user) => (user = _user));

  const switchRoute = (item) => {
    if (item === "chatbox-ellipses-outline") {
      activeMenu = menuIcon[0];
      if ($activeItem) goto(`/${$activeItem}`);
      if (!$activeItem) goto(`/`);
    }
    if (item === "heart-circle-outline") {
      activeMenu = menuIcon[1];
      goto("/tinder");
    }
    if (item === "film-outline") {
      activeMenu = menuIcon[2];
      goto("/movie");
    }
  };
</script>

<div
  class="sidebar-menu"
  class:loginform-hide={$loginFormShow}
  style:background={$bgColor}
  style:display={$mobile &&
  $page.url.pathname != "/" &&
  $page.url.pathname != "/tinder" &&
  $page.url.pathname != "/movie"
    ? "none"
    : $page.url.pathname === "/login"
    ? "none"
    : "flex"}
>
  {#each menuIcon as item}
    <div
      class="menu-item"
      class:active={item === activeMenu}
      on:click={() => switchRoute(item)}
    >
      <ion-icon name={item} />
      <!-- <span class="material-icons">{item}</span> -->
    </div>
  {/each}

  {#if user}
    <div
      class="userimg"
      on:click|stopPropagation={() =>
        ($showSettingsModal = !$showSettingsModal)}
    >
      <img src={user.photoURL} alt="" />
      <!-- <span class="material-icons settings">settings</span> -->
      <ion-icon name="settings-outline" class="settings"></ion-icon>
    </div>
  {/if}
</div>

<style>
  .settings {
    position: absolute;
    bottom: -8px;
    right: -5px;
    font-size: 1.2em;
  }

  .menu-item:active {
    background: rgba(0, 0, 0, 0.1);
  }

  .menu-item:hover {
    background: rgba(0, 0, 0, 0.1);
  }

  .menu-item {
    display: flex;
    align-items: center;
    margin-bottom: 10px;
    cursor: pointer;
    padding: 8px;
    border-radius: 10px;
    /* border: 1px solid; */
  }

  span {
    font-size: 1.5em;
  }

  .userimg img {
    width: 40px;
    height: 40px;
    border-radius: 50%;
  }

  .userimg {
    width: 40px;
    height: 40px;
    display: flex;
    align-items: center;
    position: relative;
    cursor: pointer;
    margin-top: auto;
    /* margin: auto 10px 0 10px; */
    /* border: 1px solid; */
  }

  .sidebar-menu {
    min-width: 60px;
    height: 100vh;
    display: flex;
    flex-direction: column;
    align-items: center;
    padding: 20px 0;
  }

  @media (max-width: 800px) {
    .sidebar-menu {
      flex-direction: row;
      position: absolute;
      bottom: 0;
      width: 100%;
      height: 50px;
      z-index: 200;
      justify-content: space-around;
      /* align-items: center; */
    }

    .userimg {
      display: none;
    }

    .menu-item {
      margin-bottom: 0;
    }
  }
</style>
