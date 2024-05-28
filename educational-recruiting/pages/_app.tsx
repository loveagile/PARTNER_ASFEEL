import { useEffect, type ReactElement, type ReactNode } from 'react'
import type { NextPage } from 'next'
import type { AppProps } from 'next/app'
import '@/styles/globals.css'
import ReduxWrapper, { useAppDispatch } from '../store'
import { IconTypeSelectBox, SelectBoxSize } from '@/components/atoms'
import { getPrefectureList } from '@/firebase/prefecture'
import {
  setStoreClubPopulateList,
  setStoreOrganizationList,
  setStoreOrganizationTypeOptionList,
  setStoreOrganizationTypeList,
  setStorePrefectureList,
  setStorePrefectureOptionList,
  setStoreOrganizationUniversityOptionList,
  setStoreSubDomainPref,
} from '@/store/reducers/global'
import { ClubTypeCategoryPopulate, Option, OrganizationPopulate } from '@/types'
import { OrganizationType, Prefecture } from '@/models'
import { getClubTypeCategoryPopulateList } from '@/firebase/clubTypeCategory'
import { getOrganizationTypeList } from '@/firebase/organizationType'
import { getOrganizationPopulateList } from '@/firebase/organization'
import { getPrefectureFromHostname } from '@/utils/common'

export type NextPageWithLayout<P = {}, IP = P> = NextPage<P, IP> & {
  getLayout?: (page: ReactElement) => ReactNode
}

type AppPropsWithLayout = AppProps & {
  Component: NextPageWithLayout
}

const App = ({ Component, pageProps }: AppPropsWithLayout) => {
  const dispatch = useAppDispatch()

  useEffect(() => {
    const prefJa = getPrefectureFromHostname('ja')
    dispatch(setStoreSubDomainPref(prefJa))

    const fetchData = async () => {
      let tmpPrefecture = [
        {
          value: '',
          placeholder: true,
          text: '都道府県を選択',
          icon: IconTypeSelectBox.OFF,
          size: SelectBoxSize.PC,
        },
      ]

      let tmpOrganization = [
        {
          value: '',
          placeholder: true,
          text: '学校区分を選択',
          icon: IconTypeSelectBox.OFF,
          size: SelectBoxSize.PC,
        },
      ]

      const prefectureList = await getPrefectureList()
      dispatch(setStorePrefectureList(prefectureList))

      let customizedList = [...tmpPrefecture, ...customizePrefectureList(prefectureList)]
      const prefectureOptions = customizedList.map((item) => {
        return {
          ...item,
          value: item.text,
          label: item.text,
        }
      })
      dispatch(setStorePrefectureOptionList(prefectureOptions))

      const clubList: ClubTypeCategoryPopulate[] = await getClubTypeCategoryPopulateList()
      dispatch(setStoreClubPopulateList(clubList))

      const organizationTypeList: OrganizationType[] = await getOrganizationTypeList()
      dispatch(setStoreOrganizationTypeList(organizationTypeList))

      const organizationTypeOptionList: Option[] = [...tmpOrganization, ...customizeOrganizationTypeList(organizationTypeList)]
      dispatch(setStoreOrganizationTypeOptionList(organizationTypeOptionList))

      const organizationList: OrganizationPopulate[] = await getOrganizationPopulateList()
      dispatch(setStoreOrganizationList(organizationList))

      const filteredOrganization: OrganizationPopulate[] = organizationList.filter((organization) => organization.organizationName == '大学')
      const organizationUniversityOptionList: Option[] = [...customizeOrganizationList(filteredOrganization)]
      dispatch(setStoreOrganizationUniversityOptionList(organizationUniversityOptionList))
    }

    fetchData()
  }, [])

  // customize the prefecture list that can use in select options
  const customizePrefectureList = (prefectureSelectList: Prefecture[]): Option[] => {
    let optionList: Option[] = []
    prefectureSelectList.map((data, index) => {
      optionList.push({
        value: data.id,
        placeholder: false,
        text: data.prefecture,
        icon: IconTypeSelectBox.OFF,
        size: SelectBoxSize.PC,
      })
    })

    return optionList
  }

  // customize the prefecture list that can use in select options
  const customizeOrganizationTypeList = (orgDataList: OrganizationType[]): Option[] => {
    let optionList: Option[] = []
    orgDataList.map((data, index) => {
      optionList.push({
        value: data.id,
        placeholder: false,
        text: data.name,
        icon: IconTypeSelectBox.OFF,
        size: SelectBoxSize.PC,
      })
    })

    return optionList
  }

  const customizeOrganizationList = (orgDataList: OrganizationPopulate[]): Option[] => {
    let optionList: Option[] = []
    orgDataList.map((data, index) => {
      optionList.push({
        value: data.organizationId,
        placeholder: false,
        text: data.name,
        icon: IconTypeSelectBox.OFF,
        size: SelectBoxSize.PC,
      })
    })

    return optionList
  }

  // Use the layout defined at the page level, if available
  const getLayout = Component.getLayout ?? ((page) => page)

  return getLayout(<Component {...pageProps} />)
}

export default ReduxWrapper.withRedux(App)
