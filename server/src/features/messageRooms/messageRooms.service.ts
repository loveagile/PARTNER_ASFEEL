import { Timestamp } from 'firebase-admin/firestore'
import { DocRef, getDocIdWithData } from '../../libs/firebase/firestore'
import { EventProject } from '../eventProjects/eventProjects.model'
import { LeadersWantedProject } from '../leadersWantedProjects/leadersWantedProjects.model'
import { MessageRoom, MessageRoomForES } from './messageRooms.model'

export const messageRoomsService = {
  async processMessageRoomData(data: MessageRoom) {
    const projectId = data.projectId
    const projectType = data.projectType
    const projectDoc =
      projectType === 'leader'
        ? await DocRef.leadersWantedProject(projectId).get()
        : await DocRef.eventProject(projectId).get()
    const projectData = getDocIdWithData<LeadersWantedProject | EventProject>(
      projectDoc
    )

    // Create messageRoomProject collection
    const coordinator = data.members.find(
      (member) => member.userId !== data.userId
    )
    await DocRef.messageRoomProject(projectId).set(
      {
        ...projectData,
        projectId,
        unreadCount: coordinator?.unreadCount || 0,
      },
      { merge: true }
    )

    // Create messageRoomUser collection
    const user = data.members.find((member) => member.userId === data.userId)
    const userId = data.userId!
    const userDoc = await DocRef.privateUser(userId).get()
    const userData = getDocIdWithData(userDoc)
    await DocRef.messageRoomUser(userId).set(
      {
        ...userData,
        roomId: data.id,
        userId,
        projectId,
        unreadCount: user?.unreadCount || 0,
        userLastAccessAt: user?.lastAccessedAt || Timestamp.now(), // MEMO: 無い場合はデータを入れないほうがいいかも
      },
      { merge: true }
    )

    return {
      ...data,
      roomId: data.id,
      userId,
      projectId,
    } as MessageRoomForES
  },
}
