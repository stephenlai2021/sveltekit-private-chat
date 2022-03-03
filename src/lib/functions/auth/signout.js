import { auth } from '$lib/firebase/client'
import { signOut } from 'firebase/auth'
import { activeItem } from '$lib/store'

export const signout = () => {
  signOut(auth).then(() => {
    console.log('logout successfully !')
    activeItem.set(null)
  });
};