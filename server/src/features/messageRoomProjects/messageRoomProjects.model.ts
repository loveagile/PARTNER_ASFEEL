import { EventProject } from '../eventProjects/eventProjects.model'
import { LeadersWantedProject } from '../leadersWantedProjects/leadersWantedProjects.model'

export interface messageRoomProjects
  extends LeadersWantedProject,
    EventProject {
  projectId: string
  unreadCount: number
}
