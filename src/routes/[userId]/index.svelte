<script>
  import { auth, db, storage } from "$lib/firebase/client";
  import { onAuthStateChanged } from "firebase/auth";
  import {
    doc,
    addDoc,
    setDoc,
    updateDoc,
    query,
    where,
    orderBy,
    Timestamp,
    collection,
    onSnapshot,
  } from "firebase/firestore";
  import { ref, uploadBytes, getDownloadURL } from "firebase/storage";
  import { page } from "$app/stores";
  import { goto } from "$app/navigation";
  import {
    // bgPic,
    mobile,
    message,
    bgColor,
    imageURL,
    imageTitle,
    isMobile,
    disabled,
    background,
    selectedImg,
    pictureFile,
    audioFile,
    audioURL,
    storedImageURL,
    storedPictureURL,
    bgOpacity,
    audioConfirmed,
    // selectedUser,
    selectedUsername,
    getSelectedUser,
    showAudioPlayerModal,
    showAudioRecordingModal,
    showCameraPreviewModal,
    showImagePreviewModal,
    showMapModal,
    showToolModal,
    showThemeModal,
    showCameraModal,
    showSettingsModal,
    showAddFriendModal,
    showEmojiMenu,
    pictureConfirmed,
    loggedinUser,
  } from "$lib/store";
  import CameraModal from "$lib/components/CameraModal.svelte";
  import CameraPreviewModal from "$lib/components/CameraPreviewModal.svelte";
  import AudioRecordingModal from "$lib/components/AudioRecordingModal.svelte";
  import AudioPlayerModal from "$lib/components/AudioPlayerModal.svelte";
  import ToolModal from "$lib/components/ToolModal.svelte";
  import EmojiMenu from "$lib/components/EmojiMenu.svelte";
  import MapModal from "$lib/components/MapModal.svelte";
  import { onMount, beforeUpdate, afterUpdate } from "svelte";
  import { browser } from "$app/env";
  import themeStore, { setTheme } from "svelte-themes";
  import moment from "moment";
  import * as animateScroll from "svelte-scrollto";
  import { slimscroll } from "svelte-slimscroll";
  import ImagePreviewModal from "$lib/components/ImagePreviewModal.svelte";
  import AudioPlayer from "$lib/components/AudioPlayer.svelte"

  console.log("selfie", $pictureFile);

  let q = null;
  let messageSent = "";
  let messages = [];
  // let loggedinUser = {};
  let selectedUser = {};
  // let ready = false;
  let selectedUserReady = false;
  let selectedUserMsgsReady = false;
  let matched = false;
  let url = null;
  let file = null;
  let chatbox = null;
  let autoscroll = null;
  let colRef = collection(db, "whatzapp_users");

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
      messageSent = "";
      console.log("message created successfully 😁");

      // await setDoc(doc(db, 'lastMsg', msgId), {
      //   text: messageSent,
      //   from: $loggedinUser.displayName,
      //   to: $selectedUsername,
      //   createdAt: Timestamp.fromDate(new Date()),
      //   unread: true
      // })
    } catch (error) {
      console.log("ooh, something went wrong 😥", error);
    }
  };

  const showImagePreview = (pictureURL, imageURL) => {
    $showImagePreviewModal = true;

    $storedPictureURL = pictureURL;
    $storedImageURL = imageURL;
  };

  onMount(() => {
    if (
      /(android|bb\d+|meego).+mobile|avantgo|bada\/|blackberry|blazer|compal|elaine|fennec|hiptop|iemobile|ip(hone|od)|ipad|iris|kindle|Android|Silk|lge |maemo|midp|mmp|netfront|opera m(ob|in)i|palm( os)?|phone|p(ixi|re)\/|plucker|pocket|psp|series(4|6)0|symbian|treo|up\.(browser|link)|vodafone|wap|windows (ce|phone)|xda|xiino/i.test(
        navigator.userAgent
      ) ||
      /1207|6310|6590|3gso|4thp|50[1-6]i|770s|802s|a wa|abac|ac(er|oo|s\-)|ai(ko|rn)|al(av|ca|co)|amoi|an(ex|ny|yw)|aptu|ar(ch|go)|as(te|us)|attw|au(di|\-m|r |s )|avan|be(ck|ll|nq)|bi(lb|rd)|bl(ac|az)|br(e|v)w|bumb|bw\-(n|u)|c55\/|capi|ccwa|cdm\-|cell|chtm|cldc|cmd\-|co(mp|nd)|craw|da(it|ll|ng)|dbte|dc\-s|devi|dica|dmob|do(c|p)o|ds(12|\-d)|el(49|ai)|em(l2|ul)|er(ic|k0)|esl8|ez([4-7]0|os|wa|ze)|fetc|fly(\-|_)|g1 u|g560|gene|gf\-5|g\-mo|go(\.w|od)|gr(ad|un)|haie|hcit|hd\-(m|p|t)|hei\-|hi(pt|ta)|hp( i|ip)|hs\-c|ht(c(\-| |_|a|g|p|s|t)|tp)|hu(aw|tc)|i\-(20|go|ma)|i230|iac( |\-|\/)|ibro|idea|ig01|ikom|im1k|inno|ipaq|iris|ja(t|v)a|jbro|jemu|jigs|kddi|keji|kgt( |\/)|klon|kpt |kwc\-|kyo(c|k)|le(no|xi)|lg( g|\/(k|l|u)|50|54|\-[a-w])|libw|lynx|m1\-w|m3ga|m50\/|ma(te|ui|xo)|mc(01|21|ca)|m\-cr|me(rc|ri)|mi(o8|oa|ts)|mmef|mo(01|02|bi|de|do|t(\-| |o|v)|zz)|mt(50|p1|v )|mwbp|mywa|n10[0-2]|n20[2-3]|n30(0|2)|n50(0|2|5)|n7(0(0|1)|10)|ne((c|m)\-|on|tf|wf|wg|wt)|nok(6|i)|nzph|o2im|op(ti|wv)|oran|owg1|p800|pan(a|d|t)|pdxg|pg(13|\-([1-8]|c))|phil|pire|pl(ay|uc)|pn\-2|po(ck|rt|se)|prox|psio|pt\-g|qa\-a|qc(07|12|21|32|60|\-[2-7]|i\-)|qtek|r380|r600|raks|rim9|ro(ve|zo)|s55\/|sa(ge|ma|mm|ms|ny|va)|sc(01|h\-|oo|p\-)|sdk\/|se(c(\-|0|1)|47|mc|nd|ri)|sgh\-|shar|sie(\-|m)|sk\-0|sl(45|id)|sm(al|ar|b3|it|t5)|so(ft|ny)|sp(01|h\-|v\-|v )|sy(01|mb)|t2(18|50)|t6(00|10|18)|ta(gt|lk)|tcl\-|tdg\-|tel(i|m)|tim\-|t\-mo|to(pl|sh)|ts(70|m\-|m3|m5)|tx\-9|up(\.b|g1|si)|utst|v400|v750|veri|vi(rg|te)|vk(40|5[0-3]|\-v)|vm40|voda|vulc|vx(52|53|60|61|70|80|81|83|85|98)|w3c(\-| )|webc|whit|wi(g |nc|nw)|wmlb|wonu|x700|yas\-|your|zeto|zte\-/i.test(
        navigator.userAgent.substring(0, 4)
      )
    ) {
      $isMobile = true;
      console.log("device type: ", $isMobile ? "mobile" : "desktop");
    }
  });

  $: if ($page.params.userId === $selectedUsername) {
    matched = true;
  }

  $: if (matched) {
    q = query(colRef, where("name", "==", $selectedUsername));
    const unsub = onSnapshot(q, (snapshot) => {
      let tempUsers = [];
      snapshot.docs.forEach((doc) => {
        tempUsers.push({ ...doc.data() });
      });
      selectedUser = tempUsers[0];
      // ready = true;
      selectedUserReady = true;
      console.log("get selected user name | snapshot: ", selectedUser.name);
      return () => unsub();
    });

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
    // selectedUserMsgsReady = false
    matched = false;
  }

  $: if ($pictureConfirmed) {
    let imgPath =
      $loggedinUser.displayName > $selectedUsername
        ? `${$loggedinUser.displayName} & ${$selectedUsername}`
        : `${$selectedUsername} & ${$loggedinUser.displayName}`;

    let imageRef = ref(
      storage,
      `letschat/messages/camera/${imgPath}/-${$pictureFile.name}`
    );

    uploadBytes(imageRef, $pictureFile).then(() => {
      console.log("picture upload completed !");
      $pictureConfirmed = false;
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
          pictureURL: url || "",
          text: `${$loggedinUser.displayName} has sent a photo`,
          tag: "picture",
        }).then(() => {
          console.log("document added successfully 😎");
        });
      });
    });
  }

  $: if ($audioConfirmed) {
    let audioPath =
      $loggedinUser.displayName > $selectedUsername
        ? `${$loggedinUser.displayName} & ${$selectedUsername}`
        : `${$selectedUsername} & ${$loggedinUser.displayName}`;

    let audioRef = ref(
      storage,
      `letschat/messages/voice/${audioPath}/-${$audioFile.name}`
    );

    uploadBytes(audioRef, $audioFile).then(() => {
      console.log("audio upload completed !");
      $audioConfirmed = false;
      getDownloadURL(audioRef).then((_url) => {
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
          audioURL: url || "",
          text: `${$loggedinUser.displayName} has sent a voice`,
          tag: "audio",
        }).then(() => {
          console.log("document added successfully 😎");
        });
      });
    });
  }

  $: if ($audioFile) {
    $audioURL = window.URL.createObjectURL($audioFile);
    console.log("audio url", $audioURL);
    $showAudioPlayerModal = true;
  }

  $: if ($mobile) {
    $showThemeModal = false;
    $showSettingsModal = false;
    $showAddFriendModal = false;
  }
</script>

<svelte:head>
  <!-- {#if $page.params.userId}
    <title>Chat</title>
  {/if} -->
  <script src="https://unpkg.com/wavesurfer.js"></script>
</svelte:head>

<div>
  <!-- <img 
    src="" alt=""
    style:background={$themeStore.theme === "dark" ? "#292F3F" : $bgColor}
  /> -->
  <div
    class="header"
    style:background={$themeStore.theme === "dark" ? "#292F3F" : "#ebebeb"}
  >
    <div class="left-part">
      <svg
        xmlns="http://www.w3.org/2000/svg"
        class="ionicon arrow-back"
        viewBox="0 0 512 512"
        width="24"
        height="24"
        fill="currentColor"
        on:click={() => goto("/")}
      >
        <path
          fill="none"
          stroke="currentColor"
          stroke-linecap="round"
          stroke-linejoin="round"
          stroke-width="48"
          d="M244 400L100 256l144-144M120 256h292"
        />
      </svg>
      {#if selectedUserReady}
        <div class="imgText">
          <div class="userimg">
            {#if selectedUser.avatar}
              <img src={selectedUser.avatar} alt="" />
            {:else}
              <img src="/joke.png" alt="" />
            {/if}
            <div
              class={selectedUser.isOnline ? "status online" : "status offline"}
            />
          </div>
          <div class="details">
            <h4>{selectedUser.name}</h4>
            <!-- <span class="last-seen">last seen today at 12:22pm</span> -->
          </div>
        </div>
      {:else}
        <div class="imgText">
          <div class="userimg">
            <div class="user-avatar animation" />
          </div>
          <div class="details">
            <h4 class="user-name animation" />
          </div>
        </div>
      {/if}
    </div>

    <div class="right-part">
      <svg
        xmlns="http://www.w3.org/2000/svg"
        class="ionicon"
        viewBox="0 0 512 512"
        width="24"
        height="24"
        fill="currentColor"
        style:margin-right="20px"
      >
        <path
          d="M374.79 308.78L457.5 367a16 16 0 0022.5-14.62V159.62A16 16 0 00457.5 145l-82.71 58.22A16 16 0 00368 216.3v79.4a16 16 0 006.79 13.08z"
          fill="none"
          stroke="currentColor"
          stroke-linecap="round"
          stroke-linejoin="round"
          stroke-width="32"
        />
        <path
          d="M268 384H84a52.15 52.15 0 01-52-52V180a52.15 52.15 0 0152-52h184.48A51.68 51.68 0 01320 179.52V332a52.15 52.15 0 01-52 52z"
          fill="none"
          stroke="currentColor"
          stroke-miterlimit="10"
          stroke-width="32"
        />
      </svg>

      <svg
        xmlns="http://www.w3.org/2000/svg"
        class="ionicon"
        viewBox="0 0 512 512"
        width="24"
        height="24"
        fill="currentColor"
        style:margin-right="20px"
        on:click={() => ($showMapModal = true)}
      >
        <path
          d="M256 48c-79.5 0-144 61.39-144 137 0 87 96 224.87 131.25 272.49a15.77 15.77 0 0025.5 0C304 409.89 400 272.07 400 185c0-75.61-64.5-137-144-137z"
          fill="none"
          stroke="currentColor"
          stroke-linecap="round"
          stroke-linejoin="round"
          stroke-width="32"
        />
        <circle
          cx="256"
          cy="192"
          r="48"
          fill="none"
          stroke="currentColor"
          stroke-linecap="round"
          stroke-linejoin="round"
          stroke-width="32"
        />
      </svg>
      <svg
        xmlns="http://www.w3.org/2000/svg"
        class="ionicon"
        viewBox="0 0 512 512"
        width="24"
        height="24"
        fill="currentColor"
        style:margin-right="20px"
        on:click|stopPropagation={() => ($showToolModal = !$showToolModal)}
      >
        <!-- on:click|stopPropagation={() => ($showToolModal = true)} -->
        <path
          d="M262.29 192.31a64 64 0 1057.4 57.4 64.13 64.13 0 00-57.4-57.4zM416.39 256a154.34 154.34 0 01-1.53 20.79l45.21 35.46a10.81 10.81 0 012.45 13.75l-42.77 74a10.81 10.81 0 01-13.14 4.59l-44.9-18.08a16.11 16.11 0 00-15.17 1.75A164.48 164.48 0 01325 400.8a15.94 15.94 0 00-8.82 12.14l-6.73 47.89a11.08 11.08 0 01-10.68 9.17h-85.54a11.11 11.11 0 01-10.69-8.87l-6.72-47.82a16.07 16.07 0 00-9-12.22 155.3 155.3 0 01-21.46-12.57 16 16 0 00-15.11-1.71l-44.89 18.07a10.81 10.81 0 01-13.14-4.58l-42.77-74a10.8 10.8 0 012.45-13.75l38.21-30a16.05 16.05 0 006-14.08c-.36-4.17-.58-8.33-.58-12.5s.21-8.27.58-12.35a16 16 0 00-6.07-13.94l-38.19-30A10.81 10.81 0 0149.48 186l42.77-74a10.81 10.81 0 0113.14-4.59l44.9 18.08a16.11 16.11 0 0015.17-1.75A164.48 164.48 0 01187 111.2a15.94 15.94 0 008.82-12.14l6.73-47.89A11.08 11.08 0 01213.23 42h85.54a11.11 11.11 0 0110.69 8.87l6.72 47.82a16.07 16.07 0 009 12.22 155.3 155.3 0 0121.46 12.57 16 16 0 0015.11 1.71l44.89-18.07a10.81 10.81 0 0113.14 4.58l42.77 74a10.8 10.8 0 01-2.45 13.75l-38.21 30a16.05 16.05 0 00-6.05 14.08c.33 4.14.55 8.3.55 12.47z"
          fill="none"
          stroke="currentColor"
          stroke-linecap="round"
          stroke-linejoin="round"
          stroke-width="32"
        />
      </svg>
    </div>
  </div>

  <!-- {#if selectedUserMsgsReady} -->
  {#if messages}
    <div
      class="chatBox"
      bind:this={chatbox}
      style:background={$themeStore.theme === "dark" ? "#292F3F" : $bgColor}
    >
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
              style:left={msg.pictureURL || msg.imageURL ? "12px" : ""}
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

            <!-- {#if msg.text} -->
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
              <!-- <audio controls>
                <source src={msg.audioURL} />
                <track kind="captions" />
              </audio> -->
              <AudioPlayer />
            {/if}
          </p>
        </div>
      {/each}
    </div>
  {/if}

  <div
    class="chatbox_input"
    style:background={$themeStore.theme === "dark" ? "#292F3F" : "#ebebeb"}
  >
    <div class="icon-wrapper">
      {#if $isMobile}
        <label>
          <input
            type="file"
            accept="image/png, image/jpg, image/jpeg"
            on:change={handleFileChange}
          />
          <svg
            xmlns="http://www.w3.org/2000/svg"
            class="ionicon icon-attachment"
            viewBox="0 0 512 512"
            width="26"
            height="26"
            fill="currentColor"
          >
            <path
              d="M216.08 192v143.85a40.08 40.08 0 0080.15 0l.13-188.55a67.94 67.94 0 10-135.87 0v189.82a95.51 95.51 0 10191 0V159.74"
              fill="none"
              stroke="currentColor"
              stroke-linecap="round"
              stroke-miterlimit="10"
              stroke-width="32"
            />
          </svg>
        </label>
      {/if}
      {#if !$isMobile}
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
      <input
        type="text"
        placeholder="Say something"
        bind:value={$message}
        style:background={$themeStore.theme === "dark" ? "#1F232F" : "white"}
      />
      <svg
        xmlns="http://www.w3.org/2000/svg"
        class="ionicon icon-submit"
        viewBox="0 0 512 512"
        width="20"
        height="20"
        fill="currentColor"
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
  </div>
</div>

<!-- {#if $showToolModal}
  <ToolModal />
{/if} -->

{#if $showAudioPlayerModal}
  <AudioPlayerModal />
{/if}

{#if $showAudioRecordingModal}
  <AudioRecordingModal />
{/if}

{#if $showCameraModal}
  <CameraModal />
{/if}

{#if $showCameraPreviewModal}
  <CameraPreviewModal />
{/if}

{#if $showEmojiMenu}
  <EmojiMenu />
{/if}

{#if $showMapModal}
  <MapModal />
{/if}

<style>
  :root {
    --bg-color: #d6d8dc;
    --hue: red;
  }

  .picture-wrapper {
    position: relative;
  }

  .icon-expand {
    /* position: absolute;
    top: -5px;
    left: -5px;
    z-index: 600; */
    background: rgba(0, 0, 0, 0.5);
    color: rgba(255, 255, 255, 0.5);
    color: white;
    border-radius: 2px;
  }

  audio {
    max-width: 100%;
  }

  .message-content {
    display: flex;
    flex-direction: column;
    /* border: 1px solid; */
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
  }

  .icon-image {
    position: absolute;
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

  .messageBox {
    position: relative;
    width: 100%;
    height: 40px;
  }

  .user-avatar,
  .user-name {
    background: var(--bg-color);
  }

  .user-name {
    width: 80px;
    color: #51585c;
    border-radius: 2px;
  }

  .user-avatar {
    width: 40px;
    height: 40px;
    border-radius: 50%;
  }

  .right-part {
    display: flex;
    align-items: center;
  }

  .icon-mic,
  .icon-wrapper {
    position: relative;
    display: flex;
    align-items: center;
    justify-content: center;
    padding: 6px;
    border-radius: 10px;
  }

  .icon-mic {
    margin-left: 10px;
  }

  .icon-attachment {
    position: absolute;
    top: 50%;
    left: 10px;
    left: 0px;
    transform: translateY(-50%);
  }

  .icon-camera {
    margin-right: 20px;
  }

  .arrow-back {
    display: none;
  }

  .left-part {
    display: flex;
    align-items: center;
    margin-right: auto;
  }

  .chatbox_input input {
    width: 100%;
    height: 100%;
    padding: 5px 20px;
    padding-left: 40px;
    border: none;
    outline: none;
    font-size: 1em;
    background: #f8f8f8;
    border-radius: 50px;
  }

  .chatbox_input {
    position: absolute;
    left: 50%;
    transform: translateX(-50%);
    bottom: 5px;
    width: 100%;
    max-width: 800px;
    margin: auto;
    height: 60px;
    background: #ebebeb;
    display: flex;
    justify-content: center;
    align-items: center;
    border-radius: 30px;
    padding: 0 15px;
    /* border: 1px solid; */
  }

  .message.friend_message p {
    background: #f5f5f5;
    justify-content: flex-start;
    /* border: 1px solid; */
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

  .message {
    position: relative;
    display: flex;
    max-width: 800px;
    margin: 20px auto;
    /* border: 1px solid; */
  }

  .message p {
    position: relative;
    right: 0;
    max-width: 65%;
    /* padding: 8px 12px 6px 12px; */
    border-radius: 8px;
    background: var(--lemon-green);
    color: var(--icon-add-color);
    /* border: 1px solid red; */
  }

  .message p .message-text {
    width: 100%;
    min-width: 40px;
    font-size: 18px;
    font-weight: 400;
    /* border: 1px solid white; */
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
    /* margin: 5px; */
    /* position: absolute;
    top: -17px;
    width: 60px; */
    /* border: 1px solid; */
  }

  .chatBox {
    position: absolute;
    top: 60px;
    bottom: 60px;
    width: 100%;
    height: calc(100vh - 120px);
    padding: 10px 20px 0 20px;
    overflow-y: scroll;
    /* border: 1px solid; */
  }

  .details h4 {
    font-size: 18px;
    font-weight: 400;
  }

  .details {
    padding-left: 15px;
  }

  @media (max-width: 1200px) {
    .chatbox_input {
      bottom: 0;
      border-radius: 0;
    }
  }

  @media (max-width: 800px) {
    .arrow-back {
      margin-right: 10px;
      display: block;
    }
  }
</style>
