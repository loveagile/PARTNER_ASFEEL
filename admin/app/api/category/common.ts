import { ELASTIC_INDEX } from '@/constants/common'
import { Client } from '@elastic/elasticsearch'
import { InferType, boolean, object, string } from 'yup'

export const categoryMappings = {
  id: {
    type: 'text',
    fields: {
      keyword: {
        type: 'keyword',
        ignore_above: 256,
      },
    },
  },
  largeCategory: {
    type: 'text',
    fields: {
      keyword: {
        type: 'keyword',
        ignore_above: 256,
      },
    },
  },
  mediumCategory: {
    type: 'text',
    fields: {
      keyword: {
        type: 'keyword',
        ignore_above: 256,
      },
    },
  },
  name: {
    type: 'text',
    analyzer: 'kuromoji',
  },
  order: {
    type: 'long',
  },
  isPublish: {
    type: 'boolean',
  },
  updatedAt: {
    type: 'date',
  },
  createdAt: {
    type: 'date',
  },
  deletedAt: {
    type: 'date',
  },
}

export const createIndexIfNotExists = async (elastic: Client) => {
  const indexExists = await elastic.indices.exists({
    index: ELASTIC_INDEX.categories,
  })

  if (!indexExists) {
    await elastic.indices.create({
      index: ELASTIC_INDEX.categories,
      body: {
        mappings: {
          properties: categoryMappings as any,
        },
      },
    })
  }
}

export const createCategoryRequestSchema = object({
  id: string(),
  name: string().required(),
  largeCategory: string().required(),
  mediumCategory: string().required(),
  isPublish: boolean(),
})

export type CreateCategoryRequestType = InferType<
  typeof createCategoryRequestSchema
>
