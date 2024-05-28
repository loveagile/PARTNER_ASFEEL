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

const CheckBox: React.FC<CheckBoxProps> = ({ disabled = false, name, text, backgroundColor, onChange, className, labelClassName, value }) => {
  const opacity = disabled ? 'opacity-40 hover:cursor-pointer' : ' hover:cursor-pointer '

  return (
    <div
      className={twMerge(
        `${
          'hover:cursor-pointer flex flex-row py-[6px] justify-center rounded items-center pc:px-[16px] sp:px-[12px] ' +
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
            'ml-2 text-[#3D3D3D] pc:text-body_pc sp:text-body_sp w-[120%] text-center ' +
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
