import FileIcon from '@/components/parts/Message/FileIcon'
// import { AiOutlineCloudDownload } from "react-icons/ai"
import { BalloonType } from './Balloon'
import { TimeStamp } from '@/components/parts/Message/TimeStamp'

interface AttachmentDownloadFileProps {
  extension: string
  fileName: string
  type: BalloonType
  time: string
  isMyMessage: boolean
  onDownload?: () => void
  onOpen?: () => void
}

const AttachmentDownloadFile: React.FC<AttachmentDownloadFileProps> = ({
  extension,
  fileName,
  type,
  time,
  isMyMessage,
  onDownload,
  onOpen,
}) => {
  const handleOnDownload = () => {
    if (onDownload) {
      onDownload()
    }
  }

  const handleOnClick = () => {
    if (onOpen) {
      onOpen()
    }
  }

  return (
    <div className={`flex w-full ${isMyMessage ? 'justify-end' : ''}`} onClick={handleOnDownload}>
      <div className={`flex items-end space-x-1`}>
        {isMyMessage && <TimeStamp label={time} />}
        <div
          onClick={handleOnClick}
          className={`${
            type == BalloonType.Received ? 'float-right ' : ''
          } relative z-0 inline-flex w-[250px] cursor-pointer items-center gap-1 rounded-[6px] border border-gray-gray bg-gray-white px-3 py-2`}
        >
          <FileIcon extension={extension} />
          <span className="text-small">{fileName}</span>
        </div>
        {!isMyMessage && <TimeStamp label={time} />}
      </div>
    </div>
  )
}

export default AttachmentDownloadFile
