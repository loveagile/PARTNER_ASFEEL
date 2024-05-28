import { addDoc, deleteDoc, getDoc, getDocs, orderBy, query, setDoc, where } from 'firebase/firestore'
import { ColRef, DocRef, getDocIdWithData } from '@/libs/firebase/firestore'
import { ClubTypeLargeCategory, ClubTypeMediumCategory, ClubTypeCategory } from '@/models'

export const getClubTypeCategoryList = async () => {
  const snap = await getDocs(ColRef.clubTypeCategories)

  return snap.empty ? [] : snap.docs.map((doc) => getDocIdWithData(doc))
}

export const getClubTypeCategory = async (id: string) => {
  const doc = await getDoc(DocRef.clubTypeCategory(id))
  if (!doc.exists()) return null

  return getDocIdWithData(doc)
}

export const addClubTypeCategory = async (clubTypeCategory: ClubTypeCategory) => {
  await addDoc(ColRef.clubTypeCategories, clubTypeCategory)
}

export const setClubTypeCategory = async (id: string, clubTypeCategory: ClubTypeCategory) => {
  await setDoc(DocRef.clubTypeCategory(id), clubTypeCategory)
}

export const deleteClubTypeCategory = async (id: string) => {
  await deleteDoc(DocRef.clubTypeCategory(id))
}

// other functions
export const getClubTypeCategoryPopulateList = async () => {
  const snap = await getDocs(query(ColRef.clubTypeCategories, where('isPublish', '==', true), orderBy('order', 'asc')))
  if (snap.empty) return []

  return Promise.all(
    snap.docs.map(async (doc) => {
      const data = getDocIdWithData(doc)
      const [largeCategoryName, mediumCategoryName, mediumCategoryIndex] = await Promise.all([
        getLargeCategoryName(data.largeCategory),
        getMediumCategoryName(data.mediumCategory),
        getMediumCategoryIndex(data.mediumCategory),
      ])

      return {
        ...data,
        largeCategoryName: largeCategoryName!,
        mediumCategoryName: mediumCategoryName!,
        mediumCategoryIndex: mediumCategoryIndex!,
      }
    }),
  )
}

export const getClubTypeCategoryPopulate = async (id: string) => {
  const doc = await getDoc(DocRef.clubTypeCategory(id))
  if (!doc.exists()) return null

  const clubTypeCategoryDoc = getDocIdWithData(doc)
  const largeCategoryName = await getLargeCategoryName(clubTypeCategoryDoc.largeCategory)
  const mediumCategoryName = await getMediumCategoryName(clubTypeCategoryDoc.mediumCategory)
  let temp = { ...clubTypeCategoryDoc, largeCategoryName, mediumCategoryName }

  return temp
}

const getLargeCategoryName = async (largeCategoryId: string) => {
  const doc = await getDoc(DocRef.clubTypeLargeCategory(largeCategoryId))
  if (!doc.exists()) return null

  const largeCategory = getDocIdWithData<ClubTypeLargeCategory>(doc)
  return largeCategory.name
}

const getMediumCategoryName = async (mediumCategoryId: string) => {
  const doc = await getDoc(DocRef.clubTypeMediumCategory(mediumCategoryId))
  if (!doc.exists()) return null

  const mediumCategory = getDocIdWithData<ClubTypeMediumCategory>(doc)
  return mediumCategory.name
}

const getMediumCategoryIndex = async (mediumCategoryId: string) => {
  const doc = await getDoc(DocRef.clubTypeMediumCategory(mediumCategoryId))
  if (!doc.exists()) return null

  const mediumCategory = getDocIdWithData<ClubTypeMediumCategory>(doc)
  return mediumCategory.index
}
