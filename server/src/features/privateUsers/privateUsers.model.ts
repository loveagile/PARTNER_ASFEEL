import { Timestamp } from 'firebase-admin/firestore'
import { ExpeditionPossible, Gender, TeacherLicenseStatus } from '../../enums'
import {
  Address,
  AreaOfActivity,
  Career,
  Name,
  Occupation,
  QuestionsForPrefecture,
  ScheduleType,
} from '../../types'

export class PrivateUser {
  id?: string
  createdAt: Timestamp
  updatedAt: Timestamp
  email: string
  confirmEmail?: string
  name: Name
  gender: string
  occupation: Occupation
  birthday: Timestamp
  address: Address
  phoneNumber: number
  clubs: string[]
  areasOfActivity: string[]
  areaNotes?: AreaOfActivity[]
  officeHours?: ScheduleType
  isExpeditionPossible?: string
  experience?: string
  experienceNote?: string
  teacherLicenseStatus?: string
  teacherLicenseNote?: string
  otherLicense?: string
  otherLicenseNote?: string
  hasDriverLicense?: string
  pr?: string
  questionsForPrefecture?: QuestionsForPrefecture[]
  career?: Career[]
  subscribeEmail: string
  isSuspended: boolean
  isDeletedAccount: boolean
  avatar: string
  userIdOfPrefecture: string

  constructor(
    createdAt: Timestamp,
    updatedAt: Timestamp,
    email: string,
    confirmEmail: string,
    name: Name,
    gender: Gender,
    occupation: Occupation,
    birthday: Timestamp,
    address: Address,
    phoneNumber: number,
    clubs: string[],
    areasOfActivity: string[],
    areaNotes: AreaOfActivity[],
    officeHours: ScheduleType,
    isExpeditionPossible: ExpeditionPossible,
    experience: string,
    experienceNote: string,
    teacherLicenseStatus: TeacherLicenseStatus,
    teacherLicenseNote: string,
    otherLicense: string,
    otherLicenseNote: string,
    hasDriverLicense: string,
    pr: string,
    questionsForPrefecture: QuestionsForPrefecture[],
    career: Career[],
    subscribeEmail: string,
    isSuspended: boolean,
    isDeletedAccount: boolean,
    avatar: string,
    userIdOfPrefecture: string
  ) {
    this.createdAt = createdAt
    this.updatedAt = updatedAt
    this.confirmEmail = confirmEmail
    this.email = email
    this.name = name
    this.gender = gender
    this.occupation = occupation
    this.birthday = birthday
    this.address = address
    this.phoneNumber = phoneNumber
    this.clubs = clubs
    this.areasOfActivity = areasOfActivity
    this.areaNotes = areaNotes
    this.officeHours = officeHours
    this.isExpeditionPossible = isExpeditionPossible
    this.experience = experience
    this.experienceNote = experienceNote
    this.teacherLicenseStatus = teacherLicenseStatus
    this.teacherLicenseNote = teacherLicenseNote
    this.otherLicense = otherLicense
    this.otherLicenseNote = otherLicenseNote
    this.hasDriverLicense = hasDriverLicense
    this.pr = pr
    this.questionsForPrefecture = questionsForPrefecture
    this.career = career
    this.subscribeEmail = subscribeEmail
    this.isSuspended = isSuspended
    this.isDeletedAccount = isDeletedAccount
    this.avatar = avatar
    this.userIdOfPrefecture = userIdOfPrefecture
  }
}

export interface PrivateUserForES extends PrivateUser {
  // for elasticsearch
  zip: number
  prefecture: string
  city: string
  gender: string
  type: string
  organization: string
  userName: string
  onlyClubs: string[]
  groupedClubStrings: string[]
  areasOfActivityToCities: string[]
}
