import { NextApiRequest, NextApiResponse } from 'next'
import admin from 'firebase-admin'

if (!admin.apps.length) {
  admin.initializeApp()
}
const db = admin.firestore()

export default async function handler(req: NextApiRequest, res: NextApiResponse) {
  if (req.method !== 'POST') {
    return res.status(405).json({ message: 'Method not allowed.' })
  }

  try {
    const { email } = req.body

    // Firebase Authからユーザーを取得する
    const userRecord = await admin.auth().getUserByEmail(email)
    const userId = userRecord.uid

    // Firestoreに削除フラグを立てる
    await db.collection('privateUsers').doc(userId).delete()

    // Firebase Authからユーザーを削除する
    await admin.auth().deleteUser(userId)

    console.log(`Reset register: ${userId}`)
    return res.status(200).json({ message: 'success' })
  } catch (error) {
    return res.status(500).json({ message: 'アカウントの削除に失敗しました。', error })
  }
}
