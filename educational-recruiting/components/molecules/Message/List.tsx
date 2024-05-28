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
  sex?: Sex
  selected: boolean
  unreadStatus: boolean
  unreadCount?: number
  date: string
  text?: string
  msgType?: string
}

const List: React.FC<ListProps> = ({ size, school, major, sex, selected, unreadStatus, unreadCount, date, text, msgType }) => {
  const router = useRouter()

  return (
    <div
      onClick={() => {
        router.push('/messages/111')
      }}
      className={`${
        selected ? 'bg-gray-gray_light' : 'bg-white'
      } flex justify-between w-full h-[60px] p-[10px] border-y border-gray-gray cursor-pointer`}
    >
      <div className="flex flex-col justify-between">
        <h3>
          <span className={`${size == Size.PC ? 'text-h3' : 'text-h5'} leading-none`}>{school}</span>
          <span className={`${size == Size.PC ? 'text-timestamp block' : 'text-small ml-2'} leading-none`}>
            {major}&nbsp;&nbsp;{sex}
          </span>
        </h3>
        {size == Size.SP && <p className={`leading-none text-timestamp line-clamp-1 pr-[4px] ${msgType !== 'common' && 'text-core-red'}`}>{text}</p>}
      </div>
      <div className={`flex flex-col items-end ${unreadStatus ? 'justify-between' : 'justify-end'}`}>
        {unreadStatus && (
          <span className="inline-flex items-center justify-center w-5 h-5 rounded-full bg-core-red text-gray-white text-timestamp">
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
