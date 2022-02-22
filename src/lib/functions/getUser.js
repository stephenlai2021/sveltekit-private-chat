import { auth } from '$lib/firebase/client'
import { onAuthStateChanged } from 'firebase/auth'
import { browser } from '$app/env'

let user = auth.currentUser

export const getUser = () => {
  if (browser) {
    const unsub = onAuthStateChanged(auth, _user => {
      console.log('User state changed. Current user is:', _user)
      user = _user
      return () => unsub()
    })
  }

  return { user }
}