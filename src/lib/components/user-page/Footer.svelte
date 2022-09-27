<script>
  import themeStore from "svelte-themes";
  import { db, storage } from "$lib/firebase/client";
  import { ref, uploadBytes, getDownloadURL } from "firebase/storage";
  import {
    phone,
    mobile,
    isMobile,
    showActionMenu,
    showCameraModal,
    showEmojiMenu,
    showAudioRecordingModal,
    message,
    selectedImg,
    loggedinUser,
    selectedUsername,
    selectedUserReady,
  } from "$lib/store";
  import {
    doc,
    getDoc,
    addDoc,
    setDoc,
    updateDoc,
    Timestamp,
    collection,
  } from "firebase/firestore";
  import { onMount } from "svelte";
  import ActionMenu from "$lib/components/ActionMenu.svelte";

  let url = null;
  let file = null;
  let messageSent = "";
  // let countVal = 0;

  // msgCount.subscribe((val) => (countVal = val));

  onMount(() => {
    // msgCount.subscribe(val => countVal = val)
  });

  const handleFileChange = async (e) => {
    file = e.target.files[0];
    console.log(file);
    console.log(`${file.name} is selected`);
    $selectedImg = file;

    let imgPath =
      $loggedinUser.displayName > $selectedUsername
        ? `${$loggedinUser.displayName} & ${$selectedUsername}`
        : `${$selectedUsername} & ${$loggedinUser.displayName}`;

    let imageRef = ref(
      storage,
      `letschat/messages/images/${imgPath}/${new Date().getTime()} - ${
        file.name
      }`
    );

    uploadBytes(imageRef, file).then(() => {
      console.log("image upload completed !");
      getDownloadURL(imageRef).then((_url) => {
        url = _url;
        let msgId =
          $loggedinUser.displayName > $selectedUsername
            ? `${$loggedinUser.displayName} & ${$selectedUsername}`
            : `${$selectedUsername} & ${$loggedinUser.displayName}`;
        let msgRef = collection(db, "messages", msgId, "chat");
        addDoc(msgRef, {
          from: $loggedinUser.displayName,
          to: $selectedUsername,
          createdAt: Timestamp.fromDate(new Date()),
          imageURL: url || "",
          text: `${$loggedinUser.displayName} has sent an image`,
          tag: "image",
        }).then(() => {
          console.log("document added successfully 😎");
        });
      });
    });
  };

  const handleSubmit = async () => {
    if (!$message) return;
    $showEmojiMenu = false;
    messageSent = $message;
    $message = "";

    // combined id of two users
    let msgId =
      $loggedinUser.displayName > $selectedUsername
        ? `${$loggedinUser.displayName} & ${$selectedUsername}`
        : `${$selectedUsername} & ${$loggedinUser.displayName}`;
    let msgRef = collection(db, "messages", msgId, "chat");

    try {
      await addDoc(msgRef, {
        text: messageSent,
        from: $loggedinUser.displayName,
        to: $selectedUsername,
        createdAt: Timestamp.fromDate(new Date()),
      });

      /* update selected user document */
      let selectedUserRef = doc(db, "users", $selectedUsername);
      let selectedUserSnap = await getDoc(selectedUserRef);
      await updateDoc(selectedUserRef, {
        lastMsg: selectedUserSnap
          .data()
          .lastMsg.map((msg) =>
            msg.split("=>")[0] === $loggedinUser.displayName
              ? `${$loggedinUser.displayName}=>You: ${messageSent}`
              : msg
          ),
        lastUpdated: selectedUserSnap.data().lastUpdated.map((time) =>
          time.split("=>")[0] === $loggedinUser.displayName
            ? // ? `${$loggedinUser.displayName}=>You: ${Timestamp.fromDate(new Date())}`
              // ? $loggedinUser.displayName + '=>' + Date.now().toLocaleString()
              $loggedinUser.displayName + "=>" + Date.now()
            : time
        ),
        // msgCount: selectedUserSnap
        //   .data()
        //   .msgCount.map((count) =>
        //     count.split("=>")[0] === $loggedinUser.displayName
        //       ? `${$loggedinUser.displayName}=>You: ${countVal++}`
        //       : count
        //   ),
        unread: selectedUserSnap
          .data()
          .unread.map((state) =>
            state.split("=>")[0] === $loggedinUser.displayName
              ? `${$loggedinUser.displayName}=>You: true`
              : state
          ),
      });

      // update login user document
      let loggedinUserRef = doc(db, "users", $loggedinUser.displayName);
      let loggedinUserSnap = await getDoc(loggedinUserRef);
      await updateDoc(loggedinUserRef, {
        lastMsg: loggedinUserSnap
          .data()
          .lastMsg.map((msg) =>
            msg.split("=>")[0] === $selectedUsername
              ? `${$selectedUsername}=>${messageSent}`
              : msg
          ),
        lastUpdated: loggedinUserSnap.data().lastUpdated.map((time) =>
          time.split("=>")[0] === $selectedUsername
            ? // ? `${$selectedUsername}=>${Timestamp.fromDate(new Date())}`
              // ? $selectedUsername + '=>' + Date.now().toLocaleString()
              $selectedUsername + "=>" + Date.now()
            : time
        ),
        // msgCount: loggedinUserSnap
        //   .data()
        //   .msgCount.map((count) =>
        //     count.split("=>")[0] === $selectedUsername
        //       ? `${$selectedUsername}=>${countVal++}`
        //       : count
        //   ),
        unread: loggedinUserSnap
          .data()
          .unread.map((state) =>
            state.split("=>")[0] === $selectedUsername
              ? `${$selectedUsername}=>true`
              : state
          ),
      });
      messageSent = "";
      // msgCount.update((n) => n + 1);
      // msgCount.set(countVal)
      console.log("message created successfully 😁");
    } catch (error) {
      console.log("ooh, something went wrong 😥", error);
    }
  };
</script>

<div class="chatbox_input">
  <div class="menu-group">
    {#if $phone && $selectedUserReady}
      <svg
        xmlns="http://www.w3.org/2000/svg"
        class="ionicon icon-menu"
        viewBox="0 0 512 512"
        width="24"
        height="24"
        fill="currentColor"
        on:click|stopPropagation={() => ($showActionMenu = true)}
      >
        <rect
          x="48"
          y="48"
          width="176"
          height="176"
          rx="20"
          ry="20"
          fill="none"
          stroke="currentColor"
          stroke-linecap="round"
          stroke-linejoin="round"
          stroke-width="32"
        />
        <rect
          x="288"
          y="48"
          width="176"
          height="176"
          rx="20"
          ry="20"
          fill="none"
          stroke="currentColor"
          stroke-linecap="round"
          stroke-linejoin="round"
          stroke-width="32"
        />
        <rect
          x="48"
          y="288"
          width="176"
          height="176"
          rx="20"
          ry="20"
          fill="none"
          stroke="currentColor"
          stroke-linecap="round"
          stroke-linejoin="round"
          stroke-width="32"
        />
        <rect
          x="288"
          y="288"
          width="176"
          height="176"
          rx="20"
          ry="20"
          fill="none"
          stroke="currentColor"
          stroke-linecap="round"
          stroke-linejoin="round"
          stroke-width="32"
        />
      </svg>
    {:else if $phone && !$selectedUserReady}
      <div class="icon-skeleton loading-animation" />
    {/if}

    {#if !$phone && $selectedUserReady}
      <svg
        xmlns="http://www.w3.org/2000/svg"
        class="ionicon icon-palette"
        viewBox="0 0 512 512"
        width="26"
        height="26"
        fill="currentColor"
      >
        <path
          d="M430.11 347.9c-6.6-6.1-16.3-7.6-24.6-9-11.5-1.9-15.9-4-22.6-10-14.3-12.7-14.3-31.1 0-43.8l30.3-26.9c46.4-41 46.4-108.2 0-149.2-34.2-30.1-80.1-45-127.8-45-55.7 0-113.9 20.3-158.8 60.1-83.5 73.8-83.5 194.7 0 268.5 41.5 36.7 97.5 55 152.9 55.4h1.7c55.4 0 110-17.9 148.8-52.4 14.4-12.7 11.99-36.6.1-47.7z"
          fill="none"
          stroke="currentColor"
          stroke-miterlimit="10"
          stroke-width="32"
        />
        <circle cx="144" cy="208" r="32" />
        <circle cx="152" cy="311" r="32" />
        <circle cx="224" cy="144" r="32" />
        <circle cx="256" cy="367" r="48" />
        <circle cx="328" cy="144" r="32" />
      </svg>
      <svg
        xmlns="http://www.w3.org/2000/svg"
        class="ionicon icon-camera"
        viewBox="0 0 512 512"
        width="26"
        height="26"
        fill="currentColor"
        on:click={() => ($showCameraModal = true)}
      >
        <path
          d="M350.54 148.68l-26.62-42.06C318.31 100.08 310.62 96 302 96h-92c-8.62 0-16.31 4.08-21.92 10.62l-26.62 42.06C155.85 155.23 148.62 160 140 160H80a32 32 0 00-32 32v192a32 32 0 0032 32h352a32 32 0 0032-32V192a32 32 0 00-32-32h-59c-8.65 0-16.85-4.77-22.46-11.32z"
          fill="none"
          stroke="currentColor"
          stroke-linecap="round"
          stroke-linejoin="round"
          stroke-width="32"
        />
        <circle
          cx="256"
          cy="272"
          r="80"
          fill="none"
          stroke="currentColor"
          stroke-miterlimit="10"
          stroke-width="32"
        />
        <path
          fill="none"
          stroke="currentColor"
          stroke-linecap="round"
          stroke-linejoin="round"
          stroke-width="32"
          d="M124 158v-22h-24v22"
        />
      </svg>

      <label>
        <input
          type="file"
          accept="image/png, image/jpg, image/jpeg"
          on:change={handleFileChange}
        />
        <svg
          xmlns="http://www.w3.org/2000/svg"
          class="ionicon icon-image"
          viewBox="0 0 512 512"
          width="26"
          height="26"
          fill="currentColor"
        >
          <rect
            x="48"
            y="80"
            width="416"
            height="352"
            rx="48"
            ry="48"
            fill="none"
            stroke="currentColor"
            stroke-linejoin="round"
            stroke-width="32"
          />
          <circle
            cx="336"
            cy="176"
            r="32"
            fill="none"
            stroke="currentColor"
            stroke-miterlimit="10"
            stroke-width="32"
          />
          <path
            d="M304 335.79l-90.66-90.49a32 32 0 00-43.87-1.3L48 352M224 432l123.34-123.34a32 32 0 0143.11-2L464 368"
            fill="none"
            stroke="currentColor"
            stroke-linecap="round"
            stroke-linejoin="round"
            stroke-width="32"
          />
        </svg>
      </label>
    {:else if !$phone && !$selectedUserReady}
      <div class="icon-skeleton loading-animation" style:margin-right="15px" />
      <div class="icon-skeleton loading-animation" style:margin-right="15px" />
      <div class="icon-skeleton loading-animation" style:margin-right="15px" />
    {/if}
  </div>

  <form on:submit|preventDefault={handleSubmit} class="messageBox">
    <svg
      xmlns="http://www.w3.org/2000/svg"
      class="ionicon icon-emoji"
      viewBox="0 0 512 512"
      width="24"
      height="24"
      fill="currentColor"
      on:click|stopPropagation={() => ($showEmojiMenu = true)}
    >
      <circle cx="184" cy="232" r="24" />
      <path
        d="M256.05 384c-45.42 0-83.62-29.53-95.71-69.83a8 8 0 017.82-10.17h175.69a8 8 0 017.82 10.17c-11.99 40.3-50.2 69.83-95.62 69.83z"
      />
      <circle cx="328" cy="232" r="24" />
      <circle
        cx="256"
        cy="256"
        r="208"
        fill="none"
        stroke="currentColor"
        stroke-miterlimit="10"
        stroke-width="32"
      />
    </svg>
    <input type="text" placeholder="Say something" bind:value={$message} />
    <!-- style:background={$themeStore.theme === "dark" ? "#3A3F50" : "white"} -->
    <svg
      xmlns="http://www.w3.org/2000/svg"
      class="ionicon icon-submit"
      viewBox="0 0 512 512"
      width="20"
      height="20"
      fill="currentColor"
      style:color={$message ? "#FF4408" : "currentColor"}
      style:cursor={$message ? "pointer" : "none"}
      on:click|preventDefault={handleSubmit}
    >
      <path
        d="M470.3 271.15L43.16 447.31a7.83 7.83 0 01-11.16-7V327a8 8 0 016.51-7.86l247.62-47c17.36-3.29 17.36-28.15 0-31.44l-247.63-47a8 8 0 01-6.5-7.85V72.59c0-5.74 5.88-10.26 11.16-8L470.3 241.76a16 16 0 010 29.39z"
        fill="none"
        stroke="currentColor"
        stroke-linecap="round"
        stroke-linejoin="round"
        stroke-width="32"
      />
    </svg>
  </form>

  {#if !$phone && $selectedUserReady}
    <div class="icon-mic" on:click={() => ($showAudioRecordingModal = true)}>
      <svg
        xmlns="http://www.w3.org/2000/svg"
        class="ionicon"
        viewBox="0 0 512 512"
        width="26"
        height="26"
        fill="currentColor"
      >
        <path
          fill="none"
          stroke="currentColor"
          stroke-linecap="round"
          stroke-linejoin="round"
          stroke-width="32"
          d="M192 448h128M384 208v32c0 70.4-57.6 128-128 128h0c-70.4 0-128-57.6-128-128v-32M256 368v80"
        />
        <path
          d="M256 64a63.68 63.68 0 00-64 64v111c0 35.2 29 65 64 65s64-29 64-65V128c0-36-28-64-64-64z"
          fill="none"
          stroke="currentColor"
          stroke-linecap="round"
          stroke-linejoin="round"
          stroke-width="32"
        />
      </svg>
    </div>
  {:else if !$phone && !$selectedUserReady}
    <!-- <div class="icon-skeleton loading-animation" style:margin-left="10px" /> -->
    <div class="icon-skeleton loading-animation" />
  {/if}
</div>

{#if $showActionMenu && $phone}
  <ActionMenu />
{/if}

<style>
  .icon-skeleton {
    width: 24px;
    height: 24px;
    border-radius: 50px;
  }

  .icon-palette {
    /* margin-left: 8px; */
    margin-right: 15px;
  }

  ::placeholder {
    font-style: italic;
  }

  .chatbox_input {
    position: absolute;
    left: 50%;
    transform: translateX(-50%);
    bottom: 10px;
    width: 100%;
    max-width: 800px;
    margin: auto;
    height: 60px;
    display: flex;
    justify-content: center;
    align-items: center;
    padding-left: 15px;
    backdrop-filter: blur(20px);
    border-bottom-left-radius: 8px;
    border-bottom-right-radius: 8px;
    padding-right: 10px;
    background: rgba(235, 235, 235, 0.5);
  }

  .chatbox_input input {
    width: 100%;
    height: 100%;
    padding-left: 40px;
    padding-right: 35px;
    border: none;
    outline: none;
    font-size: 1em;
    background: #f8f8f8;
    border-radius: 50px;
  }

  .icon-mic,
  .menu-group,
  .icon-camera {
    position: relative;
    display: flex;
    align-items: center;
    justify-content: center;
  }

  /* .icon-plus { */
  .menu-group {
    margin-right: 8px;
    /* border: 1px solid; */
  }

  .messageBox {
    position: relative;
    width: 100%;
    height: 40px;
  }

  .icon-mic {
    margin-left: 10px;
    /* margin-right: 10px; */
  }

  .icon-camera {
    margin-right: 15px;
  }

  .icon-emoji {
    position: absolute;
    top: 50%;
    transform: translateY(-50%);
    left: 10px;
  }

  label {
    width: 26px;
    position: relative;
    margin-right: 10px;
    /* border: 1px solid red; */
  }

  .icon-image {
    position: absolute;
    left: 2px;
    top: 50%;
    transform: translateY(-50%);
  }

  label input {
    width: 0;
    height: 0;
    opacity: 0;
  }

  .icon-submit {
    position: absolute;
    right: 10px;
    top: 50%;
    transform: translateY(-50%);
    font-size: 22px;
  }

  @media (max-width: 1200px) {
    .icon-camera {
      /* margin-left: 5px; */
      /* margin-right: 15px; */
    }
  }

  @media (max-width: 1160px) {
    .chatbox_input {
      padding-left: 10px;
    }
  }

  @media (max-width: 800px) {
    .chatbox_input {
      bottom: 0;
      border-radius: 0;
    }
  }
</style>
