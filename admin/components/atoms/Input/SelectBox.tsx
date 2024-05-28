'use client'

import { useEffect, useRef, useState } from 'react'
import { useFormContext, Controller, Control } from 'react-hook-form'
import { MdArrowDropDown } from 'react-icons/md'

export type SelectBoxProps = {
  className?: string
  control?: Control<any>
  placeholder?: string
  isSet?: boolean
  name: string
  options: { value: string; label: string }[]
  attention?: any
  hasPlaceHolder?: boolean
  defaultValue?: string
  onOptionChange?: (option: string) => void
}

const SelectBox: React.FC<SelectBoxProps> = ({
  className = '',
  control,
  name,
  placeholder = '選択してください',
  isSet = true,
  options,
  attention,
  hasPlaceHolder = true,
  defaultValue = '',
  onOptionChange,
}) => {
  const {
    setValue,
    formState: { errors },
  } = useFormContext()
  const selectRef = useRef<HTMLSelectElement>(null)
  const [selectedOption, setSelectedOption] = useState('')

  useEffect(() => {
    setValue(name, '') // Initialize the value with an empty string
  }, [name, setValue])

  useEffect(() => {
    if (onOptionChange) {
      onOptionChange(selectedOption) // Trigger the callback with the default selected option
    }
  }, [selectedOption, onOptionChange]) // Run only once on initial render

  const handleOptionChange = (event: React.ChangeEvent<HTMLInputElement>) => {
    const selectedOption = event.target.value
    setSelectedOption(selectedOption)
    if (onOptionChange) {
      onOptionChange(selectedOption)
    }
  }

  useEffect(() => {
    if (selectRef.current) {
      selectRef.current.style.color = selectRef.current.value
        ? 'inherit'
        : 'inherit'
    }
  }, [selectRef])

  return (
    <div className={`${className}`}>
      <Controller
        control={control}
        name={name}
        render={({ field }) => (
          <div className="relative">
            <select
              disabled={!isSet}
              defaultValue={defaultValue}
              id={name}
              className={`w-full appearance-none rounded border border-gray-gray_dark bg-gray-white py-[7px] pl-3 pr-[26px] text-body_sp placeholder-gray-gray_dark outline-none pc:py-[5px] pc:pl-4 pc:pr-[30px] pc:text-body_pc ${
                errors[name] ? 'border-core-red bg-light-red_light' : 'border'
              }`}
              ref={selectRef}
              onChange={(e: any) => {
                field.onChange(e)
                if (selectRef.current) {
                  selectRef.current.style.color = e.target.value
                    ? 'inherit'
                    : 'inherit'
                }
                handleOptionChange(e)
              }}
            >
              {hasPlaceHolder && <option value="">{placeholder}</option>}
              {options.map((option) => (
                <option key={option.value} value={option.value}>
                  {option.label}
                </option>
              ))}
            </select>
            <MdArrowDropDown className="pointer-events-none absolute inset-y-0 right-1 my-auto text-[20px] pc:text-[24px]" />
          </div>
        )}
      />
      {attention && (
        <p className="mt-[2px] block text-timestamp">{attention}</p>
      )}
    </div>
  )
}

export default SelectBox
