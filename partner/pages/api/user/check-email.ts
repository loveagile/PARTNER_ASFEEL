// 2. メールアドレスの重複チェック
import { NextApiRequest, NextApiResponse } from 'next'
import admin from 'firebase-admin'

interface FirebaseError {
  code: string
  message: string
}

if (!admin.apps.length) {
  admin.initializeApp()
}

const auth = admin.auth()

export default async function handler(req: NextApiRequest, res: NextApiResponse) {
  if (req.method !== 'POST') {
    return res.status(405).json({ message: 'Method not allowed.' })
  }

  const { email } = req.body
  if (!email) {
    return res.status(400).json({ message: 'Email is required.' })
  }

  try {
    const userRecord = await auth.getUserByEmail(email)
    return res.status(200).json({ exists: !!userRecord })
  } catch (error: unknown) {
    if (isFirebaseError(error) && error.code === 'auth/user-not-found') {
      return res.status(200).json({ exists: false })
    }

    console.error('Error:', error)
    return res.status(500).json({ message: 'Internal server error.' })
  }
}

/**
 * 型ガードの関数
 */
function isFirebaseError(error: any): error is FirebaseError {
  return error && typeof error.code === 'string' && typeof error.message === 'string'
}
