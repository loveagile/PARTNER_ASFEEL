import { useView } from '@/hooks'
import useSystemName from '@/hooks/useSystemName'
import React from 'react'

function SystemName({ onClick, className }: { onClick?: () => void; className?: string }) {
  const view = useView()
  const { systemTitle, systemSubTitle } = useSystemName()

  return (
    <div onClick={onClick} className="cursor-pointer">
      {view === 'PC' && (
        <div>
          <span className="mr-3 text-h1 text-white">{systemTitle}</span>
          <span className="font-bold text-white">{systemSubTitle}</span>
        </div>
      )}
      {view === 'SP' && (
        <div className="flex flex-col">
          <span className="text-small font-bold text-white">{systemTitle}</span>
          <span className="text-mini text-white">{systemSubTitle}</span>
        </div>
      )}
    </div>
  )
}

export default SystemName
