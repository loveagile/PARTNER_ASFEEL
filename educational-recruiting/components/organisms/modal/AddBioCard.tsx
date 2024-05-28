import { AiOutlineClose } from 'react-icons/ai'
import 'react-datepicker/dist/react-datepicker.css'
import { TbTilde } from 'react-icons/tb'
import { FormField } from '@/components/molecules'
import { useForm } from 'react-hook-form'
import { InputStatus, InputType } from '@/components/atoms'

export interface stepCardType {
  dateFrom: Date
  dateTo: Date
  title: string
  closeModal: () => void
  className?: string
  isModalOpen?: boolean
}
const AddBioCard = ({ dateFrom, dateTo, title, closeModal, className, isModalOpen }: stepCardType) => {
  const { control, watch } = useForm({})

  return (
    <div className="modal-card fixed inset-0 z-50 flex items-center justify-center bg-gray-black_clear">
      <div className={`bg-white rounded-t-3xl pc:h-min-[274px] sp:w-[280px] sp:h-min-[264px]`}>
        <div className="relative flex w-[280px] rounded-t-lg h-[43px] bg-core-blue_dark items-center self-center justify-center text-white font-bold">
          <p className="text-[16px]">経歴追加</p>
          <div className="absolute left-[20px]" onClick={closeModal}>
            <AiOutlineClose className="w-[18px] h-[18px] cursor-pointer" />
          </div>
          <p className="text-[14px] absolute right-[20px] cursor-pointer" onClick={closeModal}>
            完了
          </p>
        </div>

        <div className="py-[30px] px-[20px] grid gap-[20px]">
          <div>
            <p className="text-[14px]">在籍期間</p>
            <div className="flex gap-[6px]">
              <div className="w-[107px]">{/* <DatePickerMiniComponent /> */}</div>
              <TbTilde className="w-[16px] h-[16px] self-center" />
              {/* <p className="text-[14px] self-center"> ~ </p> */}
              <div className="w-[107px]">{/* <DatePickerMiniComponent /> */}</div>
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
            />
          </div>

          <div className="text-center">
            <p className="text-[12px] text-core-red cursor-pointer">この経歴を削除する</p>
          </div>
        </div>
      </div>
    </div>
  )
}
export default AddBioCard
