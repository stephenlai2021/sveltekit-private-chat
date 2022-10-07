<script>
  import { myDoc } from "$lib/store";
  import { onMount } from "svelte";
  import { db } from "$lib/firebase/client";
  import { doc, updateDoc } from "firebase/firestore";

  let peer = null;
  let peerId = "";
  let remotePeerId = "";
  let localVideoStream = null;
  let remoteVideoStream = null;

  const constraints = {
    video: true,
    // audio: true,
  };

  const call = async () => {};

  onMount(async () => {
    const Peer = (await import("peerjs")).default;
    peer = new Peer();

    peer.on("open", async (id) => {
      peerId = id;
      console.log(`${$myDoc?.name}'s peerId: ${peerId}`);

      let loginUserRef = doc(db, "users", $myDoc.name);
      await updateDoc(loginUserRef, {
        peerId: id,
      });
    });

    const stream = await navigator.mediaDevices.getUserMedia(constraints);
    localVideoStream.srcObject = stream;
    localVideoStream.play();
  });
</script>

<div class="App">
  {#if $myDoc}
    <br />
    <p>{$myDoc.name}'s peer id: {peerId}</p>
    <br />
  {/if}
  <input type="text" />
  <button on:Click={() => call(remotePeerId)}>Call</button>
  <br /><br />
  <div class="video-stream-wrapper">
    <div class="local-video-stream-wrapper">
      <p>Local Video Stream</p>
      <video bind:this={localVideoStream} class="local-video-stream">
        <track kind="captions" />
      </video>
    </div>
    <div class="remote-video-stream-wrapper">
      <p>Remote Video Stream</p>
      <video bind:this={remoteVideoStream} class="remote-video-stream">
        <track kind="captions" />
      </video>
    </div>
  </div>
</div>

<style>
  .video-stream-wrapper {
    display: flex;
    justify-content: space-between;
    border: 1px solid;
  }

  .local-video-stream, 
  .remote-video-stream {
    width: 300px;
  }

  .remote-video-stream {
    margin-left: 30px;
  }
</style>
