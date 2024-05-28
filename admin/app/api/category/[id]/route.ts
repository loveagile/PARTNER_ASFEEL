import { ErrorValidation } from '@/constants/error'
import { Category } from '@/features/category/model/category.model'
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

    const categoriesSnapshot = await getDocs(
      query(ColRef.categories, where(documentId(), '==', id)),
    )

    const detailCategory = getDocIdWithData(
      categoriesSnapshot.docs[0],
    ) as Category

    return NextResponse.json(detailCategory)
  } catch (error) {
    return handleError(error)
  }
}
