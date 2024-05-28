// 6. 認証コードの検証とアカウント作成、カスタムトークンの発行
import { NextApiRequest, NextApiResponse } from 'next'
import admin from 'firebase-admin'
import { VerificationCode } from '@/models'

if (!admin.apps.length) {
  admin.initializeApp()
}

const db = admin.firestore()

export default async function handler(req: NextApiRequest, res: NextApiResponse) {
  if (req.method !== 'POST') {
    return res.status(405).json({ message: 'リクエストメソッドが正しくありません。' })
  }

  const { email, code } = req.body
  if (!email || !code) {
    return res.status(400).json({ message: '不正なリクエストです。' })
  }

  try {
    // 認証コードの検証
    const { isVerified, message } = await verifyVerificationCode(email, code)

    return isVerified
      ? res.status(201).json({
          isVerified,
          message,
        })
      : res.status(400).json({
          isVerified,
          message,
        })
  } catch (error: unknown) {
    return res.status(500).json({
      isVerified: false,
      message: '認証コードの検証に失敗しました。',
      error,
    })
  }
}

/**
 * 認証コードの検証
 */
async function verifyVerificationCode(email: string, code: string) {
  try {
    // 認証コードの取得
    const doc = await db.collection('verificationCodes').doc(email).get()

    // 認証コードの検証
    if (!doc.exists) {
      throw new Error('認証コードが見つかりません。')
    }

    // 認証コードの有効期限（10分経過しているか）を検証
    const { code: codeOnFirestore, expiredAt, isUsed } = doc.data() as VerificationCode
    if (expiredAt.toMillis() < new Date().getTime()) {
      throw new Error('認証コードの有効期限が切れています。')
    }

    // 認証コードの使用済みフラグを検証
    if (isUsed) {
      throw new Error('認証コードは既に使用されています。')
    }

    // 認証コードの検証
    if (code !== codeOnFirestore) {
      throw new Error('認証コードが一致しません。')
    }

    return {
      isVerified: true,
      message: '認証コードの検証に成功しました。',
    }
  } catch (error: any) {
    console.error('Error:', error)
    return {
      isVerified: false,
      message: error.message,
    }
  }
}
