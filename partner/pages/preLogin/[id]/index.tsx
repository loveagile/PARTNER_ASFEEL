import DetailedJobCard, { DetailedJobCardProps } from '@/components/organisms/Card/DetailedJobCard'
import { useView } from '@/hooks'
import { useEffect, useMemo, useState } from 'react'
import { MdClose } from 'react-icons/md'
import { useRouter } from 'next/router'
import ScrollLayout from '@/components/layouts/ScrollLayout'
import StepCard from '@/components/organisms/modal/StepCard'
import { EventProject, LeadersWantedProject } from '@/models'
import { getEventProject } from '@/firebase/eventProject'
import {
  customizeDetailedEventList,
  customizeDetailedLeadersWantedProjectList,
  getPrefectureName,
  objectToDate,
} from '@/utils/common'
import { useAppSelector } from '@/store'
import { format } from 'date-fns'
import { ja } from 'date-fns/locale'
import { getLeadersWantedProject } from '@/firebase/leadersWantedProject'
import Schedule from '@/components/molecules/Table/Schedule'
import UpdatedAt from '@/components/atoms/UpdatedAt'
import { formatDate } from '@/libs/dayjs/dayjs'

const Content = () => {
  const view = useView()
  const router = useRouter()
  const [project_type, setProjectType] = useState<string>()
  const [leader_info, setLeaderInfo] = useState<LeadersWantedProject>()
  const [event_info, setEventInfo] = useState<EventProject>()
  const [topData, setTopData] = useState<DetailedJobCardProps[]>([])
  const { prefectureList } = useAppSelector((state) => state.global)
  const { id } = router.query

  useEffect(() => {
    const fetchData = async () => {
      if (id) {
        const type = id.toString().split('-')[0]
        const project_id = id.toString().split('-')[1]
        let data

        setProjectType(type)

        if (type == 'leader') {
          data = await getLeadersWantedProject(project_id)

          if (data) {
            setLeaderInfo(data)

            const topEvent: DetailedJobCardProps[] = customizeDetailedLeadersWantedProjectList([data])
            setTopData(topEvent)
          }
        } else if (type == 'event') {
          data = await getEventProject(project_id)

          if (data) {
            setEventInfo(data)

            const topEvent: DetailedJobCardProps[] = customizeDetailedEventList([data])
            setTopData(topEvent)
          }
        }
      }
    }

    fetchData()
  }, [id])

  const updateDateStr = useMemo(() => {
    return formatDate(leader_info ? leader_info.updatedAt.toDate() : event_info?.updatedAt.toDate())(
      'slashYYYYMMDDHHMM',
    )
  }, [leader_info, event_info])

  if (project_type == 'leader')
    return (
      <div className="relative">
        <div className="pb-4">
          <div className="relative mx-auto h-[46px] w-full border border-gray-100 bg-white pt-[15px] text-center">
            <p className="text-[14px] font-bold">募集詳細</p>
            <MdClose
              className="absolute right-[10px] top-2.5 text-neutral-500"
              size={24}
              onClick={() => {
                router.back()
              }}
            />
          </div>
        </div>

        <div className="sp:mx-[20px] pc:mx-0">
          <UpdatedAt updateDateStr={updateDateStr} className="mb-2 mt-5 max-w-[800px]" />

          <div className="mx-auto mb-4 max-w-[800px] rounded-2xl border border-gray-100 bg-white text-center">
            <div className="cards relative z-0 mx-auto grid max-w-[800px] sp:gap-2 pc:gap-4">
              {topData.map((data, index) => (
                <DetailedJobCard {...data} key={index} />
              ))}
            </div>

            <div className="mx-4">
              <div className="sp:pb-[14px] pc:pb-8">
                <div className="flex sp:pb-[7.5px] pc:pb-[6px]">
                  <img
                    src={`/images/icons/location.svg`}
                    className="mr-2 text-core-blue_dark sp:h-[24px] sp:w-[24px]"
                    alt=""
                  />
                  <div className="self-center text-start sp:text-[12px] pc:text-[16px]">
                    <p className="font-bold text-core-blue_dark ">勤務地</p>
                  </div>
                </div>
                <p className="text-start sp:ml-[20px] sp:text-[12px] pc:ml-[30px] pc:text-[16px]">
                  {leader_info?.workplace.prefecture
                    ? getPrefectureName(leader_info?.workplace.prefecture, prefectureList)
                    : 'ooo'}{' '}
                  {leader_info?.workplace.city}
                </p>
              </div>

              <div className="sp:pb-[14px] pc:pb-8">
                <div className="flex sp:pb-[7.5px] pc:pb-[10px]">
                  <img
                    src={`/images/icons/timeFilled.svg`}
                    className="mr-2 text-core-blue_dark sp:h-[24px] sp:w-[24px]"
                    alt=""
                  />
                  <div className="self-center text-start sp:pt-[3px] sp:text-[12px] pc:pt-[1px] pc:text-[16px]">
                    <p className="font-bold text-core-blue_dark sp:pb-[7.5px] pc:pb-[10px] ">勤務時間</p>
                    {leader_info?.workingHours &&
                      (view == 'SP' ? (
                        <Schedule schedule={leader_info?.workingHours} size="mini" className="-ml-[15px]" />
                      ) : (
                        view == 'PC' && <Schedule schedule={leader_info?.workingHours} size="small" />
                      ))}
                  </div>
                </div>
                <div className="text-start sp:ml-[20px] sp:text-[12px] pc:ml-[30px] pc:text-[16px]">
                  {leader_info?.workingHoursNote?.split(' ').map((data, index) => <p key={index}>{data}</p>)}
                </div>
              </div>

              <div className="sp:pb-[14px] pc:pb-8">
                <div className="flex sp:pb-[7.5px] pc:pb-[6px]">
                  <img
                    src={`/images/icons/currencyYen.svg`}
                    className="mr-2 text-core-blue_dark sp:h-[24px] sp:w-[24px]"
                    alt=""
                  />
                  <div className="self-center text-start sp:text-[12px] pc:text-[16px]">
                    <p className="font-bold text-core-blue_dark ">報酬について</p>
                  </div>
                </div>
                <p className="text-start sp:ml-[20px] sp:text-[12px] pc:ml-[30px] pc:text-[16px]">
                  {leader_info?.desiredSalary}
                </p>
              </div>

              <div className="sp:pb-[14px] pc:pb-8">
                <div className="flex sp:pb-[7.5px] pc:pb-[6px]">
                  <img
                    src={`/images/icons/bookOpen.svg`}
                    className="mr-2 text-core-blue_dark sp:h-[24px] sp:w-[24px]"
                    alt=""
                  />
                  <div className="self-center text-start sp:text-[12px] pc:text-[16px]">
                    <p className="font-bold text-core-blue_dark">活動の紹介</p>
                  </div>
                </div>
                <p className="text-start sp:ml-[20px] sp:text-[12px] pc:ml-[30px] pc:text-[16px]">
                  {leader_info?.activityDescription}
                </p>
              </div>

              <div className="sp:pb-[14px] pc:pb-8">
                <div className="flex  sp:pb-[7.5px] pc:pb-[13px]">
                  <img
                    src={`/images/icons/building.svg`}
                    className="mr-2 text-core-blue_dark sp:h-[24px] sp:w-[24px]"
                    alt=""
                  />
                  <div className="self-center text-start sp:text-[12px] pc:text-[16px]">
                    <p className="font-bold text-core-blue_dark">資格に関する希望</p>
                  </div>
                </div>
                <div className="text-start sp:ml-[20px] sp:text-[12px] pc:ml-[30px] pc:text-[16px]">
                  {leader_info?.desiredQualifications?.split(' ').map((data, index) => <p key={index}>{data}</p>)}
                </div>
              </div>

              <div className="sp:pb-[14px] pc:pb-8">
                <div className="flex sp:pb-[7.5px] pc:pb-[13px]">
                  <img
                    src={`/images/icons/searchUser.svg`}
                    className="mr-2 text-core-blue_dark sp:h-[24px] sp:w-[24px]"
                    alt=""
                  />
                  <div className="self-center text-start sp:text-[12px] pc:text-[16px]">
                    <p className="font-bold text-core-blue_dark">求める人材</p>
                  </div>
                </div>
                <p className="text-start sp:ml-[20px] sp:text-[12px] pc:ml-[30px] pc:text-[16px]">
                  {leader_info?.desiredTalent}
                </p>
              </div>
            </div>
          </div>
        </div>
      </div>
    )
  else if (project_type == 'event')
    return (
      <div className="relative">
        <div className="pb-4">
          <div className="relative mx-auto h-[46px] w-full border border-gray-100 bg-white pt-[15px] text-center">
            <p className="text-[14px] font-bold">募集詳細</p>
            <MdClose
              className="absolute right-[10px] top-2.5 text-neutral-500"
              size={24}
              onClick={() => {
                router.back()
              }}
            />
          </div>
        </div>

        <div className="sp:mx-[20px] pc:mx-0">
          <UpdatedAt updateDateStr={updateDateStr} className="mb-2 mt-5 max-w-[800px]" />

          <div className="mx-auto mb-4 max-w-[800px] rounded-2xl border border-gray-100 bg-white text-center">
            <div className="cards relative z-0 mx-auto grid max-w-[800px] sp:gap-2 pc:gap-4">
              {topData.map((data, index) => (
                <DetailedJobCard {...data} key={index} />
              ))}
            </div>

            <div className="mx-4">
              <div className="sp:pb-[14px] pc:pb-8">
                <div className="flex sp:pb-[7.5px] pc:pb-[6px]">
                  <img
                    src={`/images/icons/location.svg`}
                    className="mr-2 text-core-blue_dark sp:h-[24px] sp:w-[24px]"
                    alt=""
                  />
                  <div className="self-center text-start sp:text-[12px] pc:text-[16px]">
                    <p className="font-bold text-core-blue_dark ">勤務地</p>
                  </div>
                </div>
                <p className="text-start sp:ml-[20px] sp:text-[12px] pc:ml-[30px] pc:text-[16px]">
                  {event_info?.address.prefecture
                    ? getPrefectureName(event_info?.address.prefecture, prefectureList)
                    : 'ooo'}{' '}
                  {event_info?.address.city}
                </p>
              </div>

              <div className="sp:pb-[14px] pc:pb-8">
                <div className="flex sp:pb-[7.5px] pc:pb-[10px]">
                  <img
                    src={`/images/icons/timeFilled.svg`}
                    className="mr-2 text-core-blue_dark sp:h-[24px] sp:w-[24px]"
                    alt=""
                  />
                  <div className="self-center text-start sp:pt-[3px] sp:text-[12px] pc:pt-[1px] pc:text-[16px]">
                    <p className="font-bold text-core-blue_dark sp:pb-[7.5px] pc:pb-[10px] ">勤務時間</p>

                    {event_info?.officeHours.map((item, index) => (
                      <div key={index} className="sp:text-[11px] pc:text-body_pc">
                        {format(new Date(objectToDate(item.date)), 'yyyy/MM/dd (E)', { locale: ja }) +
                          ' ' +
                          item.start.hour +
                          ':' +
                          item.start.min +
                          '～' +
                          item.end.hour +
                          ':' +
                          item.end.min}
                      </div>
                    ))}
                  </div>
                </div>
                <div className="text-start sp:ml-[20px] sp:text-[12px] pc:ml-[30px] pc:text-[16px]">
                  {event_info?.officeHoursNote.split(' ').map((data, index) => <p key={index}>{data}</p>)}
                </div>
              </div>

              <div className="sp:pb-[14px] pc:pb-8">
                <div className="flex sp:pb-[7.5px] pc:pb-[6px]">
                  <img
                    src={`/images/icons/currencyYen.svg`}
                    className="mr-2 text-core-blue_dark sp:h-[24px] sp:w-[24px]"
                    alt=""
                  />
                  <div className="self-center text-start sp:text-[12px] pc:text-[16px]">
                    <p className="font-bold text-core-blue_dark ">報酬について</p>
                  </div>
                </div>
                <p className="text-start sp:ml-[20px] sp:text-[12px] pc:ml-[30px] pc:text-[16px]">
                  {event_info?.salary}
                </p>
              </div>

              <div className="sp:pb-[14px] pc:pb-8">
                <div className="flex sp:pb-[7.5px] pc:pb-[6px]">
                  <img
                    src={`/images/icons/bookOpen.svg`}
                    className="mr-2 text-core-blue_dark sp:h-[24px] sp:w-[24px]"
                    alt=""
                  />
                  <div className="self-center text-start sp:text-[12px] pc:text-[16px]">
                    <p className="font-bold text-core-blue_dark">活動の紹介</p>
                  </div>
                </div>
                <p className="text-start sp:ml-[20px] sp:text-[12px] pc:ml-[30px] pc:text-[16px]">
                  {event_info?.jobDescription}
                </p>
              </div>

              <div className="sp:pb-[14px] pc:pb-8">
                <div className="flex  sp:pb-[7.5px] pc:pb-[13px]">
                  <img
                    src={`/images/icons/building.svg`}
                    className="mr-2 text-core-blue_dark sp:h-[24px] sp:w-[24px]"
                    alt=""
                  />
                  <div className="self-center text-start sp:text-[12px] pc:text-[16px]">
                    <p className="font-bold text-core-blue_dark">資格に関する希望</p>
                  </div>
                </div>
                <div className="text-start sp:ml-[20px] sp:text-[12px] pc:ml-[30px] pc:text-[16px]">
                  {event_info?.note?.split(' ').map((data, index) => <p key={index}>{data}</p>)}
                </div>
              </div>

              <div className="sp:pb-[14px] pc:pb-8">
                <div className="flex sp:pb-[7.5px] pc:pb-[13px]">
                  <img
                    src={`/images/icons/searchUser.svg`}
                    className="mr-2 text-core-blue_dark sp:h-[24px] sp:w-[24px]"
                    alt=""
                  />
                  {/* <BsFillSearchHeartFill className="text-core-blue_dark mr-2" size={24} /> */}
                  <div className="self-center text-start sp:text-[12px] pc:text-[16px]">
                    <p className="font-bold text-core-blue_dark">求める人材</p>
                  </div>
                </div>
                <p className="text-start sp:ml-[20px] sp:text-[12px] pc:ml-[30px] pc:text-[16px]">
                  {event_info?.people}
                </p>
              </div>
            </div>
          </div>
        </div>
      </div>
    )
  else return null
}

export default function PreLoginDetailPage() {
  const router = useRouter()
  const [isModal1Open, setIsModal1Open] = useState(false)
  const [isModal2Open, setIsModal2Open] = useState(false)
  const [isModal3Open, setIsModal3Open] = useState(false)

  useEffect(() => {}, [isModal1Open])

  const click_button = () => {
    setIsModal1Open(true)
  }
  const click_button1 = () => {
    router.push('/signup')
  }
  const click_button2 = () => {
    router.push('/login')
  }

  const click_button3 = () => {
    setIsModal2Open(false)
  }
  const click_button4 = () => {
    setIsModal2Open(false)
    setIsModal3Open(true)
  }

  const click_button5 = () => {
    setIsModal3Open(false)
  }

  return (
    <div className="relative h-full bg-gray-white">
      <ScrollLayout onClick={click_button}>
        <Content />
        {isModal1Open && (
          <StepCard
            title={'応募する'}
            imgUrl="exit"
            subTitle="求人の応募にはログインが必要です"
            button1Text="会員登録"
            button2Text="ログイン"
            button1Click={click_button1}
            button2Click={click_button2}
            className="border border-blue-500 bg-white text-blue-500 "
            isModalOpen={isModal1Open}
          />
        )}
        {isModal2Open && (
          <StepCard
            title={'応募する'}
            imgUrl="armsraised"
            subTitle="この求人に応募してよろしいですか？"
            button1Text="キャンセル"
            button2Text="応募する"
            button1Click={click_button3}
            button2Click={click_button4}
            className="border border-gray-400 bg-gray-400 text-white "
          />
        )}
        {isModal3Open && (
          <StepCard
            title={'応募完了'}
            imgUrl="likeButton"
            subTitle="ご応募ありがとうございます！ 求人先とマッチングしましたら ご連絡いたします"
            button1Text="OK"
            button1Click={click_button5}
            className="border border-gray-400 bg-gray-400 text-white "
          />
        )}
      </ScrollLayout>
    </div>
  )
}
