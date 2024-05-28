var vcount = 0
export interface Card1Props {
  url?: string
  title: string
  subTitle: string
  description: string
  gender: string
  school: string
  count: number
  ref: any
}
const Card1 = ({ url, title, subTitle, description, gender, school, count }: Card1Props) => {
  vcount = vcount + 1
  vcount = (vcount % 14) + 1
  return (
    // <div className="bg-white  border-gray-100 pc:min-w-[320px]  text-center rounded-2xl border border-slate-10 py-4 pc:px-[21px] sp:px-[12px]">
    <div className="bg-white  border-gray-100 text-center rounded-2xl border border-slate-10 py-4 pc:px-[21px] sp:px-[12px]">
      <div className="w-full flex items-center justify-center pb-[10px]">
        {url && <img src={`/images/icons/sports/${url}${vcount}.svg`} className="pc:w-[44px] pc:h-[49px] sp:w-[27px] sp:h-[30px]" alt="" />}
      </div>
      <p className="font-bold pc:text-[16px] sp:text-[12px] text-neutral-800 pb-[2px]">{`${title} ${gender}`}</p>
      <p className="font-bold pc:text-[18px] sp:text-[12px] text-neutral-800 pb-[10px]">{`${subTitle} ${school}`}</p>
      <p className="font-bold pc:text-[14px] sp:text-[12px] text-core-blue_dark">{`募集人数:${count}名`}</p>
      <hr className="my-[10px]" />
      <p className="pc:text-xs sp:text-mini text-start text-neutral-500">{description}</p>
    </div>
  )
}
export default Card1
