// Import the required libraries
import React from 'react'

// Define the TopPageCaptionProps interface for the TopPageCaption component
interface TopPageCaptionProps {
  title: string
  titleClassName?: string
  subTitle: string
  subTitleClassName?: string
  backgroundColor?: string
  className?: string
}

// Create the TopPageCaption component
const TopPageCaption: React.FC<TopPageCaptionProps> = ({
  title,
  titleClassName = '',
  subTitle,
  subTitleClassName = '',
  backgroundColor = '#f8f9fa',
  className = '',
}) => {
  // Define the inline styles for the component with the provided background color
  const style = {
    backgroundColor: backgroundColor,
  }

  return (
    <div className={`top-page-caption flex gap-8 items-center pl-4 ${className}`} style={style}>
      <h1 className={`caption-title text-xl ${titleClassName}`}>{title}</h1>
      <h4 className={`caption-sub-title ${subTitleClassName}`}>※{subTitle}</h4>
    </div>
  )
}

export default TopPageCaption
