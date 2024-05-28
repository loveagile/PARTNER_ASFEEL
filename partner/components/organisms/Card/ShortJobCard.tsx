import { useView } from '@/hooks'
import { MdArrowForwardIos } from 'react-icons/md'
import { useRouter } from 'next/router'
var vcount = 0
export interface ShortJobCardProps {
  url?: string
  title: string
  subTitle: string
  description: string
  gender: string
  school: string
  count: number
  type: string
  id?: string
  ref?: any
}
const ShortJobCard = ({ url, title, subTitle, description, gender, school, count, type, id }: ShortJobCardProps) => {
  const view = useView()
  const router = useRouter()

  const click_detail = () => {
    router.push(`/jobList/${type}-${id}`)
  }
  vcount = vcount + 1
  vcount = (vcount % 14) + 1
  return (
    <div className="border-slate-10 mx-[20px] cursor-pointer rounded-2xl border border-gray-100 bg-white px-[10px] py-[16px] text-center">
      {view == 'PC' ? (
        <>
          <div className="flex max-w-[800px] justify-between gap-4" onClick={() => click_detail()}>
            <div className="flex flex-1 justify-between gap-4">
              <div className="items-center justify-center ">
                {url ? (
                  <img src={`/images/icons/sports/${url}.svg`} className="h-20 w-20" alt="" />
                ) : (
                  <img src={`/images/icons/sports/empty.svg`} className="h-20 w-20" alt="" />
                )}
              </div>
              <div className="flex-1">
                <div className="flex justify-between text-start">
                  <div>
                    <p className="text-[16px] font-bold">{title}</p>
                    <p className="text-[15px] font-bold text-core-blue_dark">{`募集人数 : ${count}名`}</p>
                  </div>
                </div>
                <hr className="my-1" />
                <div>
                  <p className="text-start text-xs text-neutral-500">{description}</p>
                </div>
              </div>
            </div>
            <div className="self-center text-neutral-500">
              <MdArrowForwardIos size={18} onClick={() => click_detail()} />
            </div>
          </div>
        </>
      ) : (
        view == 'SP' && (
          <>
            <div className="text-start" onClick={() => click_detail()}>
              <div className="flex justify-between gap-2">
                <div className="flex gap-2">
                  <div className="self-center">
                    {url ? (
                      <img src={`/images/icons/sports/${url}.svg`} className="h-8 w-8" alt="" />
                    ) : (
                      <img src={`/images/icons/sports/empty.svg`} className="h-8 w-8" alt="" />
                    )}
                  </div>
                  <div>
                    <p className="line-clamp-1 text-[16px] font-bold">{title}</p>
                    <p className="text-[12px] font-bold text-core-blue_dark">{`募集人数 : ${count}名`}</p>
                  </div>
                </div>
                <div className="flex gap-2">
                  <div className="self-center text-neutral-500">
                    <MdArrowForwardIos size={18} onClick={() => click_detail()} />
                  </div>
                </div>
              </div>
              <hr className="my-2" />
              <div>
                <p className="my-2 text-mini text-neutral-500">{description}</p>
              </div>
            </div>
          </>
        )
      )}
    </div>
  )
}
export default ShortJobCard
