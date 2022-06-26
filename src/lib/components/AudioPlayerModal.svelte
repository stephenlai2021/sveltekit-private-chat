<script>
  import {
    showAudioPlayerModal,
    showAudioRecordingModal,
    audioFile,
    audioURL,
    audioConfirmed,
  } from "$lib/store";
  import themeStore from "svelte-themes"

  // console.log("audio file", $audioFile);

  const handleConfirm = () => {
    $audioConfirmed = true;
    $showAudioRecordingModal = false;
    $showAudioPlayerModal = false;
  };

  const handleDelete = () => {
    $showAudioRecordingModal = false;
    $showAudioPlayerModal = false;
    $audioFile = null;
  };
</script>

<div 
  class="audioPlayer-modal" 
  style:background={$themeStore.theme === "dark" ? "black" : "#ebebeb"}
>
  <div class="audioPlayer-wrapper">
    <audio controls>
      <source src={$audioURL} type="audio/wav" />
      <track kind="captions" />
    </audio>
    <div class="menu-option">
      <ion-icon name="checkmark-outline" on:click={handleConfirm} />
      <ion-icon name="trash-outline" on:click={handleDelete} />
    </div>
  </div>
</div>

<style>
  ion-icon {
    font-size: 2em;
  }

  .menu-option {
    width: 100%;
    display: flex;
    justify-content: space-around;
    align-items: center;
    margin-top: 50px;
  }

  .audioPlayer-modal {
    display: flex;
    justify-content: center;
    align-items: center;
    position: absolute;
    top: 0;
    left: 50%;
    transform: translateX(-50%);
    width: 100%;
    max-width: 1000px;
    height: 100vh;
    z-index: 500;
  }
</style>
