import {
  COMMON_STATUS,
  ELASTIC_INDEX,
  SCOUT_STATUS,
  SELECTED_CANDIDATE_STATUS,
} from '@/constants/common'
import { ErrorValidation } from '@/constants/error'
import { DocRef, getDocIdWithData } from '@/libs/firebase/firestore'
import { Client } from '@elastic/elasticsearch'
import { getDoc } from 'firebase/firestore'
import { array, boolean, mixed, number, object, string } from 'yup'

export const createIndexIfNotExists = async (elastic: Client) => {
  const indexExists = await elastic.indices.exists({
    index: ELASTIC_INDEX.leadersWantedProjects,
  })

  if (!indexExists) {
    await elastic.indices.create({
      index: ELASTIC_INDEX.leadersWantedProjects,
      mappings: {
        properties: {
          eventName: { type: 'text', analyzer: 'kuromoji' },
          workplace: { type: 'text', analyzer: 'kuromoji' },
          isChecked: { type: 'integer' },
          isPublish: { type: 'integer' },
          createdAt: {
            properties: {
              nanoseconds: {
                type: 'long',
              },
              seconds: {
                type: 'long',
              },
            },
          },
          candidate: {
            type: 'integer',
          },
          message: {
            type: 'integer',
          },
        },
      },
    })
  }
}

// export type LeadersWantedProjects = {
//   type: string
//   target: string
//   organizationName: string
//   applyForProject: string
//   eventType: string
//   eventName: string
//   gender: string
//   recruitment: number
//   workplace: Address
//   workingHours: OfficeHour[]
//   activityDescription: string
//   desiredGender: string
//   desiredAge: number
//   desiredQualifications: string
//   desiredTalent: string
//   desiredSalary: string
//   desiredNote: string
//   name: Name
//   position: string
//   phoneNumber: string
//   email: string
//   status: string
//   memo: string
//   createdAt?: Timestamp
//   updatedAt?: Timestamp
// }

export const updateRecruitmentSchema = object({
  id: string().required(),
  type: string().required(),
  target: array().of(string()),
  organizationName: string().required(),
  applyForProject: string().required(),
  eventType: string().required(),
  eventName: string().required(),
  gender: string().required(),
  recruitment: number().required(),
  workplace: object({
    zip: string().required(),
    prefecture: string().required(),
    city: string().required(),
    address1: string().required(),
  }),
  workingHours: object({
    monday: array().of(string()).required(),
    tuesday: array().of(string()).required(),
    wednesday: array().of(string()).required(),
    thursday: array().of(string()).required(),
    friday: array().of(string()).required(),
    saturday: array().of(string()).required(),
    sunday: array().of(string()).required(),
    note: string(),
  }),
  activityDescription: string().required(),
  desiredGender: string().required(),
  desiredAge: array().of(string()).required(),
  desiredQualifications: string(),
  desiredTalent: string(),
  desiredSalary: string().required(),
  desiredNote: string(),
  name: object({
    sei: string().required(),
    mei: string().required(),
    seiKana: string().required(),
    meiKana: string().required(),
  }),
  position: string(),
  phoneNumber: string().required(),
  email: string().required(),
  confirmEmail: string().required(),
  status: string().required(),
  memo: string(),
  isPublish: boolean(),
})

export const modifyStatusSchema = object({
  id: string().required(),
  status: mixed()
    .oneOf([
      COMMON_STATUS.FINISH,
      COMMON_STATUS.IN_PREPARATION,
      COMMON_STATUS.IN_PUBLIC,
    ])
    .required(),
})

export const addMemoSchema = object({
  id: string().required(),
  memo: string(),
})

export const checkRecruitmentSchema = object({
  id: string().required(),
  isChecked: boolean().required(),
}).required()

export const checkExistsId = async (id: string) => {
  const queryCurrentRecruitment = await getDoc(DocRef.leadersWantedProject(id))

  if (!queryCurrentRecruitment.exists()) {
    throw ErrorValidation.FORBIDDEN.message
  }

  return getDocIdWithData(queryCurrentRecruitment)
}

export const scoutCandidateSchema = object({
  projectId: string().required(),
  scoutIds: array().of(string().required()).required(),
  status: mixed<SCOUT_STATUS>().oneOf(Object.values(SCOUT_STATUS)).required(),
}).required()

export const modifySelectionSchema = object({
  projectId: string().required(),
  usersData: array()
    .of(
      object({
        id: string().required(),
        status: mixed<SELECTED_CANDIDATE_STATUS>().oneOf(
          Object.values(SELECTED_CANDIDATE_STATUS),
        ),
        interviewDate: mixed<string | number>().nullable(),
      }).required(),
    )
    .required(),
}).required()
