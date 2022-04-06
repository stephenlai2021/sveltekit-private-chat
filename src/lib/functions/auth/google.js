import { auth, db, google } from "$lib/firebase/client";
import { signInWithPopup } from "firebase/auth";
import { doc, updateDoc } from "firebase/firestore";
import { loginState, loginUserEmail } from "$lib/store";

export const loginWithGoogle = () => {
  signInWithPopup(auth, google)
    .then((result) => {
      let user = result.user;
      console.log(`${user.displayName} signed in with Google successfully 😀`)
      loginState.set(true)
      loginUserEmail.set(user.email)

      let userRef = doc(db, "whatzapp_users", user.email);
      updateDoc(userRef, {
        isOnline: true
      }).then(() => {
        console.log(`update ${user.displayName}'s status -> 🟢`);
      })
    })
    .catch((err) => {
      console.log(err.message);
    });
};
