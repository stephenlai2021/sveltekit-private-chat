<script>
  import themeStore from "svelte-themes";
  import {
    query,
    where,
    orderBy,
    collection,
    onSnapshot,
  } from "firebase/firestore";
  import { db } from "$lib/firebase/client";
  import {
    // bgColor,
    loggedinUser,
    storedImageURL,
    storedPictureURL,
    selectedUsername,
    showImagePreviewModal,
  } from "$lib/store";
  import { page } from "$app/stores";
  import { beforeUpdate, afterUpdate } from "svelte";
  import AudioPlayer from "$lib/components/AudioPlayer.svelte"
  import { formatDistanceToNow } from 'date-fns'

  let q = null;
  let chat = null
  let autoscroll = null
  let messages = [];
  let matched = false;

  const showImagePreview = (pictureURL, imageURL) => {
    $showImagePreviewModal = true;    
    $storedImageURL = imageURL;
    $storedPictureURL = pictureURL;
  };

  $: if ($page.params.userId === $selectedUsername) matched = true;

  $: if (matched) {
    let msgId =
      $loggedinUser.displayName > $selectedUsername
        ? `${$loggedinUser.displayName} & ${$selectedUsername}`
        : `${$selectedUsername} & ${$loggedinUser.displayName}`;
    let msgRef = collection(db, "messages", msgId, "chat");
    q = query(msgRef, orderBy("createdAt", "asc"));
    const unsubMsgs = onSnapshot(q, (querySnapshot) => {
      let msgs = [];
      querySnapshot.forEach((doc) => {
        msgs.push(doc.data());
      });
      messages = msgs;
      chat?.scrollTo(0, chat.scrollHeight)
      console.log("chat messages", messages);
      return () => unsubMsgs();
    });
    matched = false;
  }

  beforeUpdate(() => {
    autoscroll = chat && chat.offsetHeight + chat.scrollTop > chat.scrollHeight - 20;
  })

  afterUpdate(() => {
    if (autoscroll) chat.scrollTo(0, chat.scrollHeight);
  })
</script>

<div
  class="chatBox"
  bind:this={chat}
>
  {#if messages && $loggedinUser}
  <!-- {#if messages} -->
    {#each messages as msg}
      <div
        class="message"
        class:my_message={msg.from === $loggedinUser.displayName}
        class:friend_message={msg.from != $loggedinUser.displayName}
      >
      <p
        class="message-content"
        style:padding={msg.pictureURL || msg.imageURL || msg.audioURL
          ? "0px"
          : "6px 10px 6px 10px"}
         
          style:background={msg.pictureURL || msg.imageURL || msg.audioURL
            ? "none"
            ? msg.from === $loggedinUser.displayName : "#dcf8c6"
            ? msg.from != $loggedinUser.displayName : "white"
            : "none"
          }
        >
          <span class="showtime">
            {formatDistanceToNow(new Date(msg.createdAt.toDate()))}
          </span>

          {#if msg.audioURL}
            <AudioPlayer audioURL={msg.audioURL} />
          {/if}

          {#if !msg.audioURL && !msg.pictureURL && !msg.imageURL}
            <span
              class="message-text"
              style:color="#292f3f"
              >{msg.text}
              <!-- style:color={$themeStore.theme === "dark" ? "white" : "#292f3f"} -->
            </span>
          {/if}

          {#if msg.pictureURL}
            <img 
              src={msg.pictureURL} 
              alt="" 
              on:click={() => showImagePreview(msg.pictureURL, msg.imageURL)}
            />
          {/if}

          {#if msg.imageURL}
            <img 
              src={msg.imageURL} 
              alt="" 
              on:click={() => showImagePreview(msg.pictureURL, msg.imageURL)}
            />
          {/if}
        </p>
      </div>
    {/each}
  {/if}
</div>

<style>
  @import url("$lib/styles/audio-player.css");

  img:hover {
    cursor: pointer;
  }

  ::-webkit-scrollbar {
    width: 10px;
  }

  ::-webkit-scrollbar-thumb {
    background: inherit;
    background: rgb(216, 216, 216);
    border-radius: 10px;
  }

  .message {
    position: relative;
    display: flex;
    max-width: 800px;
    margin: 25px auto;
    /* border: 1px solid; */
  }

  .showtime {
    text-shadow: 0.1em 0.1em 0.05em #333;
    text-shadow: 0.1em 0.1em 0.2em black;
    color: white;
  }

  .message.my_message .showtime {
    position: absolute;
    left: -105px;
    bottom: 0px;
    width: 55px;
    width: 100px;
    /* max-width: 150px; */
    text-align: right;
  }

  .message.friend_message .showtime {
    position: absolute;
    right: -105px;
    bottom: 0px;
    width: 55px;
    width: 100px;
    text-align: left;
  }

  .message.my_message {
    justify-content: flex-end;
    text-align: left;
    position: relative;
    /* border: 1px solid red; */    
  }
  
  .message.friend_message .message-content {
    background: #f5f5f5;
    justify-content: flex-start;
    border-top-left-radius: 10px;
    border-bottom-left-radius: 0px;
    border-top-right-radius: 10px;
    border-bottom-right-radius: 10px;
    /* border: 1px solid; */
  }
  
  .message-content {
    position: relative;
    max-width: 65%;
    /* min-width: 20px; */
    border-radius: 10px;
    border-bottom-right-radius: 0px;    
    background: var(--lemon-green);
    color: var(--icon-add-color);   
    /* border: 1px solid red; */
  }

  .message-content .message-text {
    /* font-size: 18px;
    font-weight: 400; */
    word-wrap: break-word;
    /* max-width: 60%; */
    /* border: 1px solid; */
  }

  .message img {
    max-width: 200px;
    max-height: 200px;
    object-fit: cover;
    border-radius: 10px;
  }

  .showtime {
    font-size: 12px;
    font-weight: 400;
  }

  /* .icon-expand {
    background: rgba(0, 0, 0, 0.5);
    color: rgba(255, 255, 255, 0.5);
    color: white;
    border-radius: 2px;
  } */

  .chatBox {
    position: absolute;
    left: 50%;
    transform: translateX(-50%);
    top: 70px;
    bottom: 60px;
    width: 100%;
    height: calc(100vh - 120px);
    padding: 0px 10px;
    overflow-y: auto;
    overflow-x: hidden;
    /* backdrop-filter: blur(20px); */
  }

  @media (max-width: 800px) {
    .chatBox {
      top: 60px;
    }
  }
</style>
