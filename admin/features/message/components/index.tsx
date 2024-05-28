import { API_ROUTES, MESSAGE_TYPE, PROJECT_TYPE } from '@/constants/common'
import { auth } from '@/libs/firebase/firebase'
import { ColRef, getDocIdWithData } from '@/libs/firebase/firestore'
import { AppStorageRef, AppStorageService } from '@/libs/firebase/storage'
import { convertUrlSearchParams, customFetchUtils } from '@/utils/common'
import { transformTimestampToDate } from '@/utils/firestore'
import { Button, Input, Skeleton } from 'antd'
import { onSnapshot } from 'firebase/firestore'
import * as lodash from 'lodash'
import React from 'react'
import {
  AiFillCloseCircle,
  AiOutlineFile,
  AiOutlineFileExcel,
  AiOutlineFileImage,
  AiOutlineFilePdf,
  AiOutlineFilePpt,
  AiOutlineFileWord,
  AiOutlinePaperClip,
} from 'react-icons/ai'
import { IoSend } from 'react-icons/io5'
import { Message } from '../common'
import ListMessage from './ListMessage'
import styles from './index.module.scss'

type MessageFeatureProps = {
  detailProject?: any
  detailCandidate?: any
  projectType?: any
}

const MessageFeature = ({
  detailProject,
  detailCandidate,
  projectType,
}: MessageFeatureProps) => {
  const [fileList, setFileList] = React.useState<File[]>([])
  const [messageText, setMessageText] = React.useState<string>('')
  const fileInputRef = React.useRef<any>(null)
  const [isLoadingMessage, setIsLoadingMessage] = React.useState<boolean>(false)
  const [messageList, setMessageList] = React.useState<any[]>([])
  const [currentMessageRoom, setCurrentMessageRoom] = React.useState<any>({})
  const [isSending, setIsSending] = React.useState<boolean>(false)

  const createMessageRoom = async ({
    memberIds,
    projectId,
    projectType,
    userId,
  }: {
    memberIds: string[]
    projectId: string
    projectType: PROJECT_TYPE
    userId: string
  }) => {
    try {
      const res = await customFetchUtils(
        `${API_ROUTES.MESSAGE.createMessageRoom}`,
        {
          method: 'POST',
          body: JSON.stringify({
            memberIds,
            projectId,
            projectType,
            userId,
          }),
        },
      )

      const response = await res.json()

      if (!res.ok) {
        throw response
      }

      return response
    } catch (error) {
      console.log('createMessageRoom error', error)
    }
  }

  const fetchListMessage = async () => {
    try {
      const adminId = auth.currentUser?.uid
      const userId = detailCandidate?.id
      const projectId = detailProject?.id
      const memberIds = [adminId, userId]

      if (!adminId || !userId || !projectId) return

      const params = {
        projectId,
        userId,
        adminId,
      }

      const urlSearchParams = convertUrlSearchParams(params)
      const resMessage = await customFetchUtils(
        `${API_ROUTES.MESSAGE.findMessages}?${urlSearchParams || ''}`,
      )
      const responseMessage = await resMessage.json()

      if (!resMessage.ok) {
        throw responseMessage
      }

      if (responseMessage?.isNewMessageRoom) {
        const newRoom = await createMessageRoom({
          memberIds,
          projectId,
          projectType,
          userId,
        })

        setCurrentMessageRoom(newRoom)
        setMessageList([])
      } else {
        if (responseMessage?.messageRoom && responseMessage?.messages) {
          setCurrentMessageRoom(responseMessage.messageRoom)
          setMessageList(responseMessage.messages)
        }
      }
    } catch (error) {
      console.log('fetchListMessage error', error)
    }
  }

  const handleFileButtonClick = () => {
    if (fileInputRef.current) {
      fileInputRef.current.click()
    }
  }

  const handleFileChange: React.ChangeEventHandler<HTMLInputElement> = (e) => {
    const files = e.target.files
    const maxSize = 5 * 1024 * 1024 // 5MB

    if (!files) return

    const fileArray = Array.from(files).filter((file) => file.size <= maxSize)
    setFileList([...fileList, ...fileArray])
  }

  const handleRemoveFile = (index: number) => {
    const updatedFileList = [...fileList]
    updatedFileList.splice(index, 1)
    setFileList(updatedFileList)
  }

  const handleChangeText = (e: any) => setMessageText(e.target.value)

  const handleSend = async () => {
    setIsSending(true)
    try {
      let messages: Message[] = []

      const senderId = auth.currentUser?.uid || ''

      if (fileList?.length) {
        try {
          const promiseUpload = await fileList.map(async (file) => {
            const fileId = `${new Date().getTime()}`
            const res = await AppStorageService.uploadFile({
              ref: AppStorageRef.messageRooms(currentMessageRoom?.id, fileId),
              file,
            })

            const url = await AppStorageService.getDownloadFileUrl(res.ref)

            return {
              fileName: file.name,
              fileUrl: url,
            }
          })

          const fileUrl = await Promise.all(promiseUpload)

          messages = [
            {
              text: '',
              senderId,
              type: MESSAGE_TYPE.file,
              fileUrl,
            },
          ]
        } catch (error) {
          throw error
        }
      }

      if (messageText) {
        messages.push({
          type: MESSAGE_TYPE.text,
          text: messageText,
          projectId: detailProject?.id,
          senderId,
        })
      }

      if (!messages.length) {
        setIsSending(false)
        return
      }
      const res = await customFetchUtils(API_ROUTES.MESSAGE.sendMessage, {
        method: 'POST',
        body: JSON.stringify({
          messageRoomId: currentMessageRoom?.id,
          messages,
        }),
      })

      if (res.ok) {
        setMessageList([...messages, ...messageList])
        setFileList([])
        setMessageText('')
      }
    } catch (error) {
      console.log('handleSend error', error)
    }
    setIsSending(false)
  }

  React.useEffect(() => {
    if (!currentMessageRoom?.id) return
    const unsubscribe = onSnapshot(ColRef.messages(currentMessageRoom?.id), {
      next: (snapshot) => {
        const data = snapshot.docs.map((doc) => getDocIdWithData(doc))

        const sortedData = lodash.sortBy(data, ['createdAt', 'seconds'])

        const transformedData = sortedData.map((item) =>
          transformTimestampToDate(item),
        ) as Message[]

        const receivedMessage = transformedData[transformedData.length - 1]

        if (
          receivedMessage?.senderId &&
          receivedMessage?.senderId !== auth.currentUser?.uid &&
          transformedData.length > messageList.length
        ) {
          fetchListMessage()
        }
      },
    })

    return () => unsubscribe()
  }, [currentMessageRoom?.id])

  React.useEffect(() => {
    setIsLoadingMessage(true)

    fetchListMessage().finally(() => setIsLoadingMessage(false))
  }, [detailProject, detailCandidate, projectType])

  return (
    <Skeleton loading={isLoadingMessage} active className="p-5">
      <div className="flex flex-1 flex-col">
        <div className="flex flex-1 flex-col justify-end bg-gray-gray_light">
          <ListMessage
            messageList={messageList}
            currentMessageRoom={currentMessageRoom}
          />
        </div>
        <div className="flex items-center gap-2 p-2">
          <input
            type="file"
            multiple
            onChange={handleFileChange}
            ref={fileInputRef}
            className="hidden"
          />
          <Button
            className="border-0 bg-transparent text-2xl shadow-none"
            onClick={handleFileButtonClick}
            icon={<AiOutlinePaperClip className="text-core-blue" />}
          />
          <Input.TextArea
            className="flex-1 rounded-md border border-gray-gray"
            rows={3}
            value={messageText}
            onChange={handleChangeText}
            autoSize={{ minRows: 1, maxRows: 3 }}
          />
          <Button
            disabled={isSending}
            onClick={isSending ? undefined : handleSend}
            className="border-0 text-2xl"
            icon={
              <IoSend
                className={`${isSending ? 'text-gray-gray' : 'text-core-sky'}`}
              />
            }
          />
        </div>
        {fileList?.length ? (
          <div className={`grid px-2`}>
            <div
              className={`mt-2 flex gap-2 overflow-x-auto border-t border-gray-gray py-3 ${styles.files_wrapper}`}
            >
              {fileList.map((file, index) => (
                <div
                  key={index}
                  className={`relative min-w-min rounded-md border border-gray-gray px-3 py-2`}
                >
                  <FileItem file={file} />
                  <Button
                    className="absolute right-0 top-0 p-0"
                    style={{ transform: 'translateY(-50%)' }}
                    type="link"
                    onClick={() => handleRemoveFile(index)}
                  >
                    <AiFillCloseCircle className="text-gray-gray_dark" />
                  </Button>
                </div>
              ))}
            </div>
          </div>
        ) : (
          <></>
        )}
      </div>
    </Skeleton>
  )
}

export const FileItem = ({
  file,
}: {
  file: {
    name: string
    url?: string
  }
}) => {
  const extension = file.name?.split('.')?.[1]?.toLowerCase()

  const getIcon = () => {
    switch (extension) {
      case 'pdf':
        return <AiOutlineFilePdf fontSize={16} />
      case 'xls':
      case 'xlsx':
        return <AiOutlineFileExcel fontSize={16} />
      case 'doc':
      case 'docx':
        return <AiOutlineFileWord fontSize={16} />
      case 'ppt':
      case 'pptx':
        return <AiOutlineFilePpt fontSize={16} />
      case 'jpg':
      case 'jpeg':
      case 'png':
        return <AiOutlineFileImage fontSize={16} />
      default:
        return <AiOutlineFile />
    }
  }

  const handleClickFile = () => {
    if (file.url) {
      window.open(file.url, '_blank')
      // if (isOpenInNewTab) {
      // } else {
      //   const link = document.createElement('a')
      //   link.href = file.url
      //   link.download = file.name
      //   document.body.appendChild(link)
      //   link.click()
      //   document.body.removeChild(link)
      // }
    }
  }

  return (
    <div
      className="flex cursor-pointer items-center gap-1 overflow-hidden text-ellipsis whitespace-nowrap"
      onClick={handleClickFile}
    >
      {getIcon()} {file.name}
    </div>
  )
}

export default MessageFeature
