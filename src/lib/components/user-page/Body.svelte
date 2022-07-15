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
          style:padding={msg.pictureURL || msg.imageURL || msg.audioURL
            ? "0"
            : "8px 12px 6px 12px"}
        >
          <span
            class="showtime"
            style:color={$themeStore.theme === "dark" ? "#ebebeb" : "#292f3f"}
          >
            {moment(msg.createdAt.toDate()).format("LT")}
          </span>

          {#if msg.audioURL}
            <div class="audio-player" style:padding="3px 0">
              <!-- <audio controls>
                <source src={msg.audioURL} type="audio/wav" />
              </audio> -->
              <AudioPlayer audioURL={msg.audioURL} />
            </div>
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

  .audio-player {
    display: flex;
    border-radius: 4px;
    padding: 3px 5px;
  }

  ::-webkit-scrollbar {
    width: 5px;
  }

  ::-webkit-scrollbar-thumb {
    background: inherit;
  }

  .message {
    position: relative;
    display: flex;
    max-width: 800px;
    margin: 10px auto;
  }

  .message-content {
    display: flex;
    flex-direction: column;
  }

  .message.friend_message p {
    background: #f5f5f5;
    justify-content: flex-start;
    border-top-left-radius: 5px;
    border-bottom-left-radius: 5px;
    border-top-right-radius: 10px;
    border-bottom-right-radius: 10px;
  }

  .message.my_message .showtime {
    text-align: right;
  }

  .message.friend_message .showtime {
    text-align: left;
  }

  .message.my_message {
    justify-content: flex-end;
    text-align: right;
  }

  .message p {
    position: relative;
    right: 0;
    max-width: 65%;
    border-radius: 8px;
    background: var(--lemon-green);
    color: var(--icon-add-color);
  }

  .message p .message-text {
    width: 100%;
    min-width: 40px;
    font-size: 18px;
    font-weight: 400;
  }

  .message img {
    max-width: 150px;
    max-height: 150px;
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
    height: calc(100vh - 125px);
    /* height: calc(100vh - 100px); */
    padding: 0px 10px;
    overflow: auto;
    backdrop-filter: blur(20px);
    /* border: 1px solid; */
  }

  @media (max-width: 800px) {
    .chatBox {
      padding-right: 5px;
    }
  }

  @media (max-width: 1200px) {
    .message {
      margin-right: 10px;
    }
  }
</style>
