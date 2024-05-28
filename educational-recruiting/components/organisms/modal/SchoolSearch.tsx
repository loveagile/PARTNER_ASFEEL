import { Input, InputStatus } from '@/components/atoms'
import Button from '@/components/atoms/Button/Button'
import CheckBox, { CheckBoxColor } from '@/components/atoms/Button/CheckBox'
import React, { useEffect, useState } from 'react'
import { useForm } from 'react-hook-form'
import { useAppSelector } from '@/store'

export interface SchoolSearchType {
  closeModal: (value: string[]) => void
  isModalOpen?: boolean
  value: string[]
}

enum SelectBoxType {
  DEFAULT,
  DISABLED,
  ERROR,
}

interface OptionProps {
  value: string
  placeholder?: boolean
  text: string
  selected?: boolean
}

interface SelectBoxProps {
  options: OptionProps[]
  setItemsValue: React.Dispatch<React.SetStateAction<string[]>>
  className?: string
  itemsValue: string[]
}

const getBackgroundColorStyle = (status: SelectBoxType) => {
  let backgroundColorStyle = ''
  switch (status) {
    case SelectBoxType.DEFAULT:
      backgroundColorStyle = 'bg-gray-white border-gray-gray_dark'
      break
    case SelectBoxType.DISABLED:
      backgroundColorStyle = 'bg-gray-white opacity-40 border-gray-gray_dark'
      break
    case SelectBoxType.ERROR:
      backgroundColorStyle = 'bg-light-red_light border-core-red'
      break
  }
  return backgroundColorStyle
}

const ArrowIcon = () => {
  return (
    <svg viewBox="0 0 10 6" fill="none" xmlns="http://www.w3.org/2000/svg" className="pc:w-[10px] pc:h-[6px] sp:w-[8px] sp:h-[4px]">
      <path d="M0 0.5L5 5.5L10 0.5H0Z" fill="#3D3D3D" />
    </svg>
  )
}

const SchoolDivisionSelectBox = ({ options, setItemsValue, itemsValue, className = ' w-[200px]' }: SelectBoxProps) => {
  const { control, watch } = useForm()
  const searchValue = watch('searchValue')

  const [optionsInSelect, setOptionsInSelect] = useState<OptionProps[]>(options)

  const [valueIsChanged, setValueIsChanged] = useState(false)

  useEffect(() => {
    console.log('********************************')
    console.log('searchValue', searchValue)
    console.log('optionsInSelect', optionsInSelect)
    console.log('itemsValue in searchvalue', itemsValue)
    searchValue
      ? setOptionsInSelect(
          options.filter((option, index) => {
            return option.text.includes(searchValue)
          }),
        )
      : setOptionsInSelect(options)
  }, [searchValue])

  useEffect(() => {
    console.log('itemsValue', itemsValue)
    valueIsChanged && setValueIsChanged(false)
  }, [valueIsChanged])

  return (
    <div className={'relative '}>
      <Input
        status={InputStatus.SEARCH}
        placeholder="検索"
        control={control}
        name="searchValue"
        className="border-y-[1px] border-gray-gray_dark bg-gray-gray_lighter w-full rounded-none border-x-0"
      />
      <ul
        className={
          `bg-white overflow-y-auto  z-10 border-b-[1px] border-gray-gray_dark block 
            max-h-[360px] ` + className
        }
      >
        {optionsInSelect.map((option, index) => (
          <li
            key={option?.value}
            className={`flex flex-row px-4 relative w-full hover:cursor-pointer`}
            onClick={() => {
              itemsValue.includes(option?.text)
                ? (itemsValue.splice(itemsValue.indexOf(option?.text), 1),
                  setItemsValue(itemsValue),
                  console.log('item removed'),
                  setValueIsChanged(true))
                : (itemsValue.push(option?.text), setItemsValue(itemsValue), console.log('item pushed'), setValueIsChanged(true))
            }}
          >
            <CheckBox
              name={option?.text}
              text={option?.text}
              backgroundColor={CheckBoxColor.GrayLight}
              className="bg-transparent h-9"
              onChange={() => {}}
              value={itemsValue.includes(option?.text) ? option?.text : ''}
            />
            <div className="border-b-[1px] border-gray-gray h-[1px] w-[90%] absolute bottom-0"></div>
          </li>
        ))}
      </ul>
    </div>
  )
}

const SchoolSearch = ({ closeModal, isModalOpen, value }: SchoolSearchType) => {
  const { organizationUniversityOptionList } = useAppSelector((state) => state.global)
  const [schoolDivision, setSchoolDivision] = useState<string[]>(value && value.length > 0 ? value : [])

  useEffect(() => {
    console.log('schoolDivision', schoolDivision)
  }, [schoolDivision])

  const clickComplete = () => {
    console.log('complete')
    closeModal(schoolDivision)
  }

  return (
    <div id="modal-card" className="modal-card fixed inset-0 z-50 flex justify-center  flex-col items-center min-h-screen bg-gray-black_clear">
      <div className="flex flex-col items-center p-10 gap-[30px] bg-gray-white rounded-[10px] sp:w-[300px] pc:w-[480px] my-[100px]">
        <div className="relative w-full text-center text-h1">
          学校検索
          <div className="absolute right-0 h-full sp:top-[4px] pc:top-0">
            <Button
              onclick={clickComplete}
              text={'完 了'}
              className=" pc:py-[6.5px] pc:px-[22px] pc:text-body_pc sp:text-body_sp sp:px-[5px] sp:py-[3px]"
            />
          </div>
        </div>

        <div className="flex flex-col items-start w-full gap-4">
          <div className="text-h4">学校区分</div>
          {organizationUniversityOptionList && organizationUniversityOptionList.length > 0 && (
            <SchoolDivisionSelectBox
              setItemsValue={setSchoolDivision}
              itemsValue={schoolDivision}
              options={organizationUniversityOptionList}
              className=" pc:w-[400px] sp:w-[220px]"
            />
          )}
        </div>
      </div>
    </div>
  )
}
export default SchoolSearch
