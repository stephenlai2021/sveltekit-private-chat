<script>
  import {
    // myDoc,
    mobile,
    loggedinUser,
    currentContact,
    selectedUsername,
    currentSelectedUser,
  } from "$lib/store";
  import { Timestamp } from "firebase/firestore";
  import { page } from "$app/stores";
  import { goto } from "$app/navigation";
  import moment from "moment";

  export let user;

  const selectUser = async (selectedUser) => {
    $selectedUsername = selectedUser.name;
    goto(`/${$selectedUsername}`);
  };
</script>

<div
  class="block"
  on:click={() => selectUser(user)}
  style:border-radius={($currentContact === user && !$mobile) ||
  (user.name === $page.params.userId && !$mobile)
    ? "8px"
    : "0"}
  style:background={($currentContact === user && !$mobile) ||
  (user.name === $page.params.userId && !$mobile)
    ? "#ebebeb"
    : "none"}
>
  <div class="imgbx">
    <img src={user.avatar} alt="" class="cover" />
    <div class={user.online ? "status online" : "status offline"} />
  </div>
  <div class="details">
    <div class="listHead">
      <span class="user-title">{user.name}</span>
      {#if $loggedinUser}
        <p class="date" style:font-size="12px">
          {moment(
            new Date(
              user.lastUpdated[
                user.lastUpdated.findIndex(
                  (date) => date.split("=>")[0] === $loggedinUser.displayName
                )
              ].split("=>")[1]
            ),
            ["h:mm A"]
          ).format("HH:mm L")}
        </p>
      {/if}
    </div>

    {#if $loggedinUser}
      <div class="message">
        {#if $currentSelectedUser}
          <p>
            <!-- style:text-shadow={$currentSelectedUser.bgColor === "#ffffff"
              ? "0.1em 0.1em 0.2em black"
              : "none"} -->
            {user.lastMsg[
              user.lastMsg.findIndex(
                (msg) => msg.split("=>")[0] === $loggedinUser.displayName
              )
            ].split("=>")[1]}
          </p>
        {/if}
        <!-- <b>
          {user.msgCount[
            user.lastMsg.findIndex(
              (count) => count.split("=>")[0] === $loggedinUser.displayName
              )
              ].split("=>")[1]}
            </b> -->
        <b style:background={"var(--theme-color)"}>3</b>
      </div>
    {/if}
  </div>
</div>

<style>
  .date {
    color: rgb(92, 102, 102);
    text-shadow: 0.1em 0.1em 0.2em black;
    color: white;
  }

  .block {
    display: flex;
    align-items: center;
    justify-content: center;
    padding: 0 10px;
    height: 65px;
    cursor: pointer;
  }

  /* .block:hover {
    transform: scale(1.01);
  } */

  .imgbx {
    min-width: 45px;
    height: 45px;
    cursor: pointer;
    margin-right: 15px;
    border-radius: 50%;
    display: flex;
    justify-content: center;
    align-items: center;
    position: relative;
  }

  .imgbx img {
    width: 45px;
    height: 45px;
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
    font-size: 17px;
    font-weight: 500;
    letter-spacing: 0.3px;
    font-style: normal;
    line-height: 20px;
    /* color: var(--theme-color); */
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
    font-size: 15px;
    font-weight: 500;
    letter-spacing: 0.3px;
    display: -webkit-box;
    -webkit-line-clamp: 1;
    -webkit-box-orient: vertical;
    overflow: hidden;
    position: absolute;
    color: rgb(92, 102, 102);
    color: white;
    text-shadow: 0.1em 0.1em 0.2em black;
    width: calc(100% - 30px);
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
