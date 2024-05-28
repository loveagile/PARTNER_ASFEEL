import { ErrorValidation } from '@/constants/error'
import { Question } from '@/features/question/model/question.model'
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

    const questionsSnapshot = await getDocs(
      query(ColRef.questions, where(documentId(), '==', id)),
    )

    const detailQuestion = getDocIdWithData(
      questionsSnapshot.docs[0],
    ) as Question

    return NextResponse.json(detailQuestion)
  } catch (error) {
    return handleError(error)
  }
}
