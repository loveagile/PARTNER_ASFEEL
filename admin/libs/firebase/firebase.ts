import { initializeApp } from 'firebase/app'
import { getAuth } from 'firebase/auth'
import {
  collection,
  doc,
  getDocs,
  getFirestore,
  serverTimestamp
} from 'firebase/firestore'
import { getStorage } from 'firebase/storage'

const firebaseConfig = {
  apiKey: process.env.NEXT_PUBLIC_FIREBASE_API_KEY,
  authDomain: process.env.NEXT_PUBLIC_FIREBASE_AUTH_DOMAIN,
  projectId: process.env.NEXT_PUBLIC_FIREBASE_PROJECT_ID,
  storageBucket: process.env.NEXT_PUBLIC_FIREBASE_STORAGE_BUCKET,
  messagingSenderId: process.env.NEXT_PUBLIC_FIREBASE_MESSAGING_SENDER_ID,
}

const app = initializeApp(firebaseConfig)
const auth = getAuth(app)
const db = getFirestore(app)
const storage = getStorage(app)

// if (!isRemote) {
//   const localhost = 'localhost'
//   // firebase.json
//   connectFirestoreEmulator(db, localhost, 8080)
//   connectAuthEmulator(auth, `http://${localhost}:9099`, {
//     disableWarnings: true,
//   })
//   connectStorageEmulator(storage, localhost, 9199)
// }

auth.languageCode = 'ja'

export default app
export { auth, collection, db, doc, getDocs, serverTimestamp, storage }
