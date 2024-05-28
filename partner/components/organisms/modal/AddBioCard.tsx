import { AiOutlineClose } from 'react-icons/ai'
import 'react-datepicker/dist/react-datepicker.css'
import { TbTilde } from 'react-icons/tb'
import { FormField } from '@/components/molecules'
import { useForm } from 'react-hook-form'
import { InputStatus, InputType } from '@/components/atoms'
import { Timestamp } from 'firebase/firestore'
import { useEffect, useState } from 'react'
import { Career } from '@/types'
import DatePickerComponent from '../Calendar'

export interface stepCardType {
  dateFrom: Date
  dateTo: Date
  title: string
  closeModal: () => void
  className?: string
  isModalOpen?: boolean
  addCareer: (career: Career) => void
  updateCareer: (career: Career, index: number) => void
  removeCareer: (index: number) => void
  isExist?: boolean
  pos: number
}
const AddBioCard = ({
  dateFrom,
  dateTo,
  title,
  closeModal,
  addCareer,
  updateCareer,
  removeCareer,
  className,
  isModalOpen,
  isExist,
  pos,
}: stepCardType) => {
  const { control, watch, setValue } = useForm({})
  const [dateF, setDateF] = useState<Date | null>(isExist == true ? dateFrom : null)
  const [dateT, setDateT] = useState<Date | null>(isExist == true ? dateTo : null)
  const [bioError, setBioError] = useState<string>('')
  const bio = watch('bio') || ''

  const clickComplete = () => {
    if (!dateF || !dateT) {
      alert('在籍期間が正しく設定されておりません。')
      return
    }
    if (dateF > dateT) {
      alert('在籍期間が正しく設定されておりません。')
      return
    }
    if (bioError || bio == '') {
      setBioError('所属入力してください')
      return
    } else {
      if (isExist == true) {
        updateCareer(
          { termOfStart: Timestamp.fromDate(dateF), termOfEnd: Timestamp.fromDate(dateT), organizationName: bio },
          pos,
        )
      } else {
        addCareer({
          termOfStart: Timestamp.fromDate(dateF),
          termOfEnd: Timestamp.fromDate(dateT),
          organizationName: bio,
        })
      }
      closeModal()
    }
  }

  const clickDelete = () => {
    if (isExist == true) removeCareer(pos)
    closeModal()
  }

  useEffect(() => {
    title != '' && isExist == true && setValue('bio', title)
  }, [])

  useEffect(() => {
    if (bio && bio == '') {
      setBioError('所属入力してください')
    } else {
      setBioError('')
    }
  }, [bio])

  return (
    <div className="modal-card fixed inset-0 z-50 flex items-center justify-center bg-gray-black_clear">
      <div className={`pc:h-min-[274px] sp:h-min-[264px] rounded-t-3xl bg-white sp:w-[280px]`}>
        <div className="relative flex h-[43px] w-[280px] items-center justify-center self-center rounded-t-lg bg-core-blue_dark font-bold text-white">
          <p className="text-[16px]">経歴追加</p>
          <div className="absolute left-[20px]" onClick={closeModal}>
            <AiOutlineClose className="h-[18px] w-[18px] cursor-pointer" />
          </div>
          <p className="absolute right-[20px] cursor-pointer text-[14px]" onClick={() => clickComplete()}>
            完了
          </p>
        </div>

        <div className="grid gap-[20px] px-[20px] py-[30px]">
          <div>
            <p className="text-[14px]">在籍期間</p>
            <div className="flex gap-[6px]">
              <div className="w-[107px]">
                <DatePickerComponent onClick={(value) => setDateF(value)} value={dateF} />
                {/* <DatePickerMiniComponent onClick={(value) => setDateF(value)} value={dateF} /> */}
              </div>
              <TbTilde className="h-[16px] w-[16px] self-center" />
              <div className="w-[107px]">
                <DatePickerComponent onClick={(value) => setDateT(value)} value={dateT} />
                {/* <DatePickerMiniComponent onClick={(value) => setDateT(value)} value={dateT} /> */}
              </div>
            </div>
          </div>

          <div>
            <p className="text-[14px]">所属</p>
            <FormField
              control={control}
              input={{
                name: 'bio',
                type: InputType.BOX,
                status: InputStatus.DEFAULT,
              }}
              attention={{ text: '' }}
              error={bioError}
            />
          </div>

          {isExist && (
            <div className="text-center">
              <p
                className="cursor-pointer text-[12px] text-core-red"
                onClick={() => {
                  clickDelete()
                }}
              >
                この経歴を削除する
              </p>
            </div>
          )}
        </div>
      </div>
    </div>
  )
}
export default AddBioCard
