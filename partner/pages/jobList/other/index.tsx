import SelectBox, { SelectBoxSize, SelectBoxType } from '@/components/atoms/Input/SelectBox'
import AfterLoginLayout from '@/components/layouts/AfterLoginLayout'
import CompleteProfileBar from '@/components/organisms/Bar/CompleteProfileBar'
import JobCard, { JobCardProps } from '@/components/organisms/Card/JobCard'
import { getLeadersWantedProjectList, getLeadersWantedProjectListByClub } from '@/firebase/leadersWantedProject'
import { useAppDispatch, useAppSelector } from '@/store'
import { setStoreLoading } from '@/store/reducers/global'
import { customizeLeaderProjectList } from '@/utils/common'
import { useState, useEffect } from 'react'

export default function OtherJobList() {
  const dispatch = useAppDispatch()
  const { clubOptionList } = useAppSelector((state) => state.global)

  const [group, setGroup] = useState<string>('')
  const [eventProjectList, setEventProjectList] = useState<JobCardProps[]>([])
  const [isCompleteProfile, setIsCompleteProfile] = useState<boolean>(false)

  useEffect(() => {
    if (!clubOptionList) return

    setIsCompleteProfile(localStorage.getItem('isCompleteProfile') == 'complete')
    setGroup('すべて')
  }, [clubOptionList])

  useEffect(() => {
    const fetchData = async () => {
      dispatch(setStoreLoading(true))

      const eventProject =
        group == 'すべて' || group == ''
          ? await getLeadersWantedProjectList()
          : await getLeadersWantedProjectListByClub(group)
      setEventProjectList(customizeLeaderProjectList(eventProject))

      dispatch(setStoreLoading(false))
    }

    fetchData()
  }, [group])

  return (
    <div className="h-full bg-gray-white">
      <AfterLoginLayout>
        <div className="">
          {!isCompleteProfile && <CompleteProfileBar />}

          <div className="mx-auto flex max-w-[800px] justify-between sp:pt-[24px] pc:pb-[16px] pc:pt-[34px]">
            <div className="ml-[20px]">
              <h1 className="font-bold sp:text-[14px] pc:text-[24px]">募集中の求人</h1>
              <div className="flex">
                <h2 className="text-blue-500 sp:text-[24px] pc:text-[32px]">{eventProjectList.length}</h2>
                <h3 className="sp:ml-1 sp:mt-2.5 sp:text-[14px] pc:ml-2 pc:mt-4 pc:text-[16px]">件</h3>
              </div>
            </div>
            <div className="mr-[20px]">
              <div className="flex gap-2 sp:mt-[20px] pc:mt-[40px]">
                <h2 className="self-center sp:text-xs pc:text-[13px]">絞り込み</h2>
                <SelectBox
                  setValue={setGroup}
                  size={SelectBoxSize.PC}
                  status={SelectBoxType.DEFAULT}
                  options={clubOptionList}
                  className="sp:w-[120px] pc:w-[200px]"
                  value={group}
                />
              </div>
            </div>
          </div>

          <div className="py-[20px]">
            <div className="cards relative z-0 mx-auto grid max-w-[800px] gap-[10px]">
              {eventProjectList &&
                eventProjectList.length > 0 &&
                eventProjectList.map((data, index) => <JobCard {...data} key={index} />)}
            </div>
          </div>
        </div>
      </AfterLoginLayout>
    </div>
  )
}
