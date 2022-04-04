import { auth, db } from '$lib/firebase/client'
import { signOut } from 'firebase/auth'
import { activeItem } from '$lib/store'
import { doc, updateDoc } from "firebase/firestore";

export const signout = async () => {
  let tempEmail = auth.currentUser.email
  let userRef = doc(db, "whatzapp_users", auth.currentUser.email);
  await updateDoc(userRef, {
    isOnline: false
  })

  signOut(auth).then(() => {
    console.log(`${tempEmail} is logged out 😃`)
    activeItem.set(null)
  });
};