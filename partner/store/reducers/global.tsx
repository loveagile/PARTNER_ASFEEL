import { IconTypeSelectBox, SelectBoxSize } from '@/components/atoms/Input'
import {
  CheckedNotification,
  ClubTypeMediumCategory,
  MessageRoomType,
  Notification,
  OrganizationType,
  Prefecture,
  PrivateUser,
} from '@/models'
import { CityTypePopulate, ClubTypeCategoryPopulate, Option } from '@/types'
import { createSlice, PayloadAction } from '@reduxjs/toolkit'
import { User } from 'firebase/auth'
import { Timestamp } from 'firebase/firestore'

interface GlobalState {
  isInit: boolean
  authUser: User | null
  loginUserData: PrivateUser
  subDomainPref: string
  organizationTypeList: OrganizationType[]
  prefectureList: Prefecture[]
  prefectureOptionList: Option[]
  clubList: ClubTypeCategoryPopulate[]
  clubOptionList: Option[]
  cityList: CityTypePopulate[]
  mediumCategoryList: ClubTypeMediumCategory[]
  notiList: Notification[]
  userCheckedNotiList: CheckedNotification[]
  messageList: MessageRoomType[]
  loading: boolean
  isNavbarOpen: boolean
}

const initialState: GlobalState = {
  isInit: false,
  authUser: null,
  subDomainPref: '',
  organizationTypeList: [],
  prefectureList: [],
  prefectureOptionList: [],
  clubList: [],
  clubOptionList: [
    {
      value: 'すべて',
      placeholder: false,
      text: 'すべて',
      size: SelectBoxSize.PC,
      icon: IconTypeSelectBox.OFF,
    },
  ],
  cityList: [],
  mediumCategoryList: [],
  notiList: [],
  userCheckedNotiList: [],
  messageList: [],
  loading: false,
  isNavbarOpen: false,
  loginUserData: {
    createdAt: Timestamp.now(),
    updatedAt: Timestamp.now(),
    email: '',
    confirmEmail: '',
    name: {
      sei: '',
      mei: '',
      seiKana: '',
      meiKana: '',
    },
    gender: null,
    occupation: {
      type: '',
      organization: '',
      faculty: '',
      grade: '',
    },
    birthday: Timestamp.now(),
    address: {
      zip: 0,
      prefecture: '',
      city: '',
      address1: '',
      address2: '',
    },
    phoneNumber: 0,
    clubs: [],
    areasOfActivity: [],
    areaNotes: [],
    officeHours: {
      monday: [],
      tuesday: [],
      wednesday: [],
      thursday: [],
      friday: [],
      saturday: [],
      sunday: [],
    },
    isExpeditionPossible: null,
    experience: null,
    experienceNote: '',
    teacherLicenseStatus: null,
    teacherLicenseNote: '',
    otherLicense: null,
    otherLicenseNote: '',
    hasDriverLicense: null,
    pr: '',
    questionsForPrefecture: [],
    career: [],
    subscribeEmail: null,
    isSuspended: false,
    isDeletedAccount: false,
    avatar: '',
  },
}

export const globalSlice = createSlice({
  name: 'global',
  initialState,
  reducers: {
    setIsInit: (state, action: PayloadAction<boolean>) => {
      state.isInit = action.payload
    },
    setAuthUser: (state, action: PayloadAction<User | null>) => {
      state.authUser = action.payload
    },
    setStoreSubDomainPref: (state, action: PayloadAction<string>) => {
      state.subDomainPref = action.payload
    },
    setStoreOrganizationTypeList: (state, action: PayloadAction<OrganizationType[]>) => {
      state.organizationTypeList = action.payload
    },
    setStorePrefectureList: (state, action: PayloadAction<Prefecture[]>) => {
      state.prefectureList = action.payload
    },
    setStorePrefectureOptionList: (state, action: PayloadAction<Option[]>) => {
      state.prefectureOptionList = action.payload
    },
    setStoreClubPopulateList: (state, action: PayloadAction<ClubTypeCategoryPopulate[]>) => {
      state.clubList = action.payload

      const options = action.payload.map((data) => {
        return {
          value: data.name,
          placeholder: false,
          text: data.name,
          size: SelectBoxSize.PC,
          icon: IconTypeSelectBox.OFF,
        }
      })
      state.clubOptionList = [
        {
          value: 'すべて',
          placeholder: false,
          text: 'すべて',
          size: SelectBoxSize.PC,
          icon: IconTypeSelectBox.OFF,
        },
        ...options,
      ]
    },
    setStoreCityPopulateList: (state, action: PayloadAction<CityTypePopulate[]>) => {
      state.cityList = action.payload
    },
    setStoreMediumCategoryList: (state, action: PayloadAction<ClubTypeMediumCategory[]>) => {
      state.mediumCategoryList = action.payload
    },
    setStoreLoginUserData: (state, action: PayloadAction<PrivateUser>) => {
      state.loginUserData = action.payload
    },
    setStoreNotiList: (state, action: PayloadAction<Notification>) => {
      state.notiList = [...state.notiList, action.payload]
    },
    setStoreCheckedNotiList: (state, action: PayloadAction<CheckedNotification>) => {
      state.userCheckedNotiList = [...state.userCheckedNotiList, action.payload]
    },
    setStoreMessageList: (state, action: PayloadAction<MessageRoomType>) => {
      state.messageList = [...state.messageList, action.payload]
    },
    setStoreModifyMessageList: (state, action: PayloadAction<MessageRoomType>) => {
      state.messageList = [...state.messageList.filter((room) => room.id !== action.payload.id), action.payload]
    },
    setStoreLoading: (state, action: PayloadAction<boolean>) => {
      state.loading = action.payload
    },
    setStoreIsNavbarOpen: (state, action: PayloadAction<boolean>) => {
      state.isNavbarOpen = action.payload
    },
  },
})

export const {
  setIsInit,
  setAuthUser,
  setStoreSubDomainPref,
  setStoreLoading,
  setStoreIsNavbarOpen,
  setStoreOrganizationTypeList,
  setStorePrefectureList,
  setStoreCityPopulateList,
  setStoreMediumCategoryList,
  setStorePrefectureOptionList,
  setStoreClubPopulateList,
  setStoreLoginUserData,
  setStoreNotiList,
  setStoreCheckedNotiList,
  setStoreMessageList,
  setStoreModifyMessageList,
} = globalSlice.actions

export default globalSlice.reducer
