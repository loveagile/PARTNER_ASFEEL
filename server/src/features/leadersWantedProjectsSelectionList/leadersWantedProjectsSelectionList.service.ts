import { Timestamp } from 'firebase-admin/firestore'
import { DocRef, getDocIdWithData } from '../../libs/firebase/firestore'
import { calculateAge, getStatusToEnglish } from '../../utils/common'
import {
  LeadersWantedProjectsSelectionList,
  LeadersWantedProjectsSelectionListForES,
} from './leadersWantedProjectsSelectionList.model'

export const leadersWantedProjectsSelectionListService = {
  async processLeadersWantedProjectsSelectionListData(
    data: LeadersWantedProjectsSelectionList
  ) {
    const userId = data.userId
    const userDoc = await DocRef.privateUser(userId).get()
    const userData = getDocIdWithData(userDoc)
    const projectId = data.projectId
    const status = getStatusToEnglish(data.status)

    return {
      ...data,
      docId: `${projectId}${userId}`,
      userId,
      projectId,

      name: userData.name,
      age: calculateAge(userData.birthday),
      gender: userData.gender,
      type: userData.occupation.type,
      organization: userData.occupation.organization,
      interviewAt: Timestamp.now(),
      lastMessageAt: Timestamp.now(),
      isSetInterview:
        status === 'interview' || status === 'adopted' ? true : false,
    } as LeadersWantedProjectsSelectionListForES
  },
}
