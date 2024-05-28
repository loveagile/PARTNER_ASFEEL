import { ELASTIC_INDEX } from '@/constants/common'
import { COMMON_TEXT_PROPERTY } from '@/utils/elastic'
import { Client } from '@elastic/elasticsearch'
import { InferType, object, string } from 'yup'

export const addressMappings = {
  id: {
    type: 'text',
    fields: COMMON_TEXT_PROPERTY,
  },
  zip: {
    type: 'text',
    fields: COMMON_TEXT_PROPERTY,
  },
  address1: { type: 'text', analyzer: 'kuromoji' },
  address1Full: { type: 'text', analyzer: 'kuromoji' },
  address2: { type: 'text', analyzer: 'kuromoji' },
  area: {
    type: 'text',
    fields: COMMON_TEXT_PROPERTY,
  },
  areaText: {
    type: 'text',
    analyzer: 'kuromoji',
  },
  areaTextFull: {
    type: 'text',
    analyzer: 'kuromoji',
  },
  city: {
    type: 'text',
    fields: COMMON_TEXT_PROPERTY,
  },
  cityCode: {
    type: 'text',
    fields: COMMON_TEXT_PROPERTY,
  },
  cityText: {
    type: 'text',
    analyzer: 'kuromoji',
  },
  prefecture: {
    type: 'text',
    fields: COMMON_TEXT_PROPERTY,
  },
  prefectureCode: {
    type: 'text',
    fields: COMMON_TEXT_PROPERTY,
  },
  prefectureText: {
    type: 'text',
    analyzer: 'kuromoji',
  },
  order: {
    type: 'integer',
  },
  createdAt: { type: 'date' },
  updatedAt: { type: 'date' },
  deletedAt: { type: 'date' },
}

export const createIndexIfNotExists = async (elastic: Client) => {
  const indexExists = await elastic.indices.exists({
    index: ELASTIC_INDEX.addresses,
  })

  if (!indexExists) {
    await elastic.indices.create({
      index: ELASTIC_INDEX.addresses,
      body: {
        mappings: {
          properties: addressMappings as any,
        },
      },
    })
  }
}

export const createAddressRequestSchema = object({
  id: string(),
  zip: string().required(),
  prefecture: object({
    value: string().required(),
    label: string().required(),
    prefectureCode: string(),
  }).required(),
  area: object({
    value: string().required(),
    label: string().required(),
  }).required(),
  city: object({
    value: string().required(),
    label: string().required(),
    cityCode: string(),
  }).required(),
  address1: string().required(),
  address2: string(),
  note: string(),
})

export type CreateAddressRequestType = InferType<
  typeof createAddressRequestSchema
>
