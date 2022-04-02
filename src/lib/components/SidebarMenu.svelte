<script>
  import { auth, db } from "$lib/firebase/client";
  import { onAuthStateChanged } from "firebase/auth";
  import { collection, onSnapshot } from "firebase/firestore";
  import {
    mobile,
    bgColor,
    loginFormShow,
    showSettingsModal,
  } from "$lib/store";
  import { page } from "$app/stores";
  // import { goto } from "$app/navigation";
  // import { activeItem } from "$lib/store";

  let user = null;
  let users = null;
  let colRef = collection(db, "whatzapp_users");
  // let activeMenu = menuIcon[0];
  // let menuIcon = ["sms", "volunteer_activism", "movie"];
  // let menuIcon = [
  //   "home-outline",
  //   "chatbox-ellipses-outline",
  //   "heart-circle-outline",
  //   "film-outline",
  // ];

  onAuthStateChanged(auth, (_user) => (user = _user));

  // const unsub = onSnapshot(colRef, (snapshot) => {
  //   let tempUsers = [];
  //   snapshot.docs.forEach((doc) => {
  //     tempUsers.push({ ...doc.data() });
  //   });
  //   users = tempUsers;
  //   return () => unsub();
  // });

  // const switchRoute = (item) => {
  //   if (item === "home-outline") goto(`/`);
  //   if (item === "chatbox-ellipses-outline") goto(`/${users[0].name}`);
  //   if (item === "heart-circle-outline") goto("/tinder");
  //   if (item === "film-outline") goto("/movie");
  // };
</script>

<!-- style:display={$mobile
  ? "none"
  : $page.url.pathname === "/" || $page.url.pathname === "/login"
  ? "none"
  : "flex"}   -->
<div
  class="sidebar-menu"
  class:loginform-hide={$loginFormShow}
  style:background={$page.url.pathname === '/' ? '#F8F8F8' : $bgColor}
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
      <img src={user.photoURL} alt="" />
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

  /* .menu-item:active {
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
  } */

  /* span {
    font-size: 1.5em;
  } */
  
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
    .menu-item {
      margin-bottom: 0;
    }
  }
</style>