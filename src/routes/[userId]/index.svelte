<script>
  import { db } from "$lib/firebase/client";
  import { collection, onSnapshot, query, where } from "firebase/firestore";
  import { page } from "$app/stores";
  import { goto } from "$app/navigation";
  import {
    mobile,
    showThemeModal,
    showSettingsModal,
    showAddFriendModal,
    showBgSettingsModal,
  } from "$lib/store";
  import BgSettingsModal from "$lib/components/BgSettingsModal.svelte";

  let q = null;
  let user = {};
  let ready = false;
  let colRef = collection(db, "whatzapp_users");

  $: if ($page.params.userId) {
    q = query(colRef, where("name", "==", $page.params.userId));
    const unsub = onSnapshot(q, (snapshot) => {
      let tempUsers = [];
      snapshot.docs.forEach((doc) => {
        tempUsers.push({ ...doc.data() });
      });
      user = tempUsers[0];
      ready = true;
      return () => unsub();
    });
  }

  $: if (!$mobile) $showBgSettingsModal = false;
  $: if ($mobile) {
    $showThemeModal = false;
    $showSettingsModal = false;
    $showAddFriendModal = false;
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
<div class="header">
  <div class="left-part">
    <ion-icon
      name="arrow-back-outline"
      class="arrow-back"
      on:click={() => goto("/")}
    />
    {#if ready}
      <div class="imgText">
        <div class="userimg">
          {#if user.avatar}
            <img src={user.avatar} alt="" />
          {:else}
            <img src="/happy.png" alt="" />
          {/if}
          <div class={user.isOnline ? "status online" : "status offline"} />
        </div>
        <div class="details">
          <h4>{user.name}</h4>
        </div>
      </div>
    {:else}
      <div class="imgText">
        <div class="userimg">
          <div class="user-avatar animation" />
        </div>
        <div class="details">
          <h4 class="user-name animation">Bao Yang</h4>
        </div>
      </div>
    {/if}
  </div>
  <div class="right-part">
    <!-- <ion-icon name="create-outline" /> -->
    <ion-icon name="videocam-outline" />
    <ion-icon name="camera-outline" />
    <ion-icon name="document-attach-outline" />
    <ion-icon name="location-outline" />
    {#if $mobile}
      <ion-icon
        name="settings-outline"
        on:click|stopPropagation={() =>
          ($showBgSettingsModal = !$showBgSettingsModal)}
      />
    {/if}
  </div>
  <ion-icon name="menu-outline" class="icon-menu" />
</div>

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
</div>

<div class="chatbox_input">
  <div class="icon-wrapper icon-happy">
    <ion-icon name="happy-outline" class="happy" />
  </div>
  <input type="text" placeholder="Type a message" />
  <div class="icon-wrapper icon-mic">
    <ion-icon name="mic-outline" style:font-size="1.5em" />
  </div>
</div>

{#if $showBgSettingsModal}
  <BgSettingsModal />
{/if}

<style>
  :root {
    --bg-color: #d6d8dc;
  }

  .user-avatar,
  .user-name {
    background: var(--bg-color);
  }

  .user-name {
    width: 80px;
    /* opacity: 0; */
    color: transparent;
    border-radius: 2px;
  }

  .user-avatar {
    width: 40px;
    height: 40px;
    border-radius: 50%;
  }

  .header {
    padding-right: 0px;
  }

  .right-part ion-icon {
    margin-right: 15px;
  }

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
  }

  .message.friend_message p {
    background: #f5f5f5;
    justify-content: flex-start;
  }

  .my_message {
    justify-content: flex-end;
    text-align: right;
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
    .left-part .details {
      padding-left: 0px;
    }

    .left-part .details h4 {
      display: none;
    }
  }

  @media (max-width: 310px) {
    .right-part ion-icon {
      margin-right: 10px;
    }
  }
</style>
