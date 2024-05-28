import SelectBox, { OptionProps, SelectBoxSize, SelectBoxType } from '@/components/atoms/Input/SelectBox'
import React, { useEffect, useState } from 'react'
import { Timestamp } from 'firebase/firestore'
import { objectToDate } from '@/utils/common'
import DatePickerComponent from '../Calendar'
import { OfficeHourType } from '@/types'
import { createEmptyRegisterEventProjectToken, decrypt, encrypt } from '@/utils/token'
import { EventProject } from '@/models'

interface DateFrameProps {
  data: OfficeHourType
  pos: number
  remove: (pos: number) => void
  changeType: boolean
}

var tmp_regsiter_data
var register_event_project_data: EventProject
if (typeof window !== 'undefined') {
  tmp_regsiter_data = localStorage.getItem('reg_event_project')
  if (!tmp_regsiter_data) {
    tmp_regsiter_data = createEmptyRegisterEventProjectToken()
  }

  register_event_project_data = JSON.parse(decrypt(tmp_regsiter_data))
}

const DateFrame = ({ data, pos, remove, changeType }: DateFrameProps) => {
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

  const clickDate = (date: Timestamp) => {
    tmp_regsiter_data = localStorage.getItem('reg_event_project')
    if (!tmp_regsiter_data) {
      tmp_regsiter_data = createEmptyRegisterEventProjectToken()
    }

    register_event_project_data = JSON.parse(decrypt(tmp_regsiter_data))
    register_event_project_data.officeHours[pos].date = date

    localStorage.setItem('reg_event_project', encrypt(JSON.stringify(register_event_project_data)))
    // change()
  }

  useEffect(() => {
    tmp_regsiter_data = localStorage.getItem('reg_event_project')
    if (!tmp_regsiter_data) {
      tmp_regsiter_data = createEmptyRegisterEventProjectToken()
    }

    register_event_project_data = JSON.parse(decrypt(tmp_regsiter_data))

    setStartHour(register_event_project_data.officeHours[pos].start.hour || '')
    setStartMinute(register_event_project_data.officeHours[pos].start.min || '')
    setEndHour(register_event_project_data.officeHours[pos].end.hour || '')
    setEndMinute(register_event_project_data.officeHours[pos].end.min || '')
    // change()
  }, [])

  useEffect(() => {
    tmp_regsiter_data = localStorage.getItem('reg_event_project')
    if (!tmp_regsiter_data) {
      tmp_regsiter_data = createEmptyRegisterEventProjectToken()
    }

    register_event_project_data = JSON.parse(decrypt(tmp_regsiter_data))

    if (changeType == true) {
      register_event_project_data.officeHours[pos].start.hour = startHour
      register_event_project_data.officeHours[pos].start.min = startMinute
      register_event_project_data.officeHours[pos].end.hour = endHour
      register_event_project_data.officeHours[pos].end.min = endMinute
    } else {
      register_event_project_data.officeHours.map((data, index) => {
        register_event_project_data.officeHours[index].start.hour = startHour
        register_event_project_data.officeHours[index].start.min = startMinute
        register_event_project_data.officeHours[index].end.hour = endHour
        register_event_project_data.officeHours[index].end.min = endMinute
      })
    }

    localStorage.setItem('reg_event_project', encrypt(JSON.stringify(register_event_project_data)))
    remove(pos)
  }, [startHour, startMinute, endHour, endMinute])

  useEffect(() => {
    if (changeType == false) {
      register_event_project_data.officeHours.map((data, index) => {
        register_event_project_data.officeHours[index].start.hour = register_event_project_data.officeHours[0].start.hour
        register_event_project_data.officeHours[index].start.min = register_event_project_data.officeHours[0].start.min
        register_event_project_data.officeHours[index].end.hour = register_event_project_data.officeHours[0].end.hour
        register_event_project_data.officeHours[index].end.min = register_event_project_data.officeHours[0].end.min
      })
      localStorage.setItem('reg_event_project', encrypt(JSON.stringify(register_event_project_data)))
      remove(pos)
    }
  }, [changeType])

  const removeDate = () => {
    tmp_regsiter_data = localStorage.getItem('reg_event_project')
    if (!tmp_regsiter_data) {
      tmp_regsiter_data = createEmptyRegisterEventProjectToken()
    }

    register_event_project_data = JSON.parse(decrypt(tmp_regsiter_data))

    register_event_project_data.officeHours.splice(pos, 1)

    localStorage.setItem('reg_event_project', encrypt(JSON.stringify(register_event_project_data)))

    remove(pos)
  }

  return (
    <div className="flex flex-row items-center pc:pl-5 sp:pl-2.5 pc:gap-5 sp:gap-0">
      <div className="pc:text-body_pc sp:text-body_sp">
        {/* {date} */}
        <DatePickerComponent onClick={(value) => clickDate(Timestamp.fromDate(value))} value={objectToDate(data.date as Timestamp)} />
      </div>
      <div className="flex items-center pc:px-5 sp:px-2.5 pc:gap-5 pc:flex-row sp:flex-col sp:gap-1">
        <div className="flex flex-row gap-[10px] items-center">
          <SelectBox
            value={data.start.hour.toString()}
            options={hours}
            setValue={setStartHour}
            size={SelectBoxSize.PC}
            status={changeType == false ? (pos == 0 ? SelectBoxType.DEFAULT : SelectBoxType.DISABLED) : SelectBoxType.DEFAULT}
            className=" pc:w-[80px] sp:w-[60px]"
          />
          <div className="pc:text-body_pc sp:text-body_sp">:</div>
          <SelectBox
            value={data.start.min.toString()}
            options={minutes}
            setValue={setStartMinute}
            size={SelectBoxSize.PC}
            status={changeType == false ? (pos == 0 ? SelectBoxType.DEFAULT : SelectBoxType.DISABLED) : SelectBoxType.DEFAULT}
            className=" pc:w-[80px] sp:w-[60px]"
          />
        </div>
        <div>～</div>
        <div className="flex flex-row gap-[10px] items-center">
          <SelectBox
            value={data.end.hour.toString()}
            options={hours}
            setValue={setEndHour}
            size={SelectBoxSize.PC}
            status={changeType == false ? (pos == 0 ? SelectBoxType.DEFAULT : SelectBoxType.DISABLED) : SelectBoxType.DEFAULT}
            className=" pc:w-[80px] sp:w-[60px]"
          />
          <div className="pc:text-body_pc sp:text-body_sp">:</div>
          <SelectBox
            value={data.end.min.toString()}
            options={minutes}
            setValue={setEndMinute}
            size={SelectBoxSize.PC}
            status={changeType == false ? (pos == 0 ? SelectBoxType.DEFAULT : SelectBoxType.DISABLED) : SelectBoxType.DEFAULT}
            className=" pc:w-[80px] sp:w-[60px]"
          />
        </div>
        <div className="text-core-red text-timestamp whitespace-nowrap cursor-pointer" onClick={() => removeDate()}>
          削除
        </div>
      </div>
    </div>
  )
}

export default DateFrame
