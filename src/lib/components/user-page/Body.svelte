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
    selectedUsername,
    loggedinUser,
    bgColor,
    showImagePreviewModal,
    storedPictureURL,
    storedImageURL,
  } from "$lib/store";
  import { page } from "$app/stores";
  import moment from "moment";

  let q = null;
  let player = null;
  let messages = [];
  let matched = false;
  let selectedUserMsgsReady = false;

  const showImagePreview = (pictureURL, imageURL) => {
    $showImagePreviewModal = true;

    $storedPictureURL = pictureURL;
    $storedImageURL = imageURL;
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
      console.log("messages:", messages);
      selectedUserMsgsReady = true;
      return () => unsubMsgs();
    });
    matched = false;
  }
</script>

{#if messages}
  <div class="chatBox">
    <!-- style:background={$themeStore.theme === "dark" ? "#292F3F" : $bgColor} -->
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
            style:left={msg.from != $loggedinUser.displayName ? "0" : ""}
            style:right={msg.from === $loggedinUser.displayName ? "0" : ""}
          >
            {moment(msg.createdAt.toDate()).format("LT")}
          </span>

          <svg
            xmlns="http://www.w3.org/2000/svg"
            class="ionicon icon-expand"
            viewBox="0 0 512 512"
            width="20"
            height="20"
            fill="currentColor"
            style:position="absolute"
            style:top={msg.pictureURL || msg.imageURL ? "22px" : ""}
            style:left={(msg.pictureURL || msg.imageURL) &&
            msg.from === $loggedinUser.displayName
              ? "12px"
              : ""}
            style:right={(msg.pictureURL || msg.imageURL) &&
            msg.from !== $loggedinUser.displayName
              ? "12px"
              : ""}
            style:display={msg.pictureURL || msg.imageURL ? "block" : "none"}
            on:click={() => showImagePreview(msg.pictureURL, msg.imageURL)}
          >
            <path
              fill="none"
              stroke="currentColor"
              stroke-linecap="round"
              stroke-linejoin="round"
              stroke-width="32"
              d="M432 320v112H320M421.8 421.77L304 304M80 192V80h112M90.2 90.23L208 208M320 80h112v112M421.77 90.2L304 208M192 432H80V320M90.23 421.8L208 304"
            />
          </svg>

          {#if !msg.audioURL && !msg.pictureURL && !msg.imageURL}
            <span
              class="message-text"
              style:color={$themeStore.theme === "dark" ? "white" : "#292f3f"}
              >{msg.text}
            </span>
          {/if}

          {#if msg.pictureURL}
            <img src={msg.pictureURL} alt="" />
          {/if}

          {#if msg.imageURL}
            <img src={msg.imageURL} alt="" />
          {/if}

          {#if msg.audioURL}
            <div
              class="player"
              bind:this={player}
              style:background={msg.from === $loggedinUser.displayName &&
              $themeStore.theme === "dark"
                ? "linear-gradient(90deg, #4b6cb7 0%, #182848 100%)"
                : msg.from !== $loggedinUser.displayName &&
                  $themeStore.theme === "dark"
                ? "linear-gradient(90deg, #FC466B 0%, #3F5EFB 100%)"
                : msg.from === $loggedinUser.displayName &&
                  $themeStore.theme === "light"
                ? "#dcf8c6"
                : msg.from != $loggedinUser.displayName &&
                  $themeStore.theme === "light"
                ? "white"
                : ""}
            >
              <div class="inner-wrapper">
                <div class="progress-wrapper">
                  <progress value="0" max="100" />
                  <span
                    class="time-stamp"
                    style:color={$themeStore.theme === "light" ? "black" : ""}
                  >
                    01/10
                  </span>
                </div>
                <div class="buttons">
                  <button class="play">
                    <svg
                      xmlns="http://www.w3.org/2000/svg"
                      class="ionicon"
                      viewBox="0 0 512 512"
                      width="24"
                      height="24"
                      fill="currentColor"
                      style:color={$themeStore.theme === "light" ? "black" : ""}
                    >
                      <path
                        d="M112 111v290c0 17.44 17 28.52 31 20.16l247.9-148.37c12.12-7.25 12.12-26.33 0-33.58L143 90.84c-14-8.36-31 2.72-31 20.16z"
                        fill="none"
                        stroke="currentColor"
                        stroke-miterlimit="10"
                        stroke-width="32"
                      />
                    </svg>
                  </button>

                  <button class="pause">
                    <svg
                      xmlns="http://www.w3.org/2000/svg"
                      class="ionicon"
                      viewBox="0 0 512 512"
                      width="24"
                      height="24"
                      fill="currentColor"
                      style:color={$themeStore.theme === "light" ? "black" : ""}
                    >
                      <path
                        fill="none"
                        stroke="currentColor"
                        stroke-linecap="round"
                        stroke-linejoin="round"
                        stroke-width="32"
                        d="M176 96h16v320h-16zM320 96h16v320h-16z"
                      />
                    </svg>
                  </button>
                  <button class="stop">
                    <svg
                      xmlns="http://www.w3.org/2000/svg"
                      class="ionicon"
                      viewBox="0 0 512 512"
                      width="24"
                      height="24"
                      fill="currentColor"
                      style:color={$themeStore.theme === "light" ? "black" : ""}
                    >
                      <rect
                        x="96"
                        y="96"
                        width="320"
                        height="320"
                        rx="24"
                        ry="24"
                        fill="none"
                        stroke="currentColor"
                        stroke-linejoin="round"
                        stroke-width="32"
                      />
                    </svg>
                  </button>
                </div>
              </div>
              <input type="range" class="volume" />
            </div>
          {/if}
        </p>
      </div>
    {/each}
  </div>
{/if}

<style>
  @import url("$lib/styles/audio-player.css");

  .chatBox {
    position: absolute;
    left: 50%;
    transform: translateX(-50%);
    top: 60px;
    bottom: 60px;
    width: 100%;
    height: calc(100vh - 120px);
    padding: 10px 10px 0 10px;
    overflow: hidden;
  }

  .chatBox:hover {
    overflow-y: auto;
    padding-right: 0px;
    box-sizing: border-box;
  }

  ::-webkit-scrollbar {
    width: 10px;
  }

  ::-webkit-scrollbar-thumb {
    border-radius: 10px;
    background: rgba(0, 0, 0, 0.3);
  }

  ::-webkit-scrollbar-thumb:hover {
    background: #555;
    background: rgba(0, 0, 0, 0.5);
  }

  .message {
    position: relative;
    display: flex;
    max-width: 800px;
    margin: 20px auto;
    /* border: 1px solid;
     */
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

  @media (max-width: 800px) {
    .chatBox {
      overflow: auto;
      padding-right: 5px;
    }

    ::-webkit-scrollbar {
      width: 0px;
    }

    ::-webkit-scrollbar-thumb {
      border-radius: 10px;
      background: inherit;
    }

    /* ::-webkit-scrollbar-thumb:hover {
      background: #555;
      background: rgba(0, 0, 0, 0.5);
    } */
  }

  @media (max-width: 1200px) {
    .message {
      margin-right: 10px;
    }    
  }
</style>
