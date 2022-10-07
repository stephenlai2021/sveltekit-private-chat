<script>
  import { allUsers } from '$lib/store'

  
</script>

<div class="icon-add-wrapper">
  {#if $allUsers && $allUsers.length}
    <li on:click|stopPropagation={showModal}>
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
          d="M256 112v288M400 256H112"
        />
      </svg>
    </li>
  {:else}
    <div class="icon-plus loading-animation" />
  {/if}
</div>

<style>
  .icon-add-wrapper {
    position: absolute;
    bottom: 100px;
    right: 40px;
    width: 60px;
    height: 60px;    
    background: var(--theme-color);
  }
</style>