import React from 'react'
import { MdCopyright } from 'react-icons/md'

interface PCFooterProps {
  className?: string
}

export const PCFooter: React.FC<PCFooterProps> = ({ className = '' }) => {
  return (
    <footer className={`flex flex-col px-[10px] py-5 text-center ${className}`}>
      <div className="flex flex-row items-center justify-center gap-[2px] text-timestamp text-gray-black">
        <MdCopyright size={14} />
        <div>ASFEEL Inc.All Right Reserved.</div>
      </div>
    </footer>
  )
}
