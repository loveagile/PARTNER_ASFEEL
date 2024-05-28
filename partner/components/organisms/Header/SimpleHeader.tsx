import HeaderLogo from '@/components/atoms/HeaderLogo'
import { useRouter } from 'next/router'
import React from 'react'

export const SimpleHeader = () => {
  const router = useRouter()
  return (
    <div className="flex h-[64px] w-full flex-row items-center justify-between bg-core-blue_dark p-[10px]">
      <HeaderLogo onClick={() => router.push('/')} />
      <div className="flex flex-row items-start gap-[10px]"></div>
    </div>
  )
}
