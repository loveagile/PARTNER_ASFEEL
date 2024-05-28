import { ELASTIC_INDEX } from '@/constants/common'
import { Client } from '@elastic/elasticsearch'
import { InferType, array, boolean, object, string } from 'yup'

export const createIndexIfNotExists = async (elastic: Client) => {
  const coordinatorsExists = await elastic.indices.exists({
    index: ELASTIC_INDEX.coordinators,
  })

  if (!coordinatorsExists) {
    await elastic.indices.create({
      index: ELASTIC_INDEX.coordinators,
      body: {
        mappings: {
          properties: {
            organizationName: {
              type: 'text',
              analyzer: 'kuromoji',
            },
            createdAt: { type: 'date' },
            updatedAt: { type: 'date' },
            deletedAt: { type: 'date' },
          },
        },
      },
    })
  }
}

export const createCoordinatorRequestSchema = object({
  id: string(),
  projectType: string().required(),
  organizationType: string().required(),
  prefectures: string().required(),
  prefectureCode: string().required(),
  cities: array().of(string().required()),
  organizationName: string().required(),
  name: object({
    sei: string().required(),
    mei: string().required(),
    seiKana: string().required(),
    meiKana: string().required(),
  }).required(),
  phoneNumber: string().required(),
  currentEmail: string(),
  email: string().required(),
  confirmEmail: string().required(),
  isSuspended: boolean(),
  parentId: string().nullable(),
  currentPassword: string(),
  newPassword: string(),
  confirmNewPassword: string(),
  isBoardOfEducation: boolean().required(),
})

export type CreateCoordinatorRequestType = InferType<
  typeof createCoordinatorRequestSchema
>
