import {
  addDoc,
  collection,
  deleteDoc,
  getDoc,
  getDocs,
  limit,
  orderBy,
  query,
  setDoc,
  where,
} from 'firebase/firestore'
import { ColRef, DocRef, getDocIdWithData } from '@/libs/firebase/firestore'
import { VerificationCode } from '@/models'
import { db } from '@/libs/firebase/firebase'

export const getVerificationCodeList = async () => {
  const snap = await getDocs(ColRef.verificationCodes)

  return snap.empty ? [] : snap.docs.map((doc) => getDocIdWithData(doc))
}

export const getVerificationCode = async (id: string) => {
  const doc = await getDoc(DocRef.verificationCode(id))
  if (!doc.exists()) return null

  return getDocIdWithData(doc)
}

export const addVerificationCode = async (verificationCode: VerificationCode) => {
  await addDoc(ColRef.verificationCodes, verificationCode)
}

export const setVerificationCode = async (id: string, verificationCode: VerificationCode) => {
  await setDoc(DocRef.verificationCode(id), verificationCode)
}

export const deleteVerificationCode = async (id: string) => {
  await deleteDoc(DocRef.verificationCode(id))
}

export const VerifyCode = async (email: string, type: string, code: string) => {
  const ColRef = collection(db, 'verificationCodes')
  const filteredQuery = query(
    ColRef,
    where('email', '==', email),
    where('type', '==', type),
    orderBy('expiredAt', 'desc'),
    limit(1),
  )
  const snapshot = await getDocs(filteredQuery)

  if (snapshot.empty) {
    return false // No documents found
  }

  const docData = snapshot.docs[0].data()

  if (docData.email == email) {
    if (Date.now() > docData.expiredAt.toDate().getTime()) {
      return false
    } else {
      if (docData.code == code) {
        return true
      } else return false
    }
  } else {
    return false
  }
}
