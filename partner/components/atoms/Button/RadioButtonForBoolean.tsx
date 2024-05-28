import React from 'react'

export interface RadioButtonProps {
  value: boolean | null
  disabled: boolean
  name: string
  text: string
  setValue: (value: string) => void
}

const RadioButtonBoolean: React.FC<RadioButtonProps> = ({ value, disabled, name, text, setValue }) => {
  const onClick = () => {
    !disabled && setValue(name)
  }

  const opacity = disabled ? 'opacity-40' : ''

  return (
    <div className={'flex items-center ' + ` ${opacity}`} onClick={onClick}>
      <input
        autoCapitalize="none"
        type="radio"
        className={
          'cursor-pointer appearance-none rounded-full border-[1px] border-gray-gray_dark bg-gray-white checked:bg-core-sky focus:ring-[1px] focus:ring-core-sky sp:h-5 sp:w-5 sp:shadow-[0px_0px_0px_3px_#FDFDFD_inset] pc:h-6 pc:w-6 pc:shadow-[0px_0px_0px_4px_#FDFDFD_inset]'
        }
        disabled={disabled}
        checked={value === null ? undefined : value}
        title={name}
        onChange={() => setValue(name)}
      />
      <label htmlFor={name} className="ml-2 whitespace-nowrap text-[#3D3D3D] sp:text-body_sp pc:text-body_pc">
        {text}
      </label>
    </div>
  )
}

export default RadioButtonBoolean
