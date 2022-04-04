<script>
  import { auth } from "$lib/firebase/client";
  import { onAuthStateChanged } from "firebase/auth";
  import {
    mobile,
    bgColor,
    loginFormShow,
    showSettingsModal,
  } from "$lib/store";
  import { page } from "$app/stores";

  let user = null;

  onAuthStateChanged(auth, (_user) => (user = _user));
</script>



  <!-- style:display={$mobile
    ? "none"
    : "flex"} -->
<div
  class="sidebar-menu"
  class:loginform-hide={$loginFormShow}
  style:background={$page.url.pathname === "/" ? "#cccccc" : $bgColor}
  style:display={$mobile
    ? "none"
    : $page.url.pathname === "/login"
    ? "none"
    : "flex"}
>
  {#if user}
    <div
      class="userimg"
      on:click|stopPropagation={() =>
        ($showSettingsModal = !$showSettingsModal)}
    >
      {#if user.photoURL}
        <img src={user.photoURL} alt="" />
      {:else}
        <img src="/joke.png" alt="" />
      {/if}
      <ion-icon name="settings-outline" class="settings" />
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
  .userimg img {
    width: 35px;
    height: 35px;
    border-radius: 50%;
  }

  .userimg {
    width: 35px;
    height: 35px;
    display: flex;
    align-items: center;
    position: relative;
    cursor: pointer;
    margin-top: auto;
  }

  .sidebar-menu {
    min-width: 50px;
    height: 100vh;
    display: flex;
    flex-direction: column;
    align-items: center;
    padding: 20px 0;
    opacity: 0.7;
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
    }

    .userimg {
      display: none;
    }
  }
</style>
