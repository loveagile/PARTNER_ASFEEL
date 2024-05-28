import Button, {
  ButtonArrow,
  ButtonColor,
  ButtonIcon,
  ButtonShape,
  ButtonSize,
  ButtonType,
} from '@/components/atoms/Button/Button'
import { useView } from '@/hooks'
import { useState, useEffect } from 'react'
import { useRouter } from 'next/router'
import CompleteProfileBar from '@/components/organisms/Bar/CompleteProfileBar'
import JobCard, { JobCardProps } from '@/components/organisms/Card/JobCard'
import ShortJobCard from '@/components/organisms/Card/ShortJobCard'
import AfterLoginLayout from '@/components/layouts/AfterLoginLayout'
import { getEventProjectListByOrganization } from '@/firebase/eventProject'
import { customizeEventList, customizeLeaderProjectList } from '@/utils/common'
import { useAppDispatch, useAppSelector } from '@/store'
import {
  getLeadersWantedProjectList,
  getRecommendedLeadersWantedProjectListByClub,
} from '@/firebase/leadersWantedProject'
import AppLoader from '@/components/atoms/AppLoader'
import { LOCAL_STORAGE } from '@/utils/constants/localStorage'
import HeroSection from '@/components/organisms/PageTop/HeroSection'

const useInit = () => {
  const view = useView()
  const router = useRouter()
  const dispatch = useAppDispatch()
  const { userInfo } = useAppSelector((state) => state.profile)
  const { cityList } = useAppSelector((state) => state.global)

  const [recEventList, setRecEventList] = useState<JobCardProps[]>([])
  const [evEventList, setEvEventList] = useState<JobCardProps[]>([])
  const [allEventList, setAllEventList] = useState<JobCardProps[]>([])
  const [isCompleteProfile, setIsCompleteProfile] = useState<boolean>(false)
  const [loading, setLoading] = useState<boolean>(true)

  useEffect(() => {
    window.scrollTo(0, 0)
    setIsCompleteProfile(localStorage.getItem(LOCAL_STORAGE.isCompleteProfile) === 'complete')
  }, [])

  useEffect(() => {
    const fetchData = async () => {
      if (!userInfo.areasOfActivity.length || !cityList.length) return

      try {
        setLoading(true)
        const possibleAreaCustomized = userInfo.areasOfActivity
          .map((area) => {
            const index = cityList.findIndex((city) => city.id == area)
            return index != -1 ? cityList[index].city : ''
          })
          .filter(Boolean)

        const [recommendEventList, evEventList, allLeaderList] = await Promise.all([
          getRecommendedLeadersWantedProjectListByClub(possibleAreaCustomized),
          getEventProjectListByOrganization(userInfo.occupation.organization),
          getLeadersWantedProjectList(),
        ])
        setRecEventList(customizeLeaderProjectList(recommendEventList).slice(0, 3))
        setEvEventList(customizeEventList(evEventList).slice(0, 2))
        setAllEventList(customizeLeaderProjectList(allLeaderList).slice(0, 2))
      } catch (error) {
        alert('データを読み込むことができませんでした')
      } finally {
        setLoading(false)
      }
    }

    fetchData()
  }, [userInfo, cityList])

  return {
    view,
    router,
    recEventList,
    evEventList,
    allEventList,
    isCompleteProfile,
    loading,
    dispatch,
  }
}

export default function AfterLoginPage() {
  const { view, router, recEventList, evEventList, allEventList, isCompleteProfile, loading } = useInit()

  return (
    <div className="h-full bg-gray-white">
      <AfterLoginLayout>
        <HeroSection view={view} />

        {loading ? (
          <div className="flex items-center justify-center pt-32">
            <AppLoader />
          </div>
        ) : (
          <div>
            {!isCompleteProfile && <CompleteProfileBar />}
            <div>
              <div className="mx-auto min-w-[300px] max-w-[800px]">
                {/* おすすめの求人 */}
                {recEventList.length > 0 && (
                  <div>
                    <div className="mx-[20px] mb-[10px] mt-5">
                      <p className="font-bold sp:text-[16px]">おすすめの求人</p>
                    </div>

                    <div className="grid gap-[10px]">
                      {recEventList.map((data, index) => (
                        <JobCard {...data} key={index} />
                      ))}
                    </div>

                    <div className="flex items-center justify-center pb-[20px] pt-[10px]">
                      <Button
                        size={ButtonSize.PC}
                        color={ButtonColor.SUB}
                        type={ButtonType.SECONDARY}
                        shape={ButtonShape.RECTANGLE}
                        disabled={false}
                        icon={ButtonIcon.FRONT}
                        arrow={ButtonArrow.RIGHT}
                        text="すべて見る"
                        onclick={() => {
                          router.push('/jobList/recommend')
                        }}
                        className="border-2 py-1.5 sp:h-[34px] sp:w-[150px] sp:px-3 pc:h-[56px] pc:w-[190px] pc:px-6"
                      />
                    </div>
                  </div>
                )}

                {/* イベントスタッフ募集 */}
                {evEventList.length > 0 && (
                  <div>
                    <div className="mx-[20px] mb-[10px] mt-5">
                      <p className="font-bold sp:text-[16px]">イベントスタッフ募集</p>
                    </div>

                    <div className="grid gap-[10px]">
                      {evEventList.map((data, index) => (
                        <ShortJobCard {...data} key={index} />
                      ))}
                    </div>

                    <div className="flex items-center justify-center pb-[20px] pt-[10px]">
                      <Button
                        size={ButtonSize.PC}
                        color={ButtonColor.SUB}
                        type={ButtonType.SECONDARY}
                        shape={ButtonShape.RECTANGLE}
                        disabled={false}
                        icon={ButtonIcon.FRONT}
                        arrow={ButtonArrow.RIGHT}
                        text="すべて見る"
                        onclick={() => {
                          router.push('/jobList/event')
                        }}
                        className="border-2 py-1.5 sp:h-[34px] sp:w-[150px] sp:px-3 pc:h-[56px] pc:w-[190px] pc:px-6"
                      />
                    </div>
                  </div>
                )}

                {/* その他の募集 */}
                {allEventList.length > 0 && (
                  <div>
                    <div className="mx-[20px] mb-[10px] mt-5">
                      <p className="font-bold sp:text-[16px]">その他の募集</p>
                    </div>

                    <div className="grid gap-[10px]">
                      {allEventList.map((data, index) => (
                        <JobCard {...data} key={index} />
                      ))}
                    </div>

                    <div className="flex items-center justify-center pb-[20px] pt-[10px]">
                      <Button
                        size={ButtonSize.PC}
                        color={ButtonColor.SUB}
                        type={ButtonType.SECONDARY}
                        shape={ButtonShape.RECTANGLE}
                        disabled={false}
                        icon={ButtonIcon.FRONT}
                        arrow={ButtonArrow.RIGHT}
                        text="すべて見る"
                        onclick={() => {
                          router.push('/jobList')
                        }}
                        className="border-2 py-1.5 sp:h-[34px] sp:w-[150px] sp:px-3 pc:h-[56px] pc:w-[190px] pc:px-6"
                      />
                    </div>
                  </div>
                )}
              </div>
            </div>
          </div>
        )}
      </AfterLoginLayout>
    </div>
  )
}
