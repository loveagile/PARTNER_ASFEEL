import { array, boolean, mixed, number, object, string } from 'yup'
import { getDoc } from 'firebase/firestore'
import lodash from 'lodash'

import {
  COMMON_STATUS,
  ELASTIC_INDEX,
  SCOUT_STATUS,
  SELECTED_CANDIDATE_STATUS,
} from '@/constants/common'
import { Client } from '@elastic/elasticsearch'
import { DocRef, getDocIdWithData } from '@/libs/firebase/firestore'
import { ErrorValidation } from '@/constants/error'
import { EventElastic } from '@/features/event/model/event.model'

export const checkEventSchema = object({
  id: string().required(),
  isChecked: boolean().required(),
}).required()

export const checkEventExistsId = async (id: string) => {
  const queryCurrentEvent = await getDoc(DocRef.eventProject(id))

  if (!queryCurrentEvent.exists()) {
    throw ErrorValidation.FORBIDDEN.message
  }

  return getDocIdWithData(queryCurrentEvent)
}

export const checkEventElasticExistsId = async (
  elastic: Client,
  id: string,
): Promise<EventElastic> => {
  const dataElastic = await elastic.search({
    index: ELASTIC_INDEX.eventProjects,
    query: {
      match: {
        id,
      },
    },
    size: 1,
  })

  const eventElastic = lodash.get(dataElastic, 'hits.hits.[0]._source')

  if (!eventElastic) {
    throw ErrorValidation.FORBIDDEN.message
  }

  return eventElastic
}

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

export const scoutCandidateSchema = object({
  projectId: string().required(),
  scoutIds: array().of(string().required()).required(),
  status: mixed<SCOUT_STATUS>().oneOf(Object.values(SCOUT_STATUS)).required(),
}).required()

export const updateEventSchema = object({
  id: string().required(),
  title: string().required(),
  organizer: string().required(),
  schoolName: array().of(string()).required(),
  numberOfApplicants: number().required(),
  workplace: object({
    zip: string().required(),
    prefecture: string().required(),
    city: string().required(),
    address1: string(),
    address2: string(),
  }),
  officeHours: array().of(
    object({
      date: string().required(),
      start: object({
        hour: string().matches(ErrorValidation.VALIDATE_NUMBER_HOUR.regex),
        min: string().matches(ErrorValidation.VALIDATE_NUMBER_MINUTE.regex),
      }),
      end: object({
        hour: string().matches(ErrorValidation.VALIDATE_NUMBER_HOUR.regex),
        min: string().matches(ErrorValidation.VALIDATE_NUMBER_MINUTE.regex),
      }),
    }),
  ),
  officeHoursNote: string(),
  jobDescription: string().required(),
  gender: mixed().oneOf(['男性', '女性', 'どちらでも']).required(),
  people: string(),
  salary: string().required(),
  note: string(),
  name: object({
    sei: string().required(),
    mei: string().required(),
    seiKana: string().required(),
    meiKana: string().required(),
  }),
  position: string(),
  address: object({
    zip: string().required(),
    prefecture: string().required(),
    city: string().required(),
    address1: string(),
    address2: string(),
  }),
  phoneNumber: string().required(),
  email: string().required(),
})

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
