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
      autoCapitalize="none"
      type="radio"
      className={
        'cursor-pointer appearance-none rounded-full border-[1px] border-gray-gray_dark bg-gray-white checked:bg-core-sky focus:ring-[1px] focus:ring-core-sky sp:h-5 sp:w-5 sp:shadow-[0px_0px_0px_3px_#FDFDFD_inset] pc:h-6 pc:w-6 pc:shadow-[0px_0px_0px_4px_#FDFDFD_inset]'
      }
      disabled={disabled}
      checked={value === name}
      title={name}
      onChange={() => setValue(name)}
    />
  )
}

export default RadioButtonCircle
