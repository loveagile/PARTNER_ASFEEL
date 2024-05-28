'use client'

// Import the required libraries
import React from 'react'

// Define the TopPageCaptionProps interface for the TopPageCaption component
interface TopPageCaptionProps {
  className?: string
  title: string
  subTitle?: string
}

// Create the TopPageCaption component
const TopPageCaption: React.FC<TopPageCaptionProps> = ({
  className = '',
  title,
  subTitle,
}) => {
  return (
    <div
      className={`flex w-full flex-col items-center gap-2 rounded-t-[10px] bg-light-blue_light px-3 py-3 pc:flex-row pc:gap-5 pc:px-5 ${className}`}
    >
      <h4 className={`text-h5 text-core-blue sp:text-h4`}>{title}</h4>
      {subTitle && <p className={`text-mini text-gray-black`}>{subTitle}</p>}
    </div>
  )
}

export default TopPageCaption
