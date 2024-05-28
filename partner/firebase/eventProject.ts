import { addDoc, collection, deleteDoc, doc, getDoc, getDocs, orderBy, query, setDoc, where } from 'firebase/firestore'
import { ColRef, DocRef, getDocIdWithData } from '@/libs/firebase/firestore'
import { EventProject, EventProjectScoutList, EventProjectSelectionList } from '@/models'
import { db } from '@/libs/firebase/firebase'

export const getEventProjectList = async () => {
  let filteredQuery = query(ColRef.eventProjects, where('status', '==', 'inpublic'))
  const snap = await getDocs(filteredQuery)

  return snap.empty ? [] : snap.docs.map((doc) => getDocIdWithData(doc))
}

export const getEventProject = async (id: string) => {
  const doc = await getDoc(DocRef.eventProject(id))
  if (!doc.exists()) return null

  return getDocIdWithData(doc)
}

export const addEventProject = async (eventProject: EventProject) => {
  await addDoc(ColRef.eventProjects, eventProject)
}

export const setEventProject = async (id: string, eventProject: EventProject) => {
  await setDoc(DocRef.eventProject(id), eventProject)
}

export const deleteEventProject = async (id: string) => {
  await deleteDoc(DocRef.eventProject(id))
}

// get eventproject list include club
export const getEventProjectListByClub = async (club: string) => {
  const filteredQuery = query(ColRef.eventProjects, where('club', '==', club), where('status', '==', 'inpublic'))
  const snap = await getDocs(filteredQuery)

  return snap.empty ? [] : snap.docs.map((doc) => getDocIdWithData(doc))
}

// get recommended project list
export const getRecommendedProjectListByClub = async (areas: string[]) => {
  let filteredQuery = query(
    ColRef.eventProjects,
    where('address.prefecture', 'in', areas),
    where('status', '==', 'inpublic'),
  )

  // Execute the query and return the results as an array
  const snap = await getDocs(filteredQuery)

  return snap.empty ? [] : snap.docs.map((doc) => getDocIdWithData(doc))
}

export const getEventProjectListByOrganization = async (org: string) => {
  let filteredQuery = query(
    ColRef.eventProjects,
    where('schoolName', 'array-contains', org),
    where('status', '==', 'inpublic'),
    orderBy('createdAt', 'desc'),
  )

  // Execute the query and return the results as an array
  const snap = await getDocs(filteredQuery)

  return snap.empty ? [] : snap.docs.map((doc) => getDocIdWithData(doc))
}

// subcollection data add
export const addEventProjectScoutListData = async (projectId: string, data: EventProjectScoutList) => {
  const eventProjectRef = doc(db, 'eventProjects', projectId)
  // Get the message room document
  const eventProjectDoc = await getDoc(eventProjectRef)
  if (!eventProjectDoc.exists()) return null

  // Get the message subcollection data
  const eventProjectScoutListsCollectionRef = collection(eventProjectRef, 'eventProjectScoutLists')
  await addDoc(eventProjectScoutListsCollectionRef, data)
}

export const getEventProjectScoutListData = async (projectId: string) => {
  const eventProjectRef = doc(db, 'eventProjects', projectId)
  // Get the message room document
  const eventProjectDoc = await getDoc(eventProjectRef)
  if (!eventProjectDoc.exists()) return null

  // Get the message subcollection data
  const eventProjectScoutListsCollectionRef = collection(eventProjectRef, 'eventProjectScoutLists')
  const eventProjectScoutListsQuerySnapshot = await getDocs(eventProjectScoutListsCollectionRef)
  const eventProjectScoutLists = eventProjectScoutListsQuerySnapshot.docs.map((doc) => doc.data())

  return eventProjectScoutLists
}

export const addEventProjectSelectionListData = async (
  projectId: string,
  docId: string,
  data: EventProjectSelectionList,
) => {
  await setDoc(
    DocRef.eventProjectSelectionList({
      eventProjectId: projectId,
      eventProjectSelectionId: docId,
    }),
    data,
    { merge: true },
  )
  return
}

export const getEventProjectSelectionListData = async (projectId: string) => {
  const eventProjectRef = doc(db, 'eventProjects', projectId)
  // Get the message room document
  const eventProjectDoc = await getDoc(eventProjectRef)
  if (!eventProjectDoc.exists()) return null

  // Get the message subcollection data
  const eventProjectSelectionListsCollectionRef = collection(eventProjectRef, 'eventProjectSelectionLists')
  const eventProjectSelectionListsQuerySnapshot = await getDocs(eventProjectSelectionListsCollectionRef)
  const eventProjectSelectionLists = eventProjectSelectionListsQuerySnapshot.docs.map((doc) => doc.data())

  return eventProjectSelectionLists
}
