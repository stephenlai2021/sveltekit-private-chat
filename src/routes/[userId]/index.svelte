<script>
  import { db } from "$lib/firebase/client";
  import { collection, onSnapshot, query, where } from "firebase/firestore";
  import { page } from "$app/stores";
  import { goto } from "$app/navigation";
  import { mobile, showSettingsModal, showAddFriendModal, showThemeModal } from '$lib/store'
  import themeStore from "svelte-themes";

  let q = null;
  let user = {};
  let users = [];
  let logout = false;
  let colRef = collection(db, "whatzapp_users");

  // $: if (logout) goto("/login");

  $: if ($page.params.userId) {
    q = query(colRef, where("name", "==", $page.params.userId));
    const unsub = onSnapshot(q, (snapshot) => {
      let tempUsers = [];
      snapshot.docs.forEach((doc) => {
        tempUsers.push({ ...doc.data() });
      });
      user = tempUsers[0];
      return () => unsub();
    });
  }

  $: if ($mobile) { 
    $showThemeModal = false
    $showSettingsModal = false
    $showAddFriendModal = false
  }
</script>

<svelte:head>
  {#if $page.params.userId}
    <title>Chat</title>
  {/if}
</svelte:head>

<img
  src="https://previews.123rf.com/images/dimapolie/dimapolie1808/dimapolie180800074/106049740-patr%C3%B3n-de-la-escuela-del-vector-escuela-de-fondo-sin-fisuras-ilustraci%C3%B3n-vectorial.jpg"
  alt=""
/>
{#if users}
  <div class="header">
    <div class="left-part">
      <!-- <ion-icon
        name="arrow-back-outline"
        class="arrow-back"
        on:click={() => goto("/")}
      /> -->
      <span
        class="material-icons arrow-back"
        on:click={() => goto("/")}>arrow_back</span
      >
      <div class="imgText">
        <div class="userimg">
          <img src={user.avatar} alt="" />
          <div class={user.isOnline ? "status online" : "status offline"} />
        </div>
        <div class="details">
          <h4>{user.name}</h4>
        </div>
      </div>
    </div>
    <div class="right-part">
      <!-- <span class="material-icons" style:margin-right="15px">location_on</span>
      <span class="material-icons" style:margin-right="15px">videocam</span>
      <span class="material-icons" style:margin-right="15px">photo_camera</span>
      <span class="material-icons" style:margin-right="15px">file_present</span>
      <span class="material-icons" style:margin-right="15px">brush</span> -->

      <ion-icon name="create-outline" style:margin-right="15px" />
      <ion-icon name="videocam-outline" style:margin-right="15px" />
      <ion-icon name="camera-outline" style:margin-right="15px" />
      <ion-icon name="document-attach-outline" style:margin-right="15px" />
      <ion-icon name="location-outline" />
    </div>
    <!-- <ion-icon name="menu-outline" class="icon-menu" /> -->
    <span class="material-icons icon-menu"> menu </span>
  </div>
{/if}

<div class="chatBox">
  <div class="message my_message">
    <p>Hi<br /><span>12:15</span></p>
  </div>
  <div class="message friend_message">
    <p>Hello<br /><span>12:18</span></p>
  </div>
  <div class="message my_message">
    <p>
      Lorem ipsum dolor sit amet consectetur adipisicing elit. Eos, iure?<br
      /><span>12:15</span>
    </p>
  </div>
  <div class="message friend_message">
    <p>
      Lorem ipsum dolor, sit amet consectetur adipisicing elit. Iure accusantium
      alias, optio quas voluptas consequuntur.<br /><span>12:18</span>
    </p>
  </div>
  <div class="message my_message">
    <p>
      Lorem ipsum dolor sit amet consectetur adipisicing elit. Eos, iure?<br
      /><span>12:15</span>
    </p>
  </div>
  <div class="message friend_message">
    <p>
      Lorem ipsum dolor, sit amet consectetur adipisicing elit. Iure accusantium
      alias, optio quas voluptas consequuntur.<br /><span>12:18</span>
    </p>
  </div>
  <div class="message my_message">
    <p>
      Lorem ipsum dolor sit amet consectetur adipisicing elit. Eos, iure?<br
      /><span>12:15</span>
    </p>
  </div>
  <div class="message friend_message">
    <p>
      Lorem ipsum dolor, sit amet consectetur adipisicing elit. Iure accusantium
      alias, optio quas voluptas consequuntur.<br /><span>12:18</span>
    </p>
  </div>
  <div class="message my_message">
    <p>
      Lorem ipsum dolor sit amet consectetur adipisicing elit. Eos, iure?<br
      /><span>12:15</span>
    </p>
  </div>
  <div class="message friend_message">
    <p>
      Lorem ipsum dolor, sit amet consectetur adipisicing elit. Iure accusantium
      alias, optio quas voluptas consequuntur.<br /><span>12:18</span>
    </p>
  </div>
  <div class="message my_message">
    <p>
      Lorem ipsum dolor sit amet consectetur adipisicing elit. Eos, iure?<br
      /><span>12:15</span>
    </p>
  </div>
  <div class="message friend_message">
    <p>
      Lorem ipsum dolor, sit amet consectetur adipisicing elit. Iure accusantium
      alias, optio quas voluptas consequuntur.<br /><span>12:18</span>
    </p>
  </div>
</div>

<div class="chatbox_input">
  <div class="icon-wrapper icon-happy">
    <ion-icon name="happy-outline" class="happy" />
    <!-- <span class="material-icons">sentiment_satisfied</span> -->
  </div>
  <input type="text" placeholder="Type a message" />
  <div class="icon-wrapper icon-mic">
    <ion-icon name="mic-outline" style:font-size="1.5em" />
    <!-- <span class="material-icons">mic_none</span> -->
  </div>
</div>

<style>
  .icon-menu {
    display: none;
  }

  .icon-mic {
    justify-content: flex-end;
  }

  .icon-happy {
    justify-content: flex-start;
  }

  .icon-wrapper {
    display: flex;
    align-items: center;
    width: 50px;
    /* border: 1px solid; */
  }

  .arrow-back {
    display: none;
  }

  .left-part {
    display: flex;
    align-items: center;
  }

  .chatbox_input input {
    width: 100%;
    /* margin: 0 20px; */
    padding: 5px 20px;
    border: none;
    outline: none;
    border-radius: 30px;
    font-size: 1em;
    background: white;
    color: black;
  }

  .chatbox_input {
    position: absolute;
    bottom: 0;
    width: 100%;
    height: 50px;
    background: #f0f0f0;
    background: transparent;
    backdrop-filter: blur(15px);
    padding: 20px;
    display: flex;
    justify-content: space-between;
    align-items: center;
    border-bottom-right-radius: 4px;
    /* border: 2px solid blue; */
  }

  .message.friend_message p {
    /* background: rgba(255, 255, 255, 0.5);
    backdrop-filter: blur(15px); */
    background: #f5f5f5;
    /* opacity: 0.5; */
    justify-content: flex-start;
  }

  .my_message {
    justify-content: flex-end;
    text-align: right;
    /* background: rgba(255, 255, 255, 0.5);
    backdrop-filter: blur(15px); */
  }

  .message p span {
    display: block;
    margin-top: 5px;
    font-size: 0.85em;
    opacity: 0.5;
  }

  .message.friend_message::before {
    left: -12px;
    background: linear-gradient(
      225deg,
      #f5f5f5 0%,
      #f5f5f5 50%,
      transparent 50%,
      transparent
    );
  }

  .message.my_message::before {
    right: -12px;
    background: linear-gradient(
      135deg,
      var(--lemon-green) 0%,
      var(--lemon-green) 50%,
      transparent 50%,
      transparent
    );
  }

  .message::before {
    content: "";
    position: absolute;
    top: 0;
    width: 20px;
    height: 20px;
  }

  .message p {
    position: relative;
    right: 0;
    max-width: 65%;
    padding: 12px;
    background: var(--lemon-green);
    /* opacity: 0.5; */
    /* background-color: rgba(0, 0, 0, 0.2);
    backdrop-filter: blur(15px); */
    border-radius: 10px;
    font-size: 0.9em;
    font-weight: 600;
    color: var(--icon-add-color);
  }

  .message {
    position: relative;
    display: flex;
    width: 100%;
    margin-bottom: 5px;
  }

  .chatBox {
    position: absolute;
    top: 60px;
    bottom: 60px;
    width: 100%;
    padding: 20px;
    padding-bottom: 0px;
    overflow-y: auto;
    border-bottom-right-radius: 4px;
  }

  .details {
    padding-left: 15px;
  }

  @media (max-width: 800px) {
    .arrow-back {
      margin-right: 10px;
      display: block;
    }
  }

  @media (max-width: 575px) {
    .chatbox_input input {
      width: 110%;
    }

    .chatbox_input {
      padding: 20px 10px;
    }
  }

  @media (max-width: 475px) {
    .right-part {
      display: none;
    }

    .icon-menu {
      display: block;
    }
  }
</style>
