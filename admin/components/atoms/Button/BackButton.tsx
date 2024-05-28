'use client'

import { MdArrowBack } from 'react-icons/md'

interface BackButtonProps {
  className?: string
  onClick: () => void
}

const BackButton: React.FC<BackButtonProps> = ({ className = '', onClick }) => {
  return (
    <div
      onClick={onClick}
      className={`inline-flex h-5 w-5 cursor-pointer items-center justify-center rounded-full bg-gray-gray text-[12px] text-gray-white pc:h-10 pc:w-10 pc:text-[24px] ${className}`}
    >
      <MdArrowBack />
    </div>
  )
}

export default BackButton
