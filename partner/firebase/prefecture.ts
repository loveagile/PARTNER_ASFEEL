import { addDoc, deleteDoc, getDoc, getDocs, orderBy, query, setDoc, where } from 'firebase/firestore'
import { ColRef, DocRef, getDocIdWithData } from '@/libs/firebase/firestore'
import { Prefecture } from '@/models'

export const getPrefectureList = async () => {
  const snap = await getDocs(query(ColRef.prefectures, orderBy('index', 'asc')))
  return snap.empty ? [] : snap.docs.map((doc) => getDocIdWithData(doc))
}

export const getPrefecture = async (id: string) => {
  const doc = await getDoc(DocRef.prefecture(id))
  if (!doc.exists()) return null

  return getDocIdWithData(doc)
}

export const addPrefecture = async (prefecture: Prefecture) => {
  await addDoc(ColRef.prefectures, prefecture)
}

export const setPrefecture = async (id: string, prefecture: Prefecture) => {
  await setDoc(DocRef.prefecture(id), prefecture)
}

export const deletePrefecture = async (id: string) => {
  await deleteDoc(DocRef.prefecture(id))
}

export const getPrefectureId = async (name: string) => {
  const filteredQuery = query(ColRef.prefectures, where('prefecture', '==', name))
  const snap = await getDocs(filteredQuery)

  if (snap.empty) {
    return null // No documents found
  }

  const documentSnapshot = snap.docs[0]
  const documentData = getDocIdWithData<Prefecture>(documentSnapshot)

  return documentData.id
}
