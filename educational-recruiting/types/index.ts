import { FieldValue, Timestamp } from 'firebase/firestore'

export type Address = {
  zip: number
  prefecture: string
  city: string
  address1: string
  address2: string
}

export type Name = {
  sei: string
  mei: string
  seiKana: string
  meiKana: string
}

export type ScheduleType = {
  [key: string]: any[]
}

export type OfficeHourType = {
  date: FieldValue | Timestamp
  start: {
    hour: string
    min: string
  }
  end: {
    hour: string
    min: string
  }
}

export type Option = {
  value: string
  placeholder: boolean
  text: string
  icon: number
  size: number
}

export type ClubTypeCategoryPopulate = {
  id?: string
  createdAt: Timestamp
  updatedAt: Timestamp
  largeCategory: string
  mediumCategory: string
  name: string
  isPublish: boolean
  largeCategoryName: string
  mediumCategoryName: string
}

export type OrganizationPopulate = {
  id: string
  createdAt: Timestamp
  updatedAt: Timestamp
  organizationId: string
  organizationType: string
  organizationName: string
  name: string
  address: Address
  phoneNumber: number
  isSuspended: boolean
}
