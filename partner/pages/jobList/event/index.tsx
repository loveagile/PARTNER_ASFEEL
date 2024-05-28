import { JobCardProps } from '@/components/organisms/Card/JobCard'
import AfterLoginLayout from '@/components/layouts/AfterLoginLayout'
import { useState, useEffect } from 'react'
import { getEventProjectListByOrganization } from '@/firebase/eventProject'
import { customizeEventList } from '@/utils/common'
import { useAppSelector } from '@/store'
import CompleteProfileBar from '@/components/organisms/Bar/CompleteProfileBar'
import ShortJobCard from '@/components/organisms/Card/ShortJobCard'

export default function Page() {
  const { userInfo } = useAppSelector((state) => state.profile)
  const [evEventList, setEvEventList] = useState<JobCardProps[]>([])
  const [isCompleteProfile, setIsCompleteProfile] = useState<boolean>(false)

  useEffect(() => {
    setIsCompleteProfile(localStorage.getItem('isCompleteProfile') === 'complete')
  }, [])

  useEffect(() => {
    const fetchData = async () => {
      const schoolName = userInfo.occupation.organization
      const evEventList = await getEventProjectListByOrganization(schoolName)
      setEvEventList(customizeEventList(evEventList))
    }

    fetchData()
  }, [])

  return (
    <div className="h-full bg-gray-white">
      <AfterLoginLayout>
        <div>
          {!isCompleteProfile && <CompleteProfileBar />}

          <div className="">
            <div className="mx-auto mb-[20px] min-w-[300px] max-w-[800px]">
              <div className="mx-[20px] mb-[10px] mt-5 flex gap-[20px]">
                <p className="font-bold sp:text-[16px]">イベントスタッフ募集</p>
                <div className="flex">
                  <p className="font-bold text-core-blue sp:text-[18px]">{evEventList.length}</p>
                  <p className="self-center sp:text-[14px]">件</p>
                </div>
              </div>

              <div className="grid gap-[10px]">
                {evEventList.map((data, index) => (
                  <ShortJobCard {...data} key={index} />
                ))}
              </div>
            </div>
          </div>
        </div>
      </AfterLoginLayout>
    </div>
  )
}
