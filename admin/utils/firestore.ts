import { Timestamp, serverTimestamp } from 'firebase/firestore'

// add fields when creating a new document
export const addFieldsCreate = <T>(data: T, isDate?: boolean): T => {
  return {
    ...data,
    createdAt: isDate ? new Date().getTime() : Timestamp.now(),
    updatedAt: isDate ? new Date().getTime() : Timestamp.now(),
    deletedAt: null,
  }
}

export const addFieldsUpdate = <T>(data: T, isDate?: boolean): T => {
  return {
    ...data,
    updatedAt: isDate ? new Date().getTime() : Timestamp.now(),
  }
}

export const addFieldsDelete = <T>(data?: T, isDate?: boolean): T => {
  return {
    ...data,
    updatedAt: isDate ? new Date().getTime() : Timestamp.now(),
    deletedAt: isDate ? new Date().getTime() : Timestamp.now(),
  } as T
}

export const transformTimestampToDate = <T>(
  data: T & {
    createdAt?: Timestamp
    updatedAt?: Timestamp
  },
): T => {
  return {
    ...data,
    createdAt: data?.createdAt?.toDate?.(),
    updatedAt: data?.updatedAt?.toDate?.(),
  }
}
