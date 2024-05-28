// 3. 認証コードの生成と保存、認証コードのメール送信
import { NextApiRequest, NextApiResponse } from 'next'
import admin from 'firebase-admin'
import sgMail from '@sendgrid/mail'
import { EMAIL_TEMPLATE } from '@/utils/emailTemplate'

if (!admin.apps.length) {
  admin.initializeApp()
}

const db = admin.firestore()
sgMail.setApiKey(process.env.SENDGRID_API_KEY as string)

export default async function handler(req: NextApiRequest, res: NextApiResponse) {
  if (req.method !== 'POST') {
    return res.status(405).json({ message: 'Method not allowed.' })
  }

  try {
    const { email, systemName } = req.body

    await sgMail.send({
      to: email,
      from: `${systemName}<support@spocul-bank.jp>`,
      subject: `認証コード通知【${systemName}】`,
      html: EMAIL_TEMPLATE.sendVerificationCode({ code: await createVerificationCode(email), systemName }),
    })

    return res.status(201).json({
      message: '認証コードを送信しました。',
    })
  } catch (error: unknown) {
    console.error(error)
    return res.status(500).json({ message: '認証コードの発行に失敗しました。', error })
  }
}

/**
 * 認証コードを作成してDBに保存する
 */
async function createVerificationCode(email: string) {
  const code = generateRandomFourDigitString()
  const verificationCode = {
    createdAt: admin.firestore.FieldValue.serverTimestamp(),
    updatedAt: admin.firestore.FieldValue.serverTimestamp(),
    expiredAt: new Date(new Date().getTime() + 600000),
    code,
    isUsed: false,
  }
  await db.collection('verificationCodes').doc(email).set(verificationCode)

  return code
}

/**
 * 4桁のランダムな数字の文字列
 */
function generateRandomFourDigitString(): string {
  return (Math.floor(Math.random() * 9000) + 1000).toString()
}
