import { auth, db } from "$lib/firebase/client";
import { signOut } from "firebase/auth";
import { doc, updateDoc } from "firebase/firestore";
import { loginState, isSignout } from "$lib/store";

export const signout = async () => {
  isSignout.set(true)
  
  let userRef = doc(db, "whatzapp_users", auth.currentUser.email);
  let tempUserEmail = auth.currentUser.email;
  try {
    await updateDoc(userRef, {
      isOnline: false,
    });
    console.log(`update ${auth.currentUser.email} status -> ⚪`);
  } catch (err) {
    console.log(err.code, err.message);
  }

  try {
    await signOut(auth);
    console.log(`${tempUserEmail} is signed out 😃`);
    loginState.set(false);
    console.log('signing out ended')
  } catch (error) {
    console.log('error message: ', error.message);
  }
};