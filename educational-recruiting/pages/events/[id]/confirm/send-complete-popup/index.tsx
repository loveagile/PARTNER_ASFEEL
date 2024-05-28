import Button, { ButtonColor, ButtonShape } from '@/components/atoms/Button/Button'
import Router from 'next/router'
import React from 'react'
import { BsCheckCircle } from 'react-icons/bs'
import { IoClose } from 'react-icons/io5'

function index() {
  return (
    <div className="fixed left-1/2 top-1/2 h-screen w-full -translate-x-1/2 -translate-y-1/2 transform bg-gray-black_clear">
      <div
        className="h-screen w-full bg-gray-black_clear"
        onClick={() => {
          Router.push('/')
        }}
      ></div>

      <div className="absolute left-1/2 top-1/2 w-full -translate-x-1/2 -translate-y-1/2 transform">
        <div className="w-full flex justify-center">
          <div className="flex flex-col items-center gap-5 pc:p-10 rounded-[10px] isolate bg-gray-white sp:w-[280px] pc:w-[480px] relative sp:py-[30px] sp:px-5">
            <div className="text-h1">送信完了</div>
            <BsCheckCircle className="w-[66px] h-[66px] text-core-blue" />
            <div className="flex flex-col items-center gap-1 text-center pc:text-body_pc sp:text-timestamp">
              <div>募集依頼を送信しました</div>
              <div>掲載が完了しましたらメールでご連絡いたします</div>
            </div>
            <div className="flex flex-col items-center gap-5 text-center pc:text-body_pc sp:text-timestamp">
              <div>説明会がまだの方はご参加ください</div>
              <Button
                color={ButtonColor.SUB}
                text={'説明会予約へ進む'}
                onclick={() => {
                  Router.push('https://timerex.net/s/bukatsu-app/f165742d')
                }}
                className="px-[56px] py-[16.5px]"
                shape={ButtonShape.ELLIPSE}
              />
            </div>
            <IoClose className="absolute w-[24px] h-[24px] top-[26.41px] right-[25.41px] hover:cursor-pointer" onClick={() => Router.push('/')} />
          </div>
        </div>
      </div>
    </div>
  )
}

export default index
