import { ErrorValidation } from '@/constants/error'
import { Organization } from '@/features/organization/model/organization.model'
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

    const organizationsSnapshot = await getDocs(
      query(ColRef.organizations, where(documentId(), '==', id)),
    )

    const detailOrganization = getDocIdWithData(
      organizationsSnapshot.docs[0],
    ) as Organization

    return NextResponse.json(detailOrganization)
  } catch (error) {
    return handleError(error)
  }
}
