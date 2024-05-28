import { ErrorValidation } from '@/constants/error'
import { ColRef, getDocIdWithData } from '@/libs/firebase/firestore'
import { handleError } from '@/utils/common'
import { documentId, getDocs, query, where } from 'firebase/firestore'
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

    const coordinatorsSnapshot = await getDocs(
      query(ColRef.coordinators, where(documentId(), '==', id)),
    )

    const { notificationEmails, ...data } = getDocIdWithData(
      coordinatorsSnapshot.docs[0],
    )

    let detailCoordinator: any = {
      ...data,
      email: notificationEmails[0],
      confirmEmail: notificationEmails[0],
    }

    return NextResponse.json(detailCoordinator)
  } catch (error) {
    return handleError(error)
  }
}
