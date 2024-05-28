import Link from 'next/link'
import { JobCardProps } from './JobCard'

const Card1: React.FC<JobCardProps> = ({
  url,
  subTitle,
  description,
  gender,
  schoolType,
  count,
  type,
  address,
  id,
}) => {
  const title1 = `${address.prefecture}${address.city}エリア ${schoolType}`
  const title2 = `${subTitle} ${gender}`
  const titleCommonStyle = 'font-bold text-neutral-800 sp:text-[12px]'

  return (
    <Link href={`/jobList/${type}-${id}`} passHref>
      <div className="border-slate-10 min-h-[265px] cursor-pointer rounded-2xl border border-gray-100 bg-white py-4 text-center sp:px-[12px] pc:px-[21px]">
        <div className="flex w-full items-center justify-center pb-[10px]">
          <img
            src={`/images/icons/sports/${url ? url : 'empty'}.svg`}
            className="sp:h-[30px] sp:w-[27px] pc:h-[49px] pc:w-[44px]"
            alt=""
          />
        </div>
        <p className={`${titleCommonStyle} mb-[2px] pc:text-[16px]`}>{`${title1}`}</p>
        <p className={`${titleCommonStyle} mb-[10px] pc:text-[16px]`}>{`${title2}`}</p>
        <p className="font-bold text-core-blue_dark sp:text-[12px] pc:text-[14px]">{`募集人数:${count}名`}</p>
        <hr className="my-2.5" />
        <p className="line-clamp-4 text-start text-neutral-500 sp:text-mini pc:text-xs">{description}</p>
      </div>
    </Link>
  )
}

export default Card1
