import React from 'react'

interface RadioButtonCircleProps {
  value: string
  name: string
  setValue: React.Dispatch<React.SetStateAction<string>>
}

const RadioButtonCircle: React.FC<RadioButtonCircleProps> = ({
  value,
  name,
  setValue,
}) => {
  return (
    <input
      type="radio"
      className={
        'h-5 w-5 appearance-none rounded-full border-[1px] border-gray-gray_dark bg-gray-white shadow-[0px_0px_0px_3px_#FDFDFD_inset] checked:bg-core-sky focus:ring-[1px] focus:ring-core-sky pc:h-6 pc:w-6 pc:shadow-[0px_0px_0px_4px_#FDFDFD_inset]'
      }
      checked={value === name}
      title={name}
      onChange={() => setValue(name)}
    />
  )
}

export default RadioButtonCircle
