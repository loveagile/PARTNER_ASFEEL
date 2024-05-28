import { Timestamp } from 'firebase-admin/firestore'
import { DocRef, getDocIdWithData } from '../../libs/firebase/firestore'
import { calculateAge } from '../../utils/common'
import {
  LeadersWantedProjectsScoutList,
  LeadersWantedProjectsScoutListForES,
} from './leadersWantedProjectsScoutList.model'

export const leadersWantedProjectsScoutListService = {
  async processLeadersWantedProjectsScoutListData(
    data: LeadersWantedProjectsScoutList
  ) {
    const userDoc = await DocRef.privateUser(data.userId).get()
    const userData = getDocIdWithData(userDoc)

    return {
      ...data,

      status:
        data.status === '未送信'
          ? 'unsend'
          : data.status === 'スカウト済'
          ? 'scouted'
          : data.status === '興味なし'
          ? 'notinterested'
          : 'ng',
      userIdOfPrefecture: userData.userIdOfPrefecture,
      gender: userData.gender,
      age: calculateAge(userData.birthday),
      name: userData.name,
      type: userData.occupation.type,
      organization: userData.occupation.organization,
      candidateAt: userData.createdAt,
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
    } as LeadersWantedProjectsScoutListForES
  },
}
