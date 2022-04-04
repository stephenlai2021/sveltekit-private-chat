import { auth, db, google } from "$lib/firebase/client";
import { signInWithPopup } from "firebase/auth";
import { doc, updateDoc } from "firebase/firestore";

export const loginWithGoogle = () => {
  signInWithPopup(auth, google)
    .then((result) => {
      let user = result.user;
      console.log('sign in with Google successfully ! 😀', user)
      let userRef = doc(db, "whatzapp_users", user.email);
      updateDoc(userRef, {
        isOnline: true
      })
      console.log(`${user.displayName} is logged in 😎`);
    })
    .catch((err) => {
      console.log(err.message);
    });
};
