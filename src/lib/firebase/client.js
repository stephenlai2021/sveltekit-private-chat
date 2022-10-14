import { initializeApp } from 'firebase/app'
import { getAuth, GoogleAuthProvider, FacebookAuthProvider } from 'firebase/auth'
import { getFirestore } from 'firebase/firestore'
import { getStorage } from 'firebase/storage'
import { getMessaging, getToken, onMessage } from 'firebase/messaging'

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
const storage = getStorage()
const messaging = getMessaging()
const google = new GoogleAuthProvider()
const facebook = new FacebookAuthProvider()

export const requestForToken = () => {
  return getToken(messaging, { vapidKey: 'BFrdhPsV5ySvrQBDcKBP-wHWnoantTiHqSxet2_fMh2uTTS16bO80uQIKT89nrRQm2yrVFgfi0KFzCU2FrM8Eec' })
    .then((currentToken) => {
      if (currentToken) {
        console.log('current token for client: ', currentToken);
        // Perform any other neccessary action with the token
      } else {
        // Show permission request UI
        console.log('No registration token available. Request permission to generate one.');
      }
    })
    .catch((err) => {
      console.log('An error occurred while retrieving token. ', err);
    });
};

export const onMessageListener = () =>
  new Promise((resolve) => {
    onMessage(messaging, (payload) => {
      console.log("payload", payload)
      resolve(payload);
    });
  });

export { auth, db, storage, google, facebook, messaging }