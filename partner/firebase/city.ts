import { addDoc, deleteDoc, getDoc, getDocs, orderBy, query, setDoc, where } from 'firebase/firestore'
import { ColRef, DocRef, getDocIdWithData } from '@/libs/firebase/firestore'
import { Area, City, Prefecture } from '@/models'

type PrefectureMap = {
  [key: string]: Prefecture
}

function convertArrayToMap(dataArray: Prefecture[]): PrefectureMap {
  const map: PrefectureMap = {}

  dataArray.forEach((data) => {
    map[data.prefecture] = data
  })

  return map
}

export const getCityList = async () => {
  const snap = await getDocs(ColRef.cities)

  return snap.empty ? [] : snap.docs.map((doc) => getDocIdWithData(doc))
}

export const getCity = async (id: string) => {
  const doc = await getDoc(DocRef.city(id))
  if (!doc.exists()) return null

  return getDocIdWithData(doc)
}

export const addCity = async (city: City) => {
  await addDoc(ColRef.cities, city)
}

export const setCity = async (id: string, city: City) => {
  await setDoc(DocRef.city(id), city)
}

export const deleteCity = async (id: string) => {
  await deleteDoc(DocRef.city(id))
}

// other functions
export const getCityPopulateList = async () => {
  const [prefSnap, citySnap] = await Promise.all([
    getDocs(ColRef.prefectures),
    getDocs(query(ColRef.cities, orderBy('order', 'asc'))),
  ])
  if (prefSnap.empty || citySnap.empty) return []

  const prefList = prefSnap.docs.map((doc) => getDocIdWithData(doc))
  const prefMap = convertArrayToMap(prefList)
  const cityList = citySnap.docs.map((doc) => {
    const data = getDocIdWithData(doc)
    return {
      ...data,
      prefectureName: data.prefectureText,
      areaName: data.areaText,
      index: prefMap[data.prefectureText].index,
    }
  })

  return cityList
}

export const getCityPopulate = async (id: string) => {
  const doc = await getDoc(DocRef.city(id))
  if (!doc.exists()) return null

  const cityDoc = getDocIdWithData(doc)
  const prefectureName = await getPrefectureName(cityDoc.prefecture)
  const areaName = await getAreaName(cityDoc.area)
  let temp = { ...cityDoc, prefectureName, areaName }

  return temp
}

const getPrefectureName = async (prefectureId: string) => {
  const doc = await getDoc(DocRef.prefecture(prefectureId))
  if (!doc.exists()) return null

  const prefecture = getDocIdWithData<Prefecture>(doc)
  return prefecture.prefecture
}

const getPrefectureIndex = async (prefectureId: string) => {
  const doc = await getDoc(DocRef.prefecture(prefectureId))
  if (!doc.exists()) return null

  const prefecture = getDocIdWithData<Prefecture>(doc)
  return prefecture.index
}

const getAreaName = async (areaId: string) => {
  const doc = await getDoc(DocRef.area(areaId))
  if (!doc.exists()) return null

  const area = getDocIdWithData<Area>(doc)
  return area.area
}

export const getCityId = async (name: string) => {
  const filteredQuery = query(ColRef.cities, where('city', '==', name))
  const snap = await getDocs(filteredQuery)

  if (snap.empty) {
    return null // No documents found
  }

  const documentSnapshot = snap.docs[0]
  const documentData = getDocIdWithData<City>(documentSnapshot)

  return documentData.id
}
