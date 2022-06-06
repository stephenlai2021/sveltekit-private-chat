import { writable } from "svelte/store";
import { db } from "$lib/firebase/client";
import { browser } from "$app/env";
import {
  query,
  where,
  collection,
  onSnapshot,
} from "firebase/firestore";

let colRef = collection(db, "whatzapp_users");

export const showSidebarMenu = writable(true)
export const selectedUsernameMatched = writable(false);
export const showGradientMenu = writable(true);
export const showThemeMenu = writable(true);
export const showMapModal = writable(false);
export const disabled = writable(false);
// export const imageTitle = writable("")
export const file = writable(null);
export const background = writable(null);
export const showToolModal = writable(false);
export const isMobile = writable(false);
export const message = writable("");
export const showEmojiMenu = writable(false);
export const leftSide = writable(null);
export const audioURL = writable(null);
export const audioBlob = writable(null);
export const audioConfirmed = writable(null);
export const audioFile = writable(null);
export const pictureConfirmed = writable(false);
export const videoStream = writable(null);
export const pictureBlob = writable(null);
export const showAudioPlayerModal = writable(false);
export const showAudioRecordingModal = writable(false);
export const showPhotoModal = writable(false);
export const showCameraPreviewModal = writable(false);
export const pictureFile = writable(null);
export const pictureURI = writable(null);
export const active = writable(false);
export const profileUpdated = writable(false);
export const loginState = writable(false);
export const user = writable(null);
export const userLogout = writable(false);
export const userDocCreated = writable(false);
export const userList = writable([]);
export const mobile = writable(false);
export const keyword = writable("");
export const activeItem = writable(null);
export const loginFormShow = writable(false);
export const profileUpdate = writable(false);
export const showPicModal = writable(false);
export const showThemeModal = writable(false);
export const showCameraModal = writable(false);
export const showSettingsModal = writable(false);
export const showAddFriendModal = writable(false);
export const showBgSettingsModal = writable(false);
export const leftsideState = writable(true);
export const rightsideState = writable(true);
export const menubarState = writable(true);
export const bgColor = writable("#e5ddd5");
// export const selectedUser = writable(null)

// export const getSelectedUser = (name) => {
export const getSelectedUser = (selectedUsername) => {
  // let q = query(colRef, where("name", "==", name));
  let q = query(colRef, where("name", "==", selectedUsername));
  const unsub = onSnapshot(q, (snapshot) => {
    let tempUsers = [];
    snapshot.docs.forEach((doc) => {
      tempUsers.push({ ...doc.data() });
    });
    // selectedUser = tempUsers[0]
    selectedUser.set(tempUsers[0])
    // selectedUser.update(n => tempUsers[0])
    // console.log("get selected user name | snapshot", selectedUser.name);
    return () => unsub();
  });
};

export const selectedUser = writable(
  // browser && JSON.parse(localStorage.getItem("selected user") || {})
  browser && localStorage.getItem("selected user") || {}
);
selectedUser.subscribe(
  // (val) => browser && localStorage.setItem("selected user", JSON.stringify(val))
  (val) => browser && localStorage.setItem("selected user", val)
);

export const selectedUsername = writable(
  // browser && JSON.parse(localStorage.getItem("selected user") || {})
  browser && localStorage.getItem("selected user name") || {}
);
selectedUsername.subscribe(
  // (val) => browser && localStorage.setItem("selected user", JSON.stringify(val))
  (val) => browser && localStorage.setItem("selected user name", val)
);

export const imageTitle = writable(
  browser && (localStorage.getItem("image title") || "Default")
);
imageTitle.subscribe(
  (val) => browser && localStorage.setItem("image title", val)
);

export const bgOpacity = writable(
  browser && (localStorage.getItem("backround opacity") || 0.06)
);
bgOpacity.subscribe(
  (val) => browser && localStorage.setItem("backround opacity", val)
);

export const imageURL = writable(
  browser &&
    // (localStorage.getItem("image url") || {
    //   url: "https://previews.123rf.com/images/dimapolie/dimapolie1808/dimapolie180800074/106049740-patr%C3%B3n-de-la-escuela-del-vector-escuela-de-fondo-sin-fisuras-ilustraci%C3%B3n-vectorial.jpg",
    //   title: "default"
    // })
    (localStorage.getItem("image url") ||
      "https://previews.123rf.com/images/dimapolie/dimapolie1808/dimapolie180800074/106049740-patr%C3%B3n-de-la-escuela-del-vector-escuela-de-fondo-sin-fisuras-ilustraci%C3%B3n-vectorial.jpg")
);
imageURL.subscribe((val) => browser && localStorage.setItem("image url", val));

export const selectedImg = writable(
  browser && localStorage.getItem("selected image")
);
selectedImg.subscribe(
  (val) => browser && localStorage.setItem("selected image", val)
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
