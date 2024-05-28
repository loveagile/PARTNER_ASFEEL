import { Address } from '../../features/addresses/addresses.model'
import { Area } from '../../features/areas/areas.model'
import { City } from '../../features/cities/cities.model'
import { ClubTypeCategory } from '../../features/clubTypeCategories/clubTypeCategories.model'
import { ClubTypeLargeCategory } from '../../features/clubTypeLargeCategories/clubTypeLargeCategories.model'
import { ClubTypeMediumCategory } from '../../features/clubTypeMediumCategories/clubTypeMediumCategories.model'
import { EventProject } from '../../features/eventProjects/eventProjects.model'
import { EventProjectsScoutList } from '../../features/eventProjectsScoutList/eventProjectsScoutList.model'
import { EventProjectsSelectionList } from '../../features/eventProjectsSelectionList/eventProjectsSelectionList.model'
import { IdempotentEvent } from '../../features/idempotent/idempotent.model'
import { LeadersWantedProject } from '../../features/leadersWantedProjects/leadersWantedProjects.model'
import { LeadersWantedProjectsScoutList } from '../../features/leadersWantedProjectsScoutList/leadersWantedProjectsScoutList.model'
import { LeadersWantedProjectsSelectionList } from '../../features/leadersWantedProjectsSelectionList/leadersWantedProjectsSelectionList.model'
import { messageRoomProjects } from '../../features/messageRoomProjects/messageRoomProjects.model'
import { MessageRoomUser } from '../../features/messageRoomUsers/messageRoomUsers.model'
import { MessageRoom } from '../../features/messageRooms/messageRooms.model'
import { Prefecture } from '../../features/prefectures/prefectures.model'
import { PrivateUser } from '../../features/privateUsers/privateUsers.model'
import { appServerTimestamp, db } from './firebase'
import {
  DocumentSnapshot,
  QueryDocumentSnapshot,
} from 'firebase-admin/firestore'

export class AppFirestoreModel {
  get toJson() {
    return {
      ...this,
    }
  }
}
export const converter = {
  toFirestore: <T extends AppFirestoreModel>(data: T) =>
    data instanceof AppFirestoreModel ? data.toJson : data,
  fromFirestore: <T>(snapshot: QueryDocumentSnapshot) => snapshot.data() as T,
}
export class ColName {
  static readonly idempotentEvents = 'idempotentEvents'
  static readonly privateUsers = 'privateUsers'
  static readonly messageRooms = 'messageRooms'
  static readonly messageRoomProjects = 'messageRoomProjects'
  static readonly messageRoomUsers = 'messageRoomUsers'
  static readonly leadersWantedProjects = 'leadersWantedProjects'
  static readonly eventProjects = 'eventProjects'
  static readonly prefectures = 'prefectures'
  static readonly areas = 'areas'
  static readonly cities = 'cities'
  static readonly addresses = 'addresses'
  static readonly clubTypeLargeCategories = 'clubTypeLargeCategories'
  static readonly clubTypeMediumCategories = 'clubTypeMediumCategories'
  static readonly clubTypeCategories = 'clubTypeCategories'
}
export class SubColName {
  static readonly leadersWantedProjectsScoutList =
    'leadersWantedProjectsScoutList'
  static readonly leadersWantedProjectsSelectionList =
    'leadersWantedProjectsSelectionList'
  static readonly eventProjectsScoutList = 'eventProjectsScoutList'
  static readonly eventProjectsSelectionList = 'eventProjectsSelectionList'
}

export class ColRef {
  static idempotentEvents = db
    .collection(ColName.idempotentEvents)
    .withConverter<IdempotentEvent>(converter)
  static privateUsers = db
    .collection(ColName.privateUsers)
    .withConverter<PrivateUser>(converter)
  static messageRooms = db
    .collection(ColName.messageRooms)
    .withConverter<MessageRoom>(converter)
  static messageRoomProjects = db
    .collection(ColName.messageRoomProjects)
    .withConverter<messageRoomProjects>(converter)
  static messageRoomUsers = db
    .collection(ColName.messageRoomUsers)
    .withConverter<MessageRoomUser>(converter)
  static leadersWantedProjects = db
    .collection(ColName.leadersWantedProjects)
    .withConverter<LeadersWantedProject>(converter)
  static eventProjects = db
    .collection(ColName.eventProjects)
    .withConverter<EventProject>(converter)
  static prefectures = db
    .collection(ColName.prefectures)
    .withConverter<Prefecture>(converter)
  static areas = db.collection(ColName.areas).withConverter<Area>(converter)
  static cities = db.collection(ColName.cities).withConverter<City>(converter)
  static addresses = db
    .collection(ColName.addresses)
    .withConverter<Address>(converter)
  static clubTypeLargeCategories = db
    .collection(ColName.clubTypeLargeCategories)
    .withConverter<ClubTypeLargeCategory>(converter)
  static clubTypeMediumCategories = db
    .collection(ColName.clubTypeMediumCategories)
    .withConverter<ClubTypeMediumCategory>(converter)
  static clubTypeCategories = db
    .collection(ColName.clubTypeCategories)
    .withConverter<ClubTypeCategory>(converter)
}

export class SubColRef {
  static leadersWantedProjectsScoutList = (id: string) =>
    db
      .collection(ColName.leadersWantedProjects)
      .doc(id)
      .collection(SubColName.leadersWantedProjectsScoutList)
      .withConverter<LeadersWantedProjectsScoutList>(converter)
  static leadersWantedProjectsSelectionList = (id: string) =>
    db
      .collection(ColName.leadersWantedProjects)
      .doc(id)
      .collection(SubColName.leadersWantedProjectsSelectionList)
      .withConverter<LeadersWantedProjectsSelectionList>(converter)
  static eventProjectsScoutList = (id: string) =>
    db
      .collection(ColName.eventProjects)
      .doc(id)
      .collection(SubColName.eventProjectsScoutList)
      .withConverter<EventProjectsScoutList>(converter)
  static eventProjectsSelectionList = (id: string) =>
    db
      .collection(ColName.eventProjects)
      .doc(id)
      .collection(SubColName.eventProjectsSelectionList)
      .withConverter<EventProjectsSelectionList>(converter)
}

export class ColGroupRef {
  // static memberReports = db.collectionGroup(SubColName.memberReports).withConverter<MemberReport>(converter)
}

export class DocRef {
  static idempotentEvent = (id: string) =>
    db
      .collection(ColName.idempotentEvents)
      .doc(id)
      .withConverter<IdempotentEvent>(converter)
  static privateUser = (id: string) => ColRef.privateUsers.doc(id)
  static messageRoom = (id: string) => ColRef.messageRooms.doc(id)
  static messageRoomProject = (id: string) => ColRef.messageRoomProjects.doc(id)
  static messageRoomUser = (id: string) => ColRef.messageRoomUsers.doc(id)
  static leadersWantedProject = (id: string) =>
    ColRef.leadersWantedProjects.doc(id)
  static leadersWantedProjectsScoutList = ({
    projectId,
    id,
  }: {
    projectId: string
    id: string
  }) => SubColRef.leadersWantedProjectsScoutList(projectId).doc(id)
  static leadersWantedProjectsSelectionList = ({
    projectId,
    id,
  }: {
    projectId: string
    id: string
  }) => SubColRef.leadersWantedProjectsSelectionList(projectId).doc(id)
  static eventProject = (id: string) => ColRef.eventProjects.doc(id)
  static eventProjectsScoutList = ({
    projectId,
    id,
  }: {
    projectId: string
    id: string
  }) => SubColRef.eventProjectsScoutList(projectId).doc(id)
  static eventProjectsSelectionList = ({
    projectId,
    id,
  }: {
    projectId: string
    id: string
  }) => SubColRef.eventProjectsSelectionList(projectId).doc(id)
  static prefecture = (id: string) => ColRef.prefectures.doc(id)
  static area = (id: string) => ColRef.areas.doc(id)
  static city = (id: string) => ColRef.cities.doc(id)
  static address = (id: string) => ColRef.addresses.doc(id)
  static clubTypeLargeCategory = (id: string) =>
    ColRef.clubTypeLargeCategories.doc(id)
  static clubTypeMediumCategory = (id: string) =>
    ColRef.clubTypeMediumCategories.doc(id)
  static clubTypeCategory = (id: string) => ColRef.clubTypeCategories.doc(id)
}

export const generateDocId = () => {
  return db.collection('authId').doc().id
}

export const getDocIdWithData = <T>(
  doc: DocumentSnapshot<T> | QueryDocumentSnapshot<T>
) => {
  if (!doc.exists) {
    throw new Error('Document does not exist')
  }

  return {
    id: doc.id,
    ...doc.data(),
  } as T
}

export const getDocData = <T>(doc: DocumentSnapshot<T>) => {
  if (!doc.exists) {
    throw new Error('Document does not exist')
  }

  return doc.data() as T
}

export const shouldIdempotentFunction = async (eventId: string) => {
  const doc = await DocRef.idempotentEvent(eventId).get()
  if (doc.exists && doc.data()?.id) {
    return false
  }

  return true
}

export const markIdempotentFunction = async (eventId: string) => {
  await DocRef.idempotentEvent(eventId).set({
    id: eventId,
    createdAt: appServerTimestamp(),
  })
}
