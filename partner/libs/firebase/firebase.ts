import { initializeApp } from 'firebase/app'
import { getAuth } from 'firebase/auth'
import { getDownloadURL, getStorage, ref, uploadBytes } from 'firebase/storage'
import { collection, doc, getDocs, getFirestore, serverTimestamp } from 'firebase/firestore'
import { appImageCompress } from '../image-compression/image_comporess'
import { nanoid } from 'nanoid'
// import { isProduction } from '@/utils/common'

// const isProduction = false

const firebaseConfig = {
  apiKey: process.env.NEXT_PUBLIC_FIREBASE_API_KEY,
  authDomain: process.env.NEXT_PUBLIC_FIREBASE_AUTH_DOMAIN,
  projectId: process.env.NEXT_PUBLIC_FIREBASE_PROJECT_ID,
  storageBucket: process.env.NEXT_PUBLIC_FIREBASE_STORAGE_BUCKET,
  messagingSenderId: process.env.NEXT_PUBLIC_FIREBASE_MESSAGING_SENDER_ID,
  appId: process.env.NEXT_PUBLIC_FIREBASE_APP_ID,
  measurementId: process.env.NEXT_PUBLIC_FIREBASE_MEASUREMENT_ID,
}

const app = initializeApp(firebaseConfig)
const auth = getAuth(app)
const db = getFirestore(app)
const storage = getStorage(app)

// if (!isProduction) {
//   const localhost = '127.0.0.1'
//   // firebase.json
//   connectFirestoreEmulator(db, localhost, 8080)
//   connectAuthEmulator(auth, `http://${localhost}:9099`, {
//     disableWarnings: true,
//   })
//   connectStorageEmulator(storage, localhost, 9199)
// }

auth.languageCode = 'ja'

export const uploadImage = async (file: File): Promise<string> => {
  const id = nanoid(10)
  const compressedFile = await appImageCompress({ file: file, maxSizeMB: 5, maxWidthOrHeight: 480 })

  const storageRef = ref(storage, `${compressedFile.name}-${id}`)
  await uploadBytes(storageRef, compressedFile)
  const imageUrl = await getDownloadURL(storageRef)
  return imageUrl
}

export const uploadFiles = async (files: File[]): Promise<string[]> => {
  const uploadPromises = files.map(async (file) => {
    const id = nanoid(10)

    const storageRef = ref(storage, `${id}-${file.name}`)
    await uploadBytes(storageRef, file)
    const fileUrl = await getDownloadURL(storageRef)
    return fileUrl
  })

  return Promise.all(uploadPromises)
}

export default app
export { auth, db, collection, doc, getDocs, serverTimestamp, storage }
