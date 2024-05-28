import { addDoc, deleteDoc, getDoc, getDocs, setDoc } from 'firebase/firestore'
import { ColRef, DocRef, getDocIdWithData } from '@/libs/firebase/firestore'
import { ClubTypeLargeCategory } from '@/models'

export const getClubTypeLargeCategoryList = async () => {
  const snap = await getDocs(ColRef.clubTypeLargeCategories)

  return snap.empty ? [] : snap.docs.map((doc) => getDocIdWithData(doc))
}

export const getClubTypeLargeCategory = async (id: string) => {
  const doc = await getDoc(DocRef.clubTypeLargeCategory(id))
  if (!doc.exists()) return null

  return getDocIdWithData(doc)
}

export const addClubTypeLargeCategory = async (clubTypeLargeCategory: ClubTypeLargeCategory) => {
  await addDoc(ColRef.clubTypeLargeCategories, clubTypeLargeCategory)
}

export const setClubTypeLargeCategory = async (id: string, clubTypeLargeCategory: ClubTypeLargeCategory) => {
  await setDoc(DocRef.clubTypeLargeCategory(id), clubTypeLargeCategory)
}

export const deleteClubTypeLargeCategory = async (id: string) => {
  await deleteDoc(DocRef.clubTypeLargeCategory(id))
}
