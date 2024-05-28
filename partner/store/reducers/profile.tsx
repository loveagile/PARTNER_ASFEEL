import { todayStartTimestamp } from '@/libs/dayjs/dayjs'
import { Organization, PrivateUser } from '@/models'
import { createSlice, PayloadAction } from '@reduxjs/toolkit'
import { Timestamp } from 'firebase/firestore'

interface ProfileState {
  isProfileEdit: boolean
  isProfileEmailChange: boolean
  profileActiveTab: number

  organizationName: string
  organizationGrade: string
  userInfo: PrivateUser
  initUserInfo: boolean
}

const initialState: ProfileState = {
  isProfileEdit: false,
  isProfileEmailChange: false,
  profileActiveTab: 0,

  organizationName: '',
  organizationGrade: '',
  userInfo: {
    createdAt: Timestamp.now(),
    updatedAt: Timestamp.fromMillis(todayStartTimestamp()),
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
    career: [],
    subscribeEmail: null,
    isSuspended: false,
    isDeletedAccount: false,
    questionsForPrefecture: [],
    avatar: '',
  },
  initUserInfo: false,
}

export const profileSlice = createSlice({
  name: 'profile',
  initialState,
  reducers: {
    // /profileで使用
    setStoreProfileEditState: (state, action: PayloadAction<boolean>) => {
      state.isProfileEdit = action.payload
    },
    setStoreProfileActiveTab: (state, action: PayloadAction<number>) => {
      state.profileActiveTab = action.payload
    },
    setStoreProfileOrganizationName: (state, action: PayloadAction<Organization>) => {
      state.organizationName = action.payload.name
    },
    setStoreProfileOrganizationGrade: (state, action: PayloadAction<string>) => {
      state.organizationGrade = action.payload
    },
    setStoreUserInfoFromProfile: (state, action: PayloadAction<PrivateUser>) => {
      state.userInfo = action.payload
    },
    setStoreChangeEmail: (state, action: PayloadAction<boolean>) => {
      state.isProfileEmailChange = action.payload
    },

    // privateUserの情報をstoreに保存
    setStoreUserInfo: (state, action: PayloadAction<PrivateUser>) => {
      state.userInfo = action.payload
      state.initUserInfo = true
    },

    // /useAuthUserStateProviderで使用
    resetUserInfo: (state) => {
      state.userInfo = initialState.userInfo
    },
  },
})

export const {
  // /profileで使用
  setStoreProfileEditState,
  setStoreProfileActiveTab,
  setStoreProfileOrganizationName,
  setStoreProfileOrganizationGrade,
  setStoreUserInfoFromProfile,
  setStoreChangeEmail,

  // privateUserの情報をstoreに保存
  setStoreUserInfo,

  // /useAuthUserStateProviderで使用
  resetUserInfo,
} = profileSlice.actions

export default profileSlice.reducer
