'use client'

import { Icon } from '@/components/atoms'
import { TimeStamp } from '@/components/parts/Message/TimeStamp'
import Image from 'next/image'

interface ListSubProps {
  profileImgUrl?: string
  name: string
  date: string
  unreadStatus: boolean
  selected: boolean
}

const ListSub: React.FC<ListSubProps> = ({
  profileImgUrl,
  name,
  date,
  unreadStatus,
  selected,
}) => {
  return (
    <div
      className={`${
        selected ? 'bg-gray-gray_light' : 'bg-gray-white'
      } relative flex h-[60px] w-[230px] cursor-pointer border-b border-gray-gray p-[10px]`}
    >
      <div className="mr-[10px] inline-flex h-10 w-10 items-center justify-center overflow-hidden rounded-full">
        {profileImgUrl == undefined ? (
          <Icon size={40} src="/images/avatar/no_avatar.png" alt="" />
        ) : (
          <Image src={profileImgUrl} width={40} height={40} alt={name} />
        )}
      </div>
      <div className="flex flex-col justify-between">
        <h4 className="text-h4">
          <span>{name}</span>
        </h4>
        <TimeStamp label={date} />
      </div>
      {unreadStatus && (
        <span className="absolute bottom-0 right-[10px] top-0 my-auto inline-block h-[10px] w-[10px] rounded-full bg-core-red"></span>
      )}
    </div>
  )
}

export default ListSub
