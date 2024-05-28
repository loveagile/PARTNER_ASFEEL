import { Prefecture, Address, Area, City, ClubTypeLargeCategory, ClubTypeMediumCategory, ClubTypeCategory, Organization, OrganizationType, PrivateUser, VerificationCode, EventProject, EventProjectScoutList, EventProjectSelectionList, LeadersWantedProjectScoutList, LeadersWantedProjectSelectionList, MessageRoom, Message, Notification, LeadersWantedProject, ScoutedProject, AppliedProject, CheckedNotification, QuestionsForPrefecture } from '@/models'
import { db } from './firebase'
import { DocumentSnapshot, QueryDocumentSnapshot, collection, collectionGroup, doc, serverTimestamp } from 'firebase/firestore'

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

/**
 * Defines the collection name.
 *
 * @example
 * static readonly users = "users";
 */
export class ColName {
  // root collection
  static readonly prefectures = 'prefectures'
  static readonly addresses = 'addresses'
  static readonly areas = 'areas'
  static readonly cities = 'cities'
  static readonly clubTypeLargeCategories = 'clubTypeLargeCategories'
  static readonly clubTypeMediumCategories = 'clubTypeMediumCategories'
  static readonly clubTypeCategories = 'clubTypeCategories'
  static readonly organizations = 'organizations'
  static readonly organizationTypes = 'organizationTypes'
  static readonly privateUsers = 'privateUsers'
  static readonly verificationCodes = 'verificationCodes'
  static readonly eventProjects = 'eventProjects'
  static readonly leadersWantedProjects = 'leadersWantedProjects'
  static readonly messageRooms = 'messageRooms'
  static readonly notifications = 'notifications'
  static readonly questionsForPrefecture = 'questionsForPrefecture'
}

export class SubColName {
  // sub collection

  // messageRoom
  static readonly messages = 'messages'

  // private user
  static readonly scoutedProjects = 'scoutedProjects'
  static readonly appliedProjects = 'appliedProjects'
  static readonly checkedNotifications = 'checkedNotifications'

  // leaderWanted project
  static readonly leadersWantedProjectsScoutList = 'leadersWantedProjectsScoutList'
  static readonly leadersWantedProjectsSelectionList = 'leadersWantedProjectsSelectionList'

  // event project
  static readonly eventProjectsScoutList = 'eventProjectsScoutList'
  static readonly eventProjectsSelectionList = 'eventProjectsSelectionList'
}

/**
 * Defines the collection reference.
 *
 * @example
 * static users = collection(db, ColName.users).withConverter<User>(converter);
 */
export class ColRef {
  static prefectures = collection(db, ColName.prefectures).withConverter<Prefecture>(converter)
  static addresses = collection(db, ColName.addresses).withConverter<Address>(converter)
  static areas = collection(db, ColName.areas).withConverter<Area>(converter)
  static cities = collection(db, ColName.cities).withConverter<City>(converter)
  static clubTypeLargeCategories = collection(db, ColName.clubTypeLargeCategories).withConverter<ClubTypeLargeCategory>(converter)
  static clubTypeMediumCategories = collection(db, ColName.clubTypeMediumCategories).withConverter<ClubTypeMediumCategory>(converter)
  static clubTypeCategories = collection(db, ColName.clubTypeCategories).withConverter<ClubTypeCategory>(converter)
  static organizations = collection(db, ColName.organizations).withConverter<Organization>(converter)
  static organizationTypes = collection(db, ColName.organizationTypes).withConverter<OrganizationType>(converter)
  static privateUsers = collection(db, ColName.privateUsers).withConverter<PrivateUser>(converter)
  static verificationCodes = collection(db, ColName.verificationCodes).withConverter<VerificationCode>(converter)
  static eventProjects = collection(db, ColName.eventProjects).withConverter<EventProject>(converter)
  static leadersWantedProjects = collection(db, ColName.leadersWantedProjects).withConverter<LeadersWantedProject>(converter)
  static messageRooms = collection(db, ColName.messageRooms).withConverter<MessageRoom>(converter)
  static notifications = collection(db, ColName.notifications).withConverter<Notification>(converter)
  static questionsForPrefecture = collection(db, ColName.questionsForPrefecture).withConverter<QuestionsForPrefecture>(converter)
}

/**
 * Defines the sub collection reference.
 *
 * @example
 * static userReports = (id: string) => collection(DocRef.user(id), ColName.userReport).withConverter<UserReport>(converter)
 */
export class SubColRef {
  static messages = (id: string) => collection(DocRef.messageRoom(id), SubColName.messages).withConverter<Message>(converter)
  static scoutedProjects = (id: string) => collection(DocRef.privateUser(id), SubColName.scoutedProjects).withConverter<ScoutedProject>(converter)
  static appliedProjects = (id: string) => collection(DocRef.privateUser(id), SubColName.appliedProjects).withConverter<AppliedProject>(converter)
  static checkedNotifications = (id: string) => collection(DocRef.privateUser(id), SubColName.checkedNotifications).withConverter<CheckedNotification>(converter)
  static leadersWantedProjectsScoutList = (id: string) => collection(DocRef.leadersWantedProject(id), SubColName.leadersWantedProjectsScoutList).withConverter<LeadersWantedProjectScoutList>(converter)
  static leadersWantedProjectsSelectionList = (id: string) => collection(DocRef.leadersWantedProject(id), SubColName.leadersWantedProjectsSelectionList).withConverter<LeadersWantedProjectSelectionList>(converter)
  static eventProjectsScoutList = (id: string) => collection(DocRef.eventProject(id), SubColName.eventProjectsScoutList).withConverter<EventProjectScoutList>(converter)
  static eventProjectsSelectionList = (id: string) => collection(DocRef.eventProject(id), SubColName.eventProjectsSelectionList).withConverter<EventProjectSelectionList>(converter)
}

/**
 * Defines the collection group reference.
 *
 * @example
 * static userReports = collectionGroup(db, ColName.userReports).withConverter<UserReport>(converter)
 */
export class ColGroupRef {
  static messages = collectionGroup(db, SubColName.messages).withConverter<Message>(converter)
  static scoutedProjects = collectionGroup(db, SubColName.scoutedProjects).withConverter<ScoutedProject>(converter)
  static appliedProjects = collectionGroup(db, SubColName.appliedProjects).withConverter<AppliedProject>(converter)
  static checkedNotifications = collectionGroup(db, SubColName.checkedNotifications).withConverter<CheckedNotification>(converter)
  static leadersWantedProjectScoutLists = collectionGroup(db, SubColName.leadersWantedProjectsScoutList).withConverter<LeadersWantedProjectScoutList>(converter)
  static leadersWantedProjectSelectionLists = collectionGroup(db, SubColName.leadersWantedProjectsSelectionList).withConverter<LeadersWantedProjectSelectionList>(converter)
  static eventProjectScoutLists = collectionGroup(db, SubColName.eventProjectsScoutList).withConverter<EventProjectScoutList>(converter)
  static eventProjectSelectionLists = collectionGroup(db, SubColName.eventProjectsSelectionList).withConverter<EventProjectSelectionList>(converter)
}

/**
 * Defines the document reference.
 *
 * @example
 * static user = (id: string) => doc(db, ColName.users, id).withConverter<User>(converter);
 */
export class DocRef {
  static prefecture = (id: string) => doc(db, ColName.prefectures, id).withConverter<Prefecture>(converter)
  static address = (id: string) => doc(db, ColName.addresses, id).withConverter<Address>(converter)
  static area = (id: string) => doc(db, ColName.areas, id).withConverter<Area>(converter)
  static city = (id: string) => doc(db, ColName.cities, id).withConverter<City>(converter)
  static clubTypeLargeCategory = (id: string) => doc(db, ColName.clubTypeLargeCategories, id).withConverter<ClubTypeLargeCategory>(converter)
  static clubTypeMediumCategory = (id: string) => doc(db, ColName.clubTypeMediumCategories, id).withConverter<ClubTypeMediumCategory>(converter)
  static clubTypeCategory = (id: string) => doc(db, ColName.clubTypeCategories, id).withConverter<ClubTypeCategory>(converter)
  static organization = (id: string) => doc(db, ColName.organizations, id).withConverter<Organization>(converter)
  static organizationType = (id: string) => doc(db, ColName.organizationTypes, id).withConverter<OrganizationType>(converter)

  static privateUser = (id: string) => doc(db, ColName.privateUsers, id).withConverter<PrivateUser>(converter)
  static scoutedProject = ({ privateUserId, scoutedProjectId }: { privateUserId: string; scoutedProjectId: string }) => doc(SubColRef.scoutedProjects(privateUserId), scoutedProjectId).withConverter<ScoutedProject>(converter)
  static appliedProject = ({ privateUserId, appliedProjectId }: { privateUserId: string; appliedProjectId: string }) => doc(SubColRef.appliedProjects(privateUserId), appliedProjectId).withConverter<AppliedProject>(converter)
  static checkedNotification = ({ privateUserId, checkedNotificationId }: { privateUserId: string; checkedNotificationId: string }) => doc(SubColRef.checkedNotifications(privateUserId), checkedNotificationId).withConverter<CheckedNotification>(converter)

  static verificationCode = (id: string) => doc(db, ColName.verificationCodes, id).withConverter<VerificationCode>(converter)
  static leadersWantedProject = (id: string) => doc(db, ColName.leadersWantedProjects, id).withConverter<LeadersWantedProject>(converter)
  static leadersWantedProjectScoutList = ({ leadersWantedProjectId, leadersWantedProjectScoutListId }: { leadersWantedProjectId: string; leadersWantedProjectScoutListId: string }) => doc(SubColRef.leadersWantedProjectsScoutList(leadersWantedProjectId), leadersWantedProjectScoutListId).withConverter<LeadersWantedProjectScoutList>(converter)
  static leadersWantedProjectSelectionList = ({ leadersWantedProjectId, leadersWantedProjectSelectionListId }: { leadersWantedProjectId: string; leadersWantedProjectSelectionListId: string }) => doc(SubColRef.leadersWantedProjectsSelectionList(leadersWantedProjectId), leadersWantedProjectSelectionListId).withConverter<LeadersWantedProjectSelectionList>(converter)

  static eventProject = (id: string) => doc(db, ColName.eventProjects, id).withConverter<EventProject>(converter)
  static eventProjectScoutList = ({ eventProjectId, eventProjectScoutId }: { eventProjectId: string; eventProjectScoutId: string }) => doc(SubColRef.eventProjectsScoutList(eventProjectId), eventProjectScoutId).withConverter<EventProjectScoutList>(converter)
  static eventProjectSelectionList = ({ eventProjectId, eventProjectSelectionId }: { eventProjectId: string; eventProjectSelectionId: string }) => doc(SubColRef.eventProjectsSelectionList(eventProjectId), eventProjectSelectionId).withConverter<EventProjectSelectionList>(converter)

  static messageRoom = (id: string) => doc(db, ColName.messageRooms, id).withConverter<MessageRoom>(converter)
  static message = ({ messageRoomId, messageId }: { messageRoomId: string; messageId: string }) => doc(SubColRef.messages(messageRoomId), messageId).withConverter<Message>(converter)

  static notification = (id: string) => doc(db, ColName.notifications, id).withConverter<Notification>(converter)
  static questionsForPrefecture = (id: string) => doc(db, ColName.questionsForPrefecture, id).withConverter<QuestionsForPrefecture>(converter)
  // static message = (id: string) => doc(db, ColName.messages, id).withConverter<Message>(converter)
}

/**
 * generate document id
 */
export const generateDocId = () => {
  return doc(collection(db, 'authId')).id
}

/**
 * get document id with data
 */
export const getDocIdWithData = <T>(doc: DocumentSnapshot<T>) => {
  if (!doc.exists()) {
    throw new Error('Document does not exist')
  }

  return {
    id: doc.id,
    ...doc.data(),
  }
}

/**
 * get document data
 */
export const getDocData = <T>(doc: DocumentSnapshot<T>) => {
  if (!doc.exists()) {
    throw new Error('Document does not exist')
  }

  return doc.data()
}

/**
 * get server timestamp
 */
export const appServerTimestamp = () => {
  return serverTimestamp()
}
