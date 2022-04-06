import { auth, db } from "$lib/firebase/client";
import { signOut } from "firebase/auth";
import { activeItem, user } from "$lib/store";
import { doc, updateDoc } from "firebase/firestore";
import { userLogout, loginState, loginUserEmail } from "../../store";

export const signout = async () => {
  let userRef = doc(db, "whatzapp_users", auth.currentUser.email);
  let tempUserEmail = auth.currentUser.email
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
    loginState.set(false)
    loginUserEmail.set(null)
  } catch (err) {
    console.log(err.code, err.message);
  }
};

// signOut(auth).then(() => {
//   console.log(`user is logged out 😃`);
// activeItem.set(null)
// userLogout, loginState, loginUserEmail.set(true)
// user.set(null)
// goto{'/login'}

// });