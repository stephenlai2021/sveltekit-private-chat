<script>
  import {
    mobile,
    loggedinUser,
    currentContact,
    selectedUsername,
    selectedUseremail,
  } from "$lib/store";
  import themeStore from "svelte-themes";
  import { page } from "$app/stores";
  import { goto } from "$app/navigation";
  import { updateDoc, doc, collection, onSnapshot } from "firebase/firestore";
  import { db } from "$lib/firebase/client";
  import { formatDistanceToNow } from "date-fns";
  import { onMount } from "svelte";

  export let user;
  // export let lastMsgs;

  let lastMsgs;

  const selectUser = async (selectedUser) => {
    // update unread status
    // let msgId =
    //   $loggedinUser.displayName > $selectedUsername
    //     ? `${$loggedinUser.displayName} & ${$selectedUsername}`
    //     : `${$selectedUsername} & ${$loggedinUser.displayName}`;
    // await updateDoc(doc(db, 'lastMsg', msgId), {
    //   unread: false
    // })

    $currentContact = selectedUser;
    $selectedUsername = selectedUser.name;
    $selectedUseremail = selectedUser.email;

    goto(`/${$selectedUsername}`);
  };

  onMount(() => {
    /* get last messages */
    // let lastMsgRef = collection(db, "lastMsg");
    // const unsubLastMsgs = onSnapshot(lastMsgRef, (snapshot) => {
    //   let tempLastMsgs = [];
    //   snapshot.docs.forEach((doc) => {
    //     tempLastMsgs.push(doc.data());
    //   });
    //   lastMsgs = tempLastMsgs;
    //   console.log("last messages", lastMsgs);
    //   return () => unsubLastMsgs();
    // });
  });
</script>

<!-- class:unread={user.unread} -->
<div
  class="block"
  on:click={() => selectUser(user)}
  style:border-radius={($currentContact === user && !$mobile) ||
  (user.name === $page.params.userId && !$mobile)
    ? "8px"
    : "0"}
  style:background={($currentContact === user && !$mobile) ||
  (user.name === $page.params.userId && !$mobile)
    ? $themeStore.theme === "dark"
      ? "#3a3f50"
      : "rgba(235, 235, 235, 1)"
    : $currentContact != user && !$mobile
    ? $themeStore.theme === "dark"
      ? "#292F3F"
      : "transparent"
    : ""}
>
  <div class="imgbx">
    <img src={user.avatar} alt="" class="cover" />
    <div class={user.isOnline ? "status online" : "status offline"} />
  </div>
  <div class="details">
    <div class="listHead">
      <span class="user-title">{user.name}</span>
      <p class="time">12:15</p>
      <!-- {#if lastMsgs}
        {#each lastMsgs as msg}
        {#if user.name === msg.from || user.name === msg.to}
        {#if msg.from === $loggedinUser.displayName || msg.to === $loggedinUser.displayName}
        <p 
        class="time"
        style:color={msg.unread ? 'var(--theme-color)' : 'gray'}
        >
        {formatDistanceToNow(new Date(msg.createdAt.toDate()), {
          addSuffix: true,
        })}
      </p>
      {/if}
      {/if}
      {/each}
      {/if} -->

    </div>
    <div class="message">
      <!-- {#if lastMsgs}
        {#each lastMsgs as msg}
          {#if user.name === msg.from || user.name === msg.to}
            {#if msg.from === $loggedinUser.displayName}
              <p>me: {msg.text}</p>
              <b style:background={msg.unread ? 'var(--theme-color)' : 'gray'}>1</b>
            {:else if msg.to === $loggedinUser.displayName}
              <p>{msg.text}</p>
              <b style:background={msg.unread ? 'var(--theme-color)' : 'gray'}>1</b>
            {/if}
          {/if}
        {/each}
      {/if} -->

      {#if user.lastMsg}
        <p>{user.lastMsg[user.lastMsg.findIndex(msg => msg.split('=>')[0] === $loggedinUser.displayName)].split('=>')[1]}</p>
      {/if}
      <b>1</b>
    </div>
  </div>
</div>

<style>
  .block {
    display: flex;
    align-items: center;
    justify-content: center;
    padding: 0 10px;
    height: 65px;
    cursor: pointer;
  }

  .block:hover {
    transform: scale(1.01);
  }

  .imgbx {
    min-width: 40px;
    height: 40px;
    cursor: pointer;
    margin-right: 15px;
    border-radius: 50%;
    display: flex;
    justify-content: center;
    align-items: center;
    position: relative;
  }

  .imgbx img {
    width: 40px;
    height: 40px;
    overflow: hidden;
    object-fit: cover;
    border-radius: 50%;
  }

  .details {
    width: 100%;
    height: 100%;
    display: flex;
    flex-direction: column;
    justify-content: center;
  }

  .details .listHead {
    display: flex;
    justify-content: space-between;
    margin-bottom: 5px;
  }

  .details .listHead .user-title {
    font-size: 16px;
    font-weight: 500;
    letter-spacing: 0.5px;
    font-style: normal;
    line-height: 20px;
  }

  .details .listHead .time {
    font-size: 0.75em;
    color: #aaa;
  }

  .block.unread .details .listHead .time {
    color: var(--active-green);
    color: #ff4408;
  }

  .message {
    display: flex;
    justify-content: space-between;
    height: 22px;
    position: relative;
    /* border: 1px solid; */
  }

  .message p {
    font-size: 14px;
    font-weight: 500;
    letter-spacing: 0.6px;
    display: -webkit-box;
    -webkit-line-clamp: 1;
    -webkit-box-orient: vertical;
    overflow: hidden;
    color: rgb(83, 81, 81);
    position: absolute;
  }

  .block .details .message b {
    background: var(--active-green);
    background: gray;
    color: white;
    min-width: 20px;
    height: 20px;
    border-radius: 50%;
    display: grid;
    place-content: center;
    font-size: 0.75em;
    margin-right: 3px;
    position: absolute;
    right: 0px;
  }

  .block.unread .details .message b {
    background: var(--active-green);
    background: #ff4408;
    color: white;
    min-width: 20px;
    height: 20px;
    border-radius: 50%;
    display: grid;
    place-content: center;
    font-size: 0.75em;
    margin-right: 3px;
    position: absolute;
    right: 0px;
  }
</style>
