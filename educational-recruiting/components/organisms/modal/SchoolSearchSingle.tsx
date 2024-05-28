import { Input, InputStatus } from '@/components/atoms'
import React, { useEffect, useState } from 'react'
import { useForm } from 'react-hook-form'
import SelectBox, { SelectBoxSize, SelectBoxType } from '@/components/atoms/Input/SelectBox'
import { useAppSelector } from '@/store'
import { getDocs } from '@/libs/firebase/firebase'
import { ColRef } from '@/libs/firebase/firestore'
import { query, where } from 'firebase/firestore'
import { getPrefectureFromHostname } from '@/utils/common'
import { GrClose } from 'react-icons/gr'

interface OptionProps {
  value: string
  placeholder?: boolean
  text: string
  selected?: boolean
}

export interface SchoolSearchType {
  closeModal: (schoolName?: string[], schoolType?: string) => void
  isModalOpen?: boolean
  value: string[]
}

function SchoolSearchSingle({ value, closeModal }: SchoolSearchType) {
  const { organizationTypeOptionList } = useAppSelector((state) => state.global)
  const [schoolType, setSchoolType] = useState<string>('')
  const [organizations, setOrganizations] = useState<OptionProps[]>([])
  const [schoolDivision, setSchoolDivision] = useState<string[]>(value && value.length > 0 ? value : [])

  useEffect(() => {
    const fetchOrganizations = async () => {
      const prefJa = getPrefectureFromHostname('ja')
      const snap = await getDocs(query(ColRef.organizations, where('organizationType', '==', schoolType), where('address.prefecture', '==', prefJa)))
      setOrganizations(
        snap.docs.map((doc) => {
          const data = doc.data()
          return {
            value: data.organizationId,
            text: data.name,
          }
        }),
      )
    }

    fetchOrganizations()
  }, [schoolType])

  return (
    <div id="modal-card" className="modal-card fixed inset-0 z-50 flex justify-center  flex-col items-center min-h-screen">
      <div className="w-full h-full bg-gray-black_clear" onClick={() => closeModal()}></div>
      <div className="absolute flex flex-col items-center p-10 gap-8 bg-gray-white rounded-[10px] min-w-[300px] w-11/12 max-w-[480px] my-[100px]">
        <button className="absolute top-6 right-6" onClick={() => closeModal()}>
          <GrClose size={18} />
        </button>

        <div className="relative w-full text-center text-h1">学校検索</div>
        <div className="flex flex-col items-start w-full gap-4">
          <div className="text-h4">学校区分</div>

          <div className="min-w-[222px] w-full max-w-[400px]">
            {organizationTypeOptionList && organizationTypeOptionList.length > 0 && (
              <SelectBox
                value={schoolType}
                setValue={(value) => setSchoolType(value)}
                size={SelectBoxSize.PC}
                status={SelectBoxType.DEFAULT}
                options={organizationTypeOptionList}
                className="w-full"
              />
            )}
          </div>

          <div className="min-w-[222px] w-full max-w-[400px]">
            {schoolType && (
              <SchoolDivisionSelectBox
                setItemsValue={setSchoolDivision}
                itemsValue={schoolDivision}
                closeModal={() => {
                  closeModal(schoolDivision, schoolType)
                }}
                options={organizations}
                className="w-full"
              />
            )}
          </div>
        </div>
      </div>
    </div>
  )
}

function SchoolDivisionSelectBox({
  options,
  setItemsValue,
  itemsValue,
  className = ' w-[200px]',
  closeModal,
}: {
  options: OptionProps[]
  setItemsValue: React.Dispatch<React.SetStateAction<string[]>>
  className?: string
  itemsValue: string[]
  closeModal: () => void
}) {
  const { control, watch } = useForm()
  const searchValue = watch('searchValue')

  const [optionsInSelect, setOptionsInSelect] = useState<OptionProps[]>(options)
  const [valueIsChanged, setValueIsChanged] = useState(false)

  useEffect(() => {
    setOptionsInSelect(
      searchValue
        ? options.filter((option) => {
            return option.text.includes(searchValue)
          })
        : options,
    )
  }, [searchValue, options])

  useEffect(() => {
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
        {optionsInSelect.map((option) => (
          <li
            key={option?.value}
            className={`flex flex-row px-4 relative w-full hover:cursor-pointer h-9 items-center`}
            onClick={() => {
              ;(itemsValue[0] = option?.text), setItemsValue(itemsValue), setValueIsChanged(true), closeModal()
            }}
          >
            {option?.text}
            <div className="border-b-[1px] border-gray-gray h-[1px] w-[90%] absolute bottom-0"></div>
          </li>
        ))}
      </ul>
    </div>
  )
}

export default SchoolSearchSingle
