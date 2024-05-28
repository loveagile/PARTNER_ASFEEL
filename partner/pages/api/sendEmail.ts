import sgMail from '@sendgrid/mail'
import { NextApiRequest, NextApiResponse } from 'next'

sgMail.setApiKey(process.env.SENDGRID_API_KEY as string)

export default async function handler(req: NextApiRequest, res: NextApiResponse) {
  if (req.method === 'POST') {
    try {
      const body = await req.body
      const { to, subject, content, systemName } = body
      const msg = {
        to,
        from: `${systemName}<support@spocul-bank.jp>`,
        subject,
        html: content,
      }

      await sgMail.send(msg)
      return res.status(200).json({ message: 'success' })
    } catch (error) {
      throw error
    }
  }
}
