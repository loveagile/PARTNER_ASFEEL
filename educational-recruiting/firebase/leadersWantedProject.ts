import { addDoc, deleteDoc, getDoc, getDocs, setDoc } from 'firebase/firestore'
import { ColRef, DocRef, getDocIdWithData } from '@/libs/firebase/firestore'
import { LeadersWantedProject } from '@/models'

export const getLeadersWantedProjectList = async () => {
  const snap = await getDocs(ColRef.leadersWantedProjects)

  return snap.empty ? [] : snap.docs.map((doc) => getDocIdWithData(doc))
}

export const getLeadersWantedProject = async (id: string) => {
  const doc = await getDoc(DocRef.leadersWantedProject(id))
  if (!doc.exists()) return null

  return getDocIdWithData(doc)
}

export const addLeadersWantedProject = async (leadersWantedProject: LeadersWantedProject) => {
  await addDoc(ColRef.leadersWantedProjects, leadersWantedProject)
}

export const setLeadersWantedProject = async (id: string, leadersWantedProject: LeadersWantedProject) => {
  await setDoc(DocRef.leadersWantedProject(id), leadersWantedProject)
}

export const deleteLeadersWantedProject = async (id: string) => {
  await deleteDoc(DocRef.leadersWantedProject(id))
}
