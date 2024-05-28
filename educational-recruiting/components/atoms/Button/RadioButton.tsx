import RadioButtonCircle from '@/components/parts/Button/RadioButtonCircle'
import React from 'react'

export interface RadioButtonProps {
  value: string
  disabled: boolean
  name: string
  text: string
  setValue: React.Dispatch<React.SetStateAction<string>>
}

const RadioButton: React.FC<RadioButtonProps> = ({ value, disabled, name, text, setValue }) => {
  const onClick = () => {
    !disabled && setValue(name)
  }

  const opacity = disabled ? 'opacity-40' : ''

  return (
    <div className={'flex items-center ' + ` ${opacity}`} onClick={onClick}>
      <RadioButtonCircle value={value} disabled={disabled} name={name} setValue={setValue} />
      <label htmlFor={name} className="ml-2 cursor-pointer pc:text-body_pc sp:text-body_sp text-[#3D3D3D] whitespace-nowrap">
        {text}
      </label>
    </div>
  )
}

export default RadioButton
