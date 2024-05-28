import { getOrganizationTypeList } from '@/firebase/organizationType'
import { Organization, OrganizationType } from '@/models'
import { useAppDispatch, useAppSelector } from '@/store'
import { useRouter } from 'next/router'
import { useEffect, useState } from 'react'
import { useForm } from 'react-hook-form'
import {
  setStoreProfileActiveTab,
  setStoreProfileEditState,
  setStoreProfileOrganizationName,
  setStoreProfileOrganizationGrade,
  setStoreUserInfoFromProfile,
} from '@/store/reducers/profile'
import { getOrganizationType } from '@/firebase/organizationType'
import { getPrefectureUnivAndJuniorCollegeList } from '@/firebase/organization'

export const useSearchUniversity = () => {
  const router = useRouter()
  const dispatch = useAppDispatch()
  const { control, watch, setValue } = useForm()
  const { userInfo } = useAppSelector((state) => state.profile)
  const { prefectureOptionList, organizationTypeList } = useAppSelector((state) => state.global)

  const searchValue = watch('searchValue') || ''
  const [tempOrg, setTmpOrg] = useState<Organization[]>([])
  const [organizationList, setOrganizationList] = useState<Organization[]>([])
  const [selectedPrefecture, setSelectedPrefecture] = useState<string>('')

  const getOrganizationTypes = async () => {
    return organizationTypeList.length === 0 ? await getOrganizationTypeList() : organizationTypeList
  }
  const getUnivAndJuniorCollege = (organizationList: OrganizationType[]) => {
    const univ = organizationList.find((data) => data.name === '大学')
    const juniorCollege = organizationList.find((data) => data.name === '短期大学')
    return [univ!, juniorCollege!]
  }

  useEffect(() => {
    setOrganizationList(searchValue === '' ? tempOrg : tempOrg.filter((item) => item.name.includes(searchValue)))
  }, [searchValue])

  const selectPrefecture = async (value: string) => {
    const organizationTypes = await getOrganizationTypes()
    const [univ, juniorCollege] = getUnivAndJuniorCollege(organizationTypes)
    const list = await getPrefectureUnivAndJuniorCollegeList(value, univ.id, juniorCollege.id)

    setTmpOrg(list)
    setOrganizationList(list)
  }

  const selectOrganization = async (data: Organization) => {
    const org_type = await getOrganizationType(data.organizationType)
    dispatch(setStoreProfileActiveTab(1))
    dispatch(setStoreProfileEditState(true))
    dispatch(setStoreProfileOrganizationName(data))
    dispatch(setStoreProfileOrganizationGrade(org_type?.grade || ''))
    dispatch(
      setStoreUserInfoFromProfile({
        ...userInfo,
        occupation: {
          ...userInfo.occupation,
          type: '大学生',
          organization: data.name,
        },
      }),
    )
    router.push('/profile')
  }

  return {
    router,
    dispatch,

    getOrganizationTypes,
    getUnivAndJuniorCollege,

    control,
    prefectureOptionList,
    organizationTypeList,
    organizationList,
    selectedPrefecture,
    searchValue,
    setValue,
    setSelectedPrefecture,
    setOrganizationList,
    setTmpOrg,

    selectPrefecture,
    selectOrganization,
  }
}
