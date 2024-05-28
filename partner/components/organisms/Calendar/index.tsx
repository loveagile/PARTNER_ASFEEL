import { ja } from 'date-fns/locale'
import React, { forwardRef, useEffect, useState } from 'react'
import DatePicker from 'react-datepicker'
import 'react-datepicker/dist/react-datepicker.css'
import { BsCalendar2 } from 'react-icons/bs'
import { GoTriangleDown } from 'react-icons/go'

interface ExampleCustomInputProps {
  value: string
  isClicked: boolean
  onClick: () => void
}

const ExampleCustomInput = forwardRef<HTMLButtonElement, ExampleCustomInputProps>(
  ({ value, isClicked, onClick }, ref) => (
    <>
      {
        <div
          className="flex h-[34px] w-[100%] cursor-pointer justify-between gap-[4px] rounded border border-gray-gray_dark py-[7px] pl-[14px] pr-[10px]"
          onClick={onClick}
        >
          <div className="flex gap-[2px] self-center">
            <BsCalendar2 className="h-[16px] w-[16px] font-bold" />
            <p className="text-[14px]">{value ? value : isClicked ? value : '日付を入力'}</p>
          </div>
          <div className="self-center">
            <GoTriangleDown className="h-[9px] w-[16px] text-gray-black" />
          </div>
        </div>
      }
    </>
  ),
)

ExampleCustomInput.displayName = 'ExampleCustomInput'

export interface DatePickerComponentProps {
  onClick: (date: Date) => void
  value: Date | null
}

const DatePickerComponent: React.FC<DatePickerComponentProps> = ({ onClick, value }) => {
  const [startDate, setStartDate] = useState(value ? value : new Date())
  const [isClicked, setIsClicked] = useState(false)

  useEffect(() => {
    setStartDate(value ? value : new Date())
  }, [value])

  return (
    <DatePicker
      selected={startDate}
      onChange={(date: Date) => {
        setStartDate(date)
        onClick(date)
        setIsClicked(true)
      }}
      customInput={
        <ExampleCustomInput value={value ? value.toDateString() : ''} isClicked={isClicked} onClick={() => onClick} />
      }
      showMonthYearPicker
      dateFormat="yyyy/MM"
      dropdownMode="select"
      locale={ja}
    />
  )
}

DatePickerComponent.displayName = 'DatePickerComponent'

export default DatePickerComponent
