import { ExpeditionPossibleEnumKeys, GenderEnumKeys, TeacherLicenseStatusEnumKeys } from '@/enums'
import { Address, AreaOfActivity, Career, Name, Occupation, QuestionsForPrefecture, ScheduleType } from '@/types'
import { Timestamp } from 'firebase/firestore'

export class PrivateUser {
  id?: string
  createdAt: Timestamp
  updatedAt: Timestamp
  email: string
  confirmEmail?: string
  name: Name
  gender: GenderEnumKeys | null
  occupation: Occupation
  birthday: Timestamp
  address: Address
  phoneNumber: number
  clubs: string[]
  areasOfActivity: string[]
  areaNotes?: AreaOfActivity[]
  officeHours?: ScheduleType
  isExpeditionPossible: ExpeditionPossibleEnumKeys | null
  experience: boolean | null
  experienceNote?: string
  teacherLicenseStatus: TeacherLicenseStatusEnumKeys | null
  teacherLicenseNote?: string
  otherLicense: boolean | null
  otherLicenseNote?: string
  hasDriverLicense: boolean | null
  pr?: string
  questionsForPrefecture?: QuestionsForPrefecture[]
  career?: Career[]
  subscribeEmail: boolean | null
  isSuspended: boolean | null
  isDeletedAccount: boolean | null
  avatar: string

  constructor(
    createdAt: Timestamp,
    updatedAt: Timestamp,
    email: string,
    confirmEmail: string,
    name: Name,
    gender: GenderEnumKeys | null,
    occupation: Occupation,
    birthday: Timestamp,
    address: Address,
    phoneNumber: number,
    clubs: string[],
    areasOfActivity: string[],
    areaNotes: AreaOfActivity[],
    officeHours: ScheduleType,
    isExpeditionPossible: ExpeditionPossibleEnumKeys | null,
    experience: boolean | null,
    experienceNote: string,
    teacherLicenseStatus: TeacherLicenseStatusEnumKeys | null,
    teacherLicenseNote: string,
    otherLicense: boolean | null,
    otherLicenseNote: string,
    hasDriverLicense: boolean | null,
    pr: string,
    questionsForPrefecture: QuestionsForPrefecture[],
    career: Career[],
    subscribeEmail: boolean | null,
    isSuspended: boolean | null,
    isDeletedAccount: boolean | null,
    avatar: string,
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
  }
}
