import { initializeApp } from 'firebase/app'
import { getAuth, GoogleAuthProvider, FacebookAuthProvider } from 'firebase/auth'
import { getFirestore } from 'firebase/firestore'

let firebaseConfig

// To deploy on Vercel, we need to begin with 'process.'
let process

// Vercel uses process.env.VARIABLE to import the environments
if (process && process.env) {
  firebaseConfig = {
    apiKey: process.env.VITE_APIKEY,
    authDomain: process.env.VITE_AUTHDOMAIN,
    projectId: process.env.VITE_PROJECTID,
    storageBucket: process.env.VITE_STORAGEBUCKET,
    messagingSenderId: process.env.VITE_MESSAGINGSENDERID,
    appId: process.env.VITE_APPID
  }
} else {
  // Sveltekit uses import.meta.env.VITE_VARIABLE
  firebaseConfig = {
    apiKey: import.meta.env.VITE_APIKEY,
    authDomain: import.meta.env.VITE_AUTHDOMAIN,
    projectId: import.meta.env.VITE_PROJECTID,
    storageBucket: import.meta.env.VITE_STORAGEBUCKET,
    messagingSenderId: import.meta.env.VITE_MESSAGINGSENDERID,
    appId: import.meta.env.VITE_APPID
  }
}

initializeApp(firebaseConfig)

const auth = getAuth()
const db = getFirestore()
const google = new GoogleAuthProvider()
const facebook = new FacebookAuthProvider()

export { auth, db, google, facebook }