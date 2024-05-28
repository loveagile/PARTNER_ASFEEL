import DetailedJobCard, { DetailedJobCardProps } from '@/components/organisms/Card/DetailedJobCard'
import { useView } from '@/hooks'
import { useEffect, useMemo, useState } from 'react'
import { MdClose } from 'react-icons/md'
import { useRouter } from 'next/router'
import Schedule from '@/components/molecules/Table/Schedule'
import StepCard from '@/components/organisms/modal/StepCard'
import AfterLoginScrollLayout, { ProjectStatus, projectStatusItem } from '@/components/layouts/AfterLoginScrollLayout'
import { addEventProjectSelectionListData, getEventProject } from '@/firebase/eventProject'
import {
  EventProject,
  EventProjectSelectionList,
  LeadersWantedProject,
  LeadersWantedProjectSelectionList,
  Message,
  MessageRoom,
} from '@/models'
import { useAppDispatch, useAppSelector } from '@/store'
import {
  customizeDetailedEventList,
  customizeDetailedLeadersWantedProjectList,
  getPrefectureName,
  objectToDate,
} from '@/utils/common'
import { Timestamp, getDocs, query, setDoc, where } from 'firebase/firestore'
import { ApplyOrScout, MessageType, ProjectScoutType, ProjectSelectionType } from '@/enums'
import {
  addMessageData,
  addMessageRoom,
  getMessageRoomByProjectIdAndUserId,
  messageRoomExists,
  setMessageRoom,
} from '@/firebase/messageRoom'
import { setStoreLoading } from '@/store/reducers/global'
import { addLeadersWantedProjectsSelectionListData, getLeadersWantedProject } from '@/firebase/leadersWantedProject'
import { format } from 'date-fns'
import { ja } from 'date-fns/locale'
import { DocRef, SubColRef } from '@/libs/firebase/firestore'
import { formatDate } from '@/libs/dayjs/dayjs'
import UpdatedAt from '@/components/atoms/UpdatedAt'

const ContentHeader = () => {
  const router = useRouter()
  return (
    <div className="pb-4">
      <div className="relative mx-auto h-[46px] w-full border border-gray-100 bg-white pt-[15px] text-center">
        <p className="text-[14px] font-bold">募集詳細</p>
        <MdClose
          className="absolute right-[10px] top-2.5 cursor-pointer text-neutral-500"
          size={24}
          onClick={() => {
            router.back()
          }}
        />
      </div>
    </div>
  )
}

const Content = () => {
  const view = useView()
  const router = useRouter()
  const [projectType, setProjectType] = useState<string>()
  const [leader_info, setLeaderInfo] = useState<LeadersWantedProject>()
  const [event_info, setEventInfo] = useState<EventProject>()
  const [topData, setTopData] = useState<DetailedJobCardProps[]>([])
  const { prefectureList } = useAppSelector((state) => state.global)
  const { id } = router.query

  useEffect(() => {
    const fetchData = async () => {
      if (!id) return

      const type = id.toString().split('-')[0]
      const projectId = id.toString().split('-')[1]
      setProjectType(type)

      if (type == 'leader') {
        const data = await getLeadersWantedProject(projectId)
        if (!data) return
        setLeaderInfo(data)
        setTopData(customizeDetailedLeadersWantedProjectList([data]))
      } else if (type == 'event') {
        const data = await getEventProject(projectId)
        if (!data) return
        setEventInfo(data)
        setTopData(customizeDetailedEventList([data]))
      }
    }

    fetchData()
  }, [id])

  const updateDateStr = useMemo(() => {
    return formatDate(leader_info ? leader_info.updatedAt.toDate() : event_info?.updatedAt.toDate())(
      'slashYYYYMMDDHHMM',
    )
  }, [leader_info, event_info])

  if (projectType == 'leader')
    return (
      <div className="relative">
        <ContentHeader />

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
                  {leader_info?.workplace.prefecture} {leader_info?.workplace.city}
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
  else if (projectType == 'event')
    return (
      <div className="relative">
        <ContentHeader />

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

export default function AfterLoginDetailPage() {
  const router = useRouter()
  const { id } = router.query
  const { authUser } = useAppSelector((state) => state.global)
  const dispatch = useAppDispatch()

  const [projectId, setProjectId] = useState<string>()
  const [projectType, setProjectType] = useState<string>()
  const [isModal2Open, setIsModal2Open] = useState(false)
  const [isModal3Open, setIsModal3Open] = useState(false)
  const [projectStatus, setProjectStatus] = useState<ProjectStatus | null>(null)

  useEffect(() => {
    const fetchData = async () => {
      if (!id || !authUser) return
      const userId = authUser.uid

      const _projectId = id.toString().split('-')[1]
      const _projectType = id.toString().split('-')[0]
      setProjectId(_projectId)
      setProjectType(_projectType)

      const scoutRef =
        _projectType === 'leader'
          ? SubColRef.leadersWantedProjectsScoutList(_projectId)
          : SubColRef.eventProjectsScoutList(_projectId)
      const selectionRef =
        _projectType === 'leader'
          ? SubColRef.leadersWantedProjectsSelectionList(_projectId)
          : SubColRef.eventProjectsSelectionList(_projectId)

      // データ取得
      const [scoutListSnap, selectionListSnap] = await Promise.all([
        getDocs(query(scoutRef, where('userId', '==', userId))),
        getDocs(query(selectionRef, where('userId', '==', userId))),
      ])

      // 選考リストにある場合
      if (!selectionListSnap.empty) {
        const applyOrScout = selectionListSnap.docs[0].data().applyOrScout
        setProjectStatus(applyOrScout === ApplyOrScout.apply ? projectStatusItem.applied : projectStatusItem.interested)
        return
      }

      // 選考リストにも候補者リストにもない場合
      if (scoutListSnap.empty) {
        setProjectStatus(projectStatusItem.default)
        return
      }

      // 候補者リストにある場合
      const status = scoutListSnap.docs[0].data().status
      setProjectStatus(
        status === ProjectScoutType.scouted
          ? projectStatusItem.scouted
          : status === ProjectScoutType.notInterested
          ? projectStatusItem.notInterested
          : projectStatusItem.default,
      )
    }

    fetchData()
  }, [authUser])

  const click_button = () => {
    setIsModal2Open(true)
  }
  const click_button3 = () => {
    setIsModal2Open(false)
  }
  const click_button4 = async () => {
    if (!projectId || !projectType || !authUser) return
    const userId = authUser.uid

    try {
      dispatch(setStoreLoading(true))

      const latestMessage = 'ご応募ありがとうございます\n求人先とマッチングしましたら\nご連絡いたします'
      const newMessage: Message = {
        createdAt: Timestamp.now(),
        updatedAt: Timestamp.now(),
        projectId: projectId || '',
        senderId: userId || '',
        text: '応募申請されました。',
        type: MessageType.application,
      }
      const newMessage2: Message = {
        createdAt: Timestamp.now(),
        updatedAt: Timestamp.now(),
        projectId: projectId || '',
        senderId: '',
        text: latestMessage,
        type: MessageType.text,
      }

      const isExistMessageRoom = await messageRoomExists(newMessage.projectId, newMessage.senderId)
      if (!isExistMessageRoom) {
        const newMessageRoom: MessageRoom = {
          createdAt: Timestamp.now(),
          updatedAt: Timestamp.now(),
          lastMessage: latestMessage,
          projectId: projectId,
          members: [
            {
              lastAccessedAt: Timestamp.now(),
              unreadCount: 0,
              userId: newMessage.senderId,
            },
          ],
          memberIds: [userId],
          userId: newMessage.senderId,
          projectType: projectType || '', //"leader"
        }

        await addSelection({
          projectType: projectType,
          applyOrScout: ApplyOrScout.apply,
          userId,
          status: ProjectSelectionType.notStarted,
          projectId: projectId,
        })

        const messageRoomId = await addMessageRoom(newMessageRoom)
        await addMessageData(messageRoomId, newMessage)
        await addMessageData(messageRoomId, newMessage2)

        setProjectStatus(projectStatusItem.applied)
      }

      dispatch(setStoreLoading(false))
    } catch (error) {}
    setIsModal2Open(false)
    setIsModal3Open(true)
  }
  const click_button5 = async () => {
    setIsModal3Open(false)
  }

  const addSelection = async ({
    projectType,
    applyOrScout,
    userId,
    status,
    projectId,
  }: {
    projectType: string
    applyOrScout: ApplyOrScout
    userId: string
    status: ProjectSelectionType
    projectId: string
  }) => {
    if (projectType == 'leader') {
      const newLeadersWantedProjectSelectionList: LeadersWantedProjectSelectionList = {
        createdAt: Timestamp.now(),
        updatedAt: Timestamp.now(),
        applyOrScout,
        isUnread: true,
        userId,
        status,
        projectId,
      }

      await addLeadersWantedProjectsSelectionListData(projectId, userId, newLeadersWantedProjectSelectionList)
    } else if (projectType == 'event') {
      const newEventProjectSelectionList: EventProjectSelectionList = {
        createdAt: Timestamp.now(),
        updatedAt: Timestamp.now(),
        applyOrScout,
        isUnread: true,
        userId,
        status,
        projectId,
      }

      await addEventProjectSelectionListData(projectId, userId, newEventProjectSelectionList)
    }
  }

  // 興味あり用のモーダル・関数
  const [isInterestModal, setIsInterestModal] = useState(false)
  const onOpenInterestModal = () => {
    setIsInterestModal(true)
  }
  const onClickInterest = async () => {
    setIsInterestModal(false)
    if (!projectId || !projectType || !authUser) return

    const userId = authUser.uid
    try {
      dispatch(setStoreLoading(true))

      const room = await getMessageRoomByProjectIdAndUserId(projectId, userId)
      if (!room) {
        throw new Error('メッセージルームが存在しません')
      }

      const messageText = 'スカウトに「興味あり」と回答しました'
      await setMessageRoom(room.id, {
        ...room,
        lastMessage: messageText,
        members: room.members.map((member) => {
          return {
            ...member,
            unreadCount: member.userId === userId ? 0 : member.unreadCount + 1,
            lastAccessedAt: member.userId === userId ? Timestamp.now() : member.lastAccessedAt,
          }
        }),
      })
      await addMessageData(room.id, {
        createdAt: Timestamp.now(),
        updatedAt: Timestamp.now(),
        projectId: projectId,
        senderId: userId,
        text: messageText,
        type: MessageType.text,
      })

      // leader or eventの選考リストに保存
      await addSelection({
        projectType: projectType,
        applyOrScout: ApplyOrScout.scout,
        userId,
        status: ProjectSelectionType.notStarted,
        projectId: projectId,
      })

      setProjectStatus(projectStatusItem.interested)
      dispatch(setStoreLoading(false))
      setIsCompletedForInterest(true)
    } catch (error) {
      dispatch(setStoreLoading(false))
      console.log(error)
      alert('エラーが発生しました。もう一度お試しください。')
    }
  }
  const [isCompletedForInterest, setIsCompletedForInterest] = useState(false)

  // 興味無し用のモーダル・関数
  const [isNotInterestModal, setIsNotInterestModal] = useState(false)
  const onOpenNotInterestModal = () => {
    setIsNotInterestModal(true)
  }
  const onClickNotInterest = async () => {
    setIsNotInterestModal(false)
    if (!projectId || !projectType || !authUser) return

    const userId = authUser.uid
    try {
      dispatch(setStoreLoading(true))

      const room = await getMessageRoomByProjectIdAndUserId(projectId, userId)
      if (!room) {
        throw new Error('メッセージルームが存在しません')
      }

      const messageText = 'スカウトに「興味なし」と回答しました'
      await setMessageRoom(room.id, {
        ...room,
        lastMessage: messageText,
        members: room.members.map((member) => {
          return {
            ...member,
            unreadCount: member.userId === userId ? 0 : member.unreadCount + 1,
            lastAccessedAt: member.userId === userId ? Timestamp.now() : member.lastAccessedAt,
          }
        }),
      })
      await addMessageData(room.id, {
        createdAt: Timestamp.now(),
        updatedAt: Timestamp.now(),
        projectId: projectId,
        senderId: userId,
        text: messageText,
        type: MessageType.text,
      })

      // leader or eventの候補者リストのstatusを更新
      const docRef =
        projectType === 'leader'
          ? DocRef.leadersWantedProjectScoutList({
              leadersWantedProjectId: projectId,
              leadersWantedProjectScoutListId: userId,
            })
          : DocRef.eventProjectScoutList({ eventProjectId: projectId, eventProjectScoutId: userId })
      await setDoc(
        docRef,
        {
          status: ProjectScoutType.notInterested,
        },
        {
          merge: true,
        },
      )

      setProjectStatus(projectStatusItem.notInterested)
      dispatch(setStoreLoading(false))
      setIsCompletedForNotInterest(true)
    } catch (error) {
      dispatch(setStoreLoading(false))
      console.log(error)
      alert('エラーが発生しました。もう一度お試しください。')
    }
  }
  const [isCompletedForNotInterest, setIsCompletedForNotInterest] = useState(false)

  // キャンセル・完了の関数
  const closeModal = () => {
    setIsInterestModal(false)
    setIsNotInterestModal(false)
    setIsCompletedForInterest(false)
    setIsCompletedForNotInterest(false)
  }

  return (
    <div className="relative h-full bg-gray-white">
      <AfterLoginScrollLayout
        onClick={click_button}
        onOpenInterestModal={onOpenInterestModal}
        onOpenNotInterestModal={onOpenNotInterestModal}
        projectStatus={projectStatus}
      >
        <Content />
        {isInterestModal && (
          <StepCard
            title={'興味あり'}
            imgUrl="thumbUp"
            subTitle={`この求人に「興味あり」と回答します\nよろしいですか？`}
            button1Text="キャンセル"
            button2Text="回答する"
            button1Click={closeModal}
            button2Click={onClickInterest}
            className="border border-gray-400 bg-gray-400 text-white "
          />
        )}
        {isNotInterestModal && (
          <StepCard
            title={'興味なし'}
            imgUrl="sentiment_neutral"
            subTitle={`この求人に「興味なし」と回答します\nよろしいですか？`}
            button1Text="キャンセル"
            button2Text="回答する"
            button1Click={closeModal}
            button2Click={onClickNotInterest}
            className="border border-gray-400 bg-gray-400 text-white "
          />
        )}
        {(isCompletedForInterest || isCompletedForNotInterest) && (
          <StepCard
            title={'回答完了'}
            imgUrl={isCompletedForInterest ? 'likeButton' : 'checkCircle'}
            subTitle={
              isCompletedForInterest
                ? `ご回答ありがとうございます！\n求人先とマッチングしましたら\nご連絡いたします`
                : `ご回答ありがとうございました！`
            }
            button1Text="OK"
            button1Click={closeModal}
            className="border border-gray-400 bg-gray-400 text-white "
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
            subTitle={`ご応募ありがとうございます！\n求人先とマッチングしましたら\nご連絡いたします`}
            button1Text="OK"
            button1Click={click_button5}
            className="border border-gray-400 bg-gray-400 text-white "
          />
        )}
      </AfterLoginScrollLayout>
    </div>
  )
}
