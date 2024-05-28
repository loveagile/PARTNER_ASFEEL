import { Icon } from '@/components/atoms'
import { TimeStamp } from '@/components/parts/Message/TimeStamp'

interface ListSubProps {
  profileImgUrl?: string
  name: string
  date: string
  unreadStatus: boolean
  selected: boolean
}

const ListSub: React.FC<ListSubProps> = ({ profileImgUrl, name, date, unreadStatus, selected }) => {
  return (
    <div
      className={`${
        selected ? 'bg-gray-gray_light' : 'bg-gray-white'
      } relative flex w-[230px] h-[60px] p-[10px] border-b border-gray-gray cursor-pointer`}
    >
      <div className="inline-flex items-center justify-center w-10 h-10 overflow-hidden rounded-full mr-[10px]">
        {profileImgUrl == undefined ? <Icon size={40} src="images/avatar/no_avatar.png" alt="" /> : <img src={profileImgUrl} alt={name} />}
      </div>
      <div className="flex flex-col justify-between">
        <h4 className="text-h4">
          <span>{name}</span>
        </h4>
        <TimeStamp label={date} />
      </div>
      {unreadStatus && <span className="absolute inline-block bg-core-red w-[10px] h-[10px] rounded-full top-0 bottom-0 right-[10px] my-auto"></span>}
    </div>
  )
}

export default ListSub
