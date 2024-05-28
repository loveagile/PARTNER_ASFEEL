import { ButtonColor } from '@/components/atoms'
import { ButtonShape } from '@/components/atoms'
import { ButtonIcon } from '@/components/atoms'
import { ButtonType } from '@/components/atoms'
import { ButtonArrow } from '@/components/atoms'
import Button from '@/components/atoms/Button/Button'
import React from 'react'
import { useRouter } from 'next/router'
import HeaderLogo from '@/components/atoms/HeaderLogo'

export const HomeHeader = () => {
  const router = useRouter()

  return (
    <div className="flex flex-row w-full h-[64px] justify-between items-center p-[10px] bg-core-blue_dark">
      <HeaderLogo
        onClick={() => {
          router.push('/')
        }}
      />
      <div className="flex flex-row gap-[10px] items-start">
        <Button
          color={ButtonColor.DEFAULT}
          type={ButtonType.DEFAULT}
          shape={ButtonShape.ELLIPSE}
          disabled={false}
          icon={ButtonIcon.OFF}
          arrow={ButtonArrow.OFF}
          text="はじめる"
          onclick={() => {
            router.push('/signup')
          }}
          className="pc:w-[144px] sp:w-[64px] pc:h-[35px] sp:h-[26px]"
          textClassName="pc:text-[16px] sp:text-[10px]"
        />
        <Button
          color={ButtonColor.SUB}
          type={ButtonType.SECONDARY}
          shape={ButtonShape.ELLIPSE}
          disabled={false}
          icon={ButtonIcon.OFF}
          arrow={ButtonArrow.OFF}
          text="ログイン"
          onclick={() => {
            router.push('/login')
          }}
          className="pc:w-[144px] sp:w-[64px] pc:h-[35px] sp:h-[26px]"
          textClassName="pc:text-[16px] sp:text-[10px]"
        />
      </div>
    </div>
  )
}
