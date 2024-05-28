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

    const addressesSnapshot = await getDocs(
      query(ColRef.addresses, where(documentId(), '==', id)),
    )

    const detailAddress = getDocIdWithData(addressesSnapshot.docs[0])

    return NextResponse.json(detailAddress)
  } catch (error) {
    return handleError(error)
  }
}
