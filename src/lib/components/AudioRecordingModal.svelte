<script>
  import { onMount } from "svelte";
  import { audioFile } from "$lib/store";

  let active = false;
  let second = 0;
  let mediaStream = null;
  let mediaRecorder = null;
  let zero = "0";
  let volumeMeter = null;

  const timer = setInterval(() => {
    second++;
  }, 1000);

  const mediaConstraints = {
    audio: {
      echoCancellation: true,
    },
  };

  const handleRecording = async () => {
    active = true;
    try {
      mediaStream = await navigator.mediaDevices.getUserMedia(mediaConstraints);
      measureMicVolume();
      recordVoice()
    } catch (err) {
      console.log(err.message);
    }
  };

  const recordVoice = () => {
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
  };

  const measureMicVolume = () => {
    const audioContext = new AudioContext();
    const mediaStreamAudioSourceNode =
      audioContext.createMediaStreamSource(mediaStream);
    const analyserNode = audioContext.createAnalyser();
    mediaStreamAudioSourceNode.connect(analyserNode);

    const pcmData = new Float32Array(analyserNode.fftSize);
    const onFrame = () => {
      analyserNode.getFloatTimeDomainData(pcmData);
      let sumSquares = 0.0;
      for (const amplitude of pcmData) {
        sumSquares += amplitude * amplitude;
      }
      volumeMeter.value = Math.sqrt(sumSquares / pcmData.length);
      window.requestAnimationFrame(onFrame);
    };
    window.requestAnimationFrame(onFrame);
  };

  const stopRecording = () => {
    clearInterval(timer);
    mediaStream.getTracks().forEach((track) => {
      track.stop();
    });
    active = false;
    // volumeMeter.value = 0
  };

  onMount(() => {
    console.log("audio modal is opened");
    handleRecording();
  });

  $: if (second === 10) {
    zero = "";
    setTimeout(() => {
      stopRecording();
    }, 1000);
  }
</script>

<div class="audio-modal">
  <div class="audio-wrapper">
    <div class="circle" class:active>
      <ion-icon name="mic-outline" class="icon-mic" on:click={stopRecording} />
    </div>
  </div>
  <meter
    class="volume-meter"
    bind:this={volumeMeter}
    high="0.25"
    max="1"
    value="0.0045595006073966"
    />
  <div class="timer-wrapper">
    <span class="timer">{zero}{second}</span>
  </div>
</div>

<style>
  meter {
    appearance: auto;
    width: 200px;
    height: 50px;
    margin: 30px 0 20px 0;
  }

  .timer-wrapper {
    width: 100%;
    display: flex;
    justify-content: center;
  }

  .timer {
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
    flex-direction: column;
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
