import { Timestamp } from 'firebase-admin/firestore'
import { Address, Name, OfficeHourType } from '../../types'

export class EventProject {
  id?: string
  createdAt: Timestamp
  updatedAt: Timestamp
  title: string
  subTitle: string
  organizer: string
  schoolName: string
  numberOfApplicants: number
  workplace: Address
  officeHours: OfficeHourType[]
  officeHoursNote: string
  jobDescription: string
  gender: string
  people?: string
  salary: string
  note?: string
  name: Name
  position?: string
  address: Address
  phoneNumber: number
  email: string
  status: string
  memo: string
  deletedAt?: Timestamp

  constructor(
    id: string,
    createdAt: Timestamp,
    updatedAt: Timestamp,
    title: string,
    subTitle: string,
    organizer: string,
    schoolName: string,
    numberOfApplicants: number,
    workplace: Address,
    officeHours: OfficeHourType[],
    officeHoursNote: string,
    jobDescription: string,
    gender: string,
    people: string,
    salary: string,
    note: string,
    name: Name,
    position: string,
    address: Address,
    phoneNumber: number,
    email: string,
    status: string,
    memo: string,
    deletedAt: Timestamp
  ) {
    this.id = id
    this.createdAt = createdAt
    this.updatedAt = updatedAt
    this.title = title
    this.subTitle = subTitle
    this.organizer = organizer
    this.schoolName = schoolName
    this.numberOfApplicants = numberOfApplicants
    this.workplace = workplace
    this.officeHours = officeHours
    this.officeHoursNote = officeHoursNote
    this.jobDescription = jobDescription
    this.gender = gender
    this.people = people
    this.salary = salary
    this.note = note
    this.name = name
    this.position = position
    this.address = address
    this.phoneNumber = phoneNumber
    this.email = email
    this.status = status
    this.memo = memo
    this.deletedAt = deletedAt
  }
}

export interface EventProjectForES extends EventProject {
  startedAt: Timestamp
  finishedAt: Timestamp
  adoptCount: number
  selectCount: number
  recruitCount: number
  message: boolean
  candidate: boolean
}
