import { NextApiRequest, NextApiResponse } from 'next'
import sgMail from '@sendgrid/mail'
import { dataToEventEmailHTML, dataToProjectEmailHTML } from '@/utils/api/sendEmail'

sgMail.setApiKey(process.env.SENDGRID_API_KEY as string)
interface SendMailData {
  projectData: any
  type: string
  from: string
  systemName: string
}

export default async function handler(req: NextApiRequest, res: NextApiResponse) {
  if (req.method === 'POST') {
    const data: SendMailData = req.body
    const fromEmail = `${data.from}@spocul-bank.jp`
    const emailHtml = data.type === 'project' ? dataToProjectEmailHTML(fromEmail, data) : dataToEventEmailHTML(fromEmail, data)

    try {
      await sgMail.send({
        to: data.projectData.email,
        from: `${data.systemName}<support@spocul-bank.jp>`,
        subject: `募集依頼を送信しました【${data.systemName}】`,
        html: emailHtml,
      })
      res.status(200).json({ status: 'Email sent' })
    } catch (error) {
      console.log(error)
      console.log('sendgrid error-----------', JSON.stringify(error))

      res.status(500).json({ error })
    }
  } else {
    res.status(405).json({ status: 'Method not allowed' })
  }
}
