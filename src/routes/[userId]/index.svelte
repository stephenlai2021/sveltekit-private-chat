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
    bgOpacity,
    audioConfirmed,
    // selectedUser,
    selectedUsername,
    getSelectedUser,
    showAudioPlayerModal,
    showAudioRecordingModal,
    showCameraPreviewModal,
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

  // onAuthStateChanged(auth, (user) => (loggedinUser = user));

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
        }).then(() => {
          console.log("document added successfully 😎");
        });
      });
    });
  };

  const handleSubmit = async () => {
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

  onMount(() => {
    $background.src = $imageURL;
    if ($imageTitle === "Default") {
      $bgOpacity = 0.06;
      $bgColor = "#e5ddd5";
      $disabled = true;
    }
    if ($imageTitle != "Default") {
      $bgOpacity = 0.5;
      $disabled = false;
    }
    console.log("image title: ", $imageTitle);

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

  // $: if ($page.params.userId === $selectedUsername) { getSelectedUser($selectedUsername) }

  $: if ($page.params.userId === $selectedUsername) matched = true;
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

  beforeUpdate(() => {
    // autoscroll = chatbox && (chatbox.offsetHeight + chatbox.scrollTop) > (chatbox.scrollHeight - 20);
    autoscroll =
      chatbox &&
      chatbox.offsetHeight + chatbox.scrollTop > chatbox.scrollHeight;
  });

  afterUpdate(() => {
    if (autoscroll) chatbox.scrollTo(0, chatbox.scrollHeight);
  });

  onMount(() => {
    // chatbox.scrollTo(0, chatbox.scrollHeight);
    // chatbox.scrollTop = chatbox.scrollHeight;
    // animateScroll.scrollToBottom()
    // animateScroll.scrollTo({ element: "chatbox" });
    moment.locale(); 
  });

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
  {#if $page.params.userId}
    <title>Chat</title>
  {/if}
</svelte:head>

<div>
  <img bind:this={$background} style:opacity={$bgOpacity} alt="" />
  <!-- <div class="header" style:background={$imageTitle === 'Default' ? '#ededed' : 'rgba(229, 221, 222, 0.5)'}> -->
    <!-- <div class="header" style:background={$bgColor}> -->
  <div class="header" style:background={$themeStore.theme === 'dark' ? 'black' : 'white'}>
    <div class="left-part">
      <ion-icon
        name="arrow-back-outline"
        class="arrow-back"
        on:click={() => goto("/")}
      />
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
            <span class="last-seen">last seen today at 12:22pm</span>
          </div>
        </div>
      {:else}
        <div class="imgText">
          <div class="userimg">
            <div class="user-avatar animation" />
          </div>
          <div class="details">
            <h4 class="user-name animation"> </h4>
          </div>
        </div>
      {/if}
    </div>

    <!-- <div class="right-part">
      <ion-icon name="videocam-outline" class="icon-videocam popup" />
      {#if $isMobile}
        <label>
          <input
            type="file"
            accept="image/png, image/jpg, image/jpeg"
            on:change={handleFileChange}
          />
          <ion-icon
            name="document-attach-outline"
            class="icon-attachment popup"
          />
        </label>
      {/if}
      {#if !$isMobile}
        <ion-icon
          name="camera-outline"
          class="icon-camera popup"
          on:click={() => ($showCameraModal = true)}
        />
        <label>
          <input
            type="file"
            accept="image/png, image/jpg, image/jpeg"
            on:change={handleFileChange}
          />
          <ion-icon name="image-outline" class="icon-image popup" />
        </label>
      {/if}
      <ion-icon
        name="location-outline"
        class="icon-location popup"
        on:click={() => ($showMapModal = true)}
      />
      <ion-icon
        name="options-outline"
        class="icon-options popup"
        on:click|stopPropagation={() => ($showToolModal = !$showToolModal)}
      />
    </div> -->
  </div>

  <!-- {#if selectedUserMsgsReady} -->
  {#if messages}
    <!-- <div class="chatBox" bind:this={chatbox} style:border="1px solid red"> -->
    <div class="chatBox" bind:this={chatbox}>
      <!-- <div class="date-separator-wrapper" style:margin-bottom="50px">
        <h4 class="date-separator">{moment().format("MMM Do YY")}</h4>
        <h4 class="date-separator">{moment().format("L")}</h4>
      </div> -->
      {#each messages as msg}
        <div
          class="message"
          class:my_message={msg.from === $loggedinUser.displayName}
          class:friend_message={msg.from != $loggedinUser.displayName}
        >
          <p class="message-content">
            {#if msg.imageURL}
              <img src={msg.imageURL} alt="" />
            {/if}
            {#if msg.pictureURL}
              <img src={msg.pictureURL} alt="" />
            {/if}
            {#if msg.audioURL}
              <!-- <audio controls style="margin-bottom: 8px;">
                <source src={msg.audioURL} />
                <track kind="captions" />
              </audio> -->
              <div class="audio-player">
                <div class="timeline">
                  <div class="progress" />
                </div>
                <div class="controls">
                  <div class="play-container">
                    <div class="toggle-play play" />
                  </div>
                  <div class="time">
                    <div class="current">0:00</div>
                    <div class="divider">/</div>
                    <div class="length" />
                  </div>
                  <div class="name">Audio </div>
                  <div class="volume-container">
                    <div class="volume-button">
                      <!-- <div class="volume icono-volumeMedium" /> -->
                      <ion-icon name="volume-medium-outline" class="volume" style:color="white"></ion-icon>
                    </div>

                    <div class="volume-slider">
                      <div class="volume-percentage" />
                    </div>
                  </div>
                </div>
              </div>
            {/if}
            {#if (msg.imageURL && msg.from != $loggedinUser.displayName) || (msg.pictureURL && msg.from != $loggedinUser.displayName) || (msg.audioURL && msg.from != $loggedinUser.displayName) || (!msg.imageURL && !msg.pictureURL && !msg.audioURL)}
              <span class="message-text">{msg.text}</span>  
            {/if}
            <!-- <span>{moment(msg.createdAt.toDate()).fromNow()}</span> -->
            <span class="showtime">{moment(msg.createdAt.toDate()).format('LLL')}</span>
          </p>
        </div>
      {/each}
    </div>
  {/if}

  <div class="chatbox_input" style:background={$themeStore.theme === 'dark' ? 'black' : 'white'}>
    <div class="icon-wrapper icon-happy">
      <ion-icon
        name="happy-outline"
        class="happy"
        on:click|stopPropagation={() => ($showEmojiMenu = true)}
      />
    </div>
    <form on:submit|preventDefault={handleSubmit} class="messageBox">
      <input type="text" placeholder="Type a message" bind:value={$message} />
      <ion-icon
        name="paper-plane-outline"
        class="icon-submit"
        on:click|preventDefault={handleSubmit}
      />
    </form>
    <div
      class="icon-wrapper icon-mic"
      on:click={() => ($showAudioRecordingModal = true)}
    >
      <!-- <ion-icon name="mic-outline" class="icon-mic" style:font-size="1.5em" /> -->
      <ion-icon name="mic-outline" />
      <!-- <img src="/icon/icon-audio.svg" alt="audio icon"> -->
    </div>
  </div>
</div>

{#if $showToolModal}
  <ToolModal />
{/if}

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
  /* @import url('https://fonts.googleapis.com/css2?family=Montserrat:wght@400;500&display=swap'); */

  :root {
    --bg-color: #d6d8dc;
    --hue: red;
  }

  ion-icon {
    /* color: #51585c; */
    /* color: #007AFF; */
    font-size: 24px;
  }

  .last-seen {
    font-family: 'Montserrat';
    font-weight: 600;
    font-size: 12px;
    /* color: rgba(13, 13, 13, 0.5); */
  }

  .date-separator-wrapper {
    /* text-align: center; */
    display: flex;
    justify-content: center;
  }

  .date-separator {
    /* font-family: "Montserrat"; */
    font-weight: 500;
    /* font-size: 14px; */
    color: black;
    text-align: center;
    line-height: 17px;
    /* text-transform: uppercase; */
    background: #D9FFFA;
    border-radius: 5px;
    /* width: 70px; */
    /* height: 25px; */
    display: flex;
    align-items: center;
    justify-content: center;
    padding: 8px 16px;
  }

  /* audio-player */
  .audio-player {
    height: 50px;
    width: 300px;
    max-width: 100%;
    background: #444;
    box-shadow: 0 0 10px 0 #000a;

    font-family: arial;
    color: white;
    font-size: 0.75em;
    overflow: hidden;

    display: grid;
    grid-template-rows: 6px auto;
  }

  .progress {
    background: coral;
    width: 0%;
    height: 100%;
    transition: 0.25s;
  }

  .timeline {
    background: white;
    width: 100%;
    position: relative;
    cursor: pointer;
    box-shadow: 0 2px 10px 0 #0008;
  }

  .controls {
    display: flex;
    justify-content: space-between;
    align-items: stretch;
    padding: 0 20px;
  }

  .volume-button {
    height: 26px;
    display: flex;
    align-items: center;
  }

  .volume-percentage {
    background: coral;
    height: 100%;
    width: 75%;
  }

  .volume-slider {
    position: absolute;
    left: -3px;
    top: 15px;
    z-index: -1;
    width: 0;
    height: 15px;
    background: white;
    box-shadow: 0 0 20px #000a;
    transition: 0.25s;
  }

  .volume-container:hover .volume-slider {
    left: -123px;
    width: 120px;
  }

  .volume-container {
    cursor: pointer;
    position: relative;
    z-index: 2;
  }

  .time {
    display: flex;
  }

  .play-container,
  .time,
  .name,
  .volume-container {
    display: flex;
    justify-content: center;
    align-items: center;
  }

  .current,
  .divider,
  .length {
    padding: 2px;
  }

  .toggle-play.play:hover {
    transform: scale(1.1);
  }

  .toggle-play.pause:hover {
    transform: scale(1.1);
  }

  .toggle-play.pause:after {
    position: absolute;
    top: 0;
    right: 8px;
    background: white;
    content: "";
    height: 15px;
    width: 3px;
  }

  .toggle-play.pause:before {
    position: absolute;
    top: 0;
    left: 0px;
    background: white;
    content: "";
    height: 15px;
    width: 3px;
  }

  .toggle-play.pause {
    height: 15px;
    width: 20px;
    cursor: pointer;
    position: relative;
  }

  .toggle-play.play {
    cursor: pointer;
    position: relative;
    left: 0;
    height: 0;
    width: 0;
    border: 7px solid #0000;
    border-left: 13px solid white;
  }
  /* end of audio-player */

  audio {
    max-width: 100%;
  }

  .message-content {
    display: flex;
    flex-direction: column;
    /* border: 1px solid; */
  }

  .message-content .audio-player {
    margin-top: 5px;
  }

  .message-content img {
    /* max-height: 300px; */
    max-height: 300px;
    max-width: 300px;
    object-fit: cover;
    margin-top: 5px;
    border-radius: 8px;
  }

  .popup {
    padding: 5px;
    /* color: rgba(128, 128, 128, 1); */
    color: white;
    border-radius: 50px;
    background: #dadada;
    box-shadow: inset -4px -4px 8px #b9b9b9, inset 4px 4px 8px #fbfbfb;
    font-size: 20px;
  }

  .icon-videocam {
    background: #fa9950;
    box-shadow: inset -6px -6px 12px #d58244, inset 6px 6px 12px #ffb05c;
  }

  .icon-camera {
    /* color: white; */
    background: #fad12f;
    box-shadow: inset -6px -6px 12px #d5b228;
  }

  .icon-image,
  .icon-attachment {
    position: absolute;
    top: 50%;
    transform: translateY(-50%);
    /* border: 1px solid; */
    /* margin-right: 5px; */
    /* background: #dadada; */
    background: #0f63e0;
    box-shadow: inset -6px -6px 12px #0d54be, inset 6px 6px 12px #1172ff;
  }

  .icon-location {
    background: #8d5cd8;
    box-shadow: inset -6px -6px 12px #784eb8, inset 6px 6px 12px #a26af8;
  }

  .icon-options {
    background: #36d676;
    box-shadow: inset -6px -6px 12px #2eb664, inset 6px 6px 12px #3ef688;
  }

  label {
    width: 25px;
    height: 50px;
    position: relative;
    margin-right: 21px;
    /* margin-left: 5px; */
    /* border: 1px solid; */
  }

  label input {
    width: 0;
    height: 0;
    opacity: 0;
  }

  .icon-submit {
    position: absolute;
    right: 15px;
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
    /* color: transparent; */
    background: var(--bg-color);
  }

  .user-name {
    width: 80px;
    /* color: transparent; */
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

  .right-part ion-icon {
    /* color: #51585c; */
    margin-right: 12px;
  }

  .icon-wrapper {
    display: flex;
    align-items: center;
  }

  .icon-mic {
    margin-left: 20px;
  }

  .icon-happy {
    margin-right: 20px;
  }
  
  .icon-wrapper img {
    width: 20px;
    height: 24px;
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
    border: none;
    outline: none;
    font-size: 1em;
    /* background: white; */
    /* color: black; */

    border: 0.5px solid #8E8E93;
    border-radius: 50px;
    /* opacity: 0.45; */
    /* border: 1px solid; */
  }

  ::placeholder {
    /* color: white; */
  }

  .chatbox_input {
    position: absolute;
    bottom: 0;
    width: 100%;
    height: 60px;
    background: #ebebeb;
    padding: 20px;
    display: flex;
    justify-content: center;
    align-items: center;
    /* border: 1px solid; */
  }

  .message.friend_message p {
    background: #f5f5f5;
    backdrop-filter: blur(20px);
    justify-content: flex-start;
  }

  .message.my_message {
    justify-content: flex-end;
    text-align: right;
  } 

  .message.friend_message::before {
    left: -12px;
    /* left: -22px; */
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
    /* left: 20px; */
    width: 20px;
    height: 20px;
  }

  .message p {
    position: relative;
    right: 0;
    max-width: 65%;
    padding: 6px 12px;
    background: var(--lemon-green);
    border-radius: 10px;
    color: var(--icon-add-color);
  }

  .message {
    position: relative;
    display: flex;
    width: 100%;
    margin-bottom: 5px;
  }

  .message p .message-text {
    width: 100%;
    color: black;
    opacity: 1;
    font-family: "Montserrat";
    font-size: 16px;
    font-weight: 500;
  }

  .showtime {
    display: block;
    margin-top: 5px;
    font-size: 11px;
    letter-spacing: 0.5px;
    font-weight: 600;
    opacity: 0.5;
  }

  .chatBox {
    position: absolute;
    top: 60px;
    bottom: 60px;
    width: 100%;
    height: calc(100vh-100px);
    /* padding: 20px; */
    padding: 0 80px;
    padding-bottom: 15px;
    overflow-y: scroll;
  }

  .details {
    padding-left: 15px;
  }

  .details h4 {
    /* color: #51585c; */
  }

  @media (max-width: 800px) {
    .arrow-back {
      margin-right: 10px;
      display: block;
    }
  }

  @media (max-width: 575px) {
    .chatbox_input {
      padding: 15px;
    }

    .icon-happy {
      margin-right: 15px;
    }

    .icon-mic {
      margin-left: 15px;
    }
  }

  @media (max-width: 540px) {
    .message-content img {
      max-height: 200px;
    }
  }

  @media (max-width: 475px) {
    .left-part .details {
      /* padding-left: 0px; */
    }

    .left-part .details h4 {
      /* display: none; */
    }
  }

  @media (max-width: 310px) {
    .right-part ion-icon {
      margin-right: 10px;
    }
  }
</style>
