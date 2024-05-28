import { GenderEnumKeys } from '@/enums'
import { EventProject, LeadersWantedProject } from '@/models'
import { Timestamp } from 'firebase/firestore'

export type Address = {
  zip: number
  prefecture: string
  city: string
  address1: string
  address2: string
}

export type Member = {
  lastAccessedAt: Timestamp
  unreadCount: number
  userId: string
}

export type Name = {
  sei: string
  mei: string
  seiKana: string
  meiKana: string
}

export type Occupation = {
  type: string
  organization: string
  faculty?: string
  grade?: string
}

export type AreaOfActivity = {
  area: string
  note: string
}

export type OfficeHour = {
  monday: string[]
  tuesday: string[]
  wednesday: string[]
  thursday: string[]
  friday: string[]
  saturday: string[]
  sunday: string[]
  // note?: string;
}

export type Career = {
  termOfStart: Timestamp
  termOfEnd: Timestamp
  organizationName: string
}

export type Option = {
  value: string
  placeholder: boolean
  text: string
  icon: number
  size: number
  index?: string
}

export type RegisterUserInput = {
  sei: string
  mei: string
  seiKana: string
  meiKana: string
  gender: GenderEnumKeys | null
  job: string
  organization: string
  faculty: string
  grade: string
  birthday: Timestamp
  zip: number
  prefecture: string
  city: string
  address1: string
  address2: string
  phoneNumber: number
  email: string
  confirmEmail: string
}

export type ProfileUserInput = {
  sei: string
  mei: string
  seiKana: string
  meiKana: string
  gender: GenderEnumKeys | null
  job: string
  organization: string
  faculty: string
  grade: string
  birthday: Timestamp
  zip: number
  prefecture: string
  city: string
  address1: string
  address2: string
  phoneNumber: number
  email: string
  receiveMail: boolean | null
}

export type ScheduleType = {
  [key: string]: any[]
}

export type OfficeHourType = {
  date: Timestamp
  start: {
    hour: string
    min: string
  }
  end: {
    hour: string
    min: string
  }
}

export type QuestionsForPrefecture = {
  prefecture: string
  question: string
  answer: string
  id: string
}

export type ClubTypeCategoryPopulate = {
  id?: string
  createdAt: Timestamp
  updatedAt: Timestamp
  largeCategory: string
  mediumCategory: string
  name: string
  isPublish: boolean
  largeCategoryName: string
  mediumCategoryName: string
}

export type CityTypePopulate = {
  id?: string
  createdAt: Timestamp
  updatedAt: Timestamp
  zip: string
  prefecture: string
  area: string
  city: string
  prefectureName?: string
  areaName?: string
  index?: string
}

export type FileUrlType = {
  fileName: string
  fileUrl: string
}

export type MessageRoomType = {
  id: string
  createdAt: Timestamp
  updatedAt: Timestamp
  members: Member[]
  lastMessage: string
  deletedAt?: Timestamp | undefined
  projectId: string
  projectData: EventProject & LeadersWantedProject
  projectType: string
}
