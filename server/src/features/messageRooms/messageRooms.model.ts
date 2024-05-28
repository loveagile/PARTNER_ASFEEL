import { Timestamp } from 'firebase-admin/firestore'
import { EventProject } from '../eventProjects/eventProjects.model'
import { LeadersWantedProject } from '../leadersWantedProjects/leadersWantedProjects.model'
import { Member } from '../../types'

export class MessageRoom {
  id?: string
  createdAt: Timestamp
  updatedAt: Timestamp
  members: Member[]
  lastMessage: string
  deletedAt?: Timestamp
  projectId: string
  userId?: string
  projectType: string
  memberIds: string[]

  constructor(
    id: string,
    createdAt: Timestamp,
    updatedAt: Timestamp,
    members: Member[],
    lastMessage: string,
    deletedAt: Timestamp,
    projectId: string,
    userId: string,
    projectType: string,
    memberIds: string[]
  ) {
    this.id = id
    this.createdAt = createdAt
    this.updatedAt = updatedAt
    this.members = members
    this.lastMessage = lastMessage
    this.deletedAt = deletedAt
    this.projectId = projectId
    this.userId = userId
    this.projectType = projectType
    this.memberIds = memberIds
  }
}

export type MessageRoomType = {
  id: string
  createdAt: Timestamp
  updatedAt: Timestamp
  members: Member[]
  lastMessage: string
  deletedAt?: Timestamp | undefined
  projectId: string
  projectData: EventProject & LeadersWantedProject
  projectType: string
}

export interface MessageRoomForES extends MessageRoom {
  roomId: string
  userId: string
  projectId: string
}
