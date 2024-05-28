import { ELASTIC_INDEX } from '@/constants/common'
import { Client } from '@elastic/elasticsearch'
import { InferType, array, date, object, string } from 'yup'

export const createIndexIfNotExists = async (elastic: Client) => {
  const indexExists = await elastic.indices.exists({
    index: ELASTIC_INDEX.notifications,
  })

  if (!indexExists) {
    await elastic.indices.create({
      index: ELASTIC_INDEX.notifications,
      body: {
        mappings: {
          properties: {
            title: { type: 'text', analyzer: 'kuromoji' },
            sentAt: { type: 'date' },
            createdAt: { type: 'date' },
            updatedAt: { type: 'date' },
            deletedAt: { type: 'date' },
          },
        },
      },
    })
  }
}

export const createNotificationRequestSchema = object({
  id: string(),
  prefecture: string().required(),
  cities: array().of(string().required()),
  sentAt: date().required(),
  title: string().required(),
  url: string().required(),
  status: string(),
})

export type CreateNotificationRequestType = InferType<
  typeof createNotificationRequestSchema
>
