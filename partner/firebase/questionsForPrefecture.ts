import { addDoc, deleteDoc, getDoc, getDocs, query, setDoc, where } from 'firebase/firestore'
import { ColRef, DocRef, getDocIdWithData } from '@/libs/firebase/firestore'
import { QuestionsForPrefecture } from '@/models'

export const getQuestionsForPrefectureList = async () => {
  const snap = await getDocs(ColRef.questionsForPrefecture)

  return snap.empty ? [] : snap.docs.map((doc) => getDocIdWithData(doc))
}

export const getQuestionsForPrefecture = async (id: string) => {
  const doc = await getDoc(DocRef.questionsForPrefecture(id))
  if (!doc.exists()) return null

  return getDocIdWithData(doc)
}

export const addQuestionsForPrefecture = async (questionsForPrefecture: QuestionsForPrefecture) => {
  await addDoc(ColRef.questionsForPrefecture, questionsForPrefecture)
}

export const setQuestionsForPrefecture = async (id: string, questionsForPrefecture: QuestionsForPrefecture) => {
  await setDoc(DocRef.questionsForPrefecture(id), questionsForPrefecture)
}

export const deleteQuestionsForPrefecture = async (id: string) => {
  await deleteDoc(DocRef.questionsForPrefecture(id))
}

// get questionforprefecture list include prefecture
export const getQuestionsForPrefectureByUser = async (prefecture: string[]) => {
  let filteredQuery = query(ColRef.questionsForPrefecture, where('prefecture', 'in', prefecture))

  // Execute the query and return the results as an array
  const snap = await getDocs(filteredQuery)

  return snap.empty ? [] : snap.docs.map((doc) => getDocIdWithData(doc))
}
