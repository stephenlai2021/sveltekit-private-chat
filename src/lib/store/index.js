import { writable } from "svelte/store";
import { browser } from "$app/env";

export const message = writable('')
export const showEmojiMenu = writable(false)
export const leftSide = writable(null)
export const audioURL = writable(null)
export const audioBlob = writable(null)
export const audioConfirmed = writable(null)
export const audioFile = writable(null)
export const pictureConfirmed = writable(false)
export const videoStream = writable(null)
export const pictureBlob = writable(null)
export const showAudioPlayerModal = writable(false)
export const showAudioRecordingModal = writable(false)
export const showPhotoModal = writable(false)
export const showCameraPreviewModal = writable(false)
export const pictureFile = writable(null)
export const pictureURI = writable(null)
export const selectedImg = writable(null)
export const active = writable(false);
export const profileUpdated = writable(false);
export const loginState = writable(false);
export const user = writable(null);
export const userLogout = writable(false);
export const userDocCreated = writable(false);
export const userList = writable([]);
export const mobile = writable(false);
export const keyword = writable("");
export const activeItem = writable(null)
export const loginFormShow = writable(false);
export const profileUpdate = writable(false);
export const showPicModal = writable(false)
export const showThemeModal = writable(false);
export const showCameraModal = writable(false);
export const showSettingsModal = writable(false);
export const showAddFriendModal = writable(false);
export const showBgSettingsModal = writable(false);
export const leftsideState = writable(true);
export const rightsideState = writable(true);
export const menubarState = writable(true);
export const bgColor = writable(
  "linear-gradient(225deg, #FC466B 0%, #3F5EFB 100%)"
);

// export const activeItem = writable(null);

export const selectedUsername = writable(
  browser && localStorage.getItem("selected user name")
);
selectedUsername.subscribe(
  (val) => browser && localStorage.setItem("selected user name", val)
);

export const loggedinUser = writable(
  browser && JSON.parse(localStorage.getItem("loggedin user"))
);
loggedinUser.subscribe(
  (val) => browser && localStorage.setItem("loggedin user", JSON.stringify(val))
);

export const loginUserEmail = writable(
  browser && localStorage.getItem("loggedin user email")
);
loginUserEmail.subscribe(
  (val) => browser && localStorage.setItem("loggedin user email", val)
);

export const connection = writable(
  browser && localStorage.getItem("internet connection")
);
connection.subscribe(
  (val) => browser && localStorage.setItem("internet connection", val)
);
