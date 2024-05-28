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
  noti_id: string
  url: string
  click: (id: string, url: string) => void
}

const NotiList: React.FC<ListProps> = ({
  size,
  school,
  major,
  sex,
  selected,
  unreadStatus,
  from,
  date,
  noti_id,
  url,
  click,
}) => {
  return (
    <div
      onClick={() => click(noti_id, url)}
      className={`${
        selected ? 'bg-gray-gray_light' : 'bg-white'
      } flex h-[78px] w-full cursor-pointer justify-between border-b-[1px] border-gray-gray p-[10px]`}
    >
      <div className="grid gap-[5px]">
        <div className="flex gap-[10px]">
          <p
            className={`w-fit rounded-[2px] px-[4px] py-[1px] text-[10px] ${
              from == Noti_From.Admin ? 'bg-core-blue' : 'border border-gray-gray_dark bg-gray-gray_lighter'
            }`}
          >{`${from}からのお知らせ`}</p>

          {unreadStatus ? (
            <div className="flex gap-[4px]">
              <span className="inline-flex h-[10px] w-[10px] items-center justify-center self-center rounded-full bg-core-red text-timestamp"></span>
              <p className="self-center text-[10px] text-core-red">未読</p>
            </div>
          ) : (
            <p className="self-center text-[10px] text-gray-gray_dark">既読</p>
          )}
        </div>

        <p className="text-[14px] font-bold">
          {school} {major && major} {sex && '/ ' + sex}
        </p>

        <p className="text-[10px] text-gray-gray_dark">{date}</p>
      </div>
      <div className={`flex flex-col items-end justify-end self-center`}>
        <MdArrowForwardIos className="h-[20px] w-[20px] text-gray-gray_dark" />
      </div>
    </div>
  )
}

export default NotiList
