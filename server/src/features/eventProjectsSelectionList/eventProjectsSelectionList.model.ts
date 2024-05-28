import { Timestamp } from 'firebase-admin/firestore'
import { ApplyOrScout, ProjectSelectionType } from '../../enums'
import { Name } from '../../types'

export class EventProjectsSelectionList {
  id?: string
  createdAt: Timestamp
  updatedAt: Timestamp
  status: ProjectSelectionType
  userId: string
  isUnread: boolean
  applyOrScout: ApplyOrScout
  deletedAt?: Timestamp
  projectId: string

  constructor(
    id: string,
    createdAt: Timestamp,
    updatedAt: Timestamp,
    status: ProjectSelectionType,
    userId: string,
    isUnread: boolean,
    applyOrScout: ApplyOrScout,
    deletedAt: Timestamp,
    projectId: string
  ) {
    this.id = id
    this.createdAt = createdAt
    this.updatedAt = updatedAt
    this.status = status
    this.userId = userId
    this.isUnread = isUnread
    this.applyOrScout = applyOrScout
    this.deletedAt = deletedAt
    this.projectId = projectId
  }
}

export interface EventProjectsSelectionListForES
  extends EventProjectsSelectionList {
  status: any // "notstarted" | "inprogress" | "interview" | "adopted" | "notadopted" | "cancel"
  name: Name
  age: number
  gender: string
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
