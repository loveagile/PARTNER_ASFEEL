import { addDoc, deleteDoc, getDoc, getDocs, setDoc } from 'firebase/firestore'
import { ColRef, DocRef, getDocIdWithData } from '@/libs/firebase/firestore'
import { Prefecture } from '@/models'

export const getPrefectureList = async () => {
  const snap = await getDocs(ColRef.prefectures)

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
