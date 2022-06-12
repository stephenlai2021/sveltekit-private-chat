<script>
  import { fly } from "svelte/transition";
  import {
    showCameraModal,
    showCameraPreviewModal,
    videoStream,
    pictureURI,
    pictureBlob,
    pictureFile,
  } from "$lib/store";
  import { onMount } from "svelte";
  // import CameraPreviewModal from "$lib/components/CameraPreviewModal.svelte";

  let video = null;
  // let videoStream = null;
  let canvas = null;
  let videoReady = false;

  const closeCamera = () => {
    $showCameraModal = false;
    videoReady = false;
    $videoStream.getTracks().forEach(function (track) {
      track.stop();
    });
  };
  
  const dataURLtoBlob = (dataURI) => {
    let byteString = atob(dataURI.split(",")[1]);
    let mimeString = dataURI.split(",")[0].split(":")[1].split(";")[0];
    let ab = new ArrayBuffer(byteString.length);
    let ia = new Uint8Array(ab);
    for (let i = 0; i < byteString.length; i++) {
      ia[i] = byteString.charCodeAt(i);
    }
    return new Blob([ab], { type: mimeString });
  };

  const takePicture = () => {
    console.log("picture is taken");
    canvas.width = video.getBoundingClientRect().width;
    canvas.height = video.getBoundingClientRect().height;

    let context = canvas.getContext("2d");
    context.drawImage(video, 0, 0, canvas.width, canvas.height);

    $pictureURI = canvas.toDataURL();
    console.log("picture url: ", pictureURI);

    $pictureBlob = dataURLtoBlob(canvas.toDataURL());
    const file = new File([$pictureBlob], `${new Date().getTime()}-selfie.jpg`, {
      type: "image/jpg",
    });
    $pictureFile = file;
    console.log("selfie", $pictureFile);

    $showCameraPreviewModal = true
  };

  onMount(async () => {
    try {
      $videoStream = await navigator.mediaDevices.getUserMedia({
        video: true,
        audio: false,
      });
      video.srcObject = $videoStream;
      videoReady = true;
      console.log("video is ready");
    } catch (err) {
      console.log(err.message);
    }
  });

  $: if ($showCameraModal)
    console.log("camera modal is ", $showCameraModal ? "opened" : "closed");
</script>

<div
  class="camera-modal"
  on:click|stopPropagation={() => console.log("camera modal clicked !")}
>
  <!-- transition:fly={{ y: -60, duration: 100, delay: 100 }} -->
  <ion-icon
    name="close-outline"
    class="icon-close"
    on:click|stopPropagation={closeCamera}
  />
  <div class="video-wrapper">
    <video bind:this={video} autoplay>
      <track kind="captions" />
    </video>
  </div>
  {#if videoReady}
    <!-- <canvas bind:this={canvas} on:click={() => ($showCameraPreviewModal = true)} /> -->
    <canvas bind:this={canvas} />
    <ion-icon
      name="aperture-outline"
      class="icon-shoot"
      on:click={takePicture}
    />
    {/if}
</div>

<style>
  canvas {
    position: absolute;
    left: clamp(30px, 50px, 80px);
    width: clamp(1.5em, 2.5em, 3.5em);
    height: clamp(1.5em, 2.5em, 3.5em);
    background: url("/icon-image.png");
    background-size: contain;
    color: white;
    cursor: pointer;
    bottom: 25px;
    border-radius: 50%;
    border: 1px solid;
    display: none;
  }

  .video-wrapper {
    position: relative;
    width: 600px;
    width: 100%;
    height: 100vh;
    display: flex;
    justify-content: center;
    align-items: center;
  }

  video {
    width: 100%;
    height: 100%;
    background: center no-repeat
      url("https://www.freeiconspng.com/uploads/camera-icon-android-camera-shutter-icon-5.png");
    background-size: 300px 300px;
  }

  .icon-close {
    position: absolute;
    right: 10px;
    top: 10px;
    z-index: 500;
  }

  .icon-shoot {
    position: absolute;
    bottom: 20px;
    font-size: clamp(2.5em, 3.5em, 4.5em);
  }

  .camera-modal {
    display: flex;
    justify-content: center;
    align-items: center;
    position: absolute;
    top: 0;
    left: 0;
    z-index: 300;
    background: rgba(163, 156, 156, 0.8);
    backdrop-filter: blur(30px);
    width: 100%;
    height: 100vh;
  }

  @media (max-width: 400px) {
    .video-wrapper {
      width: 360px;
    }
  }

  @media (max-width: 306px) {
    .icon-shoot {
      bottom: 20px;
    }
  }

  /* @media (orientation: landscape) { 
    video {
      height: 100vh;      
    }
  } */
</style>
