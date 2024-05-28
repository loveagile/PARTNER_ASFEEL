import { TimePicker, TimePickerProps } from 'antd'
import CalendarIcon from '@/public/images/icons/calendar.svg'
import dayjs from 'dayjs'
import { CellRenderInfo } from 'rc-picker/lib/interface'

const CustomTimePicker = (props: TimePickerProps) => {
  const handleCellRender = (_: any, origin: CellRenderInfo<dayjs.Dayjs>) => {
    const { children } = origin.originNode.props
    if (children === 'AM' || children === 'PM') {
      return (
        <div className="ant-picker-time-panel-cell-inner font-bold">
          {children}
        </div>
      )
    }

    return origin.originNode
  }

  return (
    <TimePicker
      showNow={false}
      changeOnBlur
      allowClear={false}
      suffixIcon={<CalendarIcon width={20} className="cursor-pointer" />}
      use12Hours={true}
      format="HH:mm"
      cellRender={handleCellRender}
      {...props}
      className={`custom_time_picker ${props.className}`}
      popupClassName={`custom_popup_time ${props.popupClassName}`}
    />
  )
}

export default CustomTimePicker
