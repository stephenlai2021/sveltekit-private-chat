<script>
  import { onMount } from "svelte";

  export let audioURL;

  let audio = null;
  let duration = 0;
  let isPlayed = false;

  const playAudio = () => {
    isPlayed = !isPlayed;
    if (isPlayed) {
      audio.play();
      audio.addEventListener("ended", () => (isPlayed = false));
    }
    if (!isPlayed) audio.pause();
  };

  onMount(() => {
    audio = new Audio(audioURL);
    audio.addEventListener("loadeddata", () => {
      audio.volume = 0.55;
      console.log('audio volume: ', audio.volume)
      duration = audio.duration
      console.log("audio duration: ", duration);
    });
  });
</script>

<div style="width: 50px; height: 50px;" />
<div class="audio-player">
  <div class="controls">
    <div class="play-container">
      <div
        class="toggle-play {isPlayed ? 'pause' : 'play'}"
        on:click={playAudio}
      />
    </div>
  </div>
</div>

<style>
  .audio-player {
    height: 100px;
    width: 100px;
    background-image: url("/radio.png");
    background-size: cover;
    /* border-radius: 50%; */
    font-family: arial;
    font-size: 0.75em;
    overflow: hidden;
    display: grid;
    grid-template-rows: 6px auto;
  }

  .controls {
    display: flex;
    justify-content: center;
    height: 100px;
  }

  .controls .play-container {
    display: flex;
  }
  
  .toggle-play.play {
    cursor: pointer;
    position: relative;
    top: 20px;
    left: 5px;
    height: 0;
    width: 0;
    border: 7px solid #0000;
    border-left: 13px solid white;
  }
  
  .toggle-play.play:hover {
    transform: scale(1.1);
  }
  
  .toggle-play.pause {
    height: 15px;
    width: 20px;
    cursor: pointer;
    position: relative;
  }

  .toggle-play.pause:before {
    position: absolute;
    top: 20px;
    left: 5px;
    background: white;
    content: "";
    height: 15px;
    width: 3px;
  }

  .toggle-play.pause:after {
    position: absolute;
    top: 20px;
    left: 10px;
    background: white;
    content: "";
    height: 15px;
    width: 3px;
  }

  .toggle-play.pause:hover {
    transform: scale(1.1);
  } 
</style>
