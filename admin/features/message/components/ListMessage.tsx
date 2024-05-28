import React from 'react'
import { Message, MessageRoom } from '../common'
import MessageItem from './MessageItem'
import dayjs from 'dayjs'

type ListMessageProps = {
  messageList: Message[]
  currentMessageRoom: MessageRoom
}

const ListMessage = ({ messageList, currentMessageRoom }: ListMessageProps) => {
  const lastMessageRef = React.useRef<HTMLDivElement>(null)

  //TODO: Handle load more message later

  React.useEffect(() => {
    if (lastMessageRef.current) {
      lastMessageRef.current.scrollIntoView()
    }
  }, [messageList])

  return (
    <div className="flex flex-col-reverse p-5">
      {messageList.map((message, index) => {
        const currentDay = dayjs(message.createdAt)
        const previousDate = dayjs(
          messageList[index - 1]?.createdAt || currentDay,
        )
        const isPreviousDay = !currentDay.isSame(previousDate, 'day')
        // const isYesterday = dayjs()
        //   .subtract(1, 'day')
        //   .isSame(previousDate, 'day')

        return (
          <div ref={index === 0 ? lastMessageRef : undefined}>
            <MessageItem
              key={index}
              message={message}
              userId={currentMessageRoom.userId}
            />
            {isPreviousDay && (
              <div className="my-5 text-center">
                <span className="inline-block rounded-[20px] bg-gray-white px-2 py-1">
                  {currentDay.format('YYYY/MM/DD')}
                </span>
              </div>
            )}
          </div>
        )
      })}
    </div>
  )
}

export default ListMessage
