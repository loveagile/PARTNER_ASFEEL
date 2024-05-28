import { useView } from '@/hooks'
import { CgUserList } from 'react-icons/cg'
import { MdArrowForwardIos } from 'react-icons/md'
import { FaUserCircle } from 'react-icons/fa'
import { useRouter } from 'next/router'

const CompleteProfileBar = () => {
  const view = useView()
  const router = useRouter()

  return (
    <div
      className="cursor-pointer"
      onClick={() => {
        router.push('/profile')
      }}
    >
      {view == 'PC' ? (
        <div className="w-full h-[48px] bg-[#f46042] items-center justify-center text-white flex gap-4">
          <div className="flex gap-4">
            <CgUserList className="font-bold w-[28px] h-[22px]" />
            <p className="text-[14px] pt-[2px] font-bold">プロフィールを完成させよう！</p>
          </div>
          <div className="flex gap-4">
            <p className="text-[11px] pt-[2px]">未入力の項目を埋めてスカウトを増やしましょう。</p>
            <MdArrowForwardIos size={18} />
          </div>
        </div>
      ) : (
        view == 'SP' && (
          <div className="w-full h-[42px] bg-[#f46042] flex relative text-white">
            <div className="self-center mx-auto">
              <div className="flex gap-4 justify-center">
                <FaUserCircle className="font-bold w-[12px] h-[12px]" />
                <p className="text-[10px] font-bold">プロフィールを完成させよう！</p>
              </div>
              <div className="flex justify-center">
                <p className="text-[10px]">未入力の項目を埋めてスカウトを増やしましょう。</p>
              </div>
            </div>
            <div className="">
              <MdArrowForwardIos size={18} className="absolute right-[12px] top-[12px] my-auto" />
            </div>
          </div>
        )
      )}
    </div>
  )
}
export default CompleteProfileBar
