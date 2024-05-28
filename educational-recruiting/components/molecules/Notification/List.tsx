import { useRouter } from 'next/router'
import { MdArrowForwardIos } from 'react-icons/md'

export enum Size {
  PC,
  SP,
}

export enum Sex {
  Boy = '男子',
  Girl = '女子',
}

export enum Noti_From {
  Admin = '運営',
  Coordinator = 'コーディネーター',
}

interface ListProps {
  size: Size
  school: string
  major?: string
  sex?: Sex
  selected: boolean
  unreadStatus: boolean
  date: string
  from: Noti_From
  msgType?: string
}

const NotiList: React.FC<ListProps> = ({ size, school, major, sex, selected, unreadStatus, from, date }) => {
  const router = useRouter()

  return (
    <div
      onClick={() => {
        router.push('/messages/111')
      }}
      className={`${
        selected ? 'bg-gray-gray_light' : 'bg-white'
      } flex justify-between w-full h-[78px] p-[10px] border-y border-gray-gray cursor-pointer`}
    >
      <div className="grid gap-[5px]">
        <div className="flex gap-[10px]">
          <p
            className={`px-[4px] py-[1px] text-[10px] rounded-[2px] w-fit ${
              from == Noti_From.Admin ? 'bg-core-blue' : 'bg-gray-gray_lighter border border-gray-gray_dark'
            }`}
          >{`${from}からのお知らせ`}</p>

          {unreadStatus ? (
            <div className="flex gap-[4px]">
              <span className="inline-flex items-center justify-center w-[10px] h-[10px] self-center rounded-full bg-core-red text-timestamp"></span>
              <p className="text-[10px] self-center text-core-red">未読</p>
            </div>
          ) : (
            <p className="text-[10px] self-center text-gray-gray_dark">既読</p>
          )}
        </div>

        <p className="text-[14px] font-bold">
          {school} {major && major} {sex && '/ ' + sex}
        </p>

        <p className="text-[10px] text-gray-gray_dark">{date}</p>
      </div>
      <div className={`flex flex-col items-end justify-end self-center`}>
        <MdArrowForwardIos className="w-[20px] h-[20px] text-gray-gray_dark" />
      </div>
    </div>
  )
}

export default NotiList
