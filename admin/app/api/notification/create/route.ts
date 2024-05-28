import { handleError } from '@/utils/common'
import { getElasticClient } from '@/utils/elastic'
import { NextRequest, NextResponse } from 'next/server'
import {
  createIndexIfNotExists,
  createNotificationRequestSchema,
} from '../common'
import { DocRef, generateDocId } from '@/libs/firebase/firestore'
import { Timestamp, setDoc } from 'firebase/firestore'
import { addFieldsCreate } from '@/utils/firestore'
import { ELASTIC_INDEX, STATUS_NOTIFICATION } from '@/constants/common'

export async function POST(request: NextRequest) {
  try {
    const [body, elastic] = await Promise.all([
      request.json(),
      getElasticClient(),
    ])

    await createIndexIfNotExists(elastic)

    const [data, id] = await Promise.all([
      createNotificationRequestSchema.validate(body),
      generateDocId(),
    ])

    await Promise.all([
      setDoc(
        DocRef.notification(id),
        addFieldsCreate({
          ...data,
          sentAt: Timestamp.fromDate(data.sentAt),
          status: STATUS_NOTIFICATION.PUBLISHED,
        }),
      ),
      elastic.index({
        index: ELASTIC_INDEX.notifications,
        id,
        document: addFieldsCreate(
          {
            ...data,
            sentAt: data.sentAt.getTime(),
            status: STATUS_NOTIFICATION.PUBLISHED,
          },
          true,
        ),
      }),
    ])

    return NextResponse.json({ id })
  } catch (error) {
    return handleError(error)
  }
}
