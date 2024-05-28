import { FieldValue, Timestamp } from 'firebase/firestore'
import { Name, Address, OfficeHourType } from '@/types'

export class EventProject {
  id?: string
  createdAt: FieldValue | Timestamp
  updatedAt: FieldValue | Timestamp
  title: string
  subTitle: string
  organizer: string
  schoolName: string[]
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
  confirmEmail: string
  status: string
  memo: string
  deletedAt?: Timestamp
  officeHourType: string

  constructor(
    id: string,
    createdAt: Timestamp,
    updatedAt: Timestamp,
    title: string,
    subTitle: string,
    organizer: string,
    schoolName: string[],
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
    confirmEmail: string,
    status: string,
    memo: string,
    deletedAt: Timestamp,
    officeHourType: string
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
    this.confirmEmail = confirmEmail
    this.status = status
    this.memo = memo
    this.deletedAt = deletedAt
    this.officeHourType = officeHourType
  }
}
