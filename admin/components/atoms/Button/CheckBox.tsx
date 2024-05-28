'use client'

import CheckBoxSquare from '@/components/parts/Button/CheckBoxSquare'
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
  value: string
}

const CheckBox: React.FC<CheckBoxProps> = ({
  disabled = false,
  name,
  text,
  backgroundColor,
  onChange,
  className,
  value,
}) => {
  const opacity = disabled ? 'opacity-40 ' : ' '

  return (
    <div
      className={twMerge(
        `${
          'flex flex-row items-center justify-center rounded py-[6px] sp:px-[12px] pc:px-[16px] ' +
          backgroundColor +
          opacity +
          (className ?? '')
        }`,
      )}
      onClick={() => !disabled && onChange(text)}
    >
      <CheckBoxSquare
        checked={value == text}
        disabled={disabled}
        text={text}
        onChange={onChange}
      />

      <label
        htmlFor={name}
        className={
          'ml-4 w-[120%] text-left text-gray-black sp:text-body_sp pc:text-body_pc'
        }
      >
        {text}
      </label>
    </div>
  )
}

export default CheckBox
