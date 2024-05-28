'use client'

import { useFormContext } from 'react-hook-form'
import { MdCheckBox, MdCheckBoxOutlineBlank } from 'react-icons/md'
import style from './CheckBoxGroup.module.css'

interface CheckBoxGroupProps {
  className?: string
  name: string
  options: {
    label: string
    value: string
    labelStyle?: string
  }[]
  isSmall?: boolean
  noPadding?: boolean
  onChange?: () => void
}

const CheckBoxGroup: React.FC<CheckBoxGroupProps> = ({
  className = '',
  name,
  options,
  isSmall = false,
  noPadding = false,
  onChange,
}) => {
  const { register } = useFormContext()

  const handleChange = () => {
    if (onChange) {
      onChange()
    }
  }

  const labelStyle = [
    `${style.checkbox}`,
    'inline-flex flex-row-reverse items-center rounded',
    `${
      noPadding
        ? 'pc:text-small text-mini py-[5px]'
        : isSmall
        ? 'pc:text-timestamp text-mini pc:px-3 px-2 py-2'
        : 'pc:text-body_pc text-body_sp pc:px-4 px-3 py-2'
    }`,
    `${className}`,
  ].join(' ')

  return (
    <div
      className={`flex flex-wrap ${isSmall ? '' : 'gap-4 pc:gap-5'} ${
        noPadding && 'gap-[10px]'
      }`}
    >
      {options.map((option) => (
        <label key={option.value} className={labelStyle}>
          <span
            className={`block ${
              isSmall ? 'px-1' : 'px-2'
            } flex-grow text-center`}
          >
            {option.label}
          </span>
          <input
            className="absolute h-0 w-0 opacity-0"
            type="checkbox"
            value={option.value}
            {...register(name, { onChange: handleChange })}
          />
          <MdCheckBox
            className={`${style.icon_check} pc:text-[24px]} text-[22px] text-core-sky`}
          />
          <MdCheckBoxOutlineBlank
            className={`${style.icon_nocheck} pc:text-[24px]} text-[22px] text-gray-gray_dark`}
          />
        </label>
      ))}
    </div>
  )
}

export default CheckBoxGroup
