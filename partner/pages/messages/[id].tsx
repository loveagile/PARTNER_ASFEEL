import { BalloonColor, BalloonType } from '@/components/atoms/Message/Balloon'
import DateLabel from '@/components/atoms/Message/DateLabel'
import MessageLayout from '@/components/layouts/MessageLayout'
import MsgAnnounce from '@/components/molecules/Message/MsgAnnounce'
import MsgText from '@/components/molecules/Message/MsgText'
import InputArea from '@/components/organisms/Message/InputArea/InputArea'
import { ApplyOrScout, MessageType, ProjectScoutType } from '@/enums'
import { addMessageData, getMessageRoom, getMessageRoomId, setMessageRoom } from '@/firebase/messageRoom'
import { uploadFiles } from '@/libs/firebase/firebase'
import { Message, MessageRoom } from '@/models'
import { useAppDispatch, useAppSelector } from '@/store'
import { setStoreLoading } from '@/store/reducers/global'
import { messageRoomDateFormat, objectToDate } from '@/utils/common'
import { Timestamp, getDocs, onSnapshot, orderBy, query, where } from 'firebase/firestore'
import { useRouter } from 'next/router'
import { useEffect, useMemo, useRef, useState } from 'react'
import AttachmentDownloadFile from '@/components/atoms/Message/AttachmentDownloadFile'
import { FileUrlType } from '@/types'
import React from 'react'
import { formatDate } from '@/libs/dayjs/dayjs'
import { SubColRef, getDocIdWithData } from '@/libs/firebase/firestore'
import { getLeadersWantedProject } from '@/firebase/leadersWantedProject'
import { getEventProject } from '@/firebase/eventProject'
import { format } from 'date-fns'
import { ja } from 'date-fns/locale'
import { ProjectStatus, projectStatusItem } from '@/components/layouts/AfterLoginScrollLayout'
import { User } from 'firebase/auth'

interface MessageDetail extends Message {
  dateStr?: string
}

const removeDuplicatesById = (data: Message[]): Message[] => {
  const uniqueMap = new Map<string, Message>()
  data.forEach((message) => uniqueMap.set(message.id!, message))
  return Array.from(uniqueMap.values())
}

function MessageRoomPage({}) {
  const router = useRouter()
  const dispatch = useAppDispatch()

  const { id } = router.query
  const [msgList, setMsgList] = useState<Message[]>([])
  const [project, setProject] = useState<any>()
  const { authUser } = useAppSelector((state) => state.global)
  const [roomProjectType, setRoomProjectType] = useState<string>('')

  const [projectStatus, setProjectStatus] = useState<ProjectStatus | null>(null)
  const [text, setText] = useState('')
  const [files, setFiles] = useState<File[]>([])

  useEffect(() => {
    const fetchData = async () => {
      if (!id || !authUser) return
      const userId = authUser.uid

      const projectId = id.toString()
      const messageRoomId = await getMessageRoomId(projectId, userId)
      if (!messageRoomId) return

      const messageRoomData = await getMessageRoom(messageRoomId)
      if (messageRoomData) {
        const member = messageRoomData.members.find((member) => member.userId == userId)
        if (member) {
          await setMessageRoom(messageRoomId, {
            ...messageRoomData,
            members: messageRoomData.members.map((member) => {
              if (member.userId == userId) {
                member.unreadCount = 0
              }
              return member
            }),
          })
        }

        const projectType = messageRoomData.projectType
        const projectData =
          projectType === 'leader' ? await getLeadersWantedProject(projectId) : await getEventProject(projectId)

        setProject(projectData)
        setRoomProjectType(projectType)

        // scoutの場合は、選考リストと候補者リストからデータを取得する
        const scoutRef =
          projectType === 'leader'
            ? SubColRef.leadersWantedProjectsScoutList(projectId)
            : SubColRef.eventProjectsScoutList(projectId)
        const selectionRef =
          projectType === 'leader'
            ? SubColRef.leadersWantedProjectsSelectionList(projectId)
            : SubColRef.eventProjectsSelectionList(projectId)

        // データ取得
        const [scoutListSnap, selectionListSnap] = await Promise.all([
          getDocs(query(scoutRef, where('userId', '==', userId))),
          getDocs(query(selectionRef, where('userId', '==', userId))),
        ])

        // 選考リストにある場合
        if (!selectionListSnap.empty) {
          const applyOrScout = selectionListSnap.docs[0].data().applyOrScout
          setProjectStatus(
            applyOrScout === ApplyOrScout.apply ? projectStatusItem.applied : projectStatusItem.interested,
          )
        } else {
          // 候補者リストに入るが、ステータスがスカウト、興味なし、NGの場合は、メッセージを送信できない
          const status = scoutListSnap.docs[0].data().status
          setProjectStatus(
            status === ProjectScoutType.scouted
              ? projectStatusItem.scouted
              : status === ProjectScoutType.notInterested
              ? projectStatusItem.notInterested
              : projectStatusItem.default,
          )
        }
      }

      const unsub = onSnapshot(query(SubColRef.messages(messageRoomId), orderBy('createdAt')), (snapshot) => {
        snapshot.docChanges().forEach((change) => {
          if (change.type === 'added') {
            const newMessage = getDocIdWithData(change.doc) as Message
            setMsgList((prev) => [...prev, newMessage])
          }
        })
      })

      return () => unsub()
    }

    fetchData()
  }, [id, authUser])

  const isFooter = useMemo(() => {
    return (
      (projectStatus && projectStatus === projectStatusItem.notInterested) ||
      projectStatus === projectStatusItem.scouted
    )
  }, [projectStatus])

  const isNotFinish = useMemo(() => {
    if (!project) return false
    return project.status !== 'finished'
  }, [project])

  const roomType = useMemo(() => {
    return msgList && msgList.length > 0 ? msgList[0].type : ''
  }, [msgList])

  const displayMsgList = useMemo(() => {
    if (!msgList) return []
    const uniqueMessages = removeDuplicatesById(msgList)

    const data: MessageDetail[] = []
    let prevDateStr = ''

    for (const msg of uniqueMessages) {
      const currentDateStr = formatDate(msg.createdAt.toDate())('YYYYMMDD')
      const todayStr = formatDate(new Date())('YYYYMMDD')

      if (prevDateStr !== currentDateStr) {
        if (data.length === 0) {
          data.push(msg)
          prevDateStr = currentDateStr
          continue
        }
        data.push({
          ...msg,
          type: '日付用',
          dateStr: todayStr === currentDateStr ? '今日' : formatDate(msg.createdAt.toDate())('slashYYYYMMDDW'),
        })
        data.push(msg)
      } else {
        data.push(msg)
      }

      prevDateStr = currentDateStr
    }

    return data
  }, [msgList])

  const handleTextChange = (newText: string) => {
    setText(newText)
  }

  const handleFileUpload = (file: FileList) => {
    setFiles([...files, ...file])
  }

  const sendMessage = async () => {
    if (!text && (!files || files.length == 0)) return
    if (!id || !authUser) return
    const userId = authUser.uid

    const newMessage: Message = {
      createdAt: Timestamp.now(),
      updatedAt: Timestamp.now(),
      type: MessageType.text,
      text: text,
      projectId: id.toString(),
      senderId: userId,
    }

    const messageRoomId = await getMessageRoomId(newMessage.projectId, userId)
    if (messageRoomId) {
      dispatch(setStoreLoading(true))
      if (text) {
        await addMessageData(messageRoomId, newMessage)
      }

      if (files && files.length > 0) {
        let file_names = await uploadFiles(files)
        let tmpFileList: FileUrlType[] = []
        file_names.map(async (url, index) => {
          let tmpFile: FileUrlType = {
            fileName: files[index].name,
            fileUrl: url,
          }
          tmpFileList.push(tmpFile)
        })

        let tmpMessage: Message = {
          createdAt: Timestamp.now(),
          updatedAt: Timestamp.now(),
          type: MessageType.file,
          text: 'ファイルを送信しました。',
          projectId: id.toString(),
          senderId: newMessage.senderId,
          fileUrl: tmpFileList,
        }

        await addMessageData(messageRoomId, tmpMessage)
      }

      const roomData = await getMessageRoom(messageRoomId)
      let tmp = roomData as MessageRoom
      tmp.lastMessage = text
      tmp.updatedAt = Timestamp.now()

      const updatedMembersInfo = tmp.members.map((member) => {
        if (member.userId != newMessage.senderId) {
          member.lastAccessedAt = Timestamp.now()
          member.unreadCount++
        }
        return member
      })
      tmp.members = updatedMembersInfo

      await setMessageRoom(messageRoomId, {
        ...tmp,
        lastMessage: files && files.length > 0 ? 'ファイルを送信しました。' : text,
        updatedAt: Timestamp.now(),
      })

      setFiles([])
      dispatch(setStoreLoading(false))
    }

    setText('')
    setFiles([])
  }

  const messagesEndRef = useRef<HTMLDivElement>(null)
  useEffect(() => {
    if (messagesEndRef && messagesEndRef.current) {
      messagesEndRef.current.scrollIntoView({ behavior: 'smooth' })
    }
  }, [msgList])

  return (
    <>
      <MessageLayout isFooter={isFooter} roomProjectType={roomProjectType} project={project}>
        {msgList && msgList.length > 0 && (
          <div className="relative flex h-full flex-col bg-gray-gray_light">
            <div
              className={`mx-auto w-full max-w-[800px] flex-1 bg-gray-gray_lighter ${
                isNotFinish ? 'min-h-[calc(100vh-169px)]' : 'min-h-screen'
              }`}
            >
              <div className="py-[20px] text-center">
                {project && (
                  <DateLabel label={format(objectToDate(msgList[0]?.createdAt), 'yyyy/MM/dd(EE)', { locale: ja })} />
                )}
              </div>

              <div className="flex w-full flex-col space-y-3 px-4 pb-8">
                {project && (
                  <MsgAnnounce
                    projectId={id?.toString() || ''}
                    readStatus={false}
                    project={project}
                    type={roomType}
                    roomProjectType={roomProjectType}
                  />
                )}

                {authUser &&
                  displayMsgList &&
                  displayMsgList.length > 0 &&
                  displayMsgList.map((message, i) => {
                    return (
                      <MessageItem
                        authUser={authUser}
                        message={message}
                        index={i}
                        organizationName={
                          roomProjectType == 'leader'
                            ? project.organizationName
                            : roomProjectType == 'event' && project.title
                        }
                        key={message.id}
                      />
                    )
                  })}

                {projectStatus && projectStatus === projectStatusItem.scouted && (
                  <p className="whitespace-pre-line py-[20px] text-center text-[12px] text-gray-gray_dark">
                    {`「興味あり」とご回答いただきますと\nメッセージが送信できるようになります`}
                  </p>
                )}
              </div>

              <div ref={messagesEndRef} className="pb-3" />
            </div>

            {isNotFinish &&
              projectStatus &&
              (projectStatus === projectStatusItem.applied || projectStatus === projectStatusItem.interested) && (
                <div className="sticky bottom-0">
                  <InputArea
                    className="mx-auto max-w-[800px]"
                    onTextChange={handleTextChange}
                    onFileUpload={handleFileUpload}
                    sendMessage={sendMessage}
                  />
                </div>
              )}
          </div>
        )}
      </MessageLayout>
    </>
  )
}

export default MessageRoomPage

function MessageItem({
  authUser,
  message,
  index,
  organizationName,
}: {
  authUser: User
  message: MessageDetail
  index: number
  organizationName: string
}) {
  const userId = authUser.uid
  const { dateStr, senderId, text, type, createdAt } = message

  const onOpen = async (fileUrl: string, fileName: string) => {
    if (fileUrl) {
      const fileExtension = fileName.split('.').pop()?.toLowerCase()
      if (fileExtension === 'pdf' || fileExtension === 'jpg' || fileExtension === 'jpeg' || fileExtension === 'png') {
        window.open(fileUrl, '_blank')
      }
    }
  }

  const onDownload = async (fileUrl: string, fileName: string) => {
    if (fileUrl) {
      const link = document.createElement('a')
      const fileExtension = fileName.split('.').pop()?.toLowerCase()
      if (fileExtension === 'pdf' || fileExtension === 'jpg' || fileExtension === 'jpeg' || fileExtension === 'png') {
        return
      }

      link.href = fileUrl
      link.download = fileName
      link.click()
    }
  }

  return (
    <>
      {index > 0 && message.fileUrl && message.fileUrl.length > 0 ? (
        message.fileUrl.map((file, file_index) => (
          <React.Fragment key={file.fileUrl + file_index}>
            {dateStr && (
              <div className="py-[20px] text-center">
                <DateLabel label={dateStr} />
              </div>
            )}

            <div className="text-[12px] text-gray-gray_dark">
              {senderId != userId ? `${organizationName}がファイルを送信しました。` : 'ファイルを送信しました。'}
            </div>

            <AttachmentDownloadFile
              fileName={file.fileName}
              isMyMessage={senderId == userId}
              time={messageRoomDateFormat(createdAt)}
              extension={text.split('.').pop() || ''}
              type={senderId == userId ? BalloonType.Received : BalloonType.Sent}
              onOpen={() => onOpen(file.fileUrl || '', file.fileName)}
              onDownload={() => onDownload(file.fileUrl || '', file.fileName)}
            />
          </React.Fragment>
        ))
      ) : (
        <>
          {senderId !== userId && type === 'text' && (
            <div className={`text-[12px] text-gray-gray_dark`}>{organizationName}</div>
          )}

          {type === '日付用' && dateStr && (
            <div className="py-[20px] text-center">
              <DateLabel label={dateStr} />
            </div>
          )}

          {type === 'text' && text && (
            <MsgText
              key={index}
              textContent={text}
              readStatus={false}
              time={messageRoomDateFormat(createdAt)}
              type={senderId == userId ? BalloonType.Received : BalloonType.Sent}
              bgColor={senderId == userId ? BalloonColor.Green : BalloonColor.White}
            />
          )}
        </>
      )}
    </>
  )
}
