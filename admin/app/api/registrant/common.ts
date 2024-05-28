import { array, boolean, mixed, object, string } from 'yup'
import { Client } from '@elastic/elasticsearch'

import { ELASTIC_INDEX } from '@/constants/common'
import { ErrorValidation } from '@/constants/error'

export const createIndexIfNotExists = async (elastic: Client) => {
  const indexExists = await elastic.indices.exists({
    index: ELASTIC_INDEX.privateUsers,
  })

  if (!indexExists) {
    await elastic.indices.create({
      index: ELASTIC_INDEX.privateUsers,
      body: {
        mappings: {
          properties: {
            id: { type: 'text', analyzer: 'kuromoji' },
            userName: { type: 'text', analyzer: 'kuromoji' },
            gender: { type: 'text', analyzer: 'kuromoji' },
            type: { type: 'text', analyzer: 'kuromoji' },
            organization: { type: 'text', analyzer: 'kuromoji' },
          },
        },
      },
    })
  }
}

export const updateRegistrantSchema = object({
  id: string().required(),
  name: object({
    sei: string().required(),
    mei: string().required(),
    seiKana: string().required(),
    meiKana: string().required(),
  }),
  isSuspended: boolean(),
  gender: mixed().oneOf(['male', 'female', 'other']).required(),
  occupation: object({
    type: mixed()
      .oneOf([
        '大学生',
        '会社員',
        '自営業/個人事業',
        'その他',
        '教員',
        '公務員（教員以外）',
        '専業主婦(夫)',
      ])
      .required(),
    organization: string(),
    faculty: string(),
    grade: string(),
  }),
  phoneNumber: string().required(),
  email: string().required(),
  birthday: string(),
  address: object({
    zip: string().required(),
    prefecture: string().required(),
    city: string().required(),
    address1: string(),
    address2: string(),
  }),
  officeHours: object({
    monday: array()
      .of(mixed().oneOf(['am', 'pm']))
      .required(),
    tuesday: array()
      .of(mixed().oneOf(['am', 'pm']))
      .required(),
    wednesday: array()
      .of(mixed().oneOf(['am', 'pm']))
      .required(),
    thursday: array()
      .of(mixed().oneOf(['am', 'pm']))
      .required(),
    friday: array()
      .of(mixed().oneOf(['am', 'pm']))
      .required(),
    saturday: array()
      .of(mixed().oneOf(['am', 'pm']))
      .required(),
    sunday: array()
      .of(mixed().oneOf(['am', 'pm']))
      .required(),
  }),
  isExpeditionPossible: mixed().oneOf([
    'possible',
    'notPossible',
    'negotiable',
  ]),
  experience: boolean(),
  teacherLicenseStatus: mixed().oneOf([
    'having',
    'nothing',
    'scheduledAcquisition',
  ]),
  teacherLicenseNote: string(),
  otherLicense: boolean(),
  otherLicenseNote: string(),
  hasDriverLicense: boolean(),
  pr: string(),
  questionsForPrefecture: array().of(
    object({
      id: string(),
      prefecture: string(),
      question: string(),
      answer: string(),
    }),
  ),
  career: array().of(
    object({
      organizationName: string(),
      termOfStart: string(),
      termOfEnd: string(),
    }),
  ),
  clubs: array().of(string()),
  areasOfActivity: array().of(string()),
  precautions: string(),
})

export const importCsvSchema = array().of(
  object({
    sei: string().required(ErrorValidation.REQUIRED.message),
    mei: string().required(ErrorValidation.REQUIRED.message),
    seiKana: string()
      .matches(
        ErrorValidation.KANA_ONLY.regex,
        ErrorValidation.KANA_ONLY.message,
      )
      .required(ErrorValidation.REQUIRED.message),
    meiKana: string()
      .matches(
        ErrorValidation.KANA_ONLY.regex,
        ErrorValidation.KANA_ONLY.message,
      )
      .required(ErrorValidation.REQUIRED.message),
    email: string()
      .matches(
        ErrorValidation.INVALID_EMAIL.regex,
        ErrorValidation.EMAIL.message,
      )
      .required(ErrorValidation.REQUIRED.message),
    organization: string(),
  }),
)
