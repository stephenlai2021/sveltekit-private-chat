<script>
  import { goto } from "$app/navigation";
  import {
    allUsers,
    groupChat,
    publicChat,
    privateChat,
    selectedUsername,
    currentContact,
  } from "$lib/store";
  import TabmenuSkeleton from "../skeleton/TabmenuSkeleton.svelte";

  const menuItems = ["Private", "Group", "Public"];
  let currentTab = menuItems[0];

  const selectTab = (selectedTab) => {
    currentTab = selectedTab;
    console.log("you clicked: " + currentTab + "tab");

    $selectedUsername = null;
    $currentContact = null;

    if (currentTab === "Private") {
      $privateChat = true;
      $groupChat = false;
      $publicChat = false;
      if ($selectedUsername) goto(`/${$selectedUsername}`);
      if (!$selectedUsername) goto("/");
    }

    if (currentTab === "Group") {
      $privateChat = false;
      $groupChat = true;
      $publicChat = false;
      goto("/");
    }

    if (currentTab === "Public") {
      $privateChat = false;
      $groupChat = false;
      $publicChat = true;
      goto("/");
    }
  };
</script>

<div class="tab-menu">
  {#if $allUsers && $allUsers.length}
    {#each menuItems as tab}
      <span on:click={() => selectTab(tab)}>
        {#if tab === "Private"}
          <svg
            class="ionicon"
            xmlns="http://www.w3.org/2000/svg"
            viewBox="0 0 512 512"
            width="24"
            height="24"
            fill="currentColor"
            style:color={currentTab === tab ? "#FF4408" : ""}
          >
            <path
              d="M87.48 380c1.2-4.38-1.43-10.47-3.94-14.86a42.63 42.63 0 00-2.54-3.8 199.81 199.81 0 01-33-110C47.64 139.09 140.72 48 255.82 48 356.2 48 440 117.54 459.57 209.85a199 199 0 014.43 41.64c0 112.41-89.49 204.93-204.59 204.93-18.31 0-43-4.6-56.47-8.37s-26.92-8.77-30.39-10.11a31.14 31.14 0 00-11.13-2.07 30.7 30.7 0 00-12.08 2.43L81.5 462.78a15.92 15.92 0 01-4.66 1.22 9.61 9.61 0 01-9.58-9.74 15.85 15.85 0 01.6-3.29z"
              fill="none"
              stroke="currentColor"
              stroke-linecap="round"
              stroke-miterlimit="10"
              stroke-width="32"
            />
            <circle cx="160" cy="256" r="32" />
            <circle cx="256" cy="256" r="32" />
            <circle cx="352" cy="256" r="32" />
          </svg>
        {/if}
        {#if tab === "Group"}
          <svg
            xmlns="http://www.w3.org/2000/svg"
            class="ionicon"
            viewBox="0 0 512 512"
            width="24"
            height="24"
            fill="currentColor"
            style:color={currentTab === tab ? "#FF4408" : ""}
          >
            <path
              d="M402 168c-2.93 40.67-33.1 72-66 72s-63.12-31.32-66-72c-3-42.31 26.37-72 66-72s69 30.46 66 72z"
              fill="none"
              stroke="currentColor"
              stroke-linecap="round"
              stroke-linejoin="round"
              stroke-width="32"
            />
            <path
              d="M336 304c-65.17 0-127.84 32.37-143.54 95.41-2.08 8.34 3.15 16.59 11.72 16.59h263.65c8.57 0 13.77-8.25 11.72-16.59C463.85 335.36 401.18 304 336 304z"
              fill="none"
              stroke="currentColor"
              stroke-miterlimit="10"
              stroke-width="32"
            />
            <path
              d="M200 185.94c-2.34 32.48-26.72 58.06-53 58.06s-50.7-25.57-53-58.06C91.61 152.15 115.34 128 147 128s55.39 24.77 53 57.94z"
              fill="none"
              stroke="currentColor"
              stroke-linecap="round"
              stroke-linejoin="round"
              stroke-width="32"
            />
            <path
              d="M206 306c-18.05-8.27-37.93-11.45-59-11.45-52 0-102.1 25.85-114.65 76.2-1.65 6.66 2.53 13.25 9.37 13.25H154"
              fill="none"
              stroke="currentColor"
              stroke-linecap="round"
              stroke-miterlimit="10"
              stroke-width="32"
            />
          </svg>
        {/if}
        {#if tab === "Public"}
          <svg
            xmlns="http://www.w3.org/2000/svg"
            class="ionicon"
            viewBox="0 0 512 512"
            width="24"
            height="24"
            fill="currentColor"
            style:color={currentTab === tab ? "#FF4408" : ""}
          >
            <path
              d="M431 320.6c-1-3.6 1.2-8.6 3.3-12.2a33.68 33.68 0 012.1-3.1A162 162 0 00464 215c.3-92.2-77.5-167-173.7-167-83.9 0-153.9 57.1-170.3 132.9a160.7 160.7 0 00-3.7 34.2c0 92.3 74.8 169.1 171 169.1 15.3 0 35.9-4.6 47.2-7.7s22.5-7.2 25.4-8.3a26.44 26.44 0 019.3-1.7 26 26 0 0110.1 2l56.7 20.1a13.52 13.52 0 003.9 1 8 8 0 008-8 12.85 12.85 0 00-.5-2.7z"
              fill="none"
              stroke="currentColor"
              stroke-linecap="round"
              stroke-miterlimit="10"
              stroke-width="32"
            />
            <path
              d="M66.46 232a146.23 146.23 0 006.39 152.67c2.31 3.49 3.61 6.19 3.21 8s-11.93 61.87-11.93 61.87a8 8 0 002.71 7.68A8.17 8.17 0 0072 464a7.26 7.26 0 002.91-.6l56.21-22a15.7 15.7 0 0112 .2c18.94 7.38 39.88 12 60.83 12A159.21 159.21 0 00284 432.11"
              fill="none"
              stroke="currentColor"
              stroke-linecap="round"
              stroke-miterlimit="10"
              stroke-width="32"
            />
          </svg>
        {/if}
      </span>
    {/each}
  {:else}
    <TabmenuSkeleton />
  {/if}
</div>

<style>
  .tab-menu {
    position: relative;
    display: flex;
    height: 60px;
    /* border: 1px solid; */
  }

  span {
    width: 33.33%;
    text-align: center;
    font-size: 16px;
    font-weight: 600;
    display: flex;
    align-items: center;
    justify-content: center;
    cursor: pointer;
    /* border: 1px solid; */
  }
</style>
