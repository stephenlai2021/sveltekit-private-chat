import { session } from "$app/stores";
import { writable, derived } from "svelte/store";
import { browser } from "$app/env";

export const keyword = writable("");
export const showModal = writable(false);
export const showSettingsModal = writable(false);
export const activeItem = writable(null);
let bgColor = null;

export const connection = writable(
  browser && localStorage.getItem("internet connection")
);
connection.subscribe(
  (val) => browser && localStorage.setItem("internet connection", val)
);

export const mobile = writable(false)
export const loginFormShow = writable(false)
export const showAddFriendModal = writable(false)

// export const bgColor = writable(
//   browser && localStorage.getItem("background color")
// );
// bgColor.subscribe(
//   (val) => browser && localStorage.setItem("background color", val)
// );

// export const bgColor = derived(session, ($session, set) => {
//   if ($session.bgColor) set($session.bgColor);
// });

if (browser) {
  bgColor = writable(localStorage.getItem("background color"));
  bgColor.subscribe((val) => localStorage.setItem("background color", val));
} else {
  bgColor = derived(session, ($session, set) => {
    if ($session.bgColor) set($session.bgColor);
  });
}

export const setBgColor = (bgColor) => {
  session.update(($session) => ({ ...$session, bgColor }))

  fetch('/api/getbgcolor', {
    method: 'PUT',
    body: bgColor
  })
}

export { bgColor };
