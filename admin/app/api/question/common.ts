import { ELASTIC_INDEX } from '@/constants/common'
import { Client } from '@elastic/elasticsearch'
import { InferType, object, string } from 'yup'

export const createIndexIfNotExists = async (elastic: Client) => {
  const indexExists = await elastic.indices.exists({
    index: ELASTIC_INDEX.questions,
  })

  if (!indexExists) {
    await elastic.indices.create({
      index: ELASTIC_INDEX.questions,
      body: {
        mappings: {
          properties: {
            question: { type: 'text', analyzer: 'kuromoji' },
            createdAt: { type: 'date' },
            updatedAt: { type: 'date' },
            deletedAt: { type: 'date' },
          },
        },
      },
    })
  }
}

export const createQuestionRequestSchema = object({
  id: string(),
  prefecture: string().required(),
  question: string().required(),
  status: string(),
})

export type CreateQuestionRequestType = InferType<
  typeof createQuestionRequestSchema
>
