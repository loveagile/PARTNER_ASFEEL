'use client'

import { TimeStamp } from '@/components/parts/Message/TimeStamp'

export enum Size {
  PC,
  SP,
}

export enum Sex {
  Boy = '男子',
  Girl = '女子',
}

interface ListProps {
  size: Size
  school: string
  major: string
  sex: Sex
  selected: boolean
  unreadStatus: boolean
  unreadCount?: number
  date: string
  text?: string
}

const List: React.FC<ListProps> = ({
  size,
  school,
  major,
  sex,
  selected,
  unreadStatus,
  unreadCount,
  date,
  text,
}) => {
  return (
    <div
      className={`${
        selected ? 'bg-gray-gray_light' : 'bg-gray-white'
      } flex h-[72px] w-[300px] cursor-pointer justify-between border-b border-gray-gray px-[10px] py-4`}
    >
      <div className="flex flex-col justify-between">
        <h3>
          <span
            className={`${
              size == Size.PC ? 'text-h4 pc:text-h3' : 'text-h5'
            } leading-none`}
          >
            {school}
          </span>
          <span
            className={`${
              size == Size.PC ? 'block text-timestamp' : 'ml-2 text-small'
            } leading-none`}
          >
            {major}&nbsp;&nbsp;{sex}
          </span>
        </h3>
        {size == Size.SP && (
          <p className="text-timestamp leading-none">{text}</p>
        )}
      </div>
      <div
        className={`flex flex-col items-end ${
          unreadStatus ? 'justify-between' : 'justify-end'
        }`}
      >
        {unreadStatus && (
          <span className="inline-flex h-5 w-5 items-center justify-center rounded-full bg-core-red text-timestamp text-gray-white">
            {unreadCount}
          </span>
        )}
        {size == Size.PC ? (
          <TimeStamp label={date} />
        ) : (
          <div className="text-mini text-gray-gray_dark">
            <span>{date}</span>
          </div>
        )}
      </div>
    </div>
  )
}

export default List
