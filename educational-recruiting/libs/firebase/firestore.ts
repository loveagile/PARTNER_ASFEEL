import { Area, City, ClubTypeLargeCategory, ClubTypeMediumCategory, Organization, OrganizationType, ClubTypeCategory, EventProject, LeadersWantedProject, Prefecture, EventProjectScoutList, EventProjectSelectionList, LeadersWantedProjectScoutList, LeadersWantedProjectSelectionList } from '@/models'
import { db } from './firebase'
import { DocumentSnapshot, QueryDocumentSnapshot, collection, collectionGroup, doc, serverTimestamp } from 'firebase/firestore'
import { Address } from '@/models'

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
  static readonly eventProjects = 'eventProjects'
  static readonly leadersWantedProjects = 'leadersWantedProjects'
  static readonly prefectures = 'prefectures'
  static readonly addresses = 'addresses'
  static readonly areas = 'areas'
  static readonly cities = 'cities'
  static readonly clubTypeLargeCategories = 'clubTypeLargeCategories'
  static readonly clubTypeMediumCategories = 'clubTypeMediumCategories'
  static readonly clubTypeCategories = 'clubTypeCategories'
  static readonly organizations = 'organizations'
  static readonly organizationTypes = 'organizationTypes'
}

export class SubColName {
  // sub collection
  // event project
  static readonly eventProjectScoutLists = 'eventProjectScoutLists'
  static readonly eventProjectSelectionLists = 'eventProjectSelectionLists'

  // leaderwanted project
  static readonly leadersWantedProjectScoutLists = 'leadersWantedProjectScoutLists'
  static readonly leadersWantedProjectSelectionLists = 'leadersWantedProjectSelectionLists'
}

/**
 * Defines the collection reference.
 *
 * @example
 * static users = collection(db, ColName.users).withConverter<User>(converter);
 */
export class ColRef {
  static eventProjects = collection(db, ColName.eventProjects).withConverter<EventProject>(converter)
  static leadersWantedProjects = collection(db, ColName.leadersWantedProjects).withConverter<LeadersWantedProject>(converter)
  static prefectures = collection(db, ColName.prefectures).withConverter<Prefecture>(converter)
  static addresses = collection(db, ColName.addresses).withConverter<Address>(converter)
  static areas = collection(db, ColName.areas).withConverter<Area>(converter)
  static cities = collection(db, ColName.cities).withConverter<City>(converter)
  static clubTypeLargeCategories = collection(db, ColName.clubTypeLargeCategories).withConverter<ClubTypeLargeCategory>(converter)
  static clubTypeMediumCategories = collection(db, ColName.clubTypeMediumCategories).withConverter<ClubTypeMediumCategory>(converter)
  static clubTypeCategories = collection(db, ColName.clubTypeCategories).withConverter<ClubTypeCategory>(converter)
  static organizations = collection(db, ColName.organizations).withConverter<Organization>(converter)
  static organizationTypes = collection(db, ColName.organizationTypes).withConverter<OrganizationType>(converter)
}

/**
 * Defines the sub collection reference.
 *
 * @example
 * static userReports = (id: string) => collection(DocRef.user(id), ColName.userReport).withConverter<UserReport>(converter)
 */
export class SubColRef {
  static eventProjectScoutLists = (id: string) => collection(DocRef.eventProject(id), SubColName.eventProjectScoutLists).withConverter<EventProjectScoutList>(converter)
  static eventProjectSelectionLists = (id: string) => collection(DocRef.eventProject(id), SubColName.eventProjectSelectionLists).withConverter<EventProjectSelectionList>(converter)
  static leadersWantedProjectScoutLists = (id: string) => collection(DocRef.leadersWantedProject(id), SubColName.leadersWantedProjectScoutLists).withConverter<LeadersWantedProjectScoutList>(converter)
  static leadersWnatedProjectSelectionLists = (id: string) => collection(DocRef.leadersWantedProject(id), SubColName.leadersWantedProjectSelectionLists).withConverter<LeadersWantedProjectSelectionList>(converter)
}

/**
 * Defines the collection group reference.
 *
 * @example
 * static userReports = collectionGroup(db, ColName.userReports).withConverter<UserReport>(converter)
 */
export class ColGroupRef {
  static eventProjectScoutLists = collectionGroup(db, SubColName.eventProjectScoutLists).withConverter<EventProjectScoutList>(converter)
  static eventProjectSelectionLists = collectionGroup(db, SubColName.eventProjectSelectionLists).withConverter<EventProjectSelectionList>(converter)
  static leadersWantedProjectScoutLists = collectionGroup(db, SubColName.leadersWantedProjectScoutLists).withConverter<LeadersWantedProjectScoutList>(converter)
  static leadersWantedProjectSelectionLists = collectionGroup(db, SubColName.leadersWantedProjectSelectionLists).withConverter<LeadersWantedProjectSelectionList>(converter)
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

  static eventProject = (id: string) => doc(db, ColName.eventProjects, id).withConverter<EventProject>(converter)
  static eventProjectScoutList = ({ eventProjectId, eventProjectScoutId }: { eventProjectId: string; eventProjectScoutId: string }) => doc(SubColRef.eventProjectScoutLists(eventProjectId), eventProjectScoutId).withConverter<EventProjectScoutList>(converter)
  static eventProjectSelectionList = ({ eventProjectId, eventProjectSelectionId }: { eventProjectId: string; eventProjectSelectionId: string }) => doc(SubColRef.eventProjectSelectionLists(eventProjectId), eventProjectSelectionId).withConverter<EventProjectSelectionList>(converter)

  static leadersWantedProject = (id: string) => doc(db, ColName.leadersWantedProjects, id).withConverter<LeadersWantedProject>(converter)
  static leadersWantedProjectScoutList = ({ leadersWantedProjectid, leadersWantedProjectScoutListId }: { leadersWantedProjectid: string; leadersWantedProjectScoutListId: string }) => doc(SubColRef.leadersWantedProjectScoutLists(leadersWantedProjectid), leadersWantedProjectScoutListId).withConverter<LeadersWantedProjectScoutList>(converter)
  static leadersWantedProjectSelectionList = ({ leadersWantedProjectid, leadersWantedProjectSelectionListId }: { leadersWantedProjectid: string; leadersWantedProjectSelectionListId: string }) => doc(SubColRef.leadersWnatedProjectSelectionLists(leadersWantedProjectid), leadersWantedProjectSelectionListId).withConverter<LeadersWantedProjectSelectionList>(converter)
  static organization = (id: string) => doc(db, ColName.organizations, id).withConverter<Organization>(converter)
  static organizationType = (id: string) => doc(db, ColName.organizationTypes, id).withConverter<OrganizationType>(converter)
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
