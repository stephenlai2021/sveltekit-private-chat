<script>
  import { auth, db, storage } from "$lib/firebase/client";
  import { onAuthStateChanged } from "firebase/auth";
  import {
    query,
    where,
    addDoc,
    updateDoc,
    Timestamp,
    collection,
    onSnapshot,
  } from "firebase/firestore";
  import { ref, uploadBytes, getDownloadURL } from "firebase/storage";
  import { page } from "$app/stores";
  import { goto } from "$app/navigation";
  import {
    mobile,
    selectedImg,
    pictureFile,
    pictureBlob,
    audioFile,
    audioURL,
    audioConfirmed,
    selectedUsername,
    showAudioPlayerModal,
    showAudioRecordingModal,
    showCameraPreviewModal,
    showThemeModal,
    showCameraModal,
    showSettingsModal,
    showAddFriendModal,
    pictureConfirmed,
  } from "$lib/store";
  import CameraModal from "$lib/components/CameraModal.svelte";
  import CameraPreviewModal from "$lib/components/CameraPreviewModal.svelte";
  import AudioRecordingModal from "$lib/components/AudioRecordingModal.svelte";
  import AudioPlayerModal from "$lib/components/AudioPlayerModal.svelte";

  console.log("selfie", $pictureFile);

  let q = null;
  let message = "";
  let sentMessage = "";
  let loggedinUser = {};
  let selectedUser = {};
  let ready = false;
  let matched = false;
  let url = null;
  let file = null;
  let fileError = null;
  let imageRef = null;
  let colRef = collection(db, "whatzapp_users");

  onAuthStateChanged(auth, (_user) => (loggedinUser = _user));

  const handleFileChange = (e) => {
    const types = ["image/png", "image/jpg", "image/jpeg"];

    let selectedFile = e.target.files[0];
    if (selectedFile && types.includes(selectedFile.type)) {
      file = selectedFile;
      console.log(file);
      console.log(`${file.name} is selected`);
      $selectedImg = file;
      fileError = null;

      let imgPath =
        loggedinUser.displayName > $selectedUsername
          ? `${loggedinUser.displayName} & ${$selectedUsername}`
          : `${$selectedUsername} & ${loggedinUser.displayName}`;

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
            loggedinUser.displayName > $selectedUsername
              ? `${loggedinUser.displayName} & ${$selectedUsername}`
              : `${$selectedUsername} & ${loggedinUser.displayName}`;
          let msgRef = collection(db, "messages", msgId, "chat");
          addDoc(msgRef, {
            from: loggedinUser.displayName,
            to: $selectedUsername,
            createdAt: Timestamp.fromDate(new Date()),
            image: url || "",
          }).then(() => {
            console.log("document added successfully 😎");
          });
        });
      });
    } else {
      file = null;
      fileError = "Please select an image file (png or jpg)";
    }
  };

  const handleSubmit = async () => {
    sentMessage = message;
    message = "";
    let imgPath =
      loggedinUser.displayName > $selectedUsername
        ? `${loggedinUser.displayName} & ${$selectedUsername}`
        : `${$selectedUsername} & ${loggedinUser.displayName}`;

    if ($selectedImg) {
      imageRef = ref(
        storage,
        `letschat/messages/images/${imgPath}/${new Date().getTime()} - ${
          $selectedImg.name
        }`
      );
      try {
        await uploadBytes(imageRef, $selectedImg);
        console.log("image upload completed !");
        $selectedImg = null;
      } catch (err) {
        console.log("image uploaded failed");
      }
    }

    if ($pictureFile) {
      imageRef = ref(
        storage,
        `letschat/messages/camera/${imgPath}/${$pictureFile.name}`
      );
      try {
        await uploadBytes(imageRef, $pictureBlob);
        console.log("picture upload completed !");
        $pictureFile = null;
      } catch (err) {
        console.log("picture uploaded failed");
      }
    }

    try {
      const url = await getDownloadURL(imageRef);
      console.log("get downloaded url: ", url);

      let msgId =
        loggedinUser.displayName > $selectedUsername
          ? `${loggedinUser.displayName} & ${$selectedUsername}`
          : `${$selectedUsername} & ${loggedinUser.displayName}`;
      let msgRef = collection(db, "messages", msgId, "chat");
      try {
        await addDoc(msgRef, {
          message: sentMessage,
          from: loggedinUser.displayName,
          to: $selectedUsername,
          createdAt: Timestamp.fromDate(new Date()),
          image: url || "",
        });
        message = "";
        console.log("message submitted successfully 😁");
      } catch (error) {
        console.log("ooh, something went wrong 😥", error);
      }
    } catch (err) {
      console.log(err.message);
    }
  };

  $: if ($page.params.userId === $selectedUsername) matched = true;

  $: if (matched) {
    q = query(colRef, where("name", "==", $selectedUsername));
    const unsub = onSnapshot(q, (snapshot) => {
      let tempUsers = [];
      snapshot.docs.forEach((doc) => {
        tempUsers.push({ ...doc.data() });
      });
      selectedUser = tempUsers[0];
      ready = true;
      console.log("get selected user name | snapshot", selectedUser.name);
      return () => unsub();
    });
    matched = false;
  }

  $: if ($pictureConfirmed) {
    let imgPath =
      loggedinUser.displayName > $selectedUsername
        ? `${loggedinUser.displayName} & ${$selectedUsername}`
        : `${$selectedUsername} & ${loggedinUser.displayName}`;

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
          loggedinUser.displayName > $selectedUsername
            ? `${loggedinUser.displayName} & ${$selectedUsername}`
            : `${$selectedUsername} & ${loggedinUser.displayName}`;
        let msgRef = collection(db, "messages", msgId, "chat");
        addDoc(msgRef, {
          from: loggedinUser.displayName,
          to: $selectedUsername,
          createdAt: Timestamp.fromDate(new Date()),
          image: url || "",
        }).then(() => {
          console.log("document added successfully 😎");
        });
      });
    });
  }

  $: if ($audioConfirmed) {
    let audioPath =
      loggedinUser.displayName > $selectedUsername
        ? `${loggedinUser.displayName} & ${$selectedUsername}`
        : `${$selectedUsername} & ${loggedinUser.displayName}`;

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
          loggedinUser.displayName > $selectedUsername
            ? `${loggedinUser.displayName} & ${$selectedUsername}`
            : `${$selectedUsername} & ${loggedinUser.displayName}`;
        let msgRef = collection(db, "messages", msgId, "chat");
        addDoc(msgRef, {
          from: loggedinUser.displayName,
          to: $selectedUsername,
          createdAt: Timestamp.fromDate(new Date()),
          audio: url || "",
        }).then(() => {
          console.log("document added successfully 😎");
        });
      });
    });
  }

  $: if ($audioFile) {
    $audioURL = window.URL.createObjectURL($audioFile);
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
    {#if $mobile}
      <label>
        <input
          type="file"
          on:change={handleFileChange}
          accept="image/png, image/jpg, image/jpeg"
        />
        <ion-icon name="document-attach-outline" />
      </label>
    {:else}
      <ion-icon
        name="camera-outline"
        on:click={() => ($showCameraModal = true)}
      />
      <label>
        <input
          type="file"
          on:change={handleFileChange}
          accept="image/png, image/jpg, image/jpeg"
        />
        <ion-icon name="image-outline" />
        <!-- <img src="/icon-image.png" alt="" width="24" height="24"> -->
      </label>
    {/if}
    <ion-icon name="location-outline" />
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
    <!-- <svg xmlns="http://www.w3.org/2000/svg" class="ionicon happy" viewBox="0 0 512 512"><title>Happy</title><circle cx="184" cy="232" r="24"/><path d="M256.05 384c-45.42 0-83.62-29.53-95.71-69.83a8 8 0 017.82-10.17h175.69a8 8 0 017.82 10.17c-11.99 40.3-50.2 69.83-95.62 69.83z"/><circle cx="328" cy="232" r="24"/><circle cx="256" cy="256" r="208" fill="none" stroke="currentColor" stroke-miterlimit="10" stroke-width="32"/></svg> -->
  </div>
  <form on:submit|preventDefault={handleSubmit} class="messageBox">
    <input type="text" placeholder="Type a message" bind:value={message} />
    <ion-icon
      name="paper-plane-outline"
      class="icon-submit"
      on:click|preventDefault={handleSubmit}
    />
  </form>
  <div class="icon-wrapper icon-mic" on:click={() => ($showAudioRecordingModal = true)}>
    <!-- <ion-icon name="mic-outline" style:font-size="1.5em" /> -->
    <span class="material-symbols-outlined"> mic </span>
  </div>
</div>

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

<!-- {#if $showPicModal}
  <PicModal />
{/if} -->

<!-- {#if $showPhotoModal}
  <PhotoModal />
{/if} -->

<!-- {#if $showBgSettingsModal}
  <BgSettingsModal />
{/if} -->

<style>
  :root {
    --bg-color: #d6d8dc;
  }

  label input {
    width: 0;
    height: 0;
    opacity: 0;
  }

  .icon-submit {
    position: absolute;
    right: 15px;
    top: 7px;
    /* font-size: 0.9em; */
    width: 20px;
    height: 20px;
    color: gray;
  }

  .messageBox {
    position: relative;
    width: 100%;
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
    z-index: 500;
    /* border: 1px solid; */
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
      /* width: 110%; */
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
