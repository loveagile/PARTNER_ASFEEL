import { useView } from '@/hooks'
import { CgUserList } from 'react-icons/cg'
import { MdArrowForwardIos } from 'react-icons/md'
import { FaUserCircle } from 'react-icons/fa'
import Link from 'next/link'

const CompleteProfileBar = () => {
  const view = useView()

  return (
    <Link href="/profile">
      {view == 'PC' ? (
        <div className="flex h-[48px] w-full items-center justify-center gap-4 bg-[#f46042] text-white">
          <div className="flex gap-4">
            <CgUserList className="h-[22px] w-[28px] font-bold" />
            <p className="pt-[2px] text-[14px] font-bold">プロフィールを完成させよう！</p>
          </div>
          <div className="flex gap-4">
            <p className="pt-[2px] text-[11px]">未入力の項目を埋めてスカウトを増やしましょう。</p>
            <MdArrowForwardIos size={18} />
          </div>
        </div>
      ) : (
        view == 'SP' && (
          <div className="relative flex h-[42px] w-full bg-[#f46042] text-white">
            <div className="mx-auto self-center">
              <div className="flex justify-center gap-4">
                <FaUserCircle className="h-[12px] w-[12px] font-bold" />
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
    </Link>
  )
}
export default CompleteProfileBar
