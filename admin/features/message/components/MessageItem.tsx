import { Col, Row } from 'antd'
import { Message } from '../common'
import dayjs from 'dayjs'
import React from 'react'
import { auth } from '@/libs/firebase/firebase'
import MessageBoxMark from '@/components/atoms/Icon/MessageBoxMark'
import { FileItem } from '.'
import TextAreaRenderBox from '@/components/TextAreaRenderBox'

type MessageItemProps = {
  message: Message
  userId: string
}

const MessageItem = ({ message, userId }: MessageItemProps) => {
  const { senderId, type, createdAt, fileUrl, projectId, text } = message
  const [isMe, setIsMe] = React.useState(false)

  const sendHour = dayjs(createdAt).format('HH:mm')

  React.useEffect(() => {
    setIsMe(senderId !== userId)
  }, [senderId])

  return (
    <div>
      <Row
        className={`mt-5 flex-nowrap ${isMe ? '' : 'flex-row-reverse'}`}
        align="bottom"
        justify="end"
      >
        <Col className="text-timestamp text-gray-gray_dark">
          {/* {isMe && <div>既読</div>} */}
          {false && <div>既読</div>}
          <div>{sendHour}</div>
        </Col>
        <Col className="max-w-[83.333%]">
          <div className="relative">
            <MessageBoxMark
              className={`absolute ${isMe ? 'right-0' : 'left-0 scale-x-[-1]'}`}
              fill={isMe ? '#BDED9A' : '#FDFDFD'}
            />
            <div
              className={`mx-2 w-fit rounded-[10px] ${
                isMe ? 'bg-core-green' : 'bg-gray-white'
              }  p-[10px]`}
            >
              {text && <TextAreaRenderBox text={text} />}
              {fileUrl?.map((file) => (
                <FileItem
                  file={{
                    name: file.fileName,
                    url: file.fileUrl,
                  }}
                />
              ))}
            </div>
          </div>
        </Col>
      </Row>
    </div>
  )
}

export default MessageItem
