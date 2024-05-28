import { faArrowLeft } from '@fortawesome/free-solid-svg-icons'
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome'
import React from 'react'
import { twMerge } from 'tailwind-merge'

interface BackButtonProps {
  className?: string
  onClick: () => void
}

function BackButton({ className, onClick }: BackButtonProps) {
  return (
    <button className={twMerge('rounded-[20px] bg-gray-gray w-10 h-10 px-[12.21px] py-[12.41px]', className)} onClick={onClick}>
      <FontAwesomeIcon icon={faArrowLeft} className="flex justify-center text-gray-white" />
    </button>
  )
}

export default BackButton
