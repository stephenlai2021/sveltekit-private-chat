<script>
  import { onMount } from "svelte";
  import {
    showAudioRecordingModal,
    audioFile
  } from "$lib/store";

  let active = false;
  let second = 0;
  let mediaStream = null;
  let mediaRecorder = null;
  let zero = "0";

  const timer = setInterval(() => {
    second++;
  }, 1000);

  const handleRecording = async () => {
    active = true;
    try {
      mediaStream = await navigator.mediaDevices.getUserMedia({
        audio: true,
      });
      mediaRecorder = new MediaRecorder(mediaStream);
      mediaRecorder.start();

      let chuck = [];
      mediaRecorder.addEventListener("dataavailable", (e) => {
        chuck.push(e.data);
      });

      mediaRecorder.addEventListener("stop", (e) => {
        let blob = new Blob(chuck, {
          type: "audio/wav",
        });
        $audioFile = new File([blob], `${new Date().getTime()}.wav`, {
          type: blob.type,
        });
        console.log("audio file:", $audioFile);
      });
    } catch (err) {
      console.log(err.message);
    }
  };

  const stopRecording = () => {
    clearInterval(timer);
    mediaStream.getTracks().forEach((track) => {
      track.stop();
    });
    active = false;
    $showAudioRecordingModal = false;
  };

  onMount(() => {
    console.log("audio modal is opened");
    handleRecording();
  });

  $: if (second === 10) {
    zero = "";
    setTimeout(() => {
      stopRecording();
    }, 1000)
  }
</script>

<div class="audio-modal">
  <ion-icon
    name="close-outline"
    class="icon-close"
    on:click={() => ($showAudioRecordingModal = false)}
  />
  <div class="audio-wrapper">
    <div class="circle" class:active>
      <ion-icon name="mic-outline" class="icon-mic" on:click={stopRecording} />
    </div>
    <div class="timer-wrapper">
      <span class="timer">{zero}{second}</span>
    </div>
  </div>
</div>

<style>
  .timer-wrapper {
    width: 100%;
    display: flex;
    justify-content: center;
  }

  .timer {
    margin-top: 20px;
    color: #b2b1b1;
    font-size: 3.5em;
  }

  .circle.active::before {
    background: gray;
    animation: bounce 0.8s ease-in-out infinite 0.5s;
  }

  .circle.active .icon-mic {
    color: #ffffff;
  }

  .circle.active {
    background: #ff0000;
  }

  .icon-mic {
    color: #b2b1b1;
    font-size: 4em;
    transition: 0.9s;
  }

  .circle::before {
    content: "";
    width: 120px;
    height: 120px;
    border-radius: 50%;
    opacity: 0.2;
    z-index: -1;
    position: absolute;
  }

  .circle {
    width: 120px;
    height: 120px;
    border-radius: 50%;
    background: #ffffff;
    display: flex;
    justify-content: center;
    align-items: center;
    z-index: 1;
    transition: 0.5s;
    box-shadow: 0 6px 10px 0 rgba(0, 0, 0, 0.14),
      0 1px 18px 0 rgba(0, 0, 0, 0.12), 0 3px 5px -1px rgba(0, 0, 0, 0.2);
  }

  @keyframes bounce {
    0% {
      transform: scale(1);
    }
    25% {
      transform: scale(1.4);
    }
    75% {
      transform: scale(1);
    }
    100% {
      transform: scale(1.3);
    }
  }

  .audio-wrapper {
    width: 120px;
  }

  .icon-close {
    position: absolute;
    right: 5px;
    top: 5px;
    color: black;
  }

  .audio-modal {
    display: flex;
    align-items: center;
    justify-content: center;
    position: absolute;
    top: 0;
    left: 0;
    z-index: 400;
    width: 100%;
    /* height: calc(100vh - 60px); */
    height: 100vh;
    background: rgba(255, 255, 255, 0.5);
    backdrop-filter: blur(24px);
  }
</style>
