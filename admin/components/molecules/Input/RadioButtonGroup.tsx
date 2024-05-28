'use client'

import { useState, useEffect } from 'react'
import { useFormContext } from 'react-hook-form'

interface RadioButtonGroupProps {
  className?: string
  name: string
  options: { label: string; value: string }[]
  onOptionChange?: (option: string) => void
}

const RadioButtonGroup: React.FC<RadioButtonGroupProps> = ({
  className = '',
  name,
  options,
  onOptionChange,
}) => {
  const { register } = useFormContext()
  const [selectedOption, setSelectedOption] = useState(options[0].value)

  useEffect(() => {
    if (onOptionChange) {
      onOptionChange(selectedOption) // Trigger the callback with the default selected option
    }
  }, [onOptionChange, selectedOption]) // Run only once on initial render

  const handleOptionChange = (event: React.ChangeEvent<HTMLInputElement>) => {
    const selectedOption = event.target.value
    setSelectedOption(selectedOption)
    if (onOptionChange) {
      onOptionChange(selectedOption)
    }
  }

  return (
    <div className={`flex flex-wrap gap-5 pc:gap-10 ${className}`}>
      {options.map((option) => (
        <div key={option.value} className="flex items-center gap-2">
          <input
            type="radio"
            id={`${name}-${option.value}`}
            value={option.value}
            checked={selectedOption === option.value}
            {...register(name, { onChange: handleOptionChange })}
            className="h-5 w-5 appearance-none rounded-full border-[1px] border-gray-gray_dark bg-gray-white shadow-[0px_0px_0px_3px_#FDFDFD_inset] checked:bg-core-sky focus:ring-[1px] focus:ring-core-sky pc:h-6 pc:w-6 pc:shadow-[0px_0px_0px_4px_#FDFDFD_inset]"
          />
          <label
            htmlFor={`${name}-${option.value}`}
            className="text-body_sp pc:text-body_pc"
          >
            {option.label}
          </label>
        </div>
      ))}
    </div>
  )
}

export default RadioButtonGroup
