import admin from 'firebase-admin'

export const db = admin.firestore()
export const appServerTimestamp = () => {
  return admin.firestore.FieldValue.serverTimestamp()
}
