import { auth } from '$lib/firebase/client'
import { signOut } from 'firebase/auth'

export const signout = () => {
  signOut(auth).then(() => {
    console.log('logout successfully !')
  });
};