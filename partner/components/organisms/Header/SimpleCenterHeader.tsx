import { useRouter } from 'next/router'
import React from 'react'

export const SimpleCenterHeader = ({ system_name }: { system_name: string }) => {
  const router = useRouter()

  return (
    <div className="w-full items-center bg-core-blue_dark p-[10px]">
      <div
        className=" text-center text-[16px] font-bold text-gray-white hover:cursor-pointer"
        onClick={() => {
          router.push('#')
        }}
      >
        {system_name}
      </div>
    </div>
  )
}
