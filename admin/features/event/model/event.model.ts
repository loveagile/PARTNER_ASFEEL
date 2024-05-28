import { Timestamp } from 'firebase/firestore'

export interface ITimestampElastic {
  seconds: number
  nanoseconds: number
}

export interface EventElastic {
  id: string
  title: string
  schoolName: string
  gender: string
  organizer: string
  status: string
  createdAt: ITimestampElastic
  recruitCount: number
  adoptCount: number
  selectCount: number
  candidate: boolean
  message: boolean

  // new
  isChecked: boolean // 1 - 0 for boolean
}

export interface EventElasticUpdated extends Partial<Omit<EventElastic, 'id'>> {
  startedAt?: ITimestampElastic
  finishedAt?: ITimestampElastic
}

export interface Event {
  id: string
  createdAt: Timestamp
  updatedAt: Timestamp
  title: string
  organizer: string
  schoolName: string[]
  numberOfApplicants: string // = recruitment.recruitment
  workplace: {
    prefecture: string
    zip: string
    city: string
    address1: string
    address2?: string
  }
  officeHours: {
    date: {
      seconds: number
      nanoseconds: number
    }
    start: { hour: string; min: string }
    end: { hour: string; min: string }
  }[]
  officeHoursNote: string
  jobDescription: string // = recruitment.activityDescription
  gender: string // = recruitment.desiredGender
  people?: string
  salary: string // = recruitment.desiredSalary
  note?: string
  name: {
    mei?: string
    sei?: string
    meiKana?: string
    seiKana?: string
  }
  position: string
  address: {
    prefecture: string
    zip: string
    city: string
    address1: string
    address2?: string
  }
  phoneNumber: string
  email: string
  status: string
  memo: string
  isChecked: boolean
  isPublish?: boolean
  deletedAt: Timestamp
}
