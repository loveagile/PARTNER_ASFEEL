import { faCheck } from '@fortawesome/free-solid-svg-icons'
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome'
import React from 'react'

interface CheckBoxSquareProps {
  checked: boolean
  disabled: boolean
  text: string
  onChange: (value: string) => void
}

const CheckBoxSquare: React.FC<CheckBoxSquareProps> = ({
  checked,
  disabled,
  text,
  onChange,
}) => {
  const border = checked ? '' : 'border-[1px]'

  return (
    <div className="relative flex h-5 w-5 justify-center ">
      <input
        type="checkbox"
        className={
          'absolute appearance-none rounded-sm  border-gray-gray_dark bg-gray-white checked:bg-core-sky disabled:opacity-60 sp:h-[18px] sp:w-[18px] pc:h-[20px] pc:w-[20px] ' +
          `${border}`
        }
        disabled={disabled}
        checked={checked}
        title={text}
        onChange={() => onChange(text)}
      />
      {checked ? (
        <FontAwesomeIcon
          icon={faCheck}
          className={'absolute mt-[2px] text-gray-gray_lighter sp:scale-75'}
        />
      ) : null}
    </div>
  )
}

export default CheckBoxSquare
