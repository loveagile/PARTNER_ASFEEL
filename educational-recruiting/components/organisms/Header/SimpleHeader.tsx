import useSystemName from '@/hooks/useSystemName'
import { useRouter } from 'next/router'
import React from 'react'

export const SimpleHeader = () => {
  const router = useRouter()
  const { logo } = useSystemName()

  return (
    <div className="flex flex-row w-full justify-between items-center p-[10px] h-[64px] bg-core-blue_dark">
      <div
        className="whitespace-pre-line text-gray-white text-small font-bold hover:cursor-pointer"
        onClick={() => {
          router.push('/')
        }}
      >
        {logo}
      </div>
      <div className="flex flex-row gap-[10px] items-start"></div>
    </div>
  )
}
