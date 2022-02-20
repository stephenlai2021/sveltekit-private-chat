import admin from "firebase-admin"
import serviceAccount from "./serviceAccountKey.json"

// if (admin.app.length === 0) {
  admin.initializeApp({
    credential: admin.credential.cert(serviceAccount),
    databaseURL: process.env.VITE_DATABASEURL
  });
// }

const db = admin.firestore()
const auth = admin.auth()

export { db, auth }