<script>
  let player = null;
</script>

<div class="player" bind:this={player}>
  <!-- <div class="now">Play Your Audio</div> -->

  <div class="inner-wrapper">
    <div class="progress-wrapper">
      <progress value="0" max="100" />
      <span class="time">01/10</span>
    </div>

    <div class="buttons">
      <button class="play">
        <svg
          xmlns="http://www.w3.org/2000/svg"
          class="ionicon"
          viewBox="0 0 512 512"
          width="24"
          height="24"
          fill="currentColor"
        >
          <path
            d="M112 111v290c0 17.44 17 28.52 31 20.16l247.9-148.37c12.12-7.25 12.12-26.33 0-33.58L143 90.84c-14-8.36-31 2.72-31 20.16z"
            fill="none"
            stroke="currentColor"
            stroke-miterlimit="10"
            stroke-width="32"
          />
        </svg>
      </button>

      <button class="pause">
        <svg
          xmlns="http://www.w3.org/2000/svg"
          class="ionicon"
          viewBox="0 0 512 512"
          width="24"
          height="24"
          fill="currentColor"
        >
          <path
            fill="none"
            stroke="currentColor"
            stroke-linecap="round"
            stroke-linejoin="round"
            stroke-width="32"
            d="M176 96h16v320h-16zM320 96h16v320h-16z"
          />
        </svg>
      </button>
      <button class="stop">
        <svg
          xmlns="http://www.w3.org/2000/svg"
          class="ionicon"
          viewBox="0 0 512 512"
          width="24"
          height="24"
          fill="currentColor"
        >
          <rect
            x="96"
            y="96"
            width="320"
            height="320"
            rx="24"
            ry="24"
            fill="none"
            stroke="currentColor"
            stroke-linejoin="round"
            stroke-width="32"
          />
        </svg>
      </button>
    </div>
  </div>
  <input type="range" class="volume" />
</div>

<style>
  /* @import url("$lib/styles/audio-player.css"); */

  .player {
    position: relative;
    width: 100%;
    width: 180px;
    height: 70px;
    margin: auto;
    background: rgb(2, 0, 36);
    background: linear-gradient(
      90deg,
      rgba(2, 0, 36, 1) 0%,
      rgba(9, 9, 121, 1) 35%,
      rgba(0, 212, 255, 1) 100%
    );
    /* background: linear-gradient(90deg, #d53369 0%, #daae51 100%);
  background: linear-gradient(225deg, #1CB5E0 0%, #000851 100%); */
    display: flex;
    flex-direction: column;
    justify-content: center;
    align-items: center;
    border-radius: 20px;
    padding: 0 0px 0 20px;
    box-shadow: 2px 2px 5px rgba(255, 255, 255, 0.5);
  }

  .buttons {
    box-sizing: border-box;
    padding-top: 5px;
  }

  button {
    border: none;
    background: none;
    margin: 5px;
    color: #fff;
    cursor: pointer;
    outline: none;
    transition: 0.5s;
    position: relative;
  }

  button:hover {
    border: 1px solid #fff;
    color: #04c2fc;
  }

  .now {
    margin-bottom: 5px;
    color: #fff;
    font-size: 1.1rem;
  }

  .progress-wrapper {
    display: flex;
    justify-content: space-between;
  }

  progress {
    width: 60%;
  }

  .progress-wrapper span.time {
    font-size: 6px;
    color: white;
  }

  .volume {
    position: absolute;
    left: 0px;
    width: 25%;
    transform: rotate(-90deg);
    -webkit-appearance: none;
  }

  .volume:focus {
    outline: none;
  }

  .volume::-webkit-slider-runnable-track {
    width: 100%;
    height: 10px;
    cursor: pointer;
    background: #010b61;
  }

  .volume::-webkit-slider-thumb {
    height: 10px;
    width: 10px;
    border-radius: 50%;
    background: #ffa8ff;
    cursor: pointer;
    -webkit-appearance: none;
  }

  .volume:focus::-webkit-slider-runnable-track {
    background: #1069b8;
  }
</style>
