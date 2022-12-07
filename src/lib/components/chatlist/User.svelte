<script>
  import {
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
  import { t, locales, locale } from "$lib/i18n";
  import { doc, getDoc, updateDoc } from "firebase/firestore";
  import { db } from "$lib/firebase/client";

  export let user;

  const selectUser = async (selectedUser) => {
    $selectedUsername = selectedUser.name;
    goto(`/${$selectedUsername}`);

    /* update selected user document */
    let selectedUserRef = doc(db, "users", $selectedUsername);
    let selectedUserSnap = await getDoc(selectedUserRef);

    // update login user document
    let loggedinUserRef = doc(db, "users", $loggedinUser.displayName);
    let loggedinUserSnap = await getDoc(loggedinUserRef);

    if (
      selectedUser.unread[
        selectedUser.unread.findIndex(
          (msg) => msg.split("=>")[0] === $loggedinUser.displayName
        )
      ].split("=>")[1] === "new"
    ) {
      await updateDoc(selectedUserRef, {
        unread: selectedUserSnap
          .data()
          .unread.map((state) =>
            state.split("=>")[0] === $loggedinUser.displayName
              ? `${$loggedinUser.displayName}=>`
              : state
          ),
      });
      await updateDoc(loggedinUserRef, {
        unread: loggedinUserSnap
          .data()
          .unread.map((state) =>
            state.split("=>")[0] === $selectedUsername
              ? `${$selectedUsername}=>read`
              : state
          ),
      });
    }
    // goto(`/${$selectedUsername}`);
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
        <p>
          {user.lastMsg[
            user.lastMsg.findIndex(
              (msg) => msg.split("=>")[0] === $loggedinUser.displayName
            )
          ].split("=>")[1]}
        </p>
        <div 
          class="indicator"
          style:padding={user.unread[
            user.unread.findIndex(
              (msg) => msg.split("=>")[0] === $loggedinUser.displayName
            )
          ].split("=>")[1] !== ""
            ? "2px 4px"
            : "0"}
          style:background={user.unread[
            user.unread.findIndex(
              (msg) => msg.split("=>")[0] === $loggedinUser.displayName
            )
          ].split("=>")[1] === "new"
            ? "#ff4408"
            : "gray"}
        >
          {user.unread[
            user.unread.findIndex(
              (msg) => msg.split("=>")[0] === $loggedinUser.displayName
            )
          ].split("=>")[1] === "new"
            ? $t("menu.new")
            : user.unread[
                user.unread.findIndex(
                  (msg) => msg.split("=>")[0] === $loggedinUser.displayName
                )
              ].split("=>")[1] === "read"
            ? $t("menu.read")
            : user.unread[
                user.unread.findIndex(
                  (msg) => msg.split("=>")[0] === $loggedinUser.displayName
                )
              ].split("=>")[1] === "unread"
            ? $t("menu.unread")
            : ""}
        </div>
      </div>
    {/if}
  </div>
</div>

<style>
  .indicator {
    /* font-style: italic; */
    color: white;
    border-radius: 4px;
    min-width: 20px;
    display: grid;
    place-content: center;
    font-size: 0.75em;
    margin-right: 3px;
    position: absolute;
    right: 0px;
  }

  .date {
    color: white;
    text-shadow: 0.1em 0.1em 0.2em black;
  }

  .block {
    display: flex;
    align-items: center;
    justify-content: center;
    padding: 0 10px;
    height: 65px;
    cursor: pointer;
  }

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
  }

  .message {
    display: flex;
    justify-content: space-between;
    height: 22px;
    position: relative;
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
    color: white;
    text-shadow: 0.1em 0.1em 0.2em black;
    width: calc(100% - 30px);
  }
</style>
