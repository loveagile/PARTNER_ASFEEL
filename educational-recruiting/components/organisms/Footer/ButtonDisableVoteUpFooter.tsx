import Button, { ButtonArrow, ButtonColor, ButtonIcon, ButtonShape, ButtonSize, ButtonType } from '@/components/atoms/Button/Button'
import React from 'react'
import { MdThumbUp } from 'react-icons/md'

export const ButtonDisableVoteUpFooter = () => {
  return (
    <div style={{ background: 'rgba(255, 255, 255, 0.9)' }} className=" w-full flex flex-col gap-5 py-5 items-center border-t border-gray-gray ">
      <Button
        size={ButtonSize.SP}
        color={ButtonColor.CANCEL}
        type={ButtonType.DEFAULT}
        shape={ButtonShape.ELLIPSE}
        icon={ButtonIcon.FRONT}
        arrow={ButtonArrow.OFF}
        iconComponent={<MdThumbUp className="w-[17px] h-[17px] mr-[2px]" />}
        disabled={true}
        text="応募済み"
        onclick={() => {
          console.log('button clicked')
        }}
        className="px-[47px] py-[7px]"
      />
      <div className="flex flex-row items-start gap-1 text-mini text-gray-gray_dark">--- ご応募ありがとうございます ---</div>
    </div>
  )
}
