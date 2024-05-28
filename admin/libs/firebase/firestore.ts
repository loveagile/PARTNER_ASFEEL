import { Area, City, Prefecture } from '@/constants/model'
import { Category, LargeCategory, MediumCategory } from '@/features/category/model/category.model'
import { Coordinator } from '@/features/coordinator/model/coordinator.model'
import { Notification } from '@/features/notification/model/notification.model'
import { Organization, OrganizationType, OrganizationTypes } from '@/features/organization/model/organization.model'
import { Question } from '@/features/question/model/question.model'
import { transformTimestampToDate } from '@/utils/firestore'
import dayjs from 'dayjs'
import { DocumentSnapshot, QueryDocumentSnapshot, Timestamp, collection, doc, getDocs, orderBy, query, serverTimestamp } from 'firebase/firestore'
import { db } from './firebase'
import { Addresses } from '@/features/address/addess.model'
import { LeadersWantedProjects } from '@/features/recruitment/common'
import { CsvHistory } from '@/features/csvHistories/models/csvHistory.model'

export class AppFirestoreModel {
  get toJson() {
    return {
      ...this,
    }
  }
}

export const converter = {
  toFirestore: <T extends AppFirestoreModel>(data: T) => (data instanceof AppFirestoreModel ? data.toJson : data),
  fromFirestore: <T>(snapshot: QueryDocumentSnapshot) => snapshot.data() as T,
}

export class ColName {
  // example
  // static readonly members = 'members';
  static readonly addresses = 'addresses'
  static readonly prefectures = 'prefectures'
  static readonly organizationTypes = 'organizationTypes'
  static readonly organizations = 'organizations'
  static readonly organizationType = 'organizationType'
  static readonly cities = 'cities'
  static readonly areas = 'areas'
  static readonly notifications = 'notifications'
  static readonly questions = 'questionsForPrefecture'
  static readonly categories = 'clubTypeCategories'
  static readonly largeCategories = 'clubTypeLargeCategories'
  static readonly mediumCategories = 'clubTypeMediumCategories'
  static readonly coordinators = 'coordinators'
  static readonly leadersWantedProjects = 'leadersWantedProjects'
  static readonly leadersWantedProjectsScoutList = (projectId: string) => `${this.leadersWantedProjects}/${projectId}/leadersWantedProjectsScoutList`
  static readonly leadersWantedProjectsSelectionList = (projectId: string) => `${this.leadersWantedProjects}/${projectId}/leadersWantedProjectsSelectionList`
  static readonly eventProjects = 'eventProjects'
  static readonly eventProjectsScoutList = (projectId: string) => `${this.eventProjects}/${projectId}/eventProjectsScoutList`
  static readonly eventProjectsSelectionList = (projectId: string) => `${this.eventProjects}/${projectId}/eventProjectsSelectionList`
  static readonly privateUsers = 'privateUsers'
  static readonly csvHistories = 'csvHistories'
  static readonly scoutedProjects = (userId: string) => `${this.privateUsers}/${userId}/scoutedProjects`
  static readonly appliedProjects = (userId: string) => `${this.privateUsers}/${userId}/appliedProjects`
  static readonly messageRooms = 'messageRooms'
  static readonly messages = (messageRoomId: string) => `${this.messageRooms}/${messageRoomId}/messages`
  static readonly latestUserOfPrefectures = 'latestUserOfPrefectures'
  static readonly latestCoordinatorOfPrefectures = 'latestCoordinatorOfPrefectures'
}

export class ColRef {
  // example
  // static members = collection(db, ColName.members).withConverter<Member>(converter);

  static addresses = collection(db, ColName.addresses).withConverter<Addresses, Addresses>(converter)
  static prefectures = collection(db, ColName.prefectures).withConverter<Prefecture, Prefecture>(converter)
  static organizationTypes = collection(db, ColName.organizationTypes).withConverter<OrganizationTypes, OrganizationTypes>(converter)
  static organizations = collection(db, ColName.organizations).withConverter<Organization, Organization>(converter)
  static cities = collection(db, ColName.cities).withConverter<City, City>(converter)
  static areas = collection(db, ColName.areas).withConverter<Area, Area>(converter)
  static notifications = collection(db, ColName.notifications).withConverter<Notification, Notification>(converter)
  static questions = collection(db, ColName.questions).withConverter<Question, Question>(converter)
  static categories = collection(db, ColName.categories).withConverter<Category, Category>(converter)
  static largeCategories = collection(db, ColName.largeCategories).withConverter<LargeCategory, LargeCategory>(converter)
  static mediumCategories = collection(db, ColName.mediumCategories).withConverter<MediumCategory, MediumCategory>(converter)
  static organizationType = collection(db, ColName.organizationType).withConverter<OrganizationType, OrganizationType>(converter)
  static coordinators = collection(db, ColName.coordinators).withConverter<Coordinator, Coordinator>(converter)
  static leadersWantedProjects = collection(db, ColName.leadersWantedProjects).withConverter<LeadersWantedProjects, LeadersWantedProjects>(converter)
  // TODO: update converter type later
  static leadersWantedProjectsScoutList = (projectId: string) => collection(db, ColName.leadersWantedProjectsScoutList(projectId)).withConverter<any, any>(converter)
  static leadersWantedProjectsSelectionList = (projectId: string) => collection(db, ColName.leadersWantedProjectsSelectionList(projectId)).withConverter<any, any>(converter)
  static eventProjects = collection(db, ColName.eventProjects).withConverter<any, any>(converter)
  static eventProjectsScoutList = (projectId: string) => collection(db, ColName.eventProjectsScoutList(projectId)).withConverter<any, any>(converter)
  static eventProjectsSelectionList = (projectId: string) => collection(db, ColName.eventProjectsSelectionList(projectId)).withConverter<any, any>(converter)
  static privateUsers = collection(db, ColName.privateUsers).withConverter<any, any>(converter)
  static csvHistories = collection(db, ColName.csvHistories).withConverter<CsvHistory, CsvHistory>(converter)
  static scoutedProjects = (userId: string) => collection(db, ColName.scoutedProjects(userId)).withConverter<any, any>(converter)
  static appliedProjects = (userId: string) => collection(db, ColName.appliedProjects(userId)).withConverter<any, any>(converter)
  static messageRooms = collection(db, ColName.messageRooms).withConverter<any, any>(converter)
  static messages = (messageRoomId: string) => collection(db, ColName.messages(messageRoomId)).withConverter<any, any>(converter)
  static latestUserOfPrefectures = collection(db, ColName.latestUserOfPrefectures).withConverter<any, any>(converter)
  static latestCoordinatorOfPrefectures = collection(db, ColName.latestCoordinatorOfPrefectures).withConverter<any, any>(converter)
}

export class SubColName {
  // example
  // static readonly memberReports = 'memberReports';
}

export class SubColRef {
  // example
  // static memberReports = (id: string) => collection(DocRef.member(id), SubColName.memberReports).withConverter<MemberReport>(converter);
}

export class ColGroupRef {
  // example
  // static memberReports = collectionGroup(db, SubColName.memberReports).withConverter<MemberReport>(converter);
}

export class DocRef {
  // example
  // static member = (id: string) => doc(db, ColName.members, id).withConverter<Member>(converter);
  static address = (id: string) => doc(db, ColName.addresses, id).withConverter<Addresses, Addresses>(converter)
  static area = (id: string) => doc(db, ColName.areas, id).withConverter<Area, Area>(converter)
  static prefecture = (id: string) => doc(db, ColName.prefectures, id).withConverter<Prefecture, Prefecture>(converter)
  static organizationType = (id: string) => doc(db, ColName.organizationType, id).withConverter<OrganizationType, OrganizationType>(converter)
  static organizationTypes = (id: string) => doc(db, ColName.organizationTypes, id).withConverter<OrganizationTypes, OrganizationTypes>(converter)
  static organization = (id: string) => doc(db, ColName.organizations, id).withConverter<Organization, Organization>(converter)
  static notification = (id: string) => doc(db, ColName.notifications, id).withConverter<Notification, Notification>(converter)
  static question = (id: string) => doc(db, ColName.questions, id).withConverter<Question, Question>(converter)
  static category = (id: string) => doc(db, ColName.categories, id).withConverter<Category, Category>(converter)
  static largeCategory = (id: string) => doc(db, ColName.largeCategories, id).withConverter<LargeCategory, LargeCategory>(converter)
  static mediumCategory = (id: string) => doc(db, ColName.mediumCategories, id).withConverter<MediumCategory, MediumCategory>(converter)
  static coordinator = (id: string) => doc(db, ColName.coordinators, id).withConverter<Coordinator, Coordinator>(converter)
  static leadersWantedProject = (id: string) => doc(db, ColName.leadersWantedProjects, id).withConverter<LeadersWantedProjects, LeadersWantedProjects>(converter)
  static eventProject = (id: string) => doc(db, ColName.eventProjects, id).withConverter<any, any>(converter)
  static privateUser = (id: string) => doc(db, ColName.privateUsers, id).withConverter<any, any>(converter)
  static city = (id: string) => doc(db, ColName.cities, id).withConverter<City, City>(converter)
  static csvHistory = (id: string) => doc(db, ColName.csvHistories, id).withConverter<CsvHistory, CsvHistory>(converter)

  // TODO: update converter type later
  static leadersWantedProjectsScoutList = (userId: string, projectId: string) => doc(db, ColName.leadersWantedProjectsScoutList(projectId), userId).withConverter<any, any>(converter)
  static leadersWantedProjectsSelectionList = (userId: string, projectId: string) => doc(db, ColName.leadersWantedProjectsSelectionList(projectId), userId).withConverter<any, any>(converter)
  static eventProjectsScoutList = (id: string, projectId: string) => doc(db, ColName.eventProjectsScoutList(projectId), id).withConverter<any, any>(converter)
  static eventProjectsSelectionList = (id: string, projectId: string) => doc(db, ColName.eventProjectsSelectionList(projectId), id).withConverter<any, any>(converter)
  static scoutedProject = (id: string, userId: string) => doc(db, ColName.scoutedProjects(userId), id).withConverter<any, any>(converter)
  static messageRoom = (id: string) => doc(db, ColName.messageRooms, id).withConverter<any, any>(converter)
  static message = (messageRoomId: string, id: string) => doc(db, ColName.messages(messageRoomId), id).withConverter<any, any>(converter)
  static latestUserOfPrefecture = (id: string) => doc(db, ColName.latestUserOfPrefectures, id).withConverter<any, any>(converter)
  static latestCoordinatorOfPrefecture = (id: string) => doc(db, ColName.latestCoordinatorOfPrefectures, id).withConverter<any, any>(converter)
}

export const generateDocId = () => {
  return doc(collection(db, 'authId')).id
}

export const getDocIdWithData = <T>(doc: DocumentSnapshot<T>) => {
  if (!doc.exists()) {
    throw new Error('Document does not exist')
  }

  return {
    id: doc.id,
    ...doc.data(),
  }
}

export const getDocData = <T>(doc: DocumentSnapshot<T>) => {
  if (!doc.exists()) {
    throw new Error('Document does not exist')
  }

  return doc.data()
}

export const appServerTimestamp = () => {
  return serverTimestamp()
}

export const toDateStr = (timestamp: Timestamp, format?: string) => {
  return dayjs(timestamp.toDate()).format(format ?? 'YYYY/MM/DD HH:mm')
}

export const getPrefectures = async () => {
  const queryPrefectures = query(ColRef.prefectures, orderBy('index', 'asc'))
  const prefectureSnapshot = await getDocs(queryPrefectures)
  return prefectureSnapshot.docs.map((doc) => transformTimestampToDate(getDocIdWithData(doc)))
}

export const getOrganizationTypes = async () => {
  const organizationTypesSnapshot = await getDocs(ColRef.organizationTypes)
  return organizationTypesSnapshot.docs.map((doc) => transformTimestampToDate(getDocIdWithData(doc)))
}

export const getClubTypes = async () => {
  const clubTypesSnapshot = await getDocs(ColRef.categories)
  return clubTypesSnapshot.docs.map((doc) => transformTimestampToDate(getDocIdWithData(doc)))
}

export const getOrganizations = async () => {
  const organizationsSnapshot = await getDocs(ColRef.organizations)
  return organizationsSnapshot.docs.map((doc) => transformTimestampToDate(getDocIdWithData(doc)))
}

export const getClubTypeLarge = async () => {
  const clubTypesLargeSnapshot = await getDocs(ColRef.largeCategories)
  return clubTypesLargeSnapshot.docs.map((doc) => transformTimestampToDate(getDocIdWithData(doc)))
}

export const getClubTypeMedium = async () => {
  const clubTypesMediumSnapshot = await getDocs(ColRef.mediumCategories)
  return clubTypesMediumSnapshot.docs.map((doc) => transformTimestampToDate(getDocIdWithData(doc)))
}

export const getAreas = async () => {
  const AreasSnapshot = await getDocs(ColRef.areas)
  return AreasSnapshot.docs.map((doc) => transformTimestampToDate(getDocIdWithData(doc)))
}

export const getCities = async () => {
  const citiesSnapshot = await getDocs(ColRef.cities)
  return citiesSnapshot.docs.map((doc) => transformTimestampToDate(getDocIdWithData(doc)))
}
