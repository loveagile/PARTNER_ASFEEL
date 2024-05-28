import { ELASTIC_INDEX } from '@/constants/common'
import { ErrorValidation } from '@/constants/error'
import { appAdmin } from '@/libs/firebase/firebaseAdmin'
import { DocRef, getDocIdWithData } from '@/libs/firebase/firestore'
import { handleError } from '@/utils/common'
import { getElasticClient } from '@/utils/elastic'
import { addFieldsCreate } from '@/utils/firestore'
import { Timestamp, getDoc, setDoc } from 'firebase/firestore'
import { NextRequest, NextResponse } from 'next/server'
import {
  createCoordinatorRequestSchema,
  createIndexIfNotExists,
} from '../common'

const LENGTH_COORDINATOR_ID_OF_PREFECTURE = 8

export async function POST(request: NextRequest) {
  try {
    const [body, elastic] = await Promise.all([
      request.json(),
      getElasticClient(),
    ])

    await createIndexIfNotExists(elastic)

    const [
      {
        email,
        confirmEmail,
        currentPassword,
        newPassword,
        confirmNewPassword,
        prefectureCode,
        ...data
      },
    ] = await Promise.all([createCoordinatorRequestSchema.validate(body)])

    if (
      email !== confirmEmail ||
      newPassword !== confirmNewPassword ||
      (!newPassword && !confirmNewPassword)
    ) {
      throw ErrorValidation.VALIDATE_ERROR.message
    }

    const latestCoordinatorOfPrefecture = await getDoc(DocRef.latestCoordinatorOfPrefecture(prefectureCode))
    let latestCoordinatorIdOfPrefecture: string = latestCoordinatorOfPrefecture.exists() ? getDocIdWithData(latestCoordinatorOfPrefecture).lastId : undefined
    latestCoordinatorIdOfPrefecture = getNextId(prefectureCode, latestCoordinatorIdOfPrefecture)

    const createdUser = await appAdmin.auth().createUser({
      email: email,
      password: newPassword,
    })

    const id = createdUser.uid

    const createData = {
      ...data,
      isSuspended: false,
      notificationEmails: [email],
      parentId: data.parentId || null,
      isFirstPasswordSet: true,
      coordinatorIdOfPrefecture: latestCoordinatorIdOfPrefecture
      // authId: createdUser.uid,
    }

    await Promise.all([
      setDoc(DocRef.coordinator(id), addFieldsCreate(createData)),
      setDoc(DocRef.latestCoordinatorOfPrefecture(prefectureCode), {
        lastId: latestCoordinatorIdOfPrefecture,
        updatedAt: Timestamp.now(),
      }),
      elastic.index({
        index: ELASTIC_INDEX.coordinators,
        id,
        document: addFieldsCreate({ ...createData, id }, true),
      }),
    ])

    return NextResponse.json({ id })
  } catch (error) {
    return handleError(error)
  }
}

/**
 * 最新のユーザーIDを取得
 */
function getNextId(
  prefectureCode: string,
  latestCoordinatorIdOfPrefecture?: string,
): string {
  // MEMO: その都道府県にユーザーがいない場合は、000001からスタートする
  if (!latestCoordinatorIdOfPrefecture) {
    return `${prefectureCode}000001`
  }

  return incrementLastSixDigits(latestCoordinatorIdOfPrefecture)
}

/**
 * 下6桁を1加算したIDを返す
 */
function incrementLastSixDigits(id: string): string {
  if (id.length !== LENGTH_COORDINATOR_ID_OF_PREFECTURE) {
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
