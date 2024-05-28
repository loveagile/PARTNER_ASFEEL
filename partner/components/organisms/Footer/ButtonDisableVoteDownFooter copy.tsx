import Button, {
  ButtonArrow,
  ButtonColor,
  ButtonIcon,
  ButtonShape,
  ButtonSize,
  ButtonType,
} from '@/components/atoms/Button/Button'
import React from 'react'
import { BiMeh } from 'react-icons/bi'

export const ButtonDisableVoteDownFooter = () => {
  return (
    <div
      style={{ background: 'rgba(255, 255, 255, 0.9)' }}
      className=" flex w-full flex-col items-center gap-5 border-t border-gray-gray py-5 "
    >
      <Button
        size={ButtonSize.SP}
        color={ButtonColor.CANCEL}
        type={ButtonType.DEFAULT}
        shape={ButtonShape.ELLIPSE}
        icon={ButtonIcon.FRONT}
        arrow={ButtonArrow.OFF}
        iconComponent={<BiMeh className="mr-[2px] h-[17px] w-[17px]" />}
        disabled={true}
        text="応募済み"
        onclick={() => {
          console.log('button clicked')
        }}
        className="px-[47px] py-[7px]"
      />
      <div className="flex flex-row items-start gap-1 text-mini text-gray-gray_dark">
        --- ご応募ありがとうございます ---
      </div>
    </div>
  )
}
