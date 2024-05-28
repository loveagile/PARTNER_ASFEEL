import { useRouter } from 'next/router'
import React from 'react'

export const SimpleCenterHeader = ({ system_name }: { system_name: string }) => {
  // const system_name = "{system_name}";
  const router = useRouter()

  return (
    <div className="w-full items-center p-[10px] bg-core-blue_dark">
      <div
        className=" text-gray-white text-center text-[16px] font-bold hover:cursor-pointer"
        onClick={() => {
          router.push('/')
        }}
      >
        {system_name}
      </div>
    </div>
  )
}
