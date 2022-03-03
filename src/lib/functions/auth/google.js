import { auth, google } from "$lib/firebase/client";
import { signInWithPopup } from "firebase/auth";

export const loginWithGoogle = () => {
  signInWithPopup(auth, google)
    .then((result) => {
      let user = result.user;
      console.log("current loggedin user", user);
      console.log("current loggedin user id ", auth.currentUser.uid);
    })
    .catch((err) => {
      console.log(err.message);
    });
};