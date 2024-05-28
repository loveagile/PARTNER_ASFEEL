import CheckBoxSquare from '@/components/parts/Button/CheckBoxSquare'
import React from 'react'
import { twMerge } from 'tailwind-merge'

export enum CheckBoxColor {
  GrayLight = 'bg-gray-gray_light ',
  GrayLighter = 'bg-gray-gray_lighter ',
}

export interface CheckBoxProps {
  checked?: boolean
  disabled?: boolean
  name: string
  text: string
  backgroundColor: CheckBoxColor
  onChange: (value: string) => void
  className?: string
  labelClassName?: string
  value: string
}

const CheckBox: React.FC<CheckBoxProps> = ({
  disabled = false,
  name,
  text,
  backgroundColor,
  onChange,
  className,
  labelClassName,
  value,
}) => {
  const opacity = disabled ? 'opacity-40 hover:cursor-pointer' : ' hover:cursor-pointer '

  return (
    <div
      className={twMerge(
        `${
          'flex flex-row items-center justify-center rounded py-[6px] hover:cursor-pointer sp:px-[12px] pc:px-[16px] ' +
          backgroundColor +
          opacity +
          (className ?? '')
        }`,
      )}
      onClick={() => !disabled && onChange(text)}
    >
      <CheckBoxSquare
        checked={value == name}
        disabled={disabled}
        text={text}
        // onChange={onChange}
      />

      <label
        htmlFor={name}
        className={twMerge(
          `${
            'ml-2 w-[120%] text-center text-[#3D3D3D] sp:text-body_sp pc:text-body_pc ' +
            (!disabled ? 'hover:cursor-pointer' : 'hover:cursor-pointer') +
            (labelClassName ?? '')
          }`,
        )}
      >
        {text}
      </label>
    </div>
  )
}

export default CheckBox
