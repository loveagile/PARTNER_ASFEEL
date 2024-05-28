import { useState } from 'react'
import FileIcon from '@/components/parts/Message/FileIcon'

interface AttachmentFileProps {
  extension: string
  fileName: string
  isRemoveBtn: boolean
  onClose?: () => void
}

const AttachmentFile: React.FC<AttachmentFileProps> = ({ extension, fileName, isRemoveBtn, onClose }) => {
  const [isVisible, setIsVisible] = useState(true)

  const handleOnClick = () => {
    setIsVisible(false)
    if (onClose) {
      onClose()
    }
  }

  // return isVisible ? (
  return (
    <div className="relative inline-flex items-center gap-1 rounded-[6px] border border-gray-gray bg-gray-white px-3 py-2">
      <FileIcon extension={extension} />
      <span className="text-small">{fileName}</span>
      {isRemoveBtn && (
        <span onClick={handleOnClick} className="absolute -right-1 -top-1 cursor-pointer">
          <img src="/images/icons/close.svg" alt="" />
        </span>
      )}
    </div>
  )
}

export default AttachmentFile
