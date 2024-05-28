import { useView } from '@/hooks'
import { MdArrowForwardIos } from 'react-icons/md'
import { useRouter } from 'next/router'
var vcount = 0
export interface JobCardProps {
  url?: string
  title: string
  subTitle: string
  description: string
  gender: string
  school: string
  count: number
  ref: any
}
const JobCard = ({ url, title, subTitle, description, gender, school, count }: JobCardProps) => {
  const view = useView()
  const router = useRouter()

  const click_detail = () => {
    router.push('/preLogin/detailed')
  }
  vcount = vcount + 1
  vcount = (vcount % 14) + 1
  return (
    <div className="bg-white border-gray-100 text-center rounded-2xl border py-[16px] px-[10px] border-slate-10 mx-[20px] cursor-pointer">
      {view == 'PC' ? (
        <>
          <div className="flex justify-between w-min-[800px]" onClick={() => click_detail()}>
            <div className="items-center justify-center pc:pr-[20px]">
              {url && <img src={`/images/icons/sports/${url}${vcount}.svg`} className="w-20 h-20" alt="" />}
            </div>
            <div className="flex justify-between gap-4">
              <div>
                <div className="flex justify-between text-start">
                  <div>
                    <p className="text-[16px] font-bold">{title}</p>
                    <p className="text-[13px]">{`${subTitle} ${gender}`}</p>
                  </div>
                  <div className="self-center">
                    <p className="text-[15px] font-bold text-core-blue_dark">{`募集人数 : ${count}名`}</p>
                  </div>
                </div>
                <hr className="my-1" />
                <div>
                  <p className="text-xs text-start text-neutral-500">{description}</p>
                </div>
              </div>
              <div className="self-center text-neutral-500">
                <MdArrowForwardIos size={18} onClick={() => click_detail()} />
              </div>
            </div>
          </div>
        </>
      ) : (
        view == 'SP' && (
          <>
            <div className="text-start w-min-[300px]" onClick={() => click_detail()}>
              <div className="flex gap-2 justify-between">
                <div className="flex gap-2">
                  <div className="self-center">{url && <img src={`/images/icons/sports/${url}${vcount}.svg`} className="w-8 h-8" alt="" />}</div>
                  <div>
                    <p className="text-[16px] font-bold">{title}</p>
                    <p className="text-[12px] font-bold">{`${subTitle} ${gender}`}</p>
                  </div>
                </div>
                <div className="flex gap-2">
                  <div>
                    <p className="text-[16px] font-bold">{school}</p>
                    <p className="text-[12px] font-bold text-core-blue">{`募集人数 : ${count}名`}</p>
                  </div>
                  <div className="self-center text-neutral-500">
                    <MdArrowForwardIos size={18} onClick={() => click_detail()} />
                  </div>
                </div>
              </div>
              <hr className="my-2" />
              <div>
                <p className="text-mini text-neutral-500 my-2">{description}</p>
              </div>
            </div>
          </>
        )
      )}
    </div>
  )
}
export default JobCard
