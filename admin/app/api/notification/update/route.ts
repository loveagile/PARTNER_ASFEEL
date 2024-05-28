import { ELASTIC_INDEX } from '@/constants/common'
import { ErrorValidation } from '@/constants/error'
import { ColRef, DocRef, getDocIdWithData } from '@/libs/firebase/firestore'
import { handleError } from '@/utils/common'
import { getElasticClient } from '@/utils/elastic'
import { addFieldsUpdate } from '@/utils/firestore'
import {
  documentId,
  getDocs,
  query,
  updateDoc,
  where,
} from 'firebase/firestore'
import { NextRequest, NextResponse } from 'next/server'
import { createNotificationRequestSchema } from '../common'

export async function PUT(request: NextRequest) {
  try {
    const [body, elastic] = await Promise.all([
      request.json(),
      getElasticClient(),
    ])

    const { id: notificationDocId, ...notificationData } =
      await createNotificationRequestSchema.validate(body)

    if (!notificationDocId) {
      throw ErrorValidation.VALIDATE_ERROR.message
    }

    const queryCurrentNotification = query(
      ColRef.notifications,
      where(documentId(), '==', notificationDocId),
    )

    const currentNotificationSnap = await getDocs(queryCurrentNotification)

    if (currentNotificationSnap.docs.length === 0) {
      throw ErrorValidation.FORBIDDEN.message
    }

    const currentNotification = getDocIdWithData(
      currentNotificationSnap.docs[0],
    )

    await Promise.all([
      updateDoc(
        DocRef.notification(currentNotification.id),
        addFieldsUpdate(notificationData),
      ),
      elastic.update({
        index: ELASTIC_INDEX.notifications,
        id: currentNotification.id,
        doc: addFieldsUpdate(notificationData, true),
      }),
    ])

    return NextResponse.json({ id: currentNotification.id })
  } catch (error) {
    return handleError(error)
  }
}
