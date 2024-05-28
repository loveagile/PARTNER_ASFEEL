import { ErrorValidation } from '@/constants/error'
import { ColRef, DocRef, getDocIdWithData } from '@/libs/firebase/firestore'
import { handleError } from '@/utils/common'
import { documentId, getDoc, getDocs, query, where } from 'firebase/firestore'
import { NextRequest, NextResponse } from 'next/server'

export async function GET(
  request: NextRequest,
  { params }: { params: { id: string } },
) {
  try {
    const { id } = params

    if (!id) {
      throw new Error(ErrorValidation.VALIDATE_ERROR.message)
    }

    const notificationsSnapshot = await getDocs(
      query(ColRef.notifications, where(documentId(), '==', id)),
    )

    let detailNotification = getDocIdWithData(
      notificationsSnapshot.docs[0],
    ) as any

    if (detailNotification.cities?.length) {
      const citiesSnapshot = await getDocs(
        query(
          ColRef.cities,
          where(documentId(), 'in', detailNotification.cities),
        ),
      )

      const areaId = citiesSnapshot.docs.map((doc) => doc.data())?.[0]?.area

      const areaSnapshot = await getDoc(DocRef.area(areaId))
      const area = getDocIdWithData(areaSnapshot)
      detailNotification = {
        ...detailNotification,
        area: {
          label: area.area,
          value: area.id,
        },
      }
    }

    return NextResponse.json({
      ...detailNotification,
      sentAt: detailNotification.sentAt.toDate(),
    })
  } catch (error) {
    return handleError(error)
  }
}
