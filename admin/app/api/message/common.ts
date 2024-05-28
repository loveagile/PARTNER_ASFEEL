import { PROJECT_TYPE } from '@/constants/common'
import * as yup from 'yup'

export const sendMessageSchema = yup
  .object()
  .shape({
    messageRoomId: yup.string().required(),
    messages: yup
      .array()
      .of(
        yup.object().shape({
          type: yup.string().required(),
          text: yup.string(),
          senderId: yup.string().required(),
          projectId: yup.string(),
          fileUrl: yup
            .array()
            .of(
              yup.object().shape({
                fileName: yup.string(),
                fileUrl: yup.string(),
              }),
            )
            .nullable(),
        }),
      )
      .required(),
  })
  .required()

export const createMessageRoomSchema = yup
  .object()
  .shape({
    memberIds: yup.array().of(yup.string().required()).required(),
    projectType: yup
      .mixed<PROJECT_TYPE>()
      .oneOf(Object.values(PROJECT_TYPE))
      .required(),
    projectId: yup.string().required(),
    userId: yup.string().required(),
  })
  .required()
