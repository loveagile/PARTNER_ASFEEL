import { addDoc, collection, deleteDoc, doc, getDoc, getDocs, query, setDoc, where } from 'firebase/firestore'
import { ColRef, DocRef, getDocIdWithData } from '@/libs/firebase/firestore'
import { CheckedNotification, PrivateUser } from '@/models'
import { encrypt } from '@/utils/token'
import { db } from '@/libs/firebase/firebase'
import { API_URL } from '@/utils/constants/apiUrls'

export const getPrivateUserList = async () => {
  const snap = await getDocs(ColRef.privateUsers)

  return snap.empty ? [] : snap.docs.map((doc) => getDocIdWithData(doc))
}

export const getPrivateUser = async (id: string) => {
  const doc = await getDoc(DocRef.privateUser(id))
  if (!doc.exists()) return null

  return getDocIdWithData(doc)
}

export const addPrivateUser = async (privateUser: PrivateUser) => {
  await addDoc(ColRef.privateUsers, privateUser)
}

export const setPrivateUser = async (id: string, privateUser: Partial<PrivateUser>) => {
  await setDoc(DocRef.privateUser(id), privateUser, { merge: true })
}

export const deletePrivateUser = async (id: string) => {
  await deleteDoc(DocRef.privateUser(id))
}

export const userExists = async (email: string): Promise<boolean> => {
  const response = await fetch(API_URL.checkEmail, {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify({ email }),
  })

  if (!response.ok) {
    const data = await response.json()
    throw new Error(data.message || 'Something went wrong.')
  }

  const result = await response.json()
  return result.exists // APIが { exists: true } または { exists: false } を返すことを想定
}

//
export const getPrivateUserByEmail = async (email: string) => {
  const filteredQuery = query(ColRef.privateUsers, where('email', '==', email), where('isDeletedAccount', '==', false))
  const snap = await getDocs(filteredQuery)

  if (snap.empty) {
    return null // No documents found
  }

  const documentSnapshot = snap.docs[0]
  const documentData = getDocIdWithData<PrivateUser>(documentSnapshot)

  return documentData
}

export const getPrivateUserToken = async (email: string) => {
  const filteredQuery = query(ColRef.privateUsers, where('email', '==', email))
  const snap = await getDocs(filteredQuery)

  if (snap.empty) {
    return null // No documents found
  }

  const documentSnapshot = snap.docs[0]
  const documentData = getDocIdWithData<PrivateUser>(documentSnapshot)

  const token = encrypt(JSON.stringify(documentData))

  return token
}

// subcollection data add
export const addCheckedNotification = async (userId: string, data: CheckedNotification) => {
  const userRef = doc(db, 'privateUsers', userId)
  // Get the message room document
  const userDoc = await getDoc(userRef)
  if (!userDoc.exists()) return null

  // Get the message subcollection data
  const userCheckedNotificationRef = collection(userRef, 'checkedNotifications')
  await addDoc(userCheckedNotificationRef, data)
}

export const getPrivateUserCheckedNotificationData = async (userId: string) => {
  const userRef = doc(db, 'privateUsers', userId)
  // Get the message room document
  const userDoc = await getDoc(userRef)
  if (!userDoc.exists()) return null

  // Get the message subcollection data
  const userCheckedNotificationRefRef = collection(userRef, 'checkedNotifications')
  const userCheckedNotificationQuerySnapshot = await getDocs(userCheckedNotificationRefRef)
  const userChekcedNotiList = userCheckedNotificationQuerySnapshot.docs.map((doc) => doc.data())

  return userChekcedNotiList
}

export const checkedNotiExists = async (userId: string, notiId: string): Promise<boolean> => {
  const userRef = doc(db, 'privateUsers', userId)
  const subNotiRef = collection(userRef, 'checkedNotifications')
  const querySnapshot = await getDocs(subNotiRef)

  let exists = false

  querySnapshot.forEach((doc) => {
    const data = doc.data()
    if (data.noticeId === notiId) {
      exists = true
    }
  })

  return exists
}
