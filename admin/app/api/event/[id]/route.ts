import { NextRequest, NextResponse } from 'next/server'
import { documentId, getDocs, query, where } from 'firebase/firestore'

import { ErrorValidation } from '@/constants/error'
import { ColRef, getDocIdWithData } from '@/libs/firebase/firestore'
import { handleError } from '@/utils/common'

export async function GET(
  request: NextRequest,
  { params }: { params: { id: string } },
) {
  try {
    const { id } = params

    if (!id) {
      throw new Error(ErrorValidation.VALIDATE_ERROR.message)
    }

    const eventSnapshot = await getDocs(
      query(ColRef.eventProjects, where(documentId(), '==', id)),
    )

    const detailEvent = getDocIdWithData(eventSnapshot.docs[0])

    let data = {
      ...detailEvent,
      confirmEmail: detailEvent?.email,
    } as any

    return NextResponse.json(data)
  } catch (error) {
    return handleError(error)
  }
}
