'use client'

import { AlreadyReadLabel } from '@/components/parts/Message/AlreadyReadLabel'
import { TimeStamp } from '@/components/parts/Message/TimeStamp'
import { BsCheckCircle } from 'react-icons/bs'
import Image from 'next/image'
import Link from 'next/link'

interface MsgAnnounceProps {
  projectId: string
  className?: string
  schedule: {
    [key: string]: string[]
  }
  time: string
  readStatus: boolean
}

const MsgAnnounce: React.FC<MsgAnnounceProps> = ({
  projectId,
  className = '',
  time,
  readStatus,
}) => {
  return (
    <div className={`${className} inline-flex items-end gap-1`}>
      <div className="relative pl-2">
        <span className="absolute left-0 top-0">
          <svg
            width="11"
            height="9"
            viewBox="0 0 11 9"
            fill="none"
            xmlns="http://www.w3.org/2000/svg"
          >
            <path
              d="M0 0C1.99997 2.00049 8.66668 3.33333 11 3C8.50001 5.5 8.00001 9 8.00001 9C2.5 8 0 0 0 0Z"
              fill="#FDF8E9"
            />
          </svg>
        </span>
        <div
          className={`${className} inline-block w-[298px] rounded-[10px] bg-light-yellow_light p-[14px]`}
        >
          <div className="flex items-end justify-center gap-[5.5px] text-small text-core-red">
            <BsCheckCircle size={15} />
            <span>応募が完了しました！</span>
          </div>
          <div className="my-2 border-y border-dashed border-gray-black px-[11.5px] pb-2 pt-[10px] text-gray-black">
            <div className="text-center">
              <Image
                src="/images/icons/ball.svg"
                width={40}
                height={40}
                className="mx-auto"
                alt=""
              />
            </div>
            <h2 className="mt-[10px] text-center text-body_sp">
              ○○県甲府市エリア 中学校
              <br />
              サッカー / 男子
            </h2>
            <p className="mt-2 text-mini">【チームからの勤務希望】</p>
            {/* <Schedule className="mt-1" schedule={schedule} size="mini" /> */}
          </div>
          <p className="mb-2 text-center text-body_sp text-gray-black">
            詳細を確認して回答してください
          </p>
          <div className="text-center">
            <Link
              href={`projects/${projectId}`}
              className="mx-auto inline-block rounded-full bg-core-blue px-[26px] py-[7px] text-body_sp text-gray-white"
            >
              募集詳細をみる
            </Link>
          </div>
        </div>
      </div>
      <div>
        {readStatus && <AlreadyReadLabel />}
        <TimeStamp label={time} />
      </div>
    </div>
  )
}

export default MsgAnnounce
