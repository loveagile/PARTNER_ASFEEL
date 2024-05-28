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
  ref: any
}
const DetailedJobCard = ({ url, title, subTitle, description, gender, school, count, background }: DetailedJobCardProps) => {
  const view = useView()

  return (
    <div className="pc:p-0 sp:p-2">
      {view == 'PC' ? (
        <>
          <div className="flex justify-between max-w-[800px]">
            <div className="flex justify-between">
              <div className="items-center justify-center p-4">{url && <img src={`/images/icons/${url}.svg`} className="w-10 h-10" alt="" />}</div>
              <div className="self-center text-start">
                <p className="text-[16px] font-bold">{title}</p>
                <p className="text-[13px]">{`${subTitle} ${gender}`}</p>
              </div>
            </div>
            <div className="flex justify-between self-center text-start pr-4">
              <br />
              <p className="text-[15px] font-bold text-blue-500">{`募集人数 : ${count}名`}</p>
            </div>
          </div>
          <div className="">{background && <img src={`/images/landing/${background}.png`} className="w-full -ml-[1px]" alt="" />}</div>
          <div className="text-start">
            <p className="text-[16px] font-bold m-4">{description}</p>
            <hr className="h-1 m-4" />
          </div>
        </>
      ) : (
        view == 'SP' && (
          <>
            <div className="text-start">
              <div className="flex gap-2">
                <div className="self-center">{url && <img src={`/images/icons/${url}.svg`} className="w-8 h-8" alt="" />}</div>
                <div className="text-start w-full">
                  <p className="text-[16px] font-bold">{`${title} ${school}`}</p>
                  <div className="flex justify-between">
                    <p className="text-[12px] font-bold">{`${subTitle} ${gender}`}</p>
                    <p className="text-[12px] text-end font-bold text-blue-500">{`募集人数 : ${count}名`}</p>
                  </div>
                </div>
              </div>
              <div>
                <p className="text-[12px] my-2">{description}</p>
                <hr className="h-1 my-2" />
              </div>
            </div>
          </>
        )
      )}
    </div>
  )
}
export default DetailedJobCard
