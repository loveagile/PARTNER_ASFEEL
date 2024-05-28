import React from 'react'

interface RadioButtonCircleProps {
  value: string
  disabled: boolean
  name: string
  setValue: React.Dispatch<React.SetStateAction<string>>
}

const RadioButtonCircle: React.FC<RadioButtonCircleProps> = ({ value, disabled, name, setValue }) => {
  return (
    <input
      type="radio"
      className={
        'appearance-none cursor-pointer bg-gray-white border-gray-gray_dark border-[1px] focus:ring-core-sky focus:ring-[1px] rounded-full checked:bg-core-sky pc:w-6 pc:h-6 sp:w-5 sp:h-5 pc:shadow-[0px_0px_0px_4px_#FDFDFD_inset] sp:shadow-[0px_0px_0px_3px_#FDFDFD_inset]'
      }
      disabled={disabled}
      checked={value === name}
      id={name}
      onChange={() => setValue(name)}
    />
  )
}

export default RadioButtonCircle
