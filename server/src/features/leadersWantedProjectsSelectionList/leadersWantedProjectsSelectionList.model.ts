import { Timestamp } from 'firebase-admin/firestore'
import { ApplyOrScout, ProjectSelectionType } from '../../enums'
import { Name } from '../../types'

export class LeadersWantedProjectsSelectionList {
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

export interface LeadersWantedProjectsSelectionListForES
  extends LeadersWantedProjectsSelectionList {
  name: Name
  age: number
  gender: string
  type: string
  organization: string
  interviewAt: Timestamp
  lastMessageAt: Timestamp
  isSetInterview: boolean
}
