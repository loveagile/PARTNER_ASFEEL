import { addDoc, and, deleteDoc, getDoc, getDocs, or, orderBy, setDoc } from 'firebase/firestore'
import { ColRef, DocRef, getDocIdWithData } from '@/libs/firebase/firestore'
import { Organization, OrganizationType } from '@/models'
import { query, where } from 'firebase/firestore'

export const getOrganizationList = async () => {
  const snap = await getDocs(ColRef.organizations)

  return snap.empty ? [] : snap.docs.map((doc) => getDocIdWithData(doc))
}

export const getOrganization = async (id: string) => {
  const doc = await getDoc(DocRef.organization(id))
  if (!doc.exists()) return null

  return getDocIdWithData(doc)
}

export const addOrganization = async (organization: Organization) => {
  await addDoc(ColRef.organizations, organization)
}

export const setOrganization = async (id: string, organization: Organization) => {
  await setDoc(DocRef.organization(id), organization)
}

export const deleteOrganization = async (id: string) => {
  await deleteDoc(DocRef.organization(id))
}

// get organization list under prefecture
export const getPrefectureOrganizationList = async (prefecture: string) => {
  const filteredQuery = query(ColRef.organizations, where('address.prefecture', '==', prefecture))
  const snap = await getDocs(filteredQuery)

  return snap.empty ? [] : snap.docs.map((doc) => getDocIdWithData(doc))
}
// get organization list under prefecture and organization type
export const getPrefAndTypeOrganizationList = async (prefecture: string, type: string) => {
  const filteredQuery = query(
    ColRef.organizations,
    where('address.prefecture', '==', prefecture),
    where('organizationType', '==', type),
  )
  const snap = await getDocs(filteredQuery)

  return snap.empty ? [] : snap.docs.map((doc) => getDocIdWithData(doc))
}

// get university list under prefecture
export const getPrefectureUnivAndJuniorCollegeList = async (
  prefecture: string,
  universityId: string,
  juniorCollegeId: string,
) => {
  const filteredQuery = query(
    ColRef.organizations,
    and(
      where('address.prefecture', '==', prefecture),
      or(where('organizationType', '==', universityId), where('organizationType', '==', juniorCollegeId)),
    ),
    orderBy('organizationId', 'asc'),
  )
  const snap = await getDocs(filteredQuery)

  return snap.empty ? [] : snap.docs.map((doc) => getDocIdWithData(doc))
}

// other functions
export const getOrganizationPopulateList = async () => {
  const snap = await getDocs(ColRef.organizations)

  if (snap.empty) return []

  const organizationDocs = snap.docs.map((doc) => getDocIdWithData(doc))

  // Get the prefecture data for each organization
  const organizationListWithOrgType = await Promise.all(
    organizationDocs.map(async (organizationDoc) => {
      const [organizationName] = await Promise.all([getOrganizationType(organizationDoc.organizationType)])

      return {
        ...organizationDoc,
        organizationName: organizationName!,
      }
    }),
  )

  return organizationListWithOrgType
}

const getOrganizationType = async (orgTypeID: string) => {
  const doc = await getDoc(DocRef.organizationType(orgTypeID))
  if (!doc.exists()) return null

  const prefecture = getDocIdWithData<OrganizationType>(doc)
  return prefecture.name
}
