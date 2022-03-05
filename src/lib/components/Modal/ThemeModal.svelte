<script>
  import { bgColor, showThemeModal } from "$lib/store";
  import themes from "$lib/data/themes.json";
  import { fly } from "svelte/transition";

  console.table(themes);
</script>

<div
  class="modal-theme"
  transition:fly={{ x: 50, duration: 200, delay: 200 }}
  on:click|stopPropagation={() => console.log("hi, there !")}
>
  <div class="icon-arrow-wrapper">
    <!-- <span class="material-icons">arrow_back</span> -->
    <ion-icon
      name="arrow-back-outline"
      class="icon-arrow-back"
      on:click|stopPropagation={() => ($showThemeModal = false)}
    />
  </div>
  <main>
    {#each themes as theme}
      <div class="theme-item" style:cursor="pointer">
        <div class="theme-image" style:background={theme.background} />
        <span class="theme-title">{theme.title}</span>
      </div>
    {/each}
  </main>
</div>

<style>
  .icon-arrow-back {
    cursor: pointer;
  }

  .icon-arrow-wrapper {
    display: flex;
    align-items: center;
    padding: 5px;
    padding-top: 10px;
  }

  main {
    display: grid;
    grid-template-columns: repeat(auto-fit, minmax(50px, 1fr));
    gap: 1em;
    grid-row-gap: 1em;
    padding: 15px;
  }

  .modal-theme {
    position: absolute;
    top: 0;
    left: 0;
    z-index: 300;
    width: 100%;
    height: 100vh;
    background: grey;
  }

  .theme-item {
    display: flex;
    flex-direction: column;
    align-items: center;
    font-weight: normal;
  }

  .theme-image {
    width: 50px;
    height: 50px;
    border-radius: 8px;
  }

  .theme-title {
    font-size: 0.7em;
    text-align: center;
  }
</style>
