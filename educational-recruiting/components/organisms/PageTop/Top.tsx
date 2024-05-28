import { CounterPageTop, CounterPageTopProps, Input, InputProps } from '@/components/atoms'
import CheckBox, { CheckBoxProps } from '@/components/atoms/Button/CheckBox'
import SelectBox, { SelectBoxProps } from '@/components/atoms/Input/SelectBox'
import React from 'react'

export interface TopProps {
  caption: string
  count: number
  typeOfItem: string
  searchProps: InputProps
  selectBoxProps: SelectBoxProps
  checkBoxProps?: CheckBoxProps
  counterPageTopProps: CounterPageTopProps
}

export const Top = ({ caption, count, typeOfItem, searchProps, checkBoxProps, counterPageTopProps, selectBoxProps }: TopProps) => {
  return (
    <>
      <div className="flex items-center gap-5">
        <div className="text-h1 text-gray-black">{caption}</div>
        <div className="flex gap-1">
          <div className="text-h2 text-core-blue">{count}</div>
          <div className="flex flex-col gap-[10px] pb-[3px]">
            <div></div>
            <div className="text-small text-core-blue">{typeOfItem}</div>
          </div>
        </div>
        <div className="w-[300px]">
          <Input {...searchProps} />
        </div>
        <SelectBox {...selectBoxProps} />
        {checkBoxProps && <CheckBox {...checkBoxProps} />}
      </div>
      <div className="flex justify-end mt-1">
        <CounterPageTop {...counterPageTopProps} />
      </div>
    </>
  )
}
