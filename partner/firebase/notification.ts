import { addDoc, deleteDoc, getDoc, getDocs, onSnapshot, orderBy, query, setDoc, where } from 'firebase/firestore'
import { ColRef, DocRef, getDocIdWithData } from '@/libs/firebase/firestore'
import { Notification } from '@/models'

export const getNotificationList = async (updateCallback: (notificationList: any[]) => void) => {
  const q = query(ColRef.notifications, where('status', '==', 'published'), orderBy('createdAt', 'desc'))
  const snap = await getDocs(q)
  if (snap.empty) {
    return []
  }

  let notificationList = snap.docs.map((doc) => getDocIdWithData(doc))
  let notiList: Notification[] = []

  onSnapshot(q, (snapshot) => {
    snapshot.docChanges().forEach((change) => {
      if (change.type === 'added') {
        const newNotification = getDocIdWithData(change.doc)
        notiList = [...notiList, newNotification]
      }

      updateCallback(notiList)
    })
  })

  return notificationList
}

export const getNotification = async (id: string) => {
  const doc = await getDoc(DocRef.notification(id))
  if (!doc.exists()) return null

  return getDocIdWithData(doc)
}

export const addNotification = async (notification: Notification) => {
  await addDoc(ColRef.notifications, notification)
}

export const setNotification = async (id: string, notification: Notification) => {
  await setDoc(DocRef.notification(id), notification)
}

export const deleteNotification = async (id: string) => {
  await deleteDoc(DocRef.notification(id))
}
