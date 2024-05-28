import {
  DocumentReference,
  Timestamp,
  addDoc,
  collection,
  deleteDoc,
  doc,
  getDoc,
  getDocs,
  onSnapshot,
  orderBy,
  query,
  setDoc,
  updateDoc,
  where,
} from 'firebase/firestore'
import { ColRef, DocRef, SubColRef, getDocIdWithData } from '@/libs/firebase/firestore'
import { EventProject, LeadersWantedProject, Message, MessageRoom } from '@/models'
import { db } from '@/libs/firebase/firebase'

export const getMessageRoomList = async (updateCallback: (messageRoomList: any[]) => void) => {
  const q = query(ColRef.messageRooms, orderBy('sentAt', 'desc'))
  const snap = await getDocs(q)
  if (snap.empty) {
    return []
  } else {
    let messageRoomList = snap.docs.map((doc) => getDocIdWithData(doc))
    let msgRoomList: MessageRoom[] = []

    // Listen for real-time updates
    onSnapshot(ColRef.messageRooms, (snapshot) => {
      snapshot.docChanges().forEach((change) => {
        if (change.type === 'added') {
          const newMessageRoom = getDocIdWithData(change.doc)
          msgRoomList = [...msgRoomList, newMessageRoom]
        }

        updateCallback(msgRoomList)
      })
    })

    return messageRoomList
  }
}

export const getMessageRoom = async (id: string) => {
  const doc = await getDoc(DocRef.messageRoom(id))

  return getDocIdWithData(doc)
}

export const addMessageRoom = async (messageRoom: MessageRoom) => {
  const docRef = await addDoc(ColRef.messageRooms, messageRoom)
  return docRef.id
}

export const setMessageRoom = async (id: string, messageRoom: MessageRoom) => {
  await setDoc(DocRef.messageRoom(id), messageRoom, { merge: true })
}

export const deleteMessageRoom = async (id: string) => {
  await deleteDoc(DocRef.messageRoom(id))
}

// confirm target messageRoom with projectid exist in db
export const messageRoomExists = async (projectId: string, userId: string): Promise<boolean> => {
  const filteredQuery = query(ColRef.messageRooms, where('projectId', '==', projectId), where('userId', '==', userId))
  // where("members", "array-contains", userId)
  const snap = await getDocs(filteredQuery)

  return !snap.empty
}

export const getMessageRoomByProjectIdAndUserId = async (projectId: string, userId: string) => {
  const snap = await getDocs(
    query(ColRef.messageRooms, where('projectId', '==', projectId), where('memberIds', 'array-contains-any', [userId])),
  )
  return snap.empty ? null : getDocIdWithData<MessageRoom>(snap.docs[0])
}

//
export const getMessageRoomByProjectID = async (projectId: string) => {
  const filteredQuery = query(ColRef.messageRooms, where('projectId', '==', projectId))
  const snap = await getDocs(filteredQuery)

  if (snap.empty) {
    return null // No documents found
  }

  const documentSnapshot = snap.docs[0]
  const documentData = getDocIdWithData<MessageRoom>(documentSnapshot)

  return documentData
}

//
export const getMessageRoomPopulateList = async () => {
  const snap = await getDocs(ColRef.messageRooms)

  if (snap.empty) return []

  const eventDocs = snap.docs.map((doc) => getDocIdWithData(doc))

  // Get the largeCategory data for each clubTypeCategory
  const eventListWithPopulate = []

  for (const event of eventDocs) {
    const eventData = await getEventProject(event.projectId)
    eventListWithPopulate.push({
      ...event,
      projectData: eventData,
    })
  }

  return eventListWithPopulate
}

export const getMessageRoomByUserPopulateList = async (
  userId: string,
  updateCallback: (messageRoomList: any[]) => void,
) => {
  const createProjectData = async ({ projectType, projectId }: MessageRoom) => {
    return projectType === 'leader' ? await getLeadersWantedProject(projectId) : await getEventProject(projectId)
  }
  let msgRoomList: any[] = []
  onSnapshot(query(ColRef.messageRooms, where('userId', '==', userId), orderBy('updatedAt', 'desc')), (snapshot) => {
    snapshot.docChanges().forEach(async (change) => {
      const data = getDocIdWithData(change.doc)
      if (change.type === 'added') {
        msgRoomList = [
          ...msgRoomList,
          {
            ...data,
            projectData: await createProjectData(data),
          },
        ]
      }
      if (change.type === 'modified') {
        const index = msgRoomList.findIndex((messageRoom) => messageRoom.id === data.id)
        if (index !== -1) {
          const updatedMsgRoomList = [...msgRoomList]
          updatedMsgRoomList[index] = {
            ...data,
            projectData: await createProjectData(data),
          }
          msgRoomList = updatedMsgRoomList
        }
      }

      updateCallback(msgRoomList)
    })
  })

  return
}

export const getMessageRoomPopulate = async (id: string) => {
  const doc = await getDoc(DocRef.messageRoom(id))
  if (!doc.exists()) return null

  const messageRoomDoc = getDocIdWithData(doc)
  const event = await getEventProject(messageRoomDoc.projectId)
  let temp = { ...messageRoomDoc, projectData: event }

  return temp
}

const getEventProject = async (eventId: string) => {
  const doc = await getDoc(DocRef.eventProject(eventId))
  if (!doc.exists()) return null

  const eventData = getDocIdWithData<EventProject>(doc)
  return eventData
}

const getLeadersWantedProject = async (eventId: string) => {
  const doc = await getDoc(DocRef.leadersWantedProject(eventId))
  if (!doc.exists()) return null

  const eventData = getDocIdWithData<LeadersWantedProject>(doc)
  return eventData
}

export const getMessageRoomId = async (projectId: string, userId: string) => {
  const filteredQuery = query(
    ColRef.messageRooms,
    where('projectId', '==', projectId),
    where('memberIds', 'array-contains-any', [userId]),
  )
  const snap = await getDocs(filteredQuery)

  if (snap.empty) {
    return null // No documents found
  }

  const documentSnapshot = snap.docs[0]
  const documentData = getDocIdWithData<MessageRoom>(documentSnapshot)

  return documentData.id
}

// subcollection data add
export const addMessageData = async (messageRoomId: string, data: Message) => {
  const messageRoomRef = doc(db, 'messageRooms', messageRoomId)
  // Get the message room document
  const messageRoomDoc = await getDoc(messageRoomRef)
  if (!messageRoomDoc.exists()) return null

  // Get the message subcollection data
  const messagesCollectionRef = collection(messageRoomRef, 'messages')
  await addDoc(messagesCollectionRef, data)
}

export const getMessageData = (messageRoomId: string, updateCallback: (messages: Message[]) => void) => {
  let msgList: Message[] = []
  return onSnapshot(query(SubColRef.messages(messageRoomId), orderBy('createdAt')), (snapshot) => {
    snapshot.docChanges().forEach((change) => {
      if (change.type === 'added') {
        const newMessage = getDocIdWithData(change.doc) as Message
        msgList = [...msgList, newMessage]
      }

      updateCallback(msgList)
    })
  })
}

export const updateMessageRoomData = async (messageRoomRef: DocumentReference, newMessage: Message) => {
  try {
    // Update the messageRooms data with the new message
    await updateDoc(messageRoomRef, {
      lastMessage: newMessage.text,
    })

    // Update the members data in the messageRoom document
    const messageRoomDoc = await getDoc(messageRoomRef)
    const members = messageRoomDoc.data()?.members

    const updatedMembers = members.map((member: any) => {
      if (member.userId != newMessage.senderId) {
        return {
          ...member,
          unreadCount: member.lastAccessedAt > newMessage.createdAt ? member.unreadCount : member.unreadCount + 1,
          lastAccessedAt: Timestamp.now(),
        }
      }
      return member
    })

    await updateDoc(messageRoomRef, { members: updatedMembers })
  } catch (error) {
    console.error('Error updating messageRooms data:', error)
  }
}
