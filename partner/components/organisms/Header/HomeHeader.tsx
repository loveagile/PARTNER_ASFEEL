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
    <div className="flex h-[64px] w-full flex-row items-center justify-between bg-core-blue_dark p-[10px]">
      <HeaderLogo
        onClick={() => {
          router.push('/')
        }}
      />
      <div className="flex flex-row items-start gap-[10px]">
        <Button
          color={ButtonColor.DEFAULT}
          type={ButtonType.DEFAULT}
          shape={ButtonShape.ELLIPSE}
          disabled={false}
          icon={ButtonIcon.OFF}
          arrow={ButtonArrow.OFF}
          text="はじめる"
          onclick={async () => {
            router.push('/signup')
          }}
          className="sp:h-[26px] sp:w-[64px] pc:h-[35px] pc:w-[144px]"
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
          className="sp:h-[26px] sp:w-[64px] pc:h-[35px] pc:w-[144px]"
          textClassName="pc:text-[16px] sp:text-[10px]"
        />
      </div>
    </div>
  )
}
