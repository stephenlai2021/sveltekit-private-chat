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
    message,
    bgColor,
    imageURL,
    isMobile,
    selectedImg,
    pictureFile,
    pictureBlob,
    audioFile,
    audioURL,
    bgOpacity,
    audioConfirmed,
    selectedUsername,
    showAudioPlayerModal,
    showAudioRecordingModal,
    showCameraPreviewModal,
    showThemeModal,
    showCameraModal,
    showSettingsModal,
    showAddFriendModal,
    showEmojiMenu,
    pictureConfirmed,
  } from "$lib/store";
  import CameraModal from "$lib/components/CameraModal.svelte";
  import CameraPreviewModal from "$lib/components/CameraPreviewModal.svelte";
  import AudioRecordingModal from "$lib/components/AudioRecordingModal.svelte";
  import AudioPlayerModal from "$lib/components/AudioPlayerModal.svelte";
  import EmojiMenu from "$lib/components/EmojiMenu.svelte";
  import { onMount } from "svelte";
  import { browser } from "$app/env";
  import themeStore, { setTheme } from "svelte-themes";

  console.log("selfie", $pictureFile);

  let q = null;
  let sentMessage = "";
  let loggedinUser = {};
  let selectedUser = {};
  let ready = false;
  let matched = false;
  let url = null;
  let file = null;
  let fileError = null;
  let imageRef = null;
  let background = null;
  let colRef = collection(db, "whatzapp_users");
  // let isMobile = false;
  let header = null;

  onAuthStateChanged(auth, (_user) => (loggedinUser = _user));

  const handleFileChange = async (e) => {
    file = e.target.files[0];

    // const reader = new FileReader();
    // reader.onload = (e) => { 
    //   background.src = $imageURL = e.target.result 
    //   $bgOpacity = 0.6;
    // }
    // reader.readAsDataURL(file);

    // $imageURL = await readURL(file);
    // background.src = $imageURL;
    // $bgOpacity = 0.6;
  };

  const readURL = (file) => {
    return new Promise((res, rej) => {
      const reader = new FileReader();
      reader.onload = (e) => res(e.target.result);
      reader.onerror = (e) => rej(e);
      reader.readAsDataURL(file);
    });
  };

  $: if (file) {
    readURL(file).then(url => {
      $imageURL = url;
      background.src = $imageURL;
      $bgOpacity = 0.6;
      file = null
    }).catch(err => { 
      console.log('something went wrong', err.message )
    })
  }

  // const handleFileChange = async (e) => {
  //   const types = ["image/png", "image/jpg", "image/jpeg"];

  //   let selectedFile = e.target.files[0];

  //   if (selectedFile && types.includes(selectedFile.type)) {
  //     file = selectedFile;
  //     console.log(file);
  //     console.log(`${file.name} is selected`);
  //     $selectedImg = file;
  //     fileError = null;

  //     // let imgPath =
  //     //   loggedinUser.displayName > $selectedUsername
  //     //     ? `${loggedinUser.displayName} & ${$selectedUsername}`
  //     //     : `${$selectedUsername} & ${loggedinUser.displayName}`;

  //     // let imageRef = ref(
  //     //   storage,
  //     //   `letschat/messages/images/${imgPath}/${new Date().getTime()} - ${
  //     //     file.name
  //     //   }`
  //     // );

  //     // uploadBytes(imageRef, file).then(() => {
  //     //   console.log("image upload completed !");
  //     //   getDownloadURL(imageRef).then((_url) => {
  //     //     url = _url;
  //     //     let msgId =
  //     //       loggedinUser.displayName > $selectedUsername
  //     //         ? `${loggedinUser.displayName} & ${$selectedUsername}`
  //     //         : `${$selectedUsername} & ${loggedinUser.displayName}`;
  //     //     let msgRef = collection(db, "messages", msgId, "chat");
  //     //     addDoc(msgRef, {
  //     //       from: loggedinUser.displayName,
  //     //       to: $selectedUsername,
  //     //       createdAt: Timestamp.fromDate(new Date()),
  //     //       imageURL: url || "",
  //     //     }).then(() => {
  //     //       console.log("document added successfully 😎");
  //     //     });
  //     //   });
  //     // });
  //   } else {
  //     file = null;
  //     fileError = "Please select an image file (png or jpg)";
  //   }
  // };

  const handleSubmit = async () => {
    $showEmojiMenu = false;
    sentMessage = $message;
    $message = "";

    // let imgPath =
    //   loggedinUser.displayName > $selectedUsername
    //     ? `${loggedinUser.displayName} & ${$selectedUsername}`
    //     : `${$selectedUsername} & ${loggedinUser.displayName}`;

    // if ($selectedImg) {
    //   imageRef = ref(
    //     storage,
    //     `letschat/messages/images/${imgPath}/${new Date().getTime()} - ${
    //       $selectedImg.name
    //     }`
    //   );
    //   try {
    //     await uploadBytes(imageRef, $selectedImg);
    //     console.log("image upload completed !");
    //     $selectedImg = null;
    //   } catch (err) {
    //     console.log("image uploaded failed");
    //   }
    // }

    // if ($pictureFile) {
    //   imageRef = ref(
    //     storage,
    //     `letschat/messages/camera/${imgPath}/${$pictureFile.name}`
    //   );
    //   try {
    //     await uploadBytes(imageRef, $pictureBlob);
    //     console.log("picture upload completed !");
    //     $pictureFile = null;
    //   } catch (err) {
    //     console.log("picture uploaded failed");
    //   }
    // }

    // try {
    //   const url = await getDownloadURL(imageRef);
    //   console.log("get downloaded url: ", url);

    //   let msgId =
    //     loggedinUser.displayName > $selectedUsername
    //       ? `${loggedinUser.displayName} & ${$selectedUsername}`
    //       : `${$selectedUsername} & ${loggedinUser.displayName}`;
    //   let msgRef = collection(db, "messages", msgId, "chat");
    //   try {
    //     await addDoc(msgRef, {
    //       message: sentMessage,
    //       from: loggedinUser.displayName,
    //       to: $selectedUsername,
    //       createdAt: Timestamp.fromDate(new Date()),
    //       image: url || "",
    //     });
    //     sentMessage = "";
    //     console.log("message created successfully 😁");
    //   } catch (error) {
    //     console.log("ooh, something went wrong 😥", error);
    //   }
    // } catch (err) {
    //   console.log(err.message);
    // }

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
      });
      sentMessage = "";
      console.log("message created successfully 😁");
    } catch (error) {
      console.log("ooh, something went wrong 😥", error);
    }
  };

  onMount(() => {
    if ($imageURL) background.src = $imageURL;
    if (!$imageURL) {
      $bgOpacity = 0.06
      $bgColor = '#e5ddd5'
      background.src = 'https://previews.123rf.com/images/dimapolie/dimapolie1808/dimapolie180800074/106049740-patr%C3%B3n-de-la-escuela-del-vector-escuela-de-fondo-sin-fisuras-ilustraci%C3%B3n-vectorial.jpg';
      setTheme("light");
    }

    if (
      /(android|bb\d+|meego).+mobile|avantgo|bada\/|blackberry|blazer|compal|elaine|fennec|hiptop|iemobile|ip(hone|od)|ipad|iris|kindle|Android|Silk|lge |maemo|midp|mmp|netfront|opera m(ob|in)i|palm( os)?|phone|p(ixi|re)\/|plucker|pocket|psp|series(4|6)0|symbian|treo|up\.(browser|link)|vodafone|wap|windows (ce|phone)|xda|xiino/i.test(
        navigator.userAgent
      ) ||
      /1207|6310|6590|3gso|4thp|50[1-6]i|770s|802s|a wa|abac|ac(er|oo|s\-)|ai(ko|rn)|al(av|ca|co)|amoi|an(ex|ny|yw)|aptu|ar(ch|go)|as(te|us)|attw|au(di|\-m|r |s )|avan|be(ck|ll|nq)|bi(lb|rd)|bl(ac|az)|br(e|v)w|bumb|bw\-(n|u)|c55\/|capi|ccwa|cdm\-|cell|chtm|cldc|cmd\-|co(mp|nd)|craw|da(it|ll|ng)|dbte|dc\-s|devi|dica|dmob|do(c|p)o|ds(12|\-d)|el(49|ai)|em(l2|ul)|er(ic|k0)|esl8|ez([4-7]0|os|wa|ze)|fetc|fly(\-|_)|g1 u|g560|gene|gf\-5|g\-mo|go(\.w|od)|gr(ad|un)|haie|hcit|hd\-(m|p|t)|hei\-|hi(pt|ta)|hp( i|ip)|hs\-c|ht(c(\-| |_|a|g|p|s|t)|tp)|hu(aw|tc)|i\-(20|go|ma)|i230|iac( |\-|\/)|ibro|idea|ig01|ikom|im1k|inno|ipaq|iris|ja(t|v)a|jbro|jemu|jigs|kddi|keji|kgt( |\/)|klon|kpt |kwc\-|kyo(c|k)|le(no|xi)|lg( g|\/(k|l|u)|50|54|\-[a-w])|libw|lynx|m1\-w|m3ga|m50\/|ma(te|ui|xo)|mc(01|21|ca)|m\-cr|me(rc|ri)|mi(o8|oa|ts)|mmef|mo(01|02|bi|de|do|t(\-| |o|v)|zz)|mt(50|p1|v )|mwbp|mywa|n10[0-2]|n20[2-3]|n30(0|2)|n50(0|2|5)|n7(0(0|1)|10)|ne((c|m)\-|on|tf|wf|wg|wt)|nok(6|i)|nzph|o2im|op(ti|wv)|oran|owg1|p800|pan(a|d|t)|pdxg|pg(13|\-([1-8]|c))|phil|pire|pl(ay|uc)|pn\-2|po(ck|rt|se)|prox|psio|pt\-g|qa\-a|qc(07|12|21|32|60|\-[2-7]|i\-)|qtek|r380|r600|raks|rim9|ro(ve|zo)|s55\/|sa(ge|ma|mm|ms|ny|va)|sc(01|h\-|oo|p\-)|sdk\/|se(c(\-|0|1)|47|mc|nd|ri)|sgh\-|shar|sie(\-|m)|sk\-0|sl(45|id)|sm(al|ar|b3|it|t5)|so(ft|ny)|sp(01|h\-|v\-|v )|sy(01|mb)|t2(18|50)|t6(00|10|18)|ta(gt|lk)|tcl\-|tdg\-|tel(i|m)|tim\-|t\-mo|to(pl|sh)|ts(70|m\-|m3|m5)|tx\-9|up(\.b|g1|si)|utst|v400|v750|veri|vi(rg|te)|vk(40|5[0-3]|\-v)|vm40|voda|vulc|vx(52|53|60|61|70|80|81|83|85|98)|w3c(\-| )|webc|whit|wi(g |nc|nw)|wmlb|wonu|x700|yas\-|your|zeto|zte\-/i.test(
        navigator.userAgent.substring(0, 4)
      )
    )
      $isMobile = true;
      console.log("device type: ", $isMobile ? "mobile" : "desktop");
  });

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
          pictureURL: url || "",
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
          audioURL: url || "",
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
  <img bind:this={background} style:opacity={$bgOpacity} alt="" />
  <div class="header" style:background={$imageURL ? "transparent" : "#ededed"}>
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
      <ion-icon name="videocam-outline" />
      {#if $isMobile}
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
        </label>
      {/if}
      <!-- <ion-icon name="create-outline" /> -->
      <ion-icon name="color-palette-outline" />
      <ion-icon name="location-outline" />
      <!-- <ion-icon name="settings-outline" /> -->
      <ion-icon name="hammer-outline" />
    </div>
    <!-- <ion-icon name="menu-outline" class="icon-menu" /> -->
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
        Lorem ipsum dolor, sit amet consectetur adipisicing elit. Iure
        accusantium alias, optio quas voluptas consequuntur.<br /><span
          >12:18</span
        >
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
        Lorem ipsum dolor, sit amet consectetur adipisicing elit. Iure
        accusantium alias, optio quas voluptas consequuntur.<br /><span
          >12:18</span
        >
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
        Lorem ipsum dolor, sit amet consectetur adipisicing elit. Iure
        accusantium alias, optio quas voluptas consequuntur.<br /><span
          >12:18</span
        >
      </p>
    </div>
  </div>

  <div class="chatbox_input">
    <div class="icon-wrapper icon-happy">
      <ion-icon
        name="happy-outline"
        class="happy"
        on:click|stopPropagation={() => ($showEmojiMenu = true)}
      />
    </div>
    <form on:submit|preventDefault={handleSubmit} class="messageBox">
      <!-- {#if isMobile}
        <label>
          <input
            type="file"
            on:change={handleFileChange}
            accept="image/png, image/jpg, image/jpeg"
          />
          <ion-icon name="document-attach-outline" class="icon-attach" />
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
          <ion-icon name="image-outline" class="icon-image" />
        </label>
      {/if} -->
      {#if isMobile}
        <ion-icon name="menu-outline" class="icon-menu" />
      {/if}
      <input type="text" placeholder="Type a message" bind:value={$message} />
      <div class="icon-submit-wrapper">
        <ion-icon
          name="paper-plane-outline"
          class="icon-submit"
          on:click|preventDefault={handleSubmit}
        />
      </div>
    </form>
    <div
      class="icon-wrapper icon-mic"
      on:click={() => ($showAudioRecordingModal = true)}
    >
      <ion-icon name="mic-outline" style:font-size="1.5em" />
    </div>
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

{#if $showEmojiMenu}
  <EmojiMenu />
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

  .icon-menu {
    position: absolute;
    right: 50px;
    top: 5px;
    color: gray;
  }

  .icon-attach {
  }

  .icon-image {
    position: absolute;
    left: 0;
  }

  .icon-submit-wrapper {
    position: absolute;
    top: 0;
    right: 0;
    width: 40px;
    height: 100%;
    display: flex;
    justify-content: center;
    align-items: center;
    /* overflow: hidden; */
    border-top-right-radius: 30px;
    border-bottom-right-radius: 30px;
    background: rgb(184, 174, 174);
    /* border: 1px solid red; */
  }

  .icon-submit {
    position: absolute;
    right: 12px;
    top: 8px;
    width: 20px;
    height: 20px;
    color: white;
    /* background: gray; */
  }

  .messageBox {
    position: relative;
    width: 100%;
    /* overflow: hidden; */
  }

  .user-avatar,
  .user-name {
    background: var(--bg-color);
  }

  .user-name {
    width: 80px;
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
    /* box-shadow: 2px 2px 2px gray; */
  }

  /* .icon-menu {
    display: none;
  } */

  .icon-mic {
    justify-content: flex-end;
    z-index: 500;
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
    /* opacity: 0.5;
    backdrop-filter: blur(8px); */
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
