import { addDoc, deleteDoc, getDoc, getDocs, query, setDoc, where } from 'firebase/firestore'
import { ColRef, DocRef, getDocIdWithData } from '@/libs/firebase/firestore'
import { Area } from '@/models'

export const getAreaList = async () => {
  const snap = await getDocs(ColRef.areas)

  return snap.empty ? [] : snap.docs.map((doc) => getDocIdWithData(doc))
}

export const getArea = async (id: string) => {
  const doc = await getDoc(DocRef.area(id))
  if (!doc.exists()) return null

  return getDocIdWithData(doc)
}

export const addArea = async (area: Area) => {
  await addDoc(ColRef.areas, area)
}

export const setArea = async (id: string, area: Area) => {
  await setDoc(DocRef.area(id), area)
}

export const deleteArea = async (id: string) => {
  await deleteDoc(DocRef.area(id))
}

export const getAreaId = async (name: string) => {
  const filteredQuery = query(ColRef.areas, where('area', '==', name))
  const snap = await getDocs(filteredQuery)

  if (snap.empty) {
    return null // No documents found
  }

  const documentSnapshot = snap.docs[0]
  const documentData = getDocIdWithData<Area>(documentSnapshot)

  return documentData.id
}
