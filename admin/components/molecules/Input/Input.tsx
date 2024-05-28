'use client'

import React, { useState } from 'react'
import { Controller, Control, useFormContext } from 'react-hook-form'
import { AiFillEyeInvisible, AiFillEye } from 'react-icons/ai'
import { MdSearch } from 'react-icons/md'

interface InputProps {
  className?: string
  name: string
  control: Control<any>
  type?: string
  placeholder?: string
  maxLength?: number
  attention?: any
  disabled?: boolean
  readOnly?: boolean
  onClick?: () => void
  onChange?: () => void
}

const Input: React.FC<InputProps> = ({
  className = '',
  name,
  control,
  type = 'text',
  placeholder,
  maxLength,
  attention,
  disabled = false,
  readOnly = false,
  onClick,
  onChange,
}) => {
  const {
    formState: { errors },
  } = useFormContext()
  const [showPassword, setShowPassword] = useState(false)
  const [inputValue, setInputValue] = useState('')

  const togglePasswordVisibility = () => {
    setShowPassword((prevShowPassword) => !prevShowPassword)
  }

  const inputClassNames = [
    'w-full',
    'text-gray-black',
    'outline-none',
    'rounded',
    'pc:px-4 px-3',
    'pc:py-[6.5px] py-[7px]',
    '',
    'leading-none',
    'pc:h-9 h-[34px]',
    `${readOnly ? 'bg-gray-gray_light' : 'bg-gray-white'}`,
    `${errors[name] ? 'border-core-red bg-light-red_light' : 'border'}`,
    `${type === 'searchbtn' && 'pc:pl-12 pl-[38px]'}`,
    `${
      type === 'searchbox'
        ? 'pc:pl-12 pl-[38px] rounded-[20px] border-gray-gray text-body_sp'
        : 'rounded-[4px] pc:text-body_pc text-body_sp'
    }`,
  ].join(' ')

  const handleClick = () => {
    if (onClick) {
      onClick()
    }
  }

  const handleChange = () => {
    if (onChange) {
      onChange()
    }
  }

  return (
    <div
      className={`relative inline-block ${className} ${
        disabled ? 'opacity-40' : ''
      }`}
    >
      <div className="relative" onClick={handleClick}>
        {(type === 'searchbtn' || type === 'searchbox') && (
          <MdSearch
            className={`${
              inputValue === '' ? 'text-gray-gray_dark' : 'text-gray-black'
            } absolute bottom-0 left-3 top-0 my-auto inline-block text-[20px] pc:left-4 pc:text-[24px]`}
          />
        )}
        <Controller
          name={name}
          control={control}
          render={({ field }) => (
            <input
              className={inputClassNames}
              type={type === 'password' && showPassword ? 'text' : type}
              id={name}
              name={name}
              value={
                type === 'number' ? Number(field.value).toString() : field.value
              }
              placeholder={placeholder}
              onChange={(event) => {
                field.onChange(event)
                setInputValue(event.target.value)
                handleChange()
              }}
              disabled={disabled}
              readOnly={readOnly}
            />
          )}
        />
        {type === 'password' && (
          <button
            type="button"
            className="absolute bottom-0 right-3 top-0 my-auto text-[20px] pc:right-[17px] pc:text-[24px]"
            onClick={togglePasswordVisibility}
          >
            {showPassword ? <AiFillEyeInvisible /> : <AiFillEye />}
          </button>
        )}
      </div>
      {maxLength && (
        <p
          className={`mt-[2px] block text-right text-timestamp ${
            errors[name] && 'text-core-red'
          }`}
        >
          {inputValue.length}/{maxLength}
        </p>
      )}
      {errors[name] ? (
        <p className="mt-[2px] block whitespace-nowrap text-timestamp text-core-red">
          {errors[name]?.message?.toString()}
        </p>
      ) : (
        attention && (
          <p className="mt-[2px] block whitespace-nowrap text-timestamp">
            {attention}
          </p>
        )
      )}
    </div>
  )
}

export default Input
