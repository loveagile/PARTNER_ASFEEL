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

  return isVisible ? (
    <div className="inline-flex items-center gap-1 px-3 py-2 border border-gray-gray rounded-[6px] bg-gray-white relative">
      <FileIcon extension={extension} />
      <span className="text-small">{fileName}</span>
      {isRemoveBtn && (
        <span onClick={handleOnClick} className="absolute cursor-pointer -top-1 -right-1">
          <img src="/images/icons/close.svg" alt="" />
        </span>
      )}
    </div>
  ) : null
}

export default AttachmentFile
