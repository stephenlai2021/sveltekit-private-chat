<script>
  import { keyword, allUsers } from "$lib/store";
  import SearchUserSkeleton from "../skeleton/SearchUserSkeleton.svelte";
</script>

<div class="search_user">
  {#if $allUsers && $allUsers.length}
    <div class="search-user-wrapper">
      <input type="text" placeholder="Find user" bind:value={$keyword} />
      <svg
        xmlns="http://www.w3.org/2000/svg"
        class="ionicon icon-finduser"
        viewBox="0 0 512 512"
        width="20"
        height="20"
        fill="currentCoklor"
        style:cursor="none"
      >
        <path
          d="M221.09 64a157.09 157.09 0 10157.09 157.09A157.1 157.1 0 00221.09 64z"
          fill="none"
          stroke="currentColor"
          stroke-miterlimit="10"
          stroke-width="32"
        />
        <path
          fill="none"
          stroke="currentColor"
          stroke-linecap="round"
          stroke-miterlimit="10"
          stroke-width="32"
          d="M338.29 338.29L448 448"
        />
      </svg>
    </div>
  {:else}
    <SearchUserSkeleton />
  {/if}
</div>

<style>
  .search_user {
    position: relative;
    top: 0px;
    width: 100%;
    padding: 0px 15px 10px 15px;
    padding: 0px 10px 10px 10px;
  }

  .search-user-wrapper {
    position: relative;
  }

  input {
    width: 100%;
    outline: none;
    border: none;
    padding: 10px;
    border-radius: 10px;
    font-size: 14px;
    padding-left: 40px;
  }

  .icon-finduser {
    position: absolute;
    left: 10px;
    top: 50%;
    transform: translateY(-50%);
  }

  ::placeholder {
    font-size: 16px;
  }

  @media (max-width: 800px) {
    .search_user {
      padding: 0 10px;
    }
  }
</style>
