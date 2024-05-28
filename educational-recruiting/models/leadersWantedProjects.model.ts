import { FieldValue, Timestamp } from 'firebase/firestore'
import { Name, Address, ScheduleType } from '@/types'

export class LeadersWantedProject {
  id?: string
  createdAt: FieldValue | Timestamp
  updatedAt: FieldValue | Timestamp
  type: string
  target: string[]
  organizationName: string
  organizationType?: string
  applyForProject: string
  eventType: string
  eventName: string
  gender: string
  recruitment: number
  workplace: Address
  workingHours: ScheduleType
  workingHoursNote: string
  activityDescription: string
  desiredGender: string
  desiredAge: string[]
  desiredQualifications: string
  desiredTalent: string
  desiredSalary: string
  desiredNote: string
  name: Name
  position: string
  phoneNumber: number
  email: string
  confirmEmail: string
  status: string
  memo: string
  deletedAt?: Timestamp

  constructor(
    id: string,
    createdAt: Timestamp,
    updatedAt: Timestamp,
    type: string,
    target: string[],
    organizationName: string,
    organizationType: string,
    applyForProject: string,
    workingHoursNote: string,
    eventType: string,
    eventName: string,
    gender: string,
    recruitment: number,
    workplace: Address,
    workingHours: ScheduleType,
    activityDescription: string,
    desiredGender: string,
    desiredNote: string,
    desiredAge: string[],
    desiredQualifications: string,
    desiredTalent: string,
    desiredSalary: string,
    name: Name,
    position: string,
    address: Address,
    phoneNumber: number,
    email: string,
    confirmEmail: string,
    status: string,
    memo: string,
    deletedAt: Timestamp,
  ) {
    this.id = id
    this.createdAt = createdAt
    this.updatedAt = updatedAt
    this.type = type
    this.target = target
    this.organizationName = organizationName
    this.organizationType = organizationType
    this.applyForProject = applyForProject
    this.eventName = eventName
    this.eventType = eventType
    this.gender = gender
    this.recruitment = recruitment
    this.workplace = workplace
    this.workingHours = workingHours
    this.workingHoursNote = workingHoursNote
    this.activityDescription = activityDescription
    this.desiredAge = desiredAge
    this.desiredGender = desiredGender
    this.desiredNote = desiredNote
    this.desiredQualifications = desiredQualifications
    this.desiredTalent = desiredTalent
    this.desiredSalary = desiredSalary
    this.name = name
    this.position = position
    this.phoneNumber = phoneNumber
    this.email = email
    this.confirmEmail = confirmEmail
    this.status = status
    this.memo = memo
    this.deletedAt = deletedAt
  }
}
