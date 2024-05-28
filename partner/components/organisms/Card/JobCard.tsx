import { useView } from '@/hooks'
import { MdArrowForwardIos } from 'react-icons/md'
import Link from 'next/link'
import { Address } from '@/types'

export interface JobCardProps {
  url?: string
  title: string
  subTitle: string
  description: string
  gender: string
  school: string
  count: number
  type: string
  address: Address
  schoolType?: string
  id?: string
}

export const schoolTypeEnum = {
  school: '学校',
  team: '合同チーム',
  club: '地域クラブ',
} as const

export default function JobCard({
  url,
  subTitle,
  description,
  gender,
  count,
  id,
  type,
  address,
  schoolType,
}: JobCardProps) {
  const view = useView()
  const link = `/jobList/${type}-${id}`
  const imgUrl = `/images/icons/sports/${url || 'empty'}.svg`
  const title1 = `${address.prefecture}${address.city}エリア ${schoolType}`
  const title2 = `${subTitle} ${gender}`

  const PCView = () => (
    <div className="w-min-[800px] flex">
      <div className="mr-5 self-center">
        {imgUrl ? (
            <img src={imgUrl} className="h-20 w-20" alt="" />
          ) : (
            <img src={`/images/icons/sports/empty.svg`} className="h-20 w-20" alt="" />
          )}
      </div>

      <div className="mr-5 flex-1 justify-between">
        <div className="flex justify-between text-start">
          <div>
            <p className="font-bold">{title1}</p>
            <p className="text-[13px]">{title2}</p>
          </div>
          <p className="text-[15px] font-bold text-core-blue_dark">{`募集人数 : ${count}名`}</p>
        </div>
        <hr className="my-1" />
        <p className="text-start text-xs text-neutral-500">{description}</p>
      </div>

      <ArrowIcon />
    </div>
  )

  const SPView = () => (
    <div className="w-min-[300px] text-start">
      <div className="flex">
        <div className="mr-2 self-center">
          {imgUrl ? (
            <img src={imgUrl} className="h-8 w-8" alt="" />
          ) : (
            <img src={`/images/icons/sports/empty.svg`} className="h-8 w-8" alt="" />
          )}
        </div>
        <div className="mr-3 flex-1">
          <p className="line-clamp-1 font-bold">{title1}</p>
          <div className="flex justify-between">
            <p className="line-clamp-1 text-[12px] font-bold">{title2}</p>
            <p className="text-[12px] font-bold text-core-blue">{`募集人数 : ${count}名`}</p>
          </div>
        </div>
        <ArrowIcon />
      </div>
      <hr className="my-2" />
      <p className="my-2 text-mini text-neutral-500">{description}</p>
    </div>
  )

  return (
    <Link href={link}>
      <div className="border-slate-10 mx-5 cursor-pointer rounded-2xl border border-gray-100 bg-white px-2.5 py-4 text-center">
        {view === 'PC' ? <PCView /> : <SPView />}
      </div>
    </Link>
  )
}

function ArrowIcon() {
  return (
    <div className="self-center text-neutral-500">
      <MdArrowForwardIos size={18} />
    </div>
  )
}
