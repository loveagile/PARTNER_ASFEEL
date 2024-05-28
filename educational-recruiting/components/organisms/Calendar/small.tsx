import { format, isToday } from 'date-fns'
import { ja } from 'date-fns/locale'
import React, { forwardRef, useState } from 'react'
import DatePicker from 'react-datepicker'
import 'react-datepicker/dist/react-datepicker.css'
import { BsCalendar2 } from 'react-icons/bs'
import { GoTriangleDown } from 'react-icons/go'

interface ExampleCustomInputProps {
  value: string
  isClicked: boolean
  onClick: () => void
}

const ExampleCustomInput = forwardRef<HTMLButtonElement, ExampleCustomInputProps>(({ value, isClicked, onClick }, ref) => (
  <>
    {
      <div
        className="w-[100%] h-[30px] py-[6.5px] pl-[6px] pr-[2px] flex justify-between gap-[4px] text-gray-gray_dark border border-gray-gray_dark rounded cursor-pointer"
        onClick={onClick}
      >
        <div className="flex gap-[2px] self-center place-items-center">
          <BsCalendar2 className="font-bold w-[12px] h-[12px]" />
          <p className="text-[12px] text-gray-black">
            {isToday(new Date(value)) ? (isClicked ? format(new Date(value), 'yyyy/MM/dd') : '日付を入力') : format(new Date(value), 'yyyy/MM/dd')}
          </p>
          {/* <p className='text-[12px] text-gray-black'>{value ? format(new Date(value), 'yyyy/MM/dd') : "日付を入力"}</p> */}
        </div>
        <div className="self-center">
          <GoTriangleDown className="text-gray-black w-[16px] h-[9px]" />
        </div>
      </div>
    }
  </>
  // <button className="example-custom-input" onClick={onClick} ref={ref}>
  //   {value}
  // </button>
))

ExampleCustomInput.displayName = 'ExampleCustomInput'

export interface DatePickerComponentProps {
  onClick: (date: Date) => void
  value: Date
}

const DatePickerMiniComponent: React.FC<DatePickerComponentProps> = ({ onClick, value }) => {
  const [startDate, setStartDate] = useState(value ? value : new Date())
  const [isClicked, setIsClicked] = useState(false)

  return (
    <DatePicker
      selected={startDate}
      onChange={(date: Date) => {
        setStartDate(date)
        onClick(date)
        setIsClicked(true)
      }}
      customInput={<ExampleCustomInput value={value && value.toDateString()} isClicked={isClicked} onClick={() => onClick} />}
      showMonthDropdown
      showYearDropdown
      dropdownMode="select"
      locale={ja}
    />
  )
}

DatePickerMiniComponent.displayName = 'DatePickerMiniComponent'

export default DatePickerMiniComponent
