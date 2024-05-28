import { DatePicker, DatePickerProps } from 'antd'
import { PanelMode } from 'rc-picker/lib/interface'
import React from 'react'
import {
  AiFillCaretDown,
  AiOutlineArrowDown,
  AiOutlineArrowUp,
} from 'react-icons/ai'
import locale from 'antd/es/date-picker/locale/en_US'
import CalendarIcon from '@/public/images/icons/calendar.svg'

type CustomDatePickerProps = DatePickerProps & {
  popupClassName?: string
}

const CustomDatePicker = (props: CustomDatePickerProps) => {
  const [isDateMode, setIsDateMode] = React.useState(true)

  const handlePanelChange = (_: any, mode: PanelMode) => {
    if (mode === 'date') {
      setIsDateMode(true)
    } else {
      setIsDateMode(false)
    }
  }

  const handleRenderFooter = (mode: PanelMode) => {
    const extraFooter = props.renderExtraFooter?.(mode)

    const leftPosition = mode === 'month' ? 'left-[2.8rem]' : 'left-[4.5rem]'
    return (
      <>
        {mode !== 'decade' && (
          <AiFillCaretDown
            fontSize={16}
            className={`absolute top-[0.8rem] cursor-pointer p-1 ${leftPosition}`}
            onClick={() => {
              const pickerHeaderView = document.querySelector(
                '.custom_popup_date .ant-picker-header .ant-picker-header-view',
              )

              const pickerFirstNode = pickerHeaderView?.firstChild

              const clickEvent = new MouseEvent('click', {
                bubbles: true,
                cancelable: true,
                view: window,
              })

              pickerFirstNode?.dispatchEvent(clickEvent)
            }}
          />
        )}
        {extraFooter}
      </>
    )
  }

  return (
    <DatePicker
      nextIcon={<AiOutlineArrowDown color="#000" fontSize={16} />}
      prevIcon={<AiOutlineArrowUp color="#000" fontSize={16} />}
      superNextIcon={<AiOutlineArrowDown color="#000" fontSize={16} />}
      superPrevIcon={<AiOutlineArrowUp color="#000" fontSize={16} />}
      onPanelChange={handlePanelChange}
      changeOnBlur={true}
      allowClear={false}
      suffixIcon={<CalendarIcon width={20} className="cursor-pointer" />}
      format="YYYY/MM/DD"
      locale={{
        ...locale,
        lang: {
          ...locale.lang,
          shortWeekDays: ['S', 'M', 'T', 'W', 'T', 'F', 'S'],
        },
      }}
      {...props}
      className={`custom_date_picker ${props.className}`}
      popupClassName={`custom_popup_date ${
        isDateMode ? 'hidden_super_icon' : ''
      } ${props.popupClassName || ''}`}
      renderExtraFooter={handleRenderFooter}
    />
  )
}

export default CustomDatePicker
