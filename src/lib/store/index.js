import { writable } from "svelte/store";
import { browser } from "$app/env";

export const profileUpdated = writable(false)
export const loginState = writable(false)
export const user = writable(null)
export const userLogout = writable(false)
export const userDocCreated = writable(false)
export const userList = writable([])
export const mobile = writable(false)
export const keyword = writable("");
export const activeItem = writable(null);
export const loginFormShow = writable(false)
export const profileUpdate = writable(false);
export const showThemeModal = writable(false);
export const showSettingsModal = writable(false);
export const showAddFriendModal = writable(false)
export const showBgSettingsModal = writable(false)
export const leftsideState = writable(true)
export const rightsideState = writable(true)
export const menubarState = writable(true)
export const bgColor = writable('linear-gradient(225deg, #FC466B 0%, #3F5EFB 100%)');

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
