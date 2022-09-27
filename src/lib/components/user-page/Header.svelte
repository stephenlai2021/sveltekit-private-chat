<script>
  import {
    phone,
    mobile,
    bgColor,
    loggedinUser,
    showMapModal,
    showToolModal,
    selectedUsername,
    widthLessthan1000,
    selectedUserReady,
    currentSelectedUser,
    showToolModalMobile,
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
  import { db } from "$lib/firebase/client";

  let q = null;
  let matched = false;
  let selectedUser = {};
  let colRef = collection(db, "users");

  $: if ($page.params.userId === $selectedUsername) matched = true;

  $: if (matched) {
    q = query(colRef, where("name", "==", $selectedUsername));
    const unsub = onSnapshot(q, (snapshot) => {
      let tempUsers = [];
      snapshot.docs.forEach((doc) => {
        tempUsers.push({ ...doc.data() });
      });
      selectedUser = tempUsers[0];
      $currentSelectedUser = tempUsers[0];
      $selectedUserReady = true;
      console.log("current contact:", selectedUser.name);
      return () => unsub();
    });
    matched = false;
  }
</script>

<div class="header">
  <div class="left-part">
    {#if $mobile && $selectedUserReady}
      <div class="icon-wrapper icon-arrow-back">
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
      </div>
    {:else if $mobile && !$selectedUserReady}
      <div
        class="icon-arrow-skeleton loading-animation"
        style:margin-right="15px"
      />
    {/if}

    {#if $selectedUserReady}
      <div class="user-info">
        <div class="image-wrapper">
          {#if selectedUser.avatar}
            <img src={selectedUser.avatar} alt="" />
          {:else}
            <div class="user-avatar animation" />
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
          <div class="user-avatar loading-animation" />
        </div>
        <div class="details">
          <h4 class="user-name loading-animation">antman</h4>
        </div>
      </div>
    {/if}
  </div>

  <div class="right-part">
    {#if !$phone && $selectedUserReady}
      <svg
        xmlns="http://www.w3.org/2000/svg"
        class="ionicon icon-palette"
        viewBox="0 0 512 512"
        width="26"
        height="26"
        fill="currentColor"
      >
        <path
          d="M430.11 347.9c-6.6-6.1-16.3-7.6-24.6-9-11.5-1.9-15.9-4-22.6-10-14.3-12.7-14.3-31.1 0-43.8l30.3-26.9c46.4-41 46.4-108.2 0-149.2-34.2-30.1-80.1-45-127.8-45-55.7 0-113.9 20.3-158.8 60.1-83.5 73.8-83.5 194.7 0 268.5 41.5 36.7 97.5 55 152.9 55.4h1.7c55.4 0 110-17.9 148.8-52.4 14.4-12.7 11.99-36.6.1-47.7z"
          fill="none"
          stroke="currentColor"
          stroke-miterlimit="10"
          stroke-width="32"
        />
        <circle cx="144" cy="208" r="32" />
        <circle cx="152" cy="311" r="32" />
        <circle cx="224" cy="144" r="32" />
        <circle cx="256" cy="367" r="48" />
        <circle cx="328" cy="144" r="32" />
      </svg>

      <div class="icon-menu icon-game" style:margin-right="15px">
        <svg
          xmlns="http://www.w3.org/2000/svg"
          class="ionicon icon-game"
          viewBox="0 0 512 512"
          width="24"
          height="24"
          fill="currentColor"
        >
          <path
            d="M467.51 248.83c-18.4-83.18-45.69-136.24-89.43-149.17A91.5 91.5 0 00352 96c-26.89 0-48.11 16-96 16s-69.15-16-96-16a99.09 99.09 0 00-27.2 3.66C89 112.59 61.94 165.7 43.33 248.83c-19 84.91-15.56 152 21.58 164.88 26 9 49.25-9.61 71.27-37 25-31.2 55.79-40.8 119.82-40.8s93.62 9.6 118.66 40.8c22 27.41 46.11 45.79 71.42 37.16 41.02-14.01 40.44-79.13 21.43-165.04z"
            fill="none"
            stroke="currentColor"
            stroke-miterlimit="10"
            stroke-width="32"
          />
          <circle cx="292" cy="224" r="20" />
          <path d="M336 288a20 20 0 1120-19.95A20 20 0 01336 288z" />
          <circle cx="336" cy="180" r="20" />
          <circle cx="380" cy="224" r="20" />
          <path
            fill="none"
            stroke="currentColor"
            stroke-linecap="round"
            stroke-linejoin="round"
            stroke-width="32"
            d="M160 176v96M208 224h-96"
          />
        </svg>
      </div>
    {:else if !$phone && !$selectedUserReady}
      <div
        class="icon-arrow-skeleton loading-animation"
        style:margin-right="15px"
      />
      <div
        class="icon-arrow-skeleton loading-animation"
        style:margin-right="15px"
      />
    {/if}

    {#if $selectedUserReady}
      <div class="icon-menu icon-video" style:padding-right="10px">
        <svg
          xmlns="http://www.w3.org/2000/svg"
          class="ionicon icon-video"
          viewBox="0 0 512 512"
          width="24"
          height="24"
          fill="currentColor"
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
      </div>

      <div class="icon-menu icon-geo">
        <svg
          xmlns="http://www.w3.org/2000/svg"
          class="ionicon icon-geo"
          viewBox="0 0 512 512"
          width="24"
          height="24"
          fill="currentColor"
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
      </div>
    {:else}
      <div
        class="icon-arrow-skeleton loading-animation"
        style:margin-right="15px"
      />
      <div class="icon-arrow-skeleton loading-animation" />
    {/if}
  </div>
</div>

<style>
  .icon-arrow-skeleton {
    width: 24px;
    height: 24px;
    border-radius: 50px;
  }

  .icon-menu {
    display: flex;
    align-items: center;
    /* border: 1px solid; */
  }

  .header {
    position: absolute;
    margin-top: 10px;
    left: 50%;
    transform: translateX(-50%);
    height: 60px;
    display: flex;
    align-items: center;
    max-width: 800px;
    padding: 15px 10px 15px 10px;
    backdrop-filter: blur(20px);
    border-top-left-radius: 8px;
    border-top-right-radius: 8px;
    background: rgba(235, 235, 235, 0.5);
  }

  .left-part {
    display: flex;
    align-items: center;
    margin-right: auto;
    cursor: pointer;
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

  .user-name {
    width: 60px;
    color: #51585c;
    color: transparent;
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
    /* border: 1px solid red; */
  }

  @media (max-width: 1200px) {
    .header {
      /* padding-right: 15px; */
    }
  }

  @media (max-width: 800px) {
    .header {
      margin-top: 0px;
      border-radius: 0px;
      /* top: 0px; */
    }

    .icon-arrow-back {
      margin-right: 10px;
      margin-left: 0px;
    }
  }

  @media (max-width: 360px) {
    .details h4 {
      font-size: 17px;
    }
  }
</style>
