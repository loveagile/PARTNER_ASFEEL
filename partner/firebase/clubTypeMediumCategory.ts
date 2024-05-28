import { addDoc, deleteDoc, getDoc, getDocs, query, setDoc, where } from 'firebase/firestore'
import { ColRef, DocRef, getDocIdWithData } from '@/libs/firebase/firestore'
import { ClubTypeMediumCategory } from '@/models'

export const getClubTypeMediumCategoryList = async () => {
  const snap = await getDocs(ColRef.clubTypeMediumCategories)

  return snap.empty ? [] : snap.docs.map((doc) => getDocIdWithData(doc))
}

export const getClubTypeMediumCategory = async (id: string) => {
  const doc = await getDoc(DocRef.clubTypeMediumCategory(id))
  if (!doc.exists()) return null

  return getDocIdWithData(doc)
}

export const addClubTypeMediumCategory = async (clubTypeMediumCategory: ClubTypeMediumCategory) => {
  await addDoc(ColRef.clubTypeMediumCategories, clubTypeMediumCategory)
}

export const setClubTypeMediumCategory = async (id: string, clubTypeMediumCategory: ClubTypeMediumCategory) => {
  await setDoc(DocRef.clubTypeMediumCategory(id), clubTypeMediumCategory)
}

export const deleteClubTypeMediumCategory = async (id: string) => {
  await deleteDoc(DocRef.clubTypeMediumCategory(id))
}

export const getClubTypeMediumCategoryId = async (name: string) => {
  const filteredQuery = query(ColRef.clubTypeMediumCategories, where('name', '==', name))
  const snap = await getDocs(filteredQuery)

  if (snap.empty) {
    return null // No documents found
  }

  const documentSnapshot = snap.docs[0]
  const documentData = getDocIdWithData<ClubTypeMediumCategory>(documentSnapshot)

  return documentData.id
}
