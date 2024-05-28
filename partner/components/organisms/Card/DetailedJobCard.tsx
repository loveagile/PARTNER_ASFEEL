import { useView } from '@/hooks'

export interface DetailedJobCardProps {
  url?: string
  title: string
  subTitle: string
  description: string
  gender: string
  school: string
  count: number
  background: string
  id?: string
}
const DetailedJobCard = ({
  url,
  title,
  subTitle,
  description,
  gender,
  school,
  count,
  background,
}: DetailedJobCardProps) => {
  const view = useView()

  return (
    <div className="sp:p-2 pc:p-0">
      {view == 'PC' ? (
        <>
          <div className="flex max-w-[800px] justify-between">
            <div className="flex justify-between">
              <div className="items-center justify-center p-4">
                {url && <img src={`/images/icons/${url}.svg`} className="h-10 w-10" alt="" />}
              </div>
              <div className="self-center text-start">
                <p className="line-clamp-1 text-[16px] font-bold">{title}</p>
                <p className="text-[13px]">{`${subTitle && subTitle} ${gender}`}</p>
              </div>
            </div>
            <div className="flex justify-between self-center pr-4 text-start">
              <br />
              <p className="text-[15px] font-bold text-blue-500">{`募集人数 : ${count}名`}</p>
            </div>
          </div>
          {/* <div className="">
                    {background && <img src={`/images/landing/${background}.png`} className="w-full -ml-[1px]" alt="" />}
                </div> */}
          <div className="text-start">
            <p className="m-4 text-[16px] font-bold">{description}</p>
            <hr className="m-4 h-1" />
          </div>
        </>
      ) : (
        view == 'SP' && (
          <>
            <div className="text-start">
              <div className="flex gap-2">
                <div className="self-center">
                  {url && <img src={`/images/icons/${url}.svg`} className="h-8 w-8" alt="" />}
                </div>
                <div className="w-full text-start">
                  <p className="line-clamp-1 text-[16px] font-bold">{`${title} ${school}`}</p>
                  <div className="flex justify-between">
                    <p className="text-[12px] font-bold">{`${subTitle && subTitle} ${gender}`}</p>
                    <p className="text-end text-[12px] font-bold text-blue-500">{`募集人数 : ${count}名`}</p>
                  </div>
                </div>
              </div>
              <div>
                <p className="my-2 text-[12px]">{description}</p>
                <hr className="my-2 h-1" />
              </div>
            </div>
          </>
        )
      )}
    </div>
  )
}
export default DetailedJobCard
