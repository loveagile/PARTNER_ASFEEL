import { NextApiRequest, NextApiResponse } from 'next'
import admin from 'firebase-admin'
import sgMail from '@sendgrid/mail'

sgMail.setApiKey(process.env.SENDGRID_API_KEY as string)
if (!admin.apps.length) {
  admin.initializeApp()
}

export default async function handler(req: NextApiRequest, res: NextApiResponse) {
  if (req.method === 'POST') {
    try {
      const body = await req.body
      const { userUid, userId, userName, email, systemName } = body
      const db = admin.firestore()

      // Firestoreに削除フラグを立てる
      await db
        .collection('privateUsers')
        .doc(userId)
        .update({
          isDeletedAccount: true,
          deletedAt: admin.firestore.FieldValue.serverTimestamp(),
          name: {
            sei: '削除されたユーザー',
            mei: '',
            seiKana: 'サクジョサレタユーザー',
            meiKana: '',
          },
        })

      // Firebase Authからユーザーを削除する
      await admin.auth().deleteUser(userUid)

      const content = `
      <!DOCTYPE html>
      <html lang="ja">
      <head>
          <meta charset="UTF-8">
          <meta name="viewport" content="width=device-width, initial-scale=1.0">
          <title>Account Deletion Confirmation</title>
          <style>
              body {
                  font-family: 'Arial', sans-serif;
                  line-height: 1.6;
              }
              .container {
                  max-width: 600px;
                  margin: 0 auto;
                  padding: 20px;
                  border: 1px solid #e0e0e0;
                  background-color: #fff;
              }
              .footer {
                  margin-top: 20px;
                  font-size: 0.9em;
                  color: #888;
              }
              .divider {
                  margin: 20px 0;
                  border-top: 1px solid #e0e0e0;
              }
          </style>
      </head>
      <body>
          <div class="container">
              <p>${userName} 様</p>
              <p>アカウントの削除が完了しました。</p>
              <p>これまでのご協力ありがとうございました。</p>

              <div class="divider"></div>
              <p class="footer">本メールは送信専用メールアドレスから配信されています。<br>
                ご返信頂いても対応できませんので、あらかじめご了承ください。</p>
              <div class="divider"></div>
  
              <p>【AS-FEEL】</p>
          </div>
      </body>
      </html>
      `
      await sgMail.send({
        to: email,
        from: `${systemName}<support@spocul-bank.jp>`,
        subject: `アカウントの削除が完了しました【${systemName}】`,
        html: content,
      })

      return res.status(200).json({ message: 'success' })
    } catch (error) {
      throw error
    }
  }
}
