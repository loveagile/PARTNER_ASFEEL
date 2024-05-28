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
import { createQuestionRequestSchema } from '../common'

export async function PUT(request: NextRequest) {
  try {
    const [body, elastic] = await Promise.all([
      request.json(),
      getElasticClient(),
    ])

    const { id: questionDocId, ...questionData } =
      await createQuestionRequestSchema.validate(body)

    if (!questionDocId) {
      throw ErrorValidation.VALIDATE_ERROR.message
    }

    const queryCurrentQuestion = query(
      ColRef.questions,
      where(documentId(), '==', questionDocId),
    )

    const currentQuestionSnap = await getDocs(queryCurrentQuestion)

    if (currentQuestionSnap.docs.length === 0) {
      throw ErrorValidation.FORBIDDEN.message
    }

    const currentQuestion = getDocIdWithData(currentQuestionSnap.docs[0])

    await Promise.all([
      updateDoc(
        DocRef.question(currentQuestion.id),
        addFieldsUpdate(questionData),
      ),
      elastic.update({
        index: ELASTIC_INDEX.questions,
        id: currentQuestion.id,
        doc: addFieldsUpdate(questionData, true),
      }),
    ])

    return NextResponse.json({ id: currentQuestion.id })
  } catch (error) {
    return handleError(error)
  }
}
