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
    bgColor,
    loggedinUser,
    // isAudioPlayed,
    storedImageURL,
    storedPictureURL,
    selectedUsername,
    showImagePreviewModal,
  } from "$lib/store";
  import { page } from "$app/stores";
  import moment from "moment";
  import { onMount, beforeUpdate, afterUpdate } from "svelte";
  import { browser } from "$app/env";
  import AudioPlayer from "$lib/components/AudioPlayer.svelte"

  let y
  let q = null;
  let chat = null
  let autoscroll = null
  let audio = null;
  let player = null;
  let messages = [];
  let matched = false;
  let isAudioPlayed = false;
  let playBtnClicked = false;
  // let selectedUserMsgsReady = false;

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
      chat.scrollTo(0, chat.scrollHeight)
      console.log("messages:", messages);
      return () => unsubMsgs();
    });
    matched = false;
  }

  // $: if (messages) chat.scrollTo(0, chat.scrollHeight)

  const playAudio = (audioURL) => {
    playBtnClicked = true;
    audio = new Audio(audioURL);
    audio.addEventListener("loadeddata", () => (audio.volume = 0.55));
    audio.play();
  };

  const pauseAudio = () => {
    // audio = new Audio(audioURL)
    // audio.addEventListener('loadeddata', () => audio.volume = .75)
    audio.pause();
  };

  $: if (isAudioPlayed) console.log("audio is played");

  $: if (!isAudioPlayed) console.log("audio is paused");

  onMount(() => {
    const audio = new Audio();
  });

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
  style:background={$themeStore.theme === "dark"
    ? "#292F3F"
    : "rgba(235, 235, 235, 0.1)"}
>
  {#if messages}
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
            : msg.from === $loggedinUser.displayName &&
              $themeStore.theme === "dark"
            ? "linear-gradient(90deg, #4b6cb7 0%, #182848 100%)"
            : msg.from === $loggedinUser.displayName &&
              $themeStore.theme === "light"
            ? "#dcf8c6"
            : msg.from != $loggedinUser.displayName &&
              $themeStore.theme === "dark"
            ? "linear-gradient(90deg, #FC466B 0%, #3F5EFB 100%)"
            : "white"}
        >
          <span
            class="showtime"
            style:color={$themeStore.theme === "dark" ? "#ebebeb" : "#292f3f"}
          >
            {moment(msg.createdAt.toDate()).format("LT")}
          </span>

          {#if msg.audioURL}
            <AudioPlayer audioURL={msg.audioURL} />
          {/if}

          {#if !msg.audioURL && !msg.pictureURL && !msg.imageURL}
            <span
              class="message-text"
              style:color={$themeStore.theme === "dark" ? "white" : "#292f3f"}
              >{msg.text}
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
    width: 5px;
  }

  ::-webkit-scrollbar-thumb {
    background: inherit;
    background: rgb(216, 216, 216);
  }

  .message {
    position: relative;
    display: flex;
    max-width: 800px;
    margin: 25px auto;
    /* border: 1px solid; */
  }

  .message.my_message .showtime {
    position: absolute;
    left: -60px;
    bottom: 0px;
    width: 55px;
    text-align: right;
  }

  .message.friend_message .showtime {
    position: absolute;
    right: -60px;
    bottom: 0px;
    width: 55px;
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
    font-size: 18px;
    font-weight: 400;
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

  .icon-expand {
    background: rgba(0, 0, 0, 0.5);
    color: rgba(255, 255, 255, 0.5);
    color: white;
    border-radius: 2px;
  }

  .chatBox {
    position: absolute;
    left: 50%;
    transform: translateX(-50%);
    top: 60px;
    bottom: 60px;
    width: 100%;
    height: calc(100vh - 120px);
    padding: 0px 10px;
    overflow-y: auto;
    overflow-x: hidden;
    backdrop-filter: blur(20px);
  }

  /* @media (max-width: 800px) {
    .chatBox {
      padding-right: 5px;
    }
  }

  @media (max-width: 1200px) {
    .message {
      margin-right: 10px;
    }
  } */
</style>
