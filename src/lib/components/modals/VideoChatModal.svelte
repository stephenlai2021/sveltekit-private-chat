<script>
  import { showVideochatModal, showIncomingCallModal, callAnswered, callRejected } from "$lib/store";
  import { scale, fly, fade } from "svelte/transition";
  import IconClose from "$lib/components/icons/IconClose.svelte";
  import { onMount } from "svelte";

  let peer = null;
  let peerId = "";
  let peerCall = "";
  let message = "";
  let callInstance = null;
  let remotePeerId = "";
  let localVideoStreamRef = null;
  let remoteVideoStreamRef = null;
  let btnDisabled = false;
  let toggle = false;
  let connected = false;
  let showRefresh = false;
  let twilioServers = null;

  const videoOptions = {
    video: true,
    // audio: true,
  };

  const call = async () => {
    try {
      // open camera
      const mediaStream = await navigator.mediaDevices.getUserMedia(
        videoOptions
      );

      // Make a call to remote peer
      const call = peer.call(remotePeerId, mediaStream);

      // Receive remote video stream
      call.on("stream", (remoteVideoStream) => {
        playRemoteVideoStream(remoteVideoStream);
        playLocalVideoStream(mediaStream);
        connected = true;
      });

      // if ($callAnswered) connected = true
    } catch (error) {
      console.log("error: ", error);
    }
  };

  const hangup = () => {
    // close peer connection
    peer.destroy();

    // close camera
    localVideoStreamRef.srcObject.getTracks().forEach((track) => {
      // track.enabled = false;
      track.stop();
    });

    connected = false;
    $callAnswered = false;
    showRefresh = true;
  };

  const playLocalVideoStream = (mediaStream) => {
    localVideoStreamRef.srcObject = mediaStream;
    localVideoStreamRef.play();
  };

  const playRemoteVideoStream = (mediaStream) => {
    remoteVideoStreamRef.srcObject = mediaStream;
    remoteVideoStreamRef.play();
  };

  const turnOnCamera = () => {
    toggle = false;
    localVideoStreamRef.srcObject.getTracks().forEach((track) => {
      track.enabled = true;
    });
  };

  const turnOffCamera = () => {
    toggle = true;
    localVideoStreamRef.srcObject.getTracks().forEach((track) => {
      track.enabled = false;
    });
  };

  const sendMessage = () => {
    alert(message);
  };

  const getTurnServerCredentials = async () => {
    // fetch("http://localhost:5000/api/get-turn-credentials")
    fetch("https://twilio-turn-server.herokuapp.com/api/get-turn-credentials")
      .then((res) => res.json())
      .then((data) => {
        console.log("1. twilio credentials: ", data.token.iceServers);
        twilioServers = data.token.iceServers;

        let peerConfig = {
          // signaling server
          host: "svelte-peerjs-server.herokuapp.com",
          secure: true,
          port: 443,
          path: "/",

          // ice && turn servers
          iceServers: twilioServers,
          iceTransportPolicy: "relay", // optional: low video resolution
        };
        console.log("2. peerCofig: ", peerConfig);

        import("peerjs").then(({ default: Peer }) => {
          const peer = new Peer(peerConfig);
          console.log("3. peer: ", peer);

          peer.on("open", (id) => {
            peerId = id
            console.log("4. my id: ", peerId);
          });

          // Can't get ID
          peer.on("error", (id) => {
            console.log("error id" + id);
          });

          peer.on("call", (call) => {
            peerCall = call.peer;
            callInstance = call;
            $showIncomingCallModal = true;
          });
        });
      });
  };

  onMount(() => {
    getTurnServerCredentials();
  });

  $: if ($callAnswered) {
    navigator.mediaDevices.getUserMedia(videoOptions).then((mediaStream) => {
      callInstance.answer(mediaStream);
      callInstance
        .on("stream", (remoteVideoStream) => {
          playRemoteVideoStream(remoteVideoStream);
          playLocalVideoStream(mediaStream);
        })
        .catch((error) => {
          console.log("error: ", error);
        });
    });
  }

  $: if ($callRejected) {
    console.log("call is unavailable !");
  }
</script>

<div class="videochat-modal" transition:fade>
  <div
    class="icon-close-wrapper"
    on:click={() => ($showVideochatModal = false)}
  >
    <IconClose width="32" height="32" />
  </div>
  123
</div>

<style>
  .videochat-modal {
    position: absolute;
    top: 0;
    left: 0;
    width: 100%;
    height: 100vh;
    z-index: 300;
    background: #ebebeb;
  }
</style>
