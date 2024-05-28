import { NextApiRequest, NextApiResponse } from 'next'
import admin from 'firebase-admin'
import { PREFECTURE_MAP, PREFECTURE_TYPE } from '@/constants/constant_text'

if (!admin.apps.length) {
  admin.initializeApp()
}

export default async function handler(req: NextApiRequest, res: NextApiResponse) {
  if (req.method === 'GET') {
    const db = admin.firestore()
    const { prefecture } = req.query
    if (!prefecture || Array.isArray(prefecture)) {
      return res.status(400).json({ error: 'Invalid or missing prefecture parameter' })
    }

    const prefJa = PREFECTURE_MAP[prefecture as PREFECTURE_TYPE]
    const snap = await db.collection('prefectures').where('prefecture', '==', prefJa).get()
    const prefectureId = snap.docs[0].id

    try {
      // 都道府県で絞り込み
      const snap = await db.collection('coordinators').where('prefectures', '==', prefectureId).get()

      // organizationNameに教育委員会が含まれているデータを抽出
      const coordinators = snap.docs.map((doc) => {
        return {
          id: doc.id,
          organizationName: doc.data().organizationName,
        }
      })
      const coordinatorsWithEducation = coordinators.filter((coordinator) => {
        return coordinator.organizationName.includes('教育委員会')
      })

      res.status(200).json({
        coordinators: coordinatorsWithEducation,
      })
    } catch (error) {
      console.log(error)
      res.status(500).json({ error })
    }
  } else {
    res.status(405).json({ status: 'Method not allowed' })
  }
}
