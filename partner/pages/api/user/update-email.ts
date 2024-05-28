// メールアドレス変更API
// 認証コードの検証結果を返すのみ。
// フロントエンド側で検証コードの結果をみて変更するかどうかを判断する。

import { NextApiRequest, NextApiResponse } from 'next'
import admin from 'firebase-admin'
import { VerificationCode } from '@/models'

if (!admin.apps.length) {
  admin.initializeApp()
}

const db = admin.firestore()

export default async function handler(req: NextApiRequest, res: NextApiResponse) {
  if (req.method !== 'POST') {
    console.error('Error:', 'Method not allowed.')
    return res.status(405).json({ message: 'Method not allowed.' })
  }

  const { currentEmail, newEmail, code } = req.body
  if (!currentEmail || !newEmail || !code) {
    console.error('Error:', 'Email and code are required.')
    return res.status(400).json({ message: 'Email and code are required.' })
  }

  try {
    // 認証コードの検証
    // MEMO: 認証コードは新規メールアドレスドキュメントを参照
    const { isVerified, message } = await verifyVerificationCode(newEmail, code)
    if (!isVerified) {
      return res.status(400).json({ message })
    }

    // アカウントのuidを取得（Firebase Authentication）
    // MEMO: userRecordは現在のメールアドレスのユーザー情報
    const userRecord = await admin.auth().getUserByEmail(currentEmail)

    // カスタムトークンの発行
    const customToken = await admin.auth().createCustomToken(userRecord.uid)

    return res.status(200).json({
      token: customToken,
      message,
    })
  } catch (error: unknown) {
    console.error('Error:', error)
    return res.status(500).json({ message: 'アカウントの作成に失敗しました。', error })
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
  } catch (error) {
    console.error('Error:', error)
    return {
      isVerified: false,
      message: error,
    }
  }
}
