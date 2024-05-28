import { addDoc, deleteDoc, getDoc, getDocs, query, setDoc, where } from 'firebase/firestore'
import { ColRef, DocRef, getDocIdWithData } from '@/libs/firebase/firestore'
import { Address, Prefecture, Area, City } from '@/models'

export const getAddressList = async () => {
  const snap = await getDocs(ColRef.addresses)

  return snap.empty ? [] : snap.docs.map((doc) => getDocIdWithData(doc))
}

export const getAddress = async (id: string) => {
  const doc = await getDoc(DocRef.address(id))
  if (!doc.exists()) return null

  return getDocIdWithData(doc)
}

export const addAddress = async (address: Address) => {
  await addDoc(ColRef.addresses, address)
}

export const setAddress = async (id: string, address: Address) => {
  await setDoc(DocRef.address(id), address)
}

export const deleteAddress = async (id: string) => {
  await deleteDoc(DocRef.address(id))
}

// other functions
export const getAddressPopulateList = async () => {
  const snap = await getDocs(ColRef.addresses)

  if (snap.empty) return []

  const addressDocs = snap.docs.map((doc) => getDocIdWithData(doc))

  // Get the prefecture data for each address
  const addressListWithPrefecture = []

  for (const addressDoc of addressDocs) {
    const prefectureName = await getPrefectureName(addressDoc.prefecture)
    const areaName = await getAreaName(addressDoc.area)
    const cityName = await getCityName(addressDoc.city)
    addressListWithPrefecture.push({
      ...addressDoc,
      prefectureName,
      areaName,
      cityName,
    })
  }

  return addressListWithPrefecture
}

export const getAddressDataByZipCode = async (zip: string) => {
  const filteredQuery = query(ColRef.addresses, where('zip', '==', zip))
  const snap = await getDocs(filteredQuery)

  if (snap.empty) {
    return null // No documents found
  }

  const documentSnapshot = snap.docs[0]
  const documentData = getDocIdWithData<Address>(documentSnapshot)

  const prefectureName = await getPrefectureName(documentData.prefecture)
  const areaName = await getAreaName(documentData.area)
  const cityName = await getCityName(documentData.city)

  return {
    ...documentData,
    prefectureName,
    areaName,
    cityName,
  }
}

const getPrefectureName = async (prefectureId: string) => {
  const doc = await getDoc(DocRef.prefecture(prefectureId))
  if (!doc.exists()) return null

  const prefecture = getDocIdWithData<Prefecture>(doc)
  return prefecture.prefecture
}

const getAreaName = async (areaId: string) => {
  const doc = await getDoc(DocRef.area(areaId))
  if (!doc.exists()) return null

  const area = getDocIdWithData<Area>(doc)
  return area.area
}

const getCityName = async (cityId: string) => {
  const doc = await getDoc(DocRef.city(cityId))
  if (!doc.exists()) return null

  const city = getDocIdWithData<City>(doc)
  return city.city
}

export const getAreaData = async (name: string) => {
  const filteredQuery = query(ColRef.addresses, where('area', '==', name))
  const snap = await getDocs(filteredQuery)

  if (snap.empty) {
    return null // No documents found
  }

  const documentSnapshot = snap.docs[0]
  const documentData = getDocIdWithData<Address>(documentSnapshot)

  return documentData.prefecture
}

export const getCityData = async (name: string) => {
  const filteredQuery = query(ColRef.addresses, where('city', '==', name))
  const snap = await getDocs(filteredQuery)

  if (snap.empty) {
    return null // No documents found
  }

  const documentSnapshot = snap.docs[0]
  const documentData = getDocIdWithData<Address>(documentSnapshot)

  return documentData
}
