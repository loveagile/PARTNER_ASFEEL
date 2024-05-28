import { format } from 'date-fns'
import { ja } from 'date-fns/locale'
import React, { forwardRef, useState, useEffect } from 'react'
import DatePicker from 'react-datepicker'
import 'react-datepicker/dist/react-datepicker.css'
import { BsCalendar2 } from 'react-icons/bs'
import { GoTriangleDown } from 'react-icons/go'

interface ExampleCustomInputProps {
  value: string
  isClicked: boolean
  onClick: () => void
}

const date = new Date(Date.now())

const ExampleCustomInput = forwardRef<HTMLButtonElement, ExampleCustomInputProps>(({ value, isClicked, onClick }, ref) => (
  <>
    {
      <div
        className="w-[100%] h-[34px] py-[7px] pl-[14px] pr-[10px] flex justify-between gap-[4px] text-gray-gray_dark border border-gray-gray_dark rounded cursor-pointer"
        onClick={onClick}
      >
        <div className="flex gap-[2px] self-center items-center">
          <BsCalendar2 className="font-bold w-[16px] h-[16px]" />
          {/* <p className='text-[14px]'>{value !== date.toLocaleDateString('en-US', { month: '2-digit', day: '2-digit', year: 'numeric' }) ? value : (isClicked ? value : "日付を入力")}</p> */}
          {/* <p className='text-[14px]'>{value ? value : (isClicked ? value : "日付を入力")}</p> */}
          {/* <p className='text-[14px] text-gray-black'>{isToday(new Date(value)) ? (isClicked ? format(new Date(value), 'yyyy/MM/dd (E)', { locale: ja }) : "日付を入力") : format(new Date(value), 'yyyy/MM/dd (E)', { locale: ja })}</p> */}
          <p className="text-[14px] text-gray-black">{format(new Date(value), 'yyyy/MM/dd (E)', { locale: ja })}</p>
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

const DatePickerComponent: React.FC<DatePickerComponentProps> = ({ onClick, value }) => {
  const [startDate, setStartDate] = useState(value ? value : new Date())
  const [isClicked, setIsClicked] = useState(false)

  useEffect(() => {
    setStartDate(value)
  }, [value])

  return (
    <DatePicker
      selected={startDate}
      onChange={(date: Date) => {
        setStartDate(date)
        onClick(date)
        setIsClicked(true)
      }}
      customInput={<ExampleCustomInput value={value.toDateString()} isClicked={isClicked} onClick={() => onClick} />}
      showMonthDropdown
      showYearDropdown
      dropdownMode="select"
      locale={ja}
    />
  )
}

DatePickerComponent.displayName = 'DatePickerComponent'

export default DatePickerComponent
