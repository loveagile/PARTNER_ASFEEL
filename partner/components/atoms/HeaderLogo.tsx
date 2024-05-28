import React from 'react'
import SystemName from './System'

function HeaderLogo({ onClick, className }: { onClick?: () => void; className?: string }) {
  return <SystemName onClick={onClick} />
}

export default HeaderLogo
