import { Timestamp } from 'firebase-admin/firestore'
import { DocRef, getDocIdWithData } from '../../libs/firebase/firestore'
import { calculateAge, getStatusToEnglish } from '../../utils/common'
import {
  EventProjectsSelectionList,
  EventProjectsSelectionListForES,
} from './eventProjectsSelectionList.model'

export const eventProjectsSelectionListService = {
  async processEventProjectsSelectionListData(
    data: EventProjectsSelectionList
  ) {
    const userDoc = await DocRef.privateUser(data.userId).get()
    const userData = getDocIdWithData(userDoc)
    const status = getStatusToEnglish(data.status)

    return {
      ...data,
      status,
      name: userData.name,
      age: calculateAge(userData.birthday),
      gender: userData.gender,
      type: userData.occupation.type,
      organization: userData.occupation.organization,
      candidateAt: data.createdAt,
      scoutAt: Timestamp.now(),
      email: userData.email,

      isExpeditionPossible: userData.isExpeditionPossible ? true : false,
      experience: userData.experience ? true : false,
      experienceNote: userData.experienceNote ? true : false,
      teacherLicenseStatus: userData.teacherLicenseStatus ? true : false,
      teacherLicenseNote: userData.teacherLicenseNote ? true : false,
      otherLicense: userData.otherLicense ? true : false,
      otherLicenseNote: userData.otherLicenseNote ? true : false,
      hasDriverLicense: userData.hasDriverLicense ? true : false,
    } as EventProjectsSelectionListForES
  },
}
