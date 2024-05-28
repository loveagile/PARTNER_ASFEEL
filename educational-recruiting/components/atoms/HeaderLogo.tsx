import useSystemName from '@/hooks/useSystemName'
import React from 'react'

function HeaderLogo({ onClick, className }: { onClick?: () => void; className?: string }) {
  const { logo } = useSystemName()
  return (
    <div className={`pc:text-md whitespace-pre-line font-bold text-white hover:cursor-pointer sp:text-small ${className}`} onClick={onClick}>
      {logo}
    </div>
  )
}

export default HeaderLogo
