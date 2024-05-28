import { addDoc, deleteDoc, getDoc, getDocs, setDoc } from 'firebase/firestore'
import { ColRef, DocRef, getDocIdWithData } from '@/libs/firebase/firestore'
import { OrganizationType } from '@/models'

export const getOrganizationTypeList = async () => {
  const snap = await getDocs(ColRef.organizationTypes)

  return snap.empty ? [] : snap.docs.map((doc) => getDocIdWithData(doc))
}

export const getOrganizationType = async (id: string) => {
  const doc = await getDoc(DocRef.organizationType(id))
  if (!doc.exists()) return null

  return getDocIdWithData(doc)
}

export const addOrganizationType = async (organizationType: OrganizationType) => {
  await addDoc(ColRef.organizationTypes, organizationType)
}

export const setOrganizationType = async (id: string, organizationType: OrganizationType) => {
  await setDoc(DocRef.organizationType(id), organizationType)
}

export const deleteOrganizationType = async (id: string) => {
  await deleteDoc(DocRef.organizationType(id))
}
