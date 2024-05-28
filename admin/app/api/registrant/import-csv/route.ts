import { NextRequest, NextResponse } from 'next/server'
import sgMail from '@sendgrid/mail'
import lodash from 'lodash'

import { handleError } from '@/utils/common'
import { ErrorValidation } from '@/constants/error'
import { Timestamp, getDoc, setDoc } from 'firebase/firestore'
import { DocRef, generateDocId, getDocIdWithData } from '@/libs/firebase/firestore'
import { addFieldsCreate } from '@/utils/firestore'
import { getElasticClient } from '@/utils/elastic'

import { createIndexIfNotExists, importCsvSchema } from '../common'
import { appAdmin } from '@/libs/firebase/firebaseAdmin'
import { ELASTIC_INDEX } from '@/constants/common'

sgMail.setApiKey(process.env.SENDGRID_API_KEY as string)

const FROM_EMAIL = process.env.NEXT_PUBLIC_MAIL_FROM || 'support@spocul-bank.jp'
const LENGTH_USER_ID_OF_PREFECTURE = 8

interface privateUserDataCreated {
  sei: string
  mei: string
  seiKana: string
  meiKana: string
  email: string
  organization: string
  userIdOfPrefecture?: string
}

const CHUNK_LENGTH = 50;
// 1 cho array bắt đầu từ 0, 0 cho header
const INDEX_INC_TO_ROW = 1;

export async function POST(request: NextRequest) {
  try {
    const [{ prefecture, csvData }, elastic] = await Promise.all([
      request.json(),
      getElasticClient(),
    ])

    await createIndexIfNotExists(elastic)

    if (!prefecture || !csvData || !Array.isArray(csvData) || !csvData.length) {
      throw ErrorValidation.VALIDATE_ERROR.message
    }

    const errors: { row: number; col: number; message: string }[] = []
    const emailMap: Record<string, number[]> = {}

    const content: privateUserDataCreated[] = []
    for (let index = 0; index < csvData.length; index++) {
      content.push(convertArrayToDataImport(csvData[index]))
    }

    if (!content.length) {
      throw 'インポート情報がない！'
    }

    const validate = await validateArray(content)

    if (validate) {
      errors.push(...validate)
    }

    for (let index = 0; index < content.length; index++) {
      const element = content[index]

      if (!element.email) break

      if (emailMap[element.email]) {
        emailMap[element.email].push(index)
      } else {
        emailMap[element.email] = [index]
      }
    }

    Object.values(emailMap).forEach((emailIdx) => {
      if (emailIdx.length > 1) {
        errors.push(
          ...emailIdx.map((idx) => {
            return {
              row: idx + INDEX_INC_TO_ROW,
              col: headerMap['email'],
              message:
                'インポートファイルに重複メールアドレスが存在しています!',
            }
          }),
        )
      }
    })

    const queryUsers = await appAdmin.auth().getUsers(
      Object.keys(emailMap).map((email) => {
        return {
          email,
        }
      }),
    )

    queryUsers.users.forEach((user) => {
      const emailExist = user.email
      if (emailExist && emailExist && emailMap[emailExist]) {
        errors.push(
          ...emailMap[emailExist].map((idx) => {
            return {
              row: idx + INDEX_INC_TO_ROW,
              col: headerMap['email'],
              message: ErrorValidation.EMAIL_ALREADY_EXISTS.message,
            }
          }),
        )
      }
    })

    if (errors.length) {
      return NextResponse.json({
        errors: errors.sort((a, b) => a.row - b.row),
      })
    }

    await elastic.indices.refresh({
      index: ELASTIC_INDEX.privateUsers,
    })

    const latestUserOfPrefecture = await getDoc(DocRef.latestUserOfPrefecture(prefecture.prefectureCode))

    let latestUserIdOfPrefecture: string = latestUserOfPrefecture.exists() ? getDocIdWithData(latestUserOfPrefecture).lastId : undefined

    content.forEach(privateUser => {
      latestUserIdOfPrefecture = getNextId(prefecture.prefectureCode, latestUserIdOfPrefecture)
      privateUser.userIdOfPrefecture = latestUserIdOfPrefecture
    })

    const privateUsersChunk = lodash.chunk(content, CHUNK_LENGTH)

    for (const privateUsers of privateUsersChunk) {
      await Promise.all(
        privateUsers.map((privateUser) =>
          createPrivateUser(privateUser, appAdmin),
        ),
      )
    }

    const csvHistoryId = generateDocId()
    await Promise.all([
      setDoc(DocRef.csvHistory(csvHistoryId), {
        name: prefecture.prefecture,
        createdAt: Timestamp.now(),
        updatedAt: Timestamp.now(),
      }),
      setDoc(DocRef.latestUserOfPrefecture(prefecture.prefectureCode), {
        lastId: latestUserIdOfPrefecture,
        updatedAt: Timestamp.now(),
      })
    ])

    return NextResponse.json({ ok: true })
  } catch (error) {
    return handleError(error)
  }
}

const convertArrayToDataImport = (input: string[]) => {
  return {
    sei: lodash.get(input, '0'),
    mei: lodash.get(input, '1'),
    seiKana: lodash.get(input, '2'),
    meiKana: lodash.get(input, '3'),
    email: lodash.get(input, '4'),
    organization: lodash.get(input, '5', ''),
  }
}

const validateArray = async (
  dataToValidate: any[],
): Promise<{ row: number; col: number; message: string }[] | null> => {
  try {
    await importCsvSchema.validate(dataToValidate, { abortEarly: false })
    return null
  } catch (errors: any) {
    return errors.inner.map((error: any) => {
      return mapPathError(error.path, error.message.replace(error.path, ''))
    })
  }
}

const headerMap: Record<string, number> = {
  sei: 1,
  mei: 2,
  seiKana: 3,
  meiKana: 4,
  email: 5,
  organization: 6,
}

const mapPathError = (
  path: string,
  message: string,
): { row: number; col: number; message: string } => {
  const [row, col] = path.split('.')

  return {
    row: +row.replace(/[\[\]]/g, '') + INDEX_INC_TO_ROW,
    col: headerMap[col],
    message: message.trim(),
  }
}

const createPrivateUser = async (
  privateUserData: privateUserDataCreated,
  appAdmin: any,
) => {
  const firebaseData: any = addFieldsCreate({
    userIdOfPrefecture: privateUserData.userIdOfPrefecture,
    name: {
      ...lodash.pick(privateUserData, 'mei', 'sei', 'meiKana', 'seiKana'),
    },
    email: privateUserData.email,
    occupation: {
      organization: privateUserData.organization,
    },
    isDeletedAccount: false,
    isSuspended: false,

    address: {},
    areaNotes: [],
    career: [],
    clubs: [],
    officeHours: {
      monday: [],
      friday: [],
      saturday: [],
      sunday: [],
      thursday: [],
      tuesday: [],
      wednesday: [],
      questionsForPrefecture: [],
    },
    birthday: Timestamp.now(),
    areasOfActivity: [],
    phoneNumber: '',
    subscribeEmail: ''
  })

  const content = `${privateUserData.sei} ${privateUserData.mei} 様\n

          アカウントの登録が完了しました！
          プロフィールを入力するとマッチング可能性が高くなります。
          ${process.env.NEXT_PUBLIC_PARTNER_URL}/profile

          プロフィールを入力したら、自分に合う募集を探してみましょう！
          ${process.env.NEXT_PUBLIC_PARTNER_URL}

          ------------------------------------------------------------------\n
          本メールは送信専用メールアドレスから配信されています。
          ご返信頂いても対応できませんので、あらかじめご了承ください。

          ------------------------------------------------------------------
          【AS-FEEL】`

  const accountCreated = await appAdmin.auth().createUser({
    email: privateUserData.email,
    password: 'password',
  })

  await Promise.all([
    setDoc(DocRef.privateUser(accountCreated.uid), firebaseData),
    sgMail.send([
      {
        to: privateUserData.email,
        from: FROM_EMAIL,
        subject: `アカウント登録が完了しました【AS-FEEL】`,
        text: content,
      },
    ]),
  ])
}

/**
 * 最新のユーザーIDを取得
 */
function getNextId(
  prefectureCode: string,
  latestUserIdOfPrefecture?: string,
): string {
  // MEMO: その都道府県にユーザーがいない場合は、000001からスタートする
  if (!latestUserIdOfPrefecture) {
    return `${prefectureCode}000001`
  }

  return incrementLastSixDigits(latestUserIdOfPrefecture)
}

/**
 * 下6桁を1加算したIDを返す
 */
function incrementLastSixDigits(id: string): string {
  if (id.length !== LENGTH_USER_ID_OF_PREFECTURE) {
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
