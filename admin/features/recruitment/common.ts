import { Address, Name } from '@/constants/model'
import { Timestamp } from 'firebase/firestore'

export type LeadersWantedProjects = {
  type: string
  target: string[]
  organizationName: string
  applyForProject: string
  eventType: string
  eventName: string
  gender: string
  recruitment: number
  workplace: Address
  workingHours: any
  activityDescription: string
  desiredGender: string
  desiredAge: string[]
  desiredQualifications: string
  desiredTalent: string
  desiredSalary: string
  desiredNote: string
  name: Name
  position: string
  phoneNumber: string
  email: string
  status: string
  memo: string
  isPublish?: boolean
  isChecked: boolean
  createdAt?: Timestamp
  updatedAt?: Timestamp
}

export const TARGET_OPTIONS = [
  {
    label: '小学生',
    value: '小学生',
  },
  {
    label: '中学生',
    value: '中学生',
  },
  {
    label: '高校生',
    value: '高校生',
  },
  {
    label: '大学生・一般',
    value: '大学生・一般',
  },
]

export const RECRUITMENT_SCHOOL_OPTIONS = [
  {
    label: '学 校',
    value: '学 校',
  },
  {
    label: '合同チーム',
    value: '合同チーム',
  },
  {
    label: '地域クラブ',
    value: '地域クラブ',
  },
]

export const GENDER_UPDATE_OPTIONS = [
  {
    label: '男子',
    value: '男子',
  },
  {
    label: '女子',
    value: '女子',
  },
  {
    label: '男女',
    value: '男女',
  },
]

export const IS_PUBLISH_OPTIONS = [
  {
    label: '掲載中',
    value: true,
  },
  {
    label: '非掲載',
    value: false,
  },
]

export const GENDER_LIST_OPTIONS = [
  {
    label: '男性',
    value: '男子',
  },
  {
    label: '女性',
    value: '女子',
  },
  {
    label: 'その他',
    value: '男女',
  },
]

export const REQUIRED_FIELDS = [
  'type',
  'organizationName',
  'applyForProject',
  'eventType',
  'eventName',
  'gender',
  'recruitment',
  'activityDescription',
  'desiredGender',
  'desiredAge',
  'desiredSalary',
  'email',
  'confirmEmail',
  'workingHours',
  'workplace',
]
