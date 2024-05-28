import DetailedJobCard, { DetailedJobCardProps } from '@/components/organisms/Card/DetailedJobCard'
import { useView } from '@/hooks'
import { useEffect, useState } from 'react'
import { MdClose } from 'react-icons/md'
import { useRouter } from 'next/router'
import StepCard from '@/components/organisms/modal/StepCard'
import ScrollLoginLayout from '@/components/layouts/ScrollLoginLayout'
import { EventProject, LeadersWantedProjectScoutList, Message } from '@/models'
import { useAppSelector } from '@/store'
import { getEventProject } from '@/firebase/eventProject'
import { customizeDetailedEventList, getPrefectureName, objectToDate } from '@/utils/common'
import { Timestamp } from 'firebase/firestore'
import { MessageType, ProjectScoutType } from '@/enums'
import { format } from 'date-fns'
import { ja } from 'date-fns/locale'

export default function ProjectScout() {
  const view = useView()
  const router = useRouter()
  const [info, setInfo] = useState<EventProject>()
  const [topData, setTopData] = useState<DetailedJobCardProps[]>([])
  const { prefectureList, loginUserData } = useAppSelector((state) => state.global)
  const { id } = router.query

  const [isModal1Open, setIsModal1Open] = useState(false)
  const [isModal2Open, setIsModal2Open] = useState(false)
  const [isVoteUpOpen, setIsVoteUpOpen] = useState(false)
  const [isVoteUp1Open, setIsVoteUp1Open] = useState(false)
  const [isVoteDownOpen, setIsVoteDownOpen] = useState(false)
  const [isVoteDown1Open, setIsVoteDown1Open] = useState(false)
  const [isApplied, setIsApplied] = useState(false)
  const [isAccepted, setIsAccepted] = useState(true)
  const [isVoteUp, setIsVoteUp] = useState(false)
  const [isVoteDown, setIsVoteDown] = useState(false)

  useEffect(() => {
    const fetchData = async () => {
      if (id) {
        const data = await getEventProject(id.toString())
        if (data) {
          setInfo(data)

          const topEvent: DetailedJobCardProps[] = customizeDetailedEventList([data])
          setTopData(topEvent)
        }
      }
    }

    fetchData()
  }, [id])

  const click_button = () => {
    setIsModal1Open(true)
  }
  const click_button1 = () => {
    setIsModal1Open(false)
  }
  const click_button2 = () => {
    setIsModal1Open(false)
    setIsModal2Open(true)
  }

  const click_button3 = () => {
    setIsModal2Open(false)
    setIsApplied(true)
  }

  const click_voteup = () => {
    setIsVoteUpOpen(true)
  }

  const click_voteup_button1 = () => {
    setIsVoteUpOpen(false)
  }

  const click_voteup_button2 = () => {
    setIsVoteUpOpen(false)
    setIsVoteUp1Open(true)
  }

  const click_voteup_button3 = async () => {
    setIsVoteUp1Open(false)
    setIsVoteUp(true)
    setIsVoteDown(false)

    // add scout status
    const newScout: LeadersWantedProjectScoutList = {
      createdAt: Timestamp.now(),
      updatedAt: Timestamp.now(),
      userId: loginUserData.id || '',
      status: ProjectScoutType.scouted,
    }
    // await addLeadersWantedProjectScoutList(newScout);

    const newMessage: Message = {
      createdAt: Timestamp.now(),
      updatedAt: Timestamp.now(),
      projectId: id?.toString() || '',
      senderId: loginUserData.id || '',
      text: 'スカウトに「興味あり」と回答しました',
      type: MessageType.scout,
    }
  }

  const click_votedown = () => {
    setIsVoteDownOpen(true)
  }

  const click_votedown_button1 = () => {
    setIsVoteDownOpen(false)
  }

  const click_votedown_button2 = async () => {
    setIsVoteDownOpen(false)
    setIsVoteDown1Open(true)

    // add scout
    const newScout: LeadersWantedProjectScoutList = {
      createdAt: Timestamp.now(),
      updatedAt: Timestamp.now(),
      userId: loginUserData.id || '',
      status: ProjectScoutType.notInterested,
    }
    // await addLeadersWantedProjectScoutList(newScout);

    // // add selection
    // const newSelection: LeadersWantedProjectSelectionList = {
    //   createdAt: Timestamp.now(),
    //   updatedAt: Timestamp.now(),
    //   status:
    // }

    const newMessage: Message = {
      createdAt: Timestamp.now(),
      updatedAt: Timestamp.now(),
      projectId: id?.toString() || '',
      senderId: loginUserData.id || '',
      text: 'スカウトに「興味なし」と回答しました ',
      type: MessageType.scout,
    }
  }

  const click_votedown_button3 = () => {
    setIsVoteDown1Open(false)
    setIsVoteUp(false)
    setIsVoteDown(true)
  }

  return (
    <div className="relative h-full bg-gray-white">
      <ScrollLoginLayout
        onClick={click_button}
        voteup={click_voteup}
        votedown={click_votedown}
        isvoteup={isVoteUp}
        isvotedown={isVoteDown}
        applied={isApplied}
        accepted={isAccepted}
      >
        <div className="relative">
          {/* {
            view == "SP" ?
              <div className="pb-4">
                <div className="w-full h-[46px] text-center bg-white mx-auto pt-[15px] relative border-gray-100 border">
                  <p className="text-[14px] font-bold">募集詳細</p>
                  <MdClose className="absolute right-[10px] top-2.5 text-neutral-500" size={24} onClick={() => {
                    router.push('/preLogin/job-list');
                  }} />
                </div>
              </div> : view == "PC" && 
              <div className="absolute top-10 left-10">
                <BackButton
                  onClick={() => {
                    router.push('/preLogin/job-list');
                  }}
                />
              </div>
            } */}

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
            <div className="mx-auto mb-4 mt-[20px] max-w-[800px] rounded-2xl border border-gray-100 bg-white text-center">
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
                    {/* <MdLocationOn className="text-core-blue_dark mr-2" size={24} /> */}
                    <div className="self-center text-start sp:text-[12px] pc:text-[16px]">
                      <p className="font-bold text-core-blue_dark ">勤務地</p>
                    </div>
                  </div>
                  <p className="text-start sp:ml-[20px] sp:text-[12px] pc:ml-[30px] pc:text-[16px]">
                    {info?.address.prefecture ? getPrefectureName(info?.address.prefecture, prefectureList) : 'ooo'}{' '}
                    {info?.address.city} {info?.address.address1} {info?.address.address2}
                  </p>
                </div>

                <div className="sp:pb-[14px] pc:pb-8">
                  <div className="flex sp:pb-[7.5px] pc:pb-[10px]">
                    <img
                      src={`/images/icons/timeFilled.svg`}
                      className="mr-2 text-core-blue_dark sp:h-[24px] sp:w-[24px]"
                      alt=""
                    />
                    {/* <MdAccessTimeFilled className="text-core-blue_dark mr-2" size={24} /> */}
                    <div className="self-center text-start sp:pt-[3px] sp:text-[12px] pc:pt-[1px] pc:text-[16px]">
                      <p className="font-bold text-core-blue_dark sp:pb-[7.5px] pc:pb-[10px] ">勤務時間</p>
                      {/* {
                          info?.officeHours && (view == "SP" ? 
                          <Schedule schedule={info?.officeHours} size="mini" className="-ml-[15px]" /> :
                          view == "PC" &&
                          <Schedule schedule={info?.officeHours} size="small"/>)
                        } */}
                      {info?.officeHours.map((item, index) => (
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
                    {info?.officeHoursNote.split(' ').map((data, index) => <p key={index}>{data}</p>)}
                  </div>
                </div>

                <div className="sp:pb-[14px] pc:pb-8">
                  <div className="flex sp:pb-[7.5px] pc:pb-[6px]">
                    <img
                      src={`/images/icons/currencyYen.svg`}
                      className="mr-2 text-core-blue_dark sp:h-[24px] sp:w-[24px]"
                      alt=""
                    />
                    {/* <HiCurrencyYen className="text-core-blue_dark mr-2" size={24} /> */}
                    <div className="self-center text-start sp:text-[12px] pc:text-[16px]">
                      <p className="font-bold text-core-blue_dark ">報酬について</p>
                    </div>
                  </div>
                  <p className="text-start sp:ml-[20px] sp:text-[12px] pc:ml-[30px] pc:text-[16px]">{info?.salary}</p>
                </div>

                <div className="sp:pb-[14px] pc:pb-8">
                  <div className="flex sp:pb-[7.5px] pc:pb-[6px]">
                    <img
                      src={`/images/icons/bookOpen.svg`}
                      className="mr-2 text-core-blue_dark sp:h-[24px] sp:w-[24px]"
                      alt=""
                    />
                    {/* <HiBookOpen className="text-core-blue_dark mr-2" size={24} /> */}
                    <div className="self-center text-start sp:text-[12px] pc:text-[16px]">
                      <p className="font-bold text-core-blue_dark">活動の紹介</p>
                    </div>
                  </div>
                  <p className="text-start sp:ml-[20px] sp:text-[12px] pc:ml-[30px] pc:text-[16px]">
                    {info?.jobDescription}
                  </p>
                </div>

                <div className="sp:pb-[14px] pc:pb-8">
                  <div className="flex  sp:pb-[7.5px] pc:pb-[13px]">
                    <img
                      src={`/images/icons/building.svg`}
                      className="mr-2 text-core-blue_dark sp:h-[24px] sp:w-[24px]"
                      alt=""
                    />
                    {/* <BsMortarboardFill className="text-core-blue_dark mr-2" size={24} /> */}
                    <div className="self-center text-start sp:text-[12px] pc:text-[16px]">
                      <p className="font-bold text-core-blue_dark">資格に関する希望</p>
                    </div>
                  </div>
                  <div className="text-start sp:ml-[20px] sp:text-[12px] pc:ml-[30px] pc:text-[16px]">
                    {info?.note?.split(' ').map((data, index) => <p key={index}>{data}</p>)}
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
                  <p className="text-start sp:ml-[20px] sp:text-[12px] pc:ml-[30px] pc:text-[16px]">{info?.people}</p>
                </div>
              </div>
            </div>
          </div>
        </div>

        {isModal1Open && (
          <StepCard
            title={'応募する'}
            imgUrl="armsraised"
            subTitle="この求人に応募してよろしいですか？"
            button1Text="キャンセル"
            button2Text="応募する"
            button1Click={click_button1}
            button2Click={click_button2}
            className="border border-gray-400 bg-gray-400 text-white "
          />
        )}
        {isModal2Open && (
          <StepCard
            title={'応募完了'}
            imgUrl="likeButton"
            subTitle="ご応募ありがとうございます！ 求人先とマッチングしましたら ご連絡いたします"
            button1Text="OK"
            button1Click={click_button3}
            className="border border-gray-400 bg-gray-400 text-white "
          />
        )}

        {isVoteUpOpen && (
          <StepCard
            title={'興味あり'}
            imgUrl="thumbUp"
            subTitle="この求人に「興味あり」と回答します よろしいですか？"
            button1Text="キャンセル"
            button2Text="回答する"
            button1Click={click_voteup_button1}
            button2Click={click_voteup_button2}
            className="border border-gray-400 bg-gray-400 text-white "
          />
        )}

        {isVoteUp1Open && (
          <StepCard
            title={'回答完了'}
            imgUrl="thumbUpColor"
            subTitle="ご回答ありがとうございます！ 求人先とマッチングしましたら ご連絡いたします"
            button1Text="OK"
            button1Click={click_voteup_button3}
            className="border border-gray-400 bg-gray-400 text-white "
          />
        )}

        {isVoteDownOpen && (
          <StepCard
            title={'興味なし'}
            imgUrl="voteDown"
            subTitle="この求人に「興味なし」と回答します よろしいですか？"
            button1Text="キャンセル"
            button2Text="回答する"
            button1Click={click_votedown_button1}
            button2Click={click_votedown_button2}
            className="border border-gray-400 bg-gray-400 text-white "
          />
        )}

        {isVoteDown1Open && (
          <StepCard
            title={'回答完了'}
            imgUrl="checkCircle"
            subTitle="ご回答ありがとうございました！"
            button1Text="OK"
            button1Click={click_votedown_button3}
            className="border border-gray-400 bg-gray-400 text-white "
          />
        )}
      </ScrollLoginLayout>
    </div>
  )
}
