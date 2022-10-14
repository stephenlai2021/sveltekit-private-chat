importScripts('https://www.gstatic.com/firebasejs/8.2.7/firebase-app.js');
importScripts('https://www.gstatic.com/firebasejs/8.2.7/firebase-messaging.js');

// Initialize the Firebase app in the service worker by passing the generated config
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

firebase.initializeApp(firebaseConfig);

// Retrieve firebase messaging
const messaging = firebase.messaging();

messaging.onBackgroundMessage(function (payload) {
  console.log('Received background message ', payload);

  const notificationTitle = payload.notification.title;
  const notificationOptions = {
    body: payload.notification.body
  };

  self.registration.showNotification(notificationTitle,
    notificationOptions);
});