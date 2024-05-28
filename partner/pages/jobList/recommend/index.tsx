import CompleteProfileBar from '@/components/organisms/Bar/CompleteProfileBar'
import JobCard, { JobCardProps } from '@/components/organisms/Card/JobCard'
import AfterLoginLayout from '@/components/layouts/AfterLoginLayout'
import { useEffect, useState } from 'react'
import { customizeLeaderProjectList } from '@/utils/common'
import { useAppSelector } from '@/store'
import { getRecommendedLeadersWantedProjectListByClub } from '@/firebase/leadersWantedProject'

export default function Page() {
  const { cityList } = useAppSelector((state) => state.global)
  const { userInfo } = useAppSelector((state) => state.profile)
  const [recEventList, setRecEventList] = useState<JobCardProps[]>([])
  const [isCompleteProfile, setIsCompleteProfile] = useState<boolean>(false)

  useEffect(() => {
    setIsCompleteProfile(localStorage.getItem('isCompleteProfile') === 'complete')
  }, [])

  useEffect(() => {
    const fetchData = async () => {
      if (!userInfo.areasOfActivity.length || !cityList.length) return

      const possibleAreaCustomized = userInfo.areasOfActivity
        .map((area) => {
          const index = cityList.findIndex((city) => city.id == area)
          return index != -1 ? cityList[index].city : ''
        })
        .filter(Boolean)

      const recommendEventList = await getRecommendedLeadersWantedProjectListByClub(possibleAreaCustomized)
      setRecEventList(customizeLeaderProjectList(recommendEventList))
    }

    fetchData()
  }, [userInfo, cityList])

  return (
    <div className="h-full bg-gray-white">
      <AfterLoginLayout>
        <div className="">
          {!isCompleteProfile && <CompleteProfileBar />}

          <div className="">
            <div className="mx-auto min-w-[300px] max-w-[800px]">
              <div className=" mx-auto mb-[20px]">
                <div className="mx-[20px] mb-[10px] mt-5 flex gap-[20px]">
                  <p className="font-bold sp:text-[16px]">おすすめの求人</p>
                  <div className="flex">
                    <p className="font-bold text-core-blue sp:text-[18px]">{recEventList.length}</p>
                    <p className="self-center sp:text-[14px]">件</p>
                  </div>
                </div>

                <div className="grid gap-[10px]">
                  {recEventList.map((data, index) => (
                    <JobCard {...data} key={index} />
                  ))}
                </div>
              </div>
            </div>
          </div>
        </div>
      </AfterLoginLayout>
    </div>
  )
}
