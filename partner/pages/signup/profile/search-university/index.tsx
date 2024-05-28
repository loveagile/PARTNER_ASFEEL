import SelectBox, { SelectBoxSize, SelectBoxType } from '@/components/atoms/Input/SelectBox'
import { useEffect } from 'react'
import { Input, InputStatus } from '@/components/atoms'
import { Organization, PrivateUser } from '@/models'
import { getPrefectureUnivAndJuniorCollegeList } from '@/firebase/organization'
import { createEmptySignUpToken } from '@/utils/common'
import { decrypt, encrypt } from '@/utils/token'
import { setStoreOrganizationTypeList } from '@/store/reducers/global'
import { useSearchUniversity } from '@/hooks/useSearchUniversity'

export default function Page() {
  const {
    router,
    dispatch,

    getOrganizationTypes,
    getUnivAndJuniorCollege,

    control,
    prefectureOptionList,
    organizationTypeList,
    organizationList,
    selectedPrefecture,
    setValue,
    setSelectedPrefecture,
    setOrganizationList,
    setTmpOrg,
  } = useSearchUniversity()

  useEffect(() => {
    const fetchPrefecture = async () => {
      const selectPrefecture = localStorage.getItem('selected_prefecture')
      setSelectedPrefecture(selectPrefecture ? selectPrefecture : '')

      const organizationTypes = await getOrganizationTypes()
      dispatch(setStoreOrganizationTypeList(organizationTypes))

      if (selectPrefecture) {
        const [univ, juniorCollege] = getUnivAndJuniorCollege(organizationTypes)
        const list = await getPrefectureUnivAndJuniorCollegeList(selectPrefecture, univ.id, juniorCollege.id)
        setTmpOrg(list)
        setOrganizationList(list)
      }
    }

    fetchPrefecture()
  }, [])

  const selectPrefecture = async (value: string) => {
    setValue('searchValue', '')
    localStorage.setItem('selected_prefecture', value)

    const [univ, juniorCollege] = getUnivAndJuniorCollege(organizationTypeList)
    const list = await getPrefectureUnivAndJuniorCollegeList(value, univ.id, juniorCollege.id)
    setTmpOrg(list)
    setOrganizationList(list)
  }

  const selectOrganization = async (data: Organization) => {
    const signUpData = localStorage.getItem('signup_data') || createEmptySignUpToken()

    const localUserInfo: PrivateUser = JSON.parse(decrypt(signUpData))
    localUserInfo.occupation.organization = data.name
    localUserInfo.occupation.faculty = ''
    localUserInfo.occupation.grade = ''

    const organizationType = organizationTypeList.find((type) => type.id === data.organizationType)
    localStorage.setItem('organization_name', data.name)
    localStorage.setItem('organization_grade', organizationType!.grade)
    localStorage.setItem('signup_data', encrypt(JSON.stringify(localUserInfo)))

    router.push('/signup/profile')
  }

  return (
    <div className="h-full bg-gray-white">
      <div className="fixed z-40 flex h-[60px] w-full items-center justify-center bg-core-blue_dark text-white">
        <div className="relative flex h-[60px] w-full max-w-[800px] items-center justify-center">
          <p className="text-[16px] font-bold">学校検索</p>
          <p
            className="absolute right-[20px] top-[20px] cursor-pointer text-[14px] font-bold"
            onClick={() => {
              router.push('/signup/profile')
            }}
          >
            完了
          </p>
        </div>
      </div>

      {prefectureOptionList && prefectureOptionList.length > 0 && (
        <div className="relative top-[60px] mx-auto max-w-[800px]">
          <div>
            <div className="p-5">
              <SelectBox
                setValue={(value) => selectPrefecture(value.toString())}
                size={SelectBoxSize.PC}
                status={SelectBoxType.DEFAULT}
                options={prefectureOptionList}
                className="w-[100%]"
                value={selectedPrefecture}
              />
            </div>

            <Input
              status={InputStatus.SEARCH}
              placeholder="検索"
              control={control}
              name="searchValue"
              className="w-full rounded-none border-x-0 border-y-[1px] border-gray-gray_dark bg-gray-gray_lighter"
            />
          </div>

          <div className="max-h-[calc(100vh-200px)] overflow-y-auto px-5">
            {organizationList.map((data, index) => (
              <div
                className="cursor-pointer border-b border-b-gray-gray py-[14px]"
                key={index}
                onClick={() => {
                  selectOrganization(data)
                }}
              >
                <p className="text-[14px]">{data.name}</p>
              </div>
            ))}
          </div>
        </div>
      )}
    </div>
  )
}
