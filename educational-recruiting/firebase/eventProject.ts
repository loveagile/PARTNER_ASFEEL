import { addDoc, deleteDoc, getDoc, getDocs, setDoc } from 'firebase/firestore'
import { ColRef, DocRef, getDocIdWithData } from '@/libs/firebase/firestore'
import { EventProject } from '@/models'

export const getEventProjectList = async () => {
  const snap = await getDocs(ColRef.eventProjects)

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
