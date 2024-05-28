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
}

const InputArea: React.FC<InputAreaProps> = ({ className = '', size = 'pc', onTextChange, onFileUpload }) => {
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
      const newFiles = Array.from(event.target.files || [])
      setFiles([...files, ...newFiles])
      if (event.target.files) {
        onFileUpload(event.target.files)
      }
    },
    [files, onFileUpload],
  )

  const handleFileRemove = useCallback(
    (file: File) => {
      const newFiles = files.filter((f) => f !== file)
      setFiles(newFiles)
    },
    [files],
  )

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
          <Attachment isLabel={false} fileUpload={handleFileUpload} />
          <textarea
            className={textareaClassNames}
            onChange={handleTextChange}
            placeholder="メッセージを入力"
            ref={textAreaRef}
            rows={1}
            value={value}
          />
          <button type="submit" className={`text-core-sky text-[20px] ${value === '' ? 'opacity-30' : ''}`} disabled={!(value === '')}>
            <IoSend />
          </button>
        </div>
        {files.length >= 1 && (
          <div className="flex flex-wrap gap-[14px] pt-[14px] border-t border-gray-gray_light mt-[10px]">
            {files.map((file, index) => {
              let extension = file.name.split('.').pop() || ''
              return <AttachmentFile key={index} extension={extension} fileName={file.name} isRemoveBtn onClose={() => handleFileRemove(file)} />
            })}
          </div>
        )}
      </form>
    </div>
  )
}

export default InputArea
