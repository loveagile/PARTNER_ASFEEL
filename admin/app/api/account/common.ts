import { boolean, object, string } from 'yup'

export const createAccountRequestSchema = object({
  id: string(),
  currentEmail: string(),
  email: string().required(),
  confirmEmail: string().required(),
  newPassword: string(),
  confirmNewPassword: string(),
  name: object({
    sei: string().required(),
    mei: string().required(),
    seiKana: string().required(),
    meiKana: string().required(),
  }).required(),
  role: string().required(),
  isPublish: boolean(),
})
