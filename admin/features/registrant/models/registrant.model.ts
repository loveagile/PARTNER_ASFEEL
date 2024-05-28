import { PaginationInfo } from '@/constants/model'
import { Timestamp } from 'firebase/firestore'

export interface Registrant {
  id: string
  userName: string
  clubs: string[]
  age: number
  gender: string
  occupation: string
  organization: string
  phoneNumber: string
  createdAt: Timestamp
  updatedAt: Timestamp
  userIdOfPrefecture: string
}

export interface RegistrantDetail {
  id: string
  gender: string
  createdAt: Timestamp
  updatedAt: Timestamp
  avatar: string
  userName: string
  teacherLicenseNote: string
  otherLicense: boolean
  hasDriverLicense: boolean
  experience: boolean
  birthday: Timestamp
  address?: {
    prefecture?: string // prefecture_id
    zip?: string
    city?: string
    address1?: string
    address2?: string
  }
  clubs?: IClubTypes[]
  areasOfActivity: ICity[]
  area: Record<string, string[]>
  email?: string
  confirmEmail?: string
  experienceNote?: string
  isDeletedAccount?: boolean
  isSuspended?: boolean
  name?: {
    mei?: string
    sei?: string
    meiKana?: string
    seiKana?: string
  }
  occupation?: {
    type?: string
    organization?: string
    faculty?: string
    grade?: string
  }
  officeHours?: IOfficeHours
  otherLicenseNote?: string
  phoneNumber?: string
  questionsForPrefecture: {
    id: string
    prefecture: string
    question: string
    answer: string
  }[]
  subscribeEmail: string
  teacherLicenseStatus: string
  isExpeditionPossible: string
  career: ICareer[]
  pr: string
  precautions: string
  userIdOfPrefecture: string
}

export interface RegistrantUpdate {
  id: string
  address: {
    prefecture: string
    zip: string
    city: string
    address1: string
    address2: string
  }
  areasOfActivity: string[]
  birthday: string
  career: {
    termOfStart: string
    termOfEnd: string
    organizationName: string
  }[]
  clubs: string[]
  email: string
  confirmEmail: string
  experience: boolean
  experienceNote: string
  gender: string
  hasDriverLicense: boolean
  isSuspended: boolean
  isExpeditionPossible: string
  name: {
    mei: string
    sei: string
    meiKana: string
    seiKana: string
  }
  occupation: {
    type: string
    organization: string
    faculty: string
    grade: string
  }
  officeHours: IOfficeHours
  otherLicense: boolean
  otherLicenseNote?: string
  phoneNumber: string
  pr: string
  questionsForPrefecture: {
    id: string
    prefecture: string
    question: string
    answer: string
  }[]
  teacherLicenseStatus: string
  teacherLicenseNote: string
  // elastic
  club?: Record<string, string[]>
  age?: number
  type?: string
  organization?: string
  teacherLicenseState: boolean
  isExpeditionPossibleBool: boolean
  precautions: string
}

export enum TeacherLicenseStatus {
  'having' = 'あり',
  'nothing' = 'なし',
  'scheduledAcquisition' = '取得予定',
}

export enum IsExpeditionPossible {
  'possible' = '可能',
  'notPossible' = '不可',
  'negotiable' = '要相談',
}

export interface ICareer {
  termOfStart: Timestamp
  termOfEnd: Timestamp
  organizationName: string
}

export interface IOfficeHours {
  monday?: ('am' | 'pm')[]
  tuesday?: ('am' | 'pm')[]
  wednesday?: ('am' | 'pm')[]
  thursday?: ('am' | 'pm')[]
  friday?: ('am' | 'pm')[]
  saturday?: ('am' | 'pm')[]
  sunday?: ('am' | 'pm')[]
}

export interface ListRegistrantsResponse {
  data: Registrant[]
  pagination: PaginationInfo
}

export interface IClubTypes {
  id: string
  updatedAt: Timestamp
  largeCategory: string
  isPublish: boolean
  name: string
  mediumCategory: string
  createdAt: Timestamp
}

export interface ICity {
  id: string
  updatedAt: Timestamp
  prefecture: string
  city: string
  area: string
  createdAt: Timestamp
  zip: string
}

export interface IArea {
  id: string
  updatedAt: Timestamp
  prefecture: string
  area: string
  createdAt: Timestamp
  zip: string
}

export interface IPrefecture {
  id: string
  updatedAt: Timestamp
  prefecture: string
  createdAt: Timestamp
  zip: string
}
