<script>
  import AddFriendModal from "$lib/components/AddFriendModal.svelte";
  import { showModal } from "$lib/store";
  import { db } from "$lib/firebase/client";
  import { collection, onSnapshot, query, where } from "firebase/firestore";
  import { page } from "$app/stores";
  import { goto } from "$app/navigation";
  import { onMount } from "svelte";
  import SettingsModal from "$lib/components/Modal/SettingsModal.svelte";
  import { showSettingsModal } from "$lib/store";

  let q = null;
  let user = {};
  let users = [];
  let logout = false;
  let colRef = collection(db, "whatzapp_users");

  $: if (logout) goto("/login");

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

  window.addEventListener("click", (e) => {
    console.log('window event', e)
    // if (e.path[0].className !== 'header') {
      showSettingsModal.set(false);
    // }
  });
</script>

<img
  src="https://previews.123rf.com/images/dimapolie/dimapolie1808/dimapolie180800074/106049740-patr%C3%B3n-de-la-escuela-del-vector-escuela-de-fondo-sin-fisuras-ilustraci%C3%B3n-vectorial.jpg"
  alt=""
/>
{#if users}
  <div class="header">
    <div class="left-part">
      <span class="material-icons arrow-back" on:click={() => goto("/")}>
        chevron_left
      </span>
      <div class="imgText">
        <div class="userimg">
          <img src={user.avatar} alt="" />
          <div class={user.isOnline ? "status online" : "status offline"} />
        </div>
        <div class="details">
          <h4>{user.name}</h4>
          <!-- <span>{user.isOnline ? "online" : "offline"}</span> -->
        </div>
      </div>
    </div>
    <!-- <ul class="nav_icons">
      <li on:click|stopPropagation={() => ($showSettingsModal = !$showSettingsModal)}>
        <span class="material-icons">settings</span>
      </li>
    </ul>
    {#if $showSettingsModal}
      <SettingsModal />
    {/if} -->
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
  <span class="material-icons">insert_emoticon</span>
  <span class="material-icons">attach_file</span>
  <input type="text" placeholder="Type a message" />
  <span class="material-icons">mic_none</span>
</div>

{#if $showModal}
  <AddFriendModal />
{/if}

<style>
  .arrow-back {
    display: none;
  }

  .left-part {
    display: flex;
    align-items: center;
  }

  .nav_icons span {
    margin-left: 20px;
  }

  .chatbox_input span:nth-child(1) {
    margin-right: 15px;
  }

  .chatbox_input input {
    width: 90%;
    margin: 0 20px;
    padding: 5px 20px;
    border: none;
    outline: none;
    border-radius: 30px;
    font-size: 1em;
    background: white;
    color: black;
  }

  .chatbox_input span {
    cursor: pointer;
    font-size: 1.6em;
    /* font-size: 26x; */
    color: #51585c;
  }

  .chatbox_input {
    position: absolute;
    bottom: 0;
    width: 100%;
    height: 50px;
    background: #f0f0f0;
    padding: 15px;
    display: flex;
    justify-content: space-between;
    align-items: center;
    border-bottom-right-radius: 4px;
    /* border: 2px solid blue; */
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
    bottom: 0px;
    width: 100%;
    /* height: 100%; */
    /* height: calc(100vh - 60px); */
    padding: 20px;
    padding-bottom: 60px;
    overflow-y: auto;
    border-bottom-right-radius: 4px;
  }

  .details {
    padding-left: 15px;
  }

  .rightSide .header .imgText {
    display: flex;
    justify-content: space-between;
    align-items: center;
  }

  .rightSide .header .imgText h4 {
    font-weight: 600;
    line-height: 1.2em;
    color: var(--icon-add-color);
    /* border: 1px solid green; */
  }

  .rightSide .header .imgText span {
    font-size: 0.8em;
    color: #555;
    /* border: 1px solid blue; */
  }

  .rightSide .header .imgText .userimg {
    position: relative;
    display: flex;
  }

  .rightSide .header .imgText .userimg img {
    width: 40px;
    height: 40px;
    color: var(--icon-add-color);
    border-radius: 50%;
    opacity: 1;
  }

  @media (max-width: 700px) {
    .arrow-back {
      margin-right: 15px;
      display: block;
      /* font-size: 1.5rem; */
    }
  }
</style>
