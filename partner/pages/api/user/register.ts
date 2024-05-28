// 6. 認証コードの検証とアカウント作成、カスタムトークンの発行
import { NextApiRequest, NextApiResponse } from 'next'
import admin from 'firebase-admin'
import { Prefecture, PrivateUser } from '@/models'

if (!admin.apps.length) {
  admin.initializeApp()
}

const db = admin.firestore()

interface LatestUserOfPrefecture {
  lastId: string
  updatedAt: admin.firestore.FieldValue
}

export default async function handler(req: NextApiRequest, res: NextApiResponse) {
  if (req.method !== 'POST') {
    return res.status(405).json({ message: 'Method not allowed.' })
  }

  const { userInfo } = req.body
  if (!userInfo) {
    return res.status(400).json({ message: 'Email and code are required.' })
  }

  try {
    // アカウントの作成（Firebase Authentication）
    const userRecord = await admin.auth().createUser({ email: userInfo.email })

    // アカウントの作成（Firestore）
    await createPrivateUser(userRecord, userInfo)

    // カスタムトークンの発行
    const customToken = await admin.auth().createCustomToken(userRecord.uid)

    return res.status(201).json({
      token: customToken,
      message: 'アカウントを作成しました。カスタムトークンを返します。',
    })
  } catch (error: unknown) {
    console.error(error)
    return res.status(500).json({ message: 'アカウントの作成に失敗しました。', error })
  }
}

/**
 * アカウント作成（Firestore）
 */
async function createPrivateUser(userRecord: admin.auth.UserRecord, userInfo: PrivateUser) {
  const prefectureCode = await getPrefectureCode(userInfo.address.prefecture)

  return db.runTransaction(async (transaction) => {
    const latestUserRef = db.collection('latestUserOfPrefectures').doc(prefectureCode)
    const latestUserData = await transaction.get(latestUserRef)

    const nextId = getNextId(prefectureCode, latestUserData as admin.firestore.DocumentSnapshot<LatestUserOfPrefecture>)
    const newUserRef = db.collection('privateUsers').doc(userRecord.uid)

    transaction.set(
      newUserRef,
      {
        ...userInfo,
        userIdOfPrefecture: nextId,
        birthday: new admin.firestore.Timestamp(userInfo.birthday.seconds, userInfo.birthday.nanoseconds),
        createdAt: admin.firestore.FieldValue.serverTimestamp(),
        updatedAt: admin.firestore.FieldValue.serverTimestamp(),
      },
      {
        merge: true,
      },
    )

    transaction.set(
      latestUserRef,
      {
        lastId: nextId,
        updatedAt: admin.firestore.FieldValue.serverTimestamp(),
      },
      { merge: true },
    )

    return nextId
  })
}

/**
 * prefectureCodeを取得
 */
async function getPrefectureCode(prefectureName: string) {
  const prefectureRef = db.collection('prefectures').where('prefecture', '==', prefectureName)
  const prefectureSnapshot = await prefectureRef.get()
  if (prefectureSnapshot.empty) {
    throw new Error(`Prefecture name ${prefectureName} does not exist.`)
  }

  const data = prefectureSnapshot.docs[0].data() as Prefecture
  return data.index
}

/**
 * 最新のユーザーIDを取得
 */
function getNextId(
  prefectureCode: string,
  latestUserData: admin.firestore.DocumentSnapshot<LatestUserOfPrefecture>,
): string {
  // MEMO: その都道府県にユーザーがいない場合は、000001からスタートする
  if (!latestUserData.exists) {
    return `${prefectureCode}000001`
  }

  const lastId = latestUserData.data()!.lastId
  return incrementLastSixDigits(lastId)
}

/**
 * 下6桁を1加算したIDを返す
 */
function incrementLastSixDigits(id: string): string {
  if (id.length !== 8) {
    throw new Error('Invalid ID length. ID must be 8 characters long.')
  }

  // 上位2桁（都道府県コード）を取得
  const prefectureCode = id.substring(0, 2)

  // 下6桁を取得
  const lastSixDigits = id.substring(2)

  // 下6桁を数値に変換し、1を加算
  const incremented = Number(lastSixDigits) + 1

  // 新しい下6桁を生成（6桁未満の場合は0でパディング）
  const newLastSixDigits = incremented.toString().padStart(6, '0')

  // 新しいIDを返す
  return prefectureCode + newLastSixDigits
}
