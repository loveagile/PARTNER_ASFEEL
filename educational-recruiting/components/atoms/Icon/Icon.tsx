import React from 'react'

// Define the IconProps interface for the Icon component
interface IconProps {
  src: string
  alt: string
  size?: 20 | 40 | 60 | 80
  className?: string
}

// Create the Icon component
const Icon: React.FC<IconProps> = ({ src, alt, size = 20, className = '' }) => {
  // Define the inline styles for the component with provided size
  const style = {
    width: size,
    height: size,
  }

  return <img src={src} alt={alt} style={style} className={`icon rounded-full ${className}`} />
}

export default Icon
