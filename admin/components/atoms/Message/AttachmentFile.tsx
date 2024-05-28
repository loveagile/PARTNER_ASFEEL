'use client'

import { useState } from 'react'
import FileIcon from '@/components/parts/Message/FileIcon'
import { MdClose } from 'react-icons/md'

interface AttachmentFileProps {
  extension: string
  fileName: string
  isRemoveBtn: boolean
  onClose?: () => void
}

const AttachmentFile: React.FC<AttachmentFileProps> = ({
  extension,
  fileName,
  isRemoveBtn,
  onClose,
}) => {
  const [isVisible, setIsVisible] = useState(true)

  const handleOnClick = () => {
    setIsVisible(false)
    if (onClose) {
      onClose()
    }
  }

  return isVisible ? (
    <div className="relative inline-flex items-center gap-1 rounded-[6px] border border-gray-gray bg-gray-white px-3 py-2">
      <FileIcon extension={extension} />
      <span className="text-small">{fileName}</span>
      {isRemoveBtn && (
        <span
          onClick={handleOnClick}
          className="absolute -right-1 -top-1 h-[14px] w-[14px] cursor-pointer rounded-full bg-gray-gray_dark text-gray-white"
        >
          <MdClose size={14} />
        </span>
      )}
    </div>
  ) : null
}

export default AttachmentFile
