import SelectBox, { OptionProps, SelectBoxSize, SelectBoxType } from '@/components/atoms/Input/SelectBox'
import React, { useState } from 'react'

interface DateFrameProps {
  date: string
  //   setStartHour: React.Dispatch<React.SetStateAction<string>>;
}

const DateFrame = ({ date }: DateFrameProps) => {
  const hours: OptionProps[] = [...Array(24).keys()].map((i) => ({
    value: i <= 9 ? '0' + i.toString() : i.toString(),
    text: i <= 9 ? '0' + i.toString() : i.toString(),
    size: SelectBoxSize.PC,
  }))

  const minutes: OptionProps[] = [...Array(60).keys()].map((i) => ({
    value: i <= 9 ? '0' + i.toString() : i.toString(),
    text: i <= 9 ? '0' + i.toString() : i.toString(),
    size: SelectBoxSize.PC,
  }))

  const [startHour, setStartHour] = useState<string>('')
  const [startMinute, setStartMinute] = useState<string>('')

  const [endHour, setEndHour] = useState<string>('')
  const [endMinute, setEndMinute] = useState<string>('')

  return (
    <div className="flex flex-row items-center sp:gap-0 sp:pl-2.5 pc:gap-5 pc:pl-5">
      <div className="sp:text-body_sp pc:text-body_pc"> {date}</div>
      <div className="flex items-center sp:flex-col sp:gap-1 sp:px-2.5 pc:flex-row pc:gap-5 pc:px-5">
        <div className="flex flex-row items-center gap-[10px]">
          <SelectBox
            options={hours}
            setValue={setStartHour}
            size={SelectBoxSize.PC}
            status={SelectBoxType.DEFAULT}
            className=" sp:w-[60px] pc:w-[80px]"
          />
          <div className="sp:text-body_sp pc:text-body_pc">:</div>
          <SelectBox
            options={minutes}
            setValue={setStartMinute}
            size={SelectBoxSize.PC}
            status={SelectBoxType.DEFAULT}
            className=" sp:w-[60px] pc:w-[80px]"
          />
        </div>
        <div>～</div>
        <div className="flex flex-row items-center gap-[10px]">
          <SelectBox
            options={hours}
            setValue={setEndHour}
            size={SelectBoxSize.PC}
            status={SelectBoxType.DEFAULT}
            className=" sp:w-[60px] pc:w-[80px]"
          />
          <div className="sp:text-body_sp pc:text-body_pc">:</div>
          <SelectBox
            options={minutes}
            setValue={setEndMinute}
            size={SelectBoxSize.PC}
            status={SelectBoxType.DEFAULT}
            className=" sp:w-[60px] pc:w-[80px]"
          />
        </div>
        <div className="whitespace-nowrap text-timestamp text-core-red">削除</div>
      </div>
    </div>
  )
}

export default DateFrame
