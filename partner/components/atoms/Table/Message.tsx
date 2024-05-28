import { MdChatBubble } from 'react-icons/md'

interface MessageProps {
  status: 'On' | 'Off'
}

const Message: React.FC<MessageProps> = ({ status }) => {
  return (
    <div className={`text-[20px] ${status === 'On' ? 'text-core-sky' : 'text-gray-gray'}`}>
      <MdChatBubble />
    </div>
  )
}

export default Message
