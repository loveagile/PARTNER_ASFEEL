import { Button, Modal } from 'antd'
import React, { forwardRef } from 'react'
import styles from './index.module.scss'
import CustomDatePicker from '../atoms/CustomDatePicker'
import CustomTimePicker from '../atoms/CustomTimePicker'
import dayjs, { Dayjs } from 'dayjs'
import { MdArrowDropDown, MdDateRange } from 'react-icons/md'
import { convertUtcToJapanTime } from '@/utils/common'

type ModalInterviewDateProps = {
  handleChangeList: (
    changeValues: { [key: string]: any },
    userId: string,
  ) => void
}

const ModalInterviewDate = forwardRef(
  ({ handleChangeList }: ModalInterviewDateProps, ref) => {
    const [currentUser, setCurrentUser] = React.useState<any>({})
    const [date, setDate] = React.useState<Dayjs>(dayjs())
    const [time, setTime] = React.useState<Dayjs>(dayjs())
    const [isShow, setIsShow] = React.useState<boolean>(false)

    const handleSetDate = (value: Dayjs | null) => {
      handleChangeList(
        { interviewDate: value ? value.valueOf() : null },
        currentUser?.id,
      )
      setIsShow(false)
    }

    React.useImperativeHandle(ref, () => ({
      show: (data: any) => {
        setIsShow(true)
        setCurrentUser(data)
        data?.interviewDate && setDate(dayjs(data?.interviewDate))
        data?.interviewDate && setTime(dayjs(data?.interviewDate))
      },
    }))

    return (
      <Modal
        className={styles.wrapper}
        open={isShow}
        title={<div className="text-center text-h3">面談日時</div>}
        closeIcon={null}
        onCancel={() => setIsShow(false)}
        footer={
          <>
            <Button
              key="back"
              className="h-[56px] w-[200px] rounded-[30px] !border-gray-gray_dark !bg-gray-gray_dark !text-gray-white"
              onClick={() => setIsShow(false)}
            >
              キャンセル
            </Button>
            <Button
              key="submit"
              type="primary"
              onClick={() =>
                handleSetDate(
                  dayjs(`${date.format('YYYY-MM-DD')} ${time.format('HH:mm')}`),
                )
              }
              className="h-[56px] w-[200px] rounded-[30px] !bg-core-blue"
            >
              登録する
            </Button>
            <div
              className="mt-[30px] cursor-pointer text-core-red"
              onClick={() => handleSetDate(null)}
            >
              削除する
            </div>
          </>
        }
      >
        <CustomDatePicker
          className="w-[220px]"
          value={date}
          inputRender={(props) => {
            return (
              <>
                <MdDateRange fontSize={24} className="mr-1" />
                <input {...props} />
              </>
            )
          }}
          format={(value) => {
            return convertUtcToJapanTime(value.valueOf(), true)
          }}
          onChange={(value) => {
            setDate(value as Dayjs)
          }}
          suffixIcon={
            <MdArrowDropDown
              fontSize={20}
              className="cursor-pointer text-gray-black"
            />
          }
        />
        <CustomTimePicker
          className="w-[120px]"
          inputReadOnly
          value={time}
          onChange={(value) => {
            setTime(value as Dayjs)
          }}
          suffixIcon={
            <MdArrowDropDown
              fontSize={20}
              className="cursor-pointer text-gray-black"
            />
          }
        />
      </Modal>
    )
  },
)

ModalInterviewDate.displayName = 'ModalInterviewDate'

export default ModalInterviewDate
