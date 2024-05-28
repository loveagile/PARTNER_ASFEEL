import { OrganizationType, Prefecture } from '@/models'
import { ClubTypeCategoryPopulate, Option, OrganizationPopulate } from '@/types'
import { createSlice, PayloadAction } from '@reduxjs/toolkit'

interface GlobalState {
  subDomainPref: string
  prefectureList: Prefecture[]
  clubList: ClubTypeCategoryPopulate[]
  prefectureOptionList: Option[]
  organizationTypeList: OrganizationType[]
  organizationTypeOptionList: Option[]
  organizationList: OrganizationPopulate[]
  organizationByPrefList: Option[]
  organizationUniversityOptionList: Option[]
}

const initialState: GlobalState = {
  subDomainPref: '',
  prefectureList: [],
  clubList: [],
  prefectureOptionList: [],
  organizationTypeList: [],
  organizationTypeOptionList: [],
  organizationList: [],
  organizationByPrefList: [],
  organizationUniversityOptionList: [],
}

export const globalSlice = createSlice({
  name: 'global',
  initialState,
  reducers: {
    setStoreSubDomainPref: (state, action: PayloadAction<string>) => {
      state.subDomainPref = action.payload
    },
    setStorePrefectureList: (state, action: PayloadAction<Prefecture[]>) => {
      state.prefectureList = action.payload
    },
    setStorePrefectureOptionList: (state, action: PayloadAction<Option[]>) => {
      state.prefectureOptionList = action.payload
    },
    setStoreClubPopulateList: (state, action: PayloadAction<ClubTypeCategoryPopulate[]>) => {
      state.clubList = action.payload
    },
    setStoreOrganizationTypeList: (state, action: PayloadAction<OrganizationType[]>) => {
      state.organizationTypeList = action.payload
    },
    setStoreOrganizationTypeOptionList: (state, action: PayloadAction<Option[]>) => {
      state.organizationTypeOptionList = action.payload
    },
    setStoreOrganizationList: (state, action: PayloadAction<OrganizationPopulate[]>) => {
      state.organizationList = action.payload
    },
    setStoreOrganizationByPref: (state, action: PayloadAction<Option[]>) => {
      state.organizationByPrefList = action.payload
    },
    setStoreOrganizationUniversityOptionList: (state, action: PayloadAction<Option[]>) => {
      state.organizationUniversityOptionList = action.payload
    },
  },
})

export const {
  setStoreSubDomainPref,
  setStorePrefectureList,
  setStorePrefectureOptionList,
  setStoreClubPopulateList,
  setStoreOrganizationTypeList,
  setStoreOrganizationTypeOptionList,
  setStoreOrganizationList,
  setStoreOrganizationByPref,
  setStoreOrganizationUniversityOptionList,
} = globalSlice.actions

export default globalSlice.reducer
