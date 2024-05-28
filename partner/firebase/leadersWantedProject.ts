import { addDoc, deleteDoc, getDoc, getDocs, orderBy, query, setDoc, where } from 'firebase/firestore'
import { ColRef, DocRef, getDocIdWithData } from '@/libs/firebase/firestore'
import { LeadersWantedProject, LeadersWantedProjectSelectionList } from '@/models'

export const getLeadersWantedProjectList = async () => {
  const snap = await getDocs(
    query(ColRef.leadersWantedProjects, where('status', '==', 'inpublic'), orderBy('createdAt', 'desc')),
  )

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

export const getLeadersWantedProjectListByPrefecture = async (prefecture: string) => {
  const snap = await getDocs(
    query(
      ColRef.leadersWantedProjects,
      where('workplace.prefecture', '==', prefecture),
      where('status', '==', 'inpublic'),
    ),
  )

  return snap.empty ? [] : snap.docs.map((doc) => getDocIdWithData(doc))
}

export const getLeadersWantedProjectListByClub = async (club: string) => {
  const snap = await getDocs(
    query(ColRef.leadersWantedProjects, where('eventName', '==', club), where('status', '==', 'inpublic')),
  )

  return snap.empty ? [] : snap.docs.map((doc) => getDocIdWithData(doc))
}

export const getRecommendedLeadersWantedProjectListByClub = async (areas: string[]) => {
  const snap = await getDocs(
    query(
      ColRef.leadersWantedProjects,
      where('workplace.city', 'in', areas),
      where('status', '==', 'inpublic'),
      orderBy('createdAt', 'desc'),
    ),
  )

  return snap.empty ? [] : snap.docs.map((doc) => getDocIdWithData(doc))
}

export const addLeadersWantedProjectsSelectionListData = async (
  projectId: string,
  docId: string,
  data: LeadersWantedProjectSelectionList,
) => {
  await setDoc(
    DocRef.leadersWantedProjectSelectionList({
      leadersWantedProjectId: projectId,
      leadersWantedProjectSelectionListId: docId,
    }),
    data,
    { merge: true },
  )
  return
}
