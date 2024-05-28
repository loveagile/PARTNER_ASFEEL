import { ErrorValidation } from '@/constants/error'
import { InferType, boolean, object, string } from 'yup'

export const createOrganizationRequestSchema = object({
  id: string(),
  organizationId: string().required(),
  // prefecture: string().required(),
  organizationType: string().required(),
  name: string().required(),
  nameKana: string().matches(ErrorValidation.KANA_ONLY.regex).required(),
  address: object({
    id: string(),
    zip: string().required(),
    prefecture: string().required(),
    city: string().required(),
    address1: string().required(),
    address2: string(),
  }),
  phoneNumber: string().matches(ErrorValidation.NUMBER_ONLY.regex).required(),
  isSuspended: boolean(),
})

export type CreateOrganizationRequestType = InferType<
  typeof createOrganizationRequestSchema
>
