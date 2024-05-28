'use client'

import { ImAttachment } from 'react-icons/im'

interface AttachmentProps {
  className?: string
  isLabel: boolean
  fileUpload: (event: React.ChangeEvent<HTMLInputElement>) => void
}

const Attachment: React.FC<AttachmentProps> = ({
  className = '',
  isLabel,
  fileUpload,
}) => {
  return (
    <div className={className}>
      <label
        htmlFor="inputFile"
        className="inline-flex cursor-pointer items-end gap-1"
      >
        <ImAttachment className="text-core-sky" />
        {isLabel && (
          <span className="text-small text-core-sky">ファイル添付</span>
        )}
      </label>
      <input id="inputFile" type="file" hidden multiple onChange={fileUpload} />
    </div>
  )
}

export default Attachment
