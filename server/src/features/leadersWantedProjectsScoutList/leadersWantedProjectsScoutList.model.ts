import { Timestamp } from 'firebase-admin/firestore'
import { ProjectScoutType } from '../../enums'
import { Name } from '../../types'

export class LeadersWantedProjectsScoutList {
  id?: string
  createdAt: Timestamp
  updatedAt: Timestamp
  status: ProjectScoutType
  userId: string
  projectId: string
  deletedAt?: Timestamp

  constructor(
    id: string,
    createdAt: Timestamp,
    updatedAt: Timestamp,
    status: ProjectScoutType,
    userId: string,
    projectId: string,
    deletedAt: Timestamp
  ) {
    this.id = id
    this.createdAt = createdAt
    this.updatedAt = updatedAt
    this.status = status
    this.userId = userId
    this.projectId = projectId
    this.deletedAt = deletedAt
  }
}

export interface LeadersWantedProjectsScoutListForES
  extends LeadersWantedProjectsScoutList {
  userId: string
  projectId: string
  status: any // unsend, scouted, notinterested, ng
  userIdOfPrefecture: string
  gender: string
  age: number
  name: Name
  type: string
  organization: string
  candidateAt: Timestamp
  scoutAt: Timestamp
  email: string

  isExpeditionPossible: boolean
  experience: boolean
  experienceNote: boolean
  teacherLicenseStatus: boolean
  teacherLicenseNote: boolean
  otherLicense: boolean
  otherLicenseNote: boolean
  hasDriverLicense: boolean
}
