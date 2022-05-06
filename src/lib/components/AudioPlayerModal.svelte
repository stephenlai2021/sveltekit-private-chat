<script>
  import {
    showAudioPlayerModal,
    audioFile,
    audioURL,
    audioConfirmed,
  } from "$lib/store";
  console.log("audio file", $audioFile);

  const handleConfirm = () => {
    $audioConfirmed = true;
    $showAudioPlayerModal = false;
  };

  const handleDelete = () => {
    $showAudioPlayerModal = false;
    $audioFile = null;
  };
</script>

<div class="audioPlayer-modal">
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
    /* position: absolute;
    bottom: 20px; */
  }

  .audioPlayer-modal {
    display: flex;
    justify-content: center;
    align-items: center;
    position: absolute;
    top: 0;
    left: 0;
    width: 100%;
    height: 100vh;
    z-index: 500;
    background: rgba(163, 156, 156, 0.8);
    backdrop-filter: blur(30px);
  }
</style>
