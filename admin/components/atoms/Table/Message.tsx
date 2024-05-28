'use client'

import { MdChatBubble } from 'react-icons/md'

interface MessageProps {
  status: boolean
}

const Message: React.FC<MessageProps> = ({ status }) => {
  return (
    <div
      className={`text-[20px] ${status ? 'text-core-sky' : 'text-gray-gray'}`}
    >
      <MdChatBubble />
    </div>
  )
}

export default Message
