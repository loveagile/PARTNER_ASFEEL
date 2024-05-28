import { TimeStamp } from '@/components/parts/Message/TimeStamp'
import { useRouter } from 'next/router'

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
  major?: string
  sex?: string
  selected: boolean
  unreadStatus: boolean
  unreadCount: number
  date: string
  text?: string
  msgType?: string
  projectId: string
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
  msgType,
  projectId,
}) => {
  const router = useRouter()

  return (
    <div
      onClick={() => {
        router.push(`/messages/${projectId}`)
      }}
      className={`${
        selected ? 'bg-gray-gray_light' : 'bg-white'
      } flex h-[60px] w-full cursor-pointer justify-between border-y border-gray-gray p-[10px]`}
    >
      <div className="flex flex-col justify-between">
        <h3 className="line-clamp-1">
          <span className={`${size == Size.PC ? 'text-h3' : 'text-h5'} leading-none`}>{school}</span>
          <span className={`${size == Size.PC ? 'block text-timestamp' : 'ml-2 text-small'} leading-none`}>
            {major}&nbsp;&nbsp;{sex}
          </span>
        </h3>
        {size == Size.SP && (
          <p className={`line-clamp-1 pr-[4px] text-[13px] leading-none ${msgType !== 'common' && 'text-core-red'}`}>
            {text}
          </p>
        )}
      </div>
      <div className={`flex flex-col items-end ${unreadStatus ? 'justify-between' : 'justify-end'}`}>
        {unreadStatus && unreadCount > 0 && (
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
