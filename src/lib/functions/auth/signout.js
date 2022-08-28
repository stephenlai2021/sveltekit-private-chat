import { auth, db } from "$lib/firebase/client";
import { signOut } from "firebase/auth";
import { doc, updateDoc } from "firebase/firestore";
import { loggedinUser } from "$lib/store";

let tempUser = null

loggedinUser.subscribe(val => tempUser = val)

export const signout = async () => {
  let userRef = doc(db, "whatzapp_users", tempUser.email);
  let userName = tempUser.displayName;

  try {
    await updateDoc(userRef, { isOnline: false });
    console.log(`update ${userName} status -> ⚪`);

    await signOut(auth);
    console.log(`${userName} is signed out 😃`);
  } catch (error) {
    console.log('error message: ', error.message);
  }
};