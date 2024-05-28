import { addDoc, deleteDoc, getDoc, getDocs, setDoc } from 'firebase/firestore'
import { ColRef, DocRef, getDocIdWithData } from '@/libs/firebase/firestore'
import { Organization, OrganizationType } from '@/models'
import { query, where } from 'firebase/firestore'
import { getPrefectureFromHostname } from '@/utils/common'

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

// other functions
export const getOrganizationPopulateList = async () => {
  const prefJa = getPrefectureFromHostname('ja')
  const snap = await getDocs(query(ColRef.organizations, where('address.prefecture', '==', prefJa)))

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
