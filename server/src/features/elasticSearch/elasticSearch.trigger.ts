import { setGlobalOptions } from 'firebase-functions/v2/options'
import { onDocumentWritten } from 'firebase-functions/v2/firestore'

// ロジック
import { elasticSearchService } from './elasticSearch.service'
import { privateUsersService } from '../privateUsers/privateUsers.service'
import { messageRoomsService } from '../messageRooms/messageRooms.service'
import { leadersWantedProjectsService } from '../leadersWantedProjects/leadersWantedProjects.service'
import { leadersWantedProjectsScoutListService } from '../leadersWantedProjectsScoutList/leadersWantedProjectsScoutList.service'
import { leadersWantedProjectsSelectionListService } from '../leadersWantedProjectsSelectionList/leadersWantedProjectsSelectionList.service'
import { eventProjectsService } from '../eventProjects/eventProjects.service'
import { eventProjectsScoutListService } from '../eventProjectsScoutList/eventProjectsScoutList.service'
import { eventProjectsSelectionListService } from '../eventProjectsSelectionList/eventProjectsSelectionList.service'

// モデル
import { PrivateUserForES } from '../privateUsers/privateUsers.model'
import { MessageRoomForES } from '../messageRooms/messageRooms.model'
import { LeadersWantedProjectForES } from '../leadersWantedProjects/leadersWantedProjects.model'
import { LeadersWantedProjectsScoutListForES } from '../leadersWantedProjectsScoutList/leadersWantedProjectsScoutList.model'
import { LeadersWantedProjectsSelectionListForES } from '../leadersWantedProjectsSelectionList/leadersWantedProjectsSelectionList.model'
import { EventProjectForES } from '../eventProjects/eventProjects.model'
import { EventProjectsScoutListForES } from '../eventProjectsScoutList/eventProjectsScoutList.model'
import { EventProjectsSelectionListForES } from '../eventProjectsSelectionList/eventProjectsSelectionList.model'

setGlobalOptions({
  region: 'asia-northeast1',
  secrets: ['www-asfeel'],
})

const handleDocumentChange = elasticSearchService.handleDocumentChange

// Firestore trigger for PrivateUser changes
export const onWrittenPrivateUsers = onDocumentWritten(
  'privateUsers/{userId}',
  async (event) => {
    await handleDocumentChange<PrivateUserForES>(
      event,
      'privateusers',
      privateUsersService.processPrivateUserData
    )
  }
)

// Firestore trigger for MessageRoom changes
export const onWrittenMessageRooms = onDocumentWritten(
  'messageRooms/{docId}',
  async (event) => {
    await handleDocumentChange<MessageRoomForES>(
      event,
      'messagerooms',
      messageRoomsService.processMessageRoomData
    )
  }
)

// Firestore trigger for LeadersWantedProject changes
export const onWrittenLeadersWantedProjects = onDocumentWritten(
  'leadersWantedProjects/{docId}',
  async (event) => {
    await handleDocumentChange<LeadersWantedProjectForES>(
      event,
      'leaderswantedprojects',
      leadersWantedProjectsService.processLeadersWantedProjectData
    )
  }
)

// Firestore trigger for LeadersWantedProjectsScoutList changes
export const onWrittenLeadersWantedProjectsScoutList = onDocumentWritten(
  'leadersWantedProjectsScoutList/{docId}',
  async (event) => {
    await handleDocumentChange<LeadersWantedProjectsScoutListForES>(
      event,
      'leaderswantedprojectsscoutlist',
      leadersWantedProjectsScoutListService.processLeadersWantedProjectsScoutListData
    )
  }
)

// Firestore trigger for LeadersWantedProjectsSelectionList changes
export const onWrittenLeadersWantedProjectsSelectionList = onDocumentWritten(
  'leadersWantedProjectsSelectionList/{docId}',
  async (event) => {
    await handleDocumentChange<LeadersWantedProjectsSelectionListForES>(
      event,
      'leaderswantedprojectsselectionlist',
      leadersWantedProjectsSelectionListService.processLeadersWantedProjectsSelectionListData
    )
  }
)

// Firestore trigger for EventProjects changes
export const onWrittenEventProjects = onDocumentWritten(
  'eventProjects/{docId}',
  async (event) => {
    await handleDocumentChange<EventProjectForES>(
      event,
      'eventprojects',
      eventProjectsService.processEventProjectData
    )
  }
)

// Firestore trigger for EventProjectsScoutList changes
export const onWrittenEventProjectsScoutList = onDocumentWritten(
  'eventProjectsScoutList/{docId}',
  async (event) => {
    await handleDocumentChange<EventProjectsScoutListForES>(
      event,
      'eventprojectsscoutlist',
      eventProjectsScoutListService.processEventProjectsScoutListData
    )
  }
)

// Firestore trigger for EventProjectsSelectionList changes
export const onWrittenEventProjectsSelectionList = onDocumentWritten(
  'eventProjectsSelectionList/{docId}',
  async (event) => {
    await handleDocumentChange<EventProjectsSelectionListForES>(
      event,
      'eventprojectsselectionlist',
      eventProjectsSelectionListService.processEventProjectsSelectionListData
    )
  }
)
