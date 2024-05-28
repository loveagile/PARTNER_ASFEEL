import React, { useState } from 'react'
import { IoMdClose } from 'react-icons/io'

interface HeaderProps {
  name: string
  messageUrl: string
  onClose?: () => void
}

const Header: React.FC<HeaderProps> = ({ name, messageUrl, onClose }) => {
  const [isVisible, setIsVisible] = useState(true)

  const handleOnClick = () => {
    setIsVisible(false)
    if (onClose) {
      onClose()
    }
  }

  return isVisible ? (
    <div className="flex w-full items-center justify-between rounded-t-[6px] bg-core-blue_dark p-[10px]">
      <div className="flex">
        <span onClick={handleOnClick} className="mr-[10px] cursor-pointer text-[26px] text-gray-white">
          <IoMdClose />
        </span>
        <span className="text-h3 text-gray-white">{name}</span>
      </div>
      <a
        href={messageUrl}
        className="inline-flex h-[29px] cursor-pointer items-center justify-center border border-gray-white bg-core-blue px-[10px] py-[6px]"
      >
        <span className="text-timestamp text-gray-white">メッセージ画面で確認</span>
      </a>
    </div>
  ) : null
}

export default Header
