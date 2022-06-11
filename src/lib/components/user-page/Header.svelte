<script>
  import {
    showMapModal,
    showToolModal,
    selectedUsername,
    loggedinUser,
  } from "$lib/store";
  import {
    doc,
    addDoc,
    setDoc,
    updateDoc,
    query,
    where,
    orderBy,
    Timestamp,
    collection,
    onSnapshot,
  } from "firebase/firestore";
  import { goto } from "$app/navigation";
  import { page } from "$app/stores";
  import themeStore from "svelte-themes";
  import { db } from "$lib/firebase/client";

  let q = null;
  let matched = false;
  let selectedUserReady = false;
  let selectedUser = {};
  let colRef = collection(db, "whatzapp_users");

  $: if ($page.params.userId === $selectedUsername) matched = true;

  $: if (matched) {
    q = query(colRef, where("name", "==", $selectedUsername));
    const unsub = onSnapshot(q, (snapshot) => {
      let tempUsers = [];
      snapshot.docs.forEach((doc) => {
        tempUsers.push({ ...doc.data() });
      });
      selectedUser = tempUsers[0];
      selectedUserReady = true;
      console.log("get selected user name | snapshot: ", selectedUser.name);
      return () => unsub();
    });
    matched = false;
  }
</script>

<div
  class="header"
  style:background={$themeStore.theme === "dark" ? "#292F3F" : "#ebebeb"}
>
  <div class="left-part">
    <svg
      xmlns="http://www.w3.org/2000/svg"
      class="ionicon arrow-back"
      viewBox="0 0 512 512"
      width="24"
      height="24"
      fill="currentColor"
      on:click={() => goto("/")}
    >
      <path
        fill="none"
        stroke="currentColor"
        stroke-linecap="round"
        stroke-linejoin="round"
        stroke-width="48"
        d="M244 400L100 256l144-144M120 256h292"
      />
    </svg>
    {#if selectedUserReady}
      <div class="user-info">
        <div class="image-wrapper">
          {#if selectedUser.avatar}
            <img src={selectedUser.avatar} alt="" />
          {:else}
            <img src="/joke.png" alt="" />
          {/if}
          <div
            class={selectedUser.isOnline ? "status online" : "status offline"}
          />
        </div>
        <div class="details">
          <h4>{selectedUser.name}</h4>
        </div>
      </div>
    {:else}
      <div class="user-info">
        <div class="image-wrapper">
          <div class="user-avatar animation" />
        </div>
        <div class="details">
          <h4 class="user-name animation">.</h4>
        </div>
      </div>
    {/if}
  </div>

  <div class="right-part">
    <svg
      xmlns="http://www.w3.org/2000/svg"
      class="ionicon"
      viewBox="0 0 512 512"
      width="24"
      height="24"
      fill="currentColor"
      style:margin-right="20px"
    >
      <path
        d="M374.79 308.78L457.5 367a16 16 0 0022.5-14.62V159.62A16 16 0 00457.5 145l-82.71 58.22A16 16 0 00368 216.3v79.4a16 16 0 006.79 13.08z"
        fill="none"
        stroke="currentColor"
        stroke-linecap="round"
        stroke-linejoin="round"
        stroke-width="32"
      />
      <path
        d="M268 384H84a52.15 52.15 0 01-52-52V180a52.15 52.15 0 0152-52h184.48A51.68 51.68 0 01320 179.52V332a52.15 52.15 0 01-52 52z"
        fill="none"
        stroke="currentColor"
        stroke-miterlimit="10"
        stroke-width="32"
      />
    </svg>

    <svg
      xmlns="http://www.w3.org/2000/svg"
      class="ionicon"
      viewBox="0 0 512 512"
      width="24"
      height="24"
      fill="currentColor"
      style:margin-right="20px"
      on:click={() => ($showMapModal = true)}
    >
      <path
        d="M256 48c-79.5 0-144 61.39-144 137 0 87 96 224.87 131.25 272.49a15.77 15.77 0 0025.5 0C304 409.89 400 272.07 400 185c0-75.61-64.5-137-144-137z"
        fill="none"
        stroke="currentColor"
        stroke-linecap="round"
        stroke-linejoin="round"
        stroke-width="32"
      />
      <circle
        cx="256"
        cy="192"
        r="48"
        fill="none"
        stroke="currentColor"
        stroke-linecap="round"
        stroke-linejoin="round"
        stroke-width="32"
      />
    </svg>
    <svg
      xmlns="http://www.w3.org/2000/svg"
      class="ionicon"
      viewBox="0 0 512 512"
      width="24"
      height="24"
      fill="currentColor"
      style:margin-right="20px"
      on:click|stopPropagation={() => ($showToolModal = !$showToolModal)}
    >
      <path
        d="M262.29 192.31a64 64 0 1057.4 57.4 64.13 64.13 0 00-57.4-57.4zM416.39 256a154.34 154.34 0 01-1.53 20.79l45.21 35.46a10.81 10.81 0 012.45 13.75l-42.77 74a10.81 10.81 0 01-13.14 4.59l-44.9-18.08a16.11 16.11 0 00-15.17 1.75A164.48 164.48 0 01325 400.8a15.94 15.94 0 00-8.82 12.14l-6.73 47.89a11.08 11.08 0 01-10.68 9.17h-85.54a11.11 11.11 0 01-10.69-8.87l-6.72-47.82a16.07 16.07 0 00-9-12.22 155.3 155.3 0 01-21.46-12.57 16 16 0 00-15.11-1.71l-44.89 18.07a10.81 10.81 0 01-13.14-4.58l-42.77-74a10.8 10.8 0 012.45-13.75l38.21-30a16.05 16.05 0 006-14.08c-.36-4.17-.58-8.33-.58-12.5s.21-8.27.58-12.35a16 16 0 00-6.07-13.94l-38.19-30A10.81 10.81 0 0149.48 186l42.77-74a10.81 10.81 0 0113.14-4.59l44.9 18.08a16.11 16.11 0 0015.17-1.75A164.48 164.48 0 01187 111.2a15.94 15.94 0 008.82-12.14l6.73-47.89A11.08 11.08 0 01213.23 42h85.54a11.11 11.11 0 0110.69 8.87l6.72 47.82a16.07 16.07 0 009 12.22 155.3 155.3 0 0121.46 12.57 16 16 0 0015.11 1.71l44.89-18.07a10.81 10.81 0 0113.14 4.58l42.77 74a10.8 10.8 0 01-2.45 13.75l-38.21 30a16.05 16.05 0 00-6.05 14.08c.33 4.14.55 8.3.55 12.47z"
        fill="none"
        stroke="currentColor"
        stroke-linecap="round"
        stroke-linejoin="round"
        stroke-width="32"
      />
    </svg>
  </div>
</div>

<style>
  .header {
    position: absolute;
    top: 0px;
    height: 60px;
    display: flex;
    align-items: center;
    padding-right: 0px;
    padding: 15px 0 15px 15px;
    background: #ebebeb;
  }

  .left-part {
    display: flex;
    align-items: center;
    margin-right: auto;
    cursor: pointer;
  }

  .arrow-back {
    display: none;
  }

  .user-info {
    display: flex;
    justify-content: space-between;
    align-items: center;
  }

  .user-info .image-wrapper {
    position: relative;
    display: flex;
  }

  .user-info .image-wrapper img {
    width: 35px;
    height: 35px;
    border-radius: 50%;
  }
  
  .details {
    padding-left: 15px;
  }
  
  .details h4 {
    font-size: 18px;
    font-weight: 600;
    line-height: 1.2em;
  }

  .user-avatar,
  .user-name {
    background: var(--bg-color);
  }

  .user-name {
    width: 60px;
    color: #51585c;
    border-radius: 4px;
  }

  .user-avatar {
    width: 40px;
    height: 40px;
    border-radius: 50%;
  }

  .right-part {
    display: flex;
    align-items: center;
  } 

  @media (max-width: 800px) {
    .arrow-back {
      margin-right: 10px;
      display: block;
    }
  }
</style>
