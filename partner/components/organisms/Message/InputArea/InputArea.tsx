import { useCallback, useEffect, useRef, useState } from 'react'

import Attachment from '@/components/atoms/Message/Attachment'
import { IoSend } from 'react-icons/io5'
import { useAutosizeTextArea } from '@/hooks'

import styles from './InputArea.module.css'
import AttachmentFile from '@/components/atoms/Message/AttachmentFile'

interface InputAreaProps {
  className?: string
  size?: 'pc' | 'sp'
  onTextChange: (text: string) => void
  onFileUpload: (files: FileList) => void
  sendMessage: () => Promise<void>
}

const InputArea: React.FC<InputAreaProps> = ({
  className = '',
  size = 'pc',
  onTextChange,
  onFileUpload,
  sendMessage,
}) => {
  const [value, setValue] = useState('')
  const [files, setFiles] = useState<File[]>([])
  const textAreaRef = useRef<HTMLTextAreaElement>(null)

  useAutosizeTextArea(textAreaRef.current, value)

  useEffect(() => {
    onTextChange(value)
  }, [value, onTextChange])

  const handleTextChange = useCallback((event: React.ChangeEvent<HTMLTextAreaElement>) => {
    const { value } = event.target
    setValue(value)
  }, [])

  const handleFileUpload = useCallback(
    (event: React.ChangeEvent<HTMLInputElement>) => {
      const maxFileSize = 5 * 1024 * 1024 // 5MB in bytes

      const newFiles = Array.from(event.target.files || [])
      let fit_files: File[] = []

      let alert_string: string[] = []
      newFiles.map((data, index) => {
        if (data.size > maxFileSize) {
          alert_string.push(data.name)
        } else {
          fit_files.push(data)
        }
      })

      if (alert_string && alert_string.length > 0) alert(alert_string.join(', ') + ' ファイル容量が5MBを超えています。')

      setFiles([...files, ...fit_files])
      if (event.target.files) {
        console.log('event.target.files:', event.target.files)
        onFileUpload(event.target.files)
      }
    },
    [files, onFileUpload],
  )

  const handleFileRemove = useCallback(
    (file: File) => {
      const newFiles = files.filter((f) => f !== file)
      setFiles(newFiles)

      const dataTransfer = new DataTransfer()
      for (const file of newFiles) {
        dataTransfer.items.add(file)
      }
      onFileUpload(dataTransfer.files)
    },
    [files],
  )

  const clickSend = async () => {
    await sendMessage()
    setValue('')
    setFiles([])
  }

  const textareaClassNames = [
    'w-full',
    'max-h-[176px]',
    'px-[18px]',
    'py-[7px]',
    'text-gray-black',
    'text-body_sp',
    'rounded-[6px]',
    'border',
    'border-gray-gray',
    'outline-none',
    'resize-none',
    size === 'pc' ? styles.textareaScrollbarWidth : styles.textareaScrollbarWidthSP,
    styles.textareaScrollbar,
    size === 'pc' ? 'mx-4' : 'mx-[10px]',
  ].join(' ')

  return (
    <div className={`w-full ${className}`}>
      <form className="bg-gray-white px-4 py-[10px]">
        <div className={`flex ${value === '' ? 'items-center' : 'items-end'}`}>
          <div className="flex h-[37px] items-center justify-center">
            <Attachment isLabel={false} fileUpload={handleFileUpload} />
          </div>
          <textarea
            className={textareaClassNames}
            onChange={handleTextChange}
            placeholder="メッセージを入力"
            ref={textAreaRef}
            rows={1}
            value={value}
          />
          <div className="flex h-[38px] items-center justify-center">
            <button
              type="button"
              className={`cursor-pointer text-[20px] text-core-sky ${
                value === '' && files.length == 0 ? 'opacity-30' : ''
              }`}
              disabled={value === '' && files.length == 0}
            >
              <IoSend onClick={() => clickSend()} />
            </button>
          </div>
        </div>
        {files.length >= 1 && (
          <div className="mt-[10px] flex flex-wrap gap-[14px] border-t border-gray-gray_light pt-[14px]">
            {files.map((file, index) => {
              let extension = file.name.split('.').pop() || ''
              return (
                <AttachmentFile
                  key={index}
                  extension={extension}
                  fileName={file.name}
                  isRemoveBtn
                  onClose={() => handleFileRemove(file)}
                />
              )
            })}
          </div>
        )}
      </form>
    </div>
  )
}

export default InputArea
