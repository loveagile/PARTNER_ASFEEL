import { ELASTIC_INDEX } from '@/constants/common'
import { DocRef, generateDocId } from '@/libs/firebase/firestore'
import { handleError } from '@/utils/common'
import { getElasticClient } from '@/utils/elastic'
import { addFieldsCreate } from '@/utils/firestore'
import { setDoc } from 'firebase/firestore'
import { NextRequest, NextResponse } from 'next/server'
import { createIndexIfNotExists, createQuestionRequestSchema } from '../common'

export async function POST(request: NextRequest) {
  try {
    const [body, elastic] = await Promise.all([
      request.json(),
      getElasticClient(),
    ])

    await createIndexIfNotExists(elastic)

    const [data, id] = await Promise.all([
      createQuestionRequestSchema.validate(body),
      generateDocId(),
    ])

    await Promise.all([
      setDoc(
        DocRef.question(id),
        addFieldsCreate({
          ...data,
          isPublish: true,
        }),
      ),
      elastic.index({
        index: ELASTIC_INDEX.questions,
        id,
        document: addFieldsCreate(
          {
            ...data,
            isPublish: true,
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
