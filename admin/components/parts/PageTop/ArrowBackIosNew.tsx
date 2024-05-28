import React from 'react'
import { MdArrowBackIosNew, MdArrowForwardIos } from 'react-icons/md'

export enum ArrowIconType {
  NEXT,
  PREV,
}

export interface ArrowIconProps {
  type: ArrowIconType
  onClick: () => void
  disabled: boolean
}

export const ArrowIcon = ({ type, onClick, disabled }: ArrowIconProps) => {
  return type == ArrowIconType.NEXT ? (
    <MdArrowForwardIos
      className={`${
        disabled ? 'opacity-40' : 'cursor-pointer'
      } text-[12px] text-gray-black pc:text-[18px]`}
      onClick={() => {
        !disabled && onClick()
      }}
    />
  ) : (
    <MdArrowBackIosNew
      className={`${
        disabled ? 'opacity-40' : 'cursor-pointer'
      } text-[12px] text-gray-black pc:text-[18px]`}
      onClick={() => {
        !disabled && onClick()
      }}
    />
  )
}
