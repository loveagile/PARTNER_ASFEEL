import {
  Form,
  Input,
  InputProps,
  List,
  Modal,
  ModalProps,
  Typography,
} from 'antd'
import { useState } from 'react'
import { AiFillCaretDown, AiOutlineSearch } from 'react-icons/ai'

type PrefectureModalProps = InputProps & {
  dataSource: {
    label: string
    value: any
  }[]
  modalProps?: ModalProps
}

const PrefectureInput = ({
  dataSource,
  modalProps,
  value,
  onChange,
  ...rest
}: PrefectureModalProps) => {
  const [isOpenPrefectureInput, setIsOpenPrefectureInput] = useState(false)
  const form = Form.useFormInstance()
  const [search, setSearch] = useState('')
  const currentLabel = dataSource.find((item) => item.value === value)?.label

  const handleSelect = (value: any) => {
    if (rest?.id) {
      form.setFieldValue(rest?.id, value)
    }

    onChange?.(value)
    setIsOpenPrefectureInput(false)
  }

  return (
    <>
      <span
        className="cursor-pointer"
        onClick={() => setIsOpenPrefectureInput(true)}
      >
        <Input
          value={currentLabel || ''}
          suffix={<AiFillCaretDown className="text-gray-black" />}
          placeholder="都道府県を選択"
          classNames={{
            input: 'cursor-pointer caret-transparent',
          }}
          {...rest}
        />
      </span>
      <Modal
        closeIcon={null}
        footer={null}
        {...modalProps}
        open={isOpenPrefectureInput}
        onCancel={() => setIsOpenPrefectureInput(false)}
        className="custom_modal !w-full !max-w-[32.5rem]"
      >
        <Typography.Title level={3} className="text-center">
          都道府県検索
        </Typography.Title>
        <Input
          prefix={<AiOutlineSearch color="#AFAFAF" />}
          placeholder="検索"
          className="prefecture_modal_input rounded-none border-x-0 !border-e-0 bg-gray-gray_lighter px-5"
          onChange={(value) => setSearch(value.target.value)}
        />
        <List
          className="list_modal_prefecture h-60 overflow-auto border-b pl-5 pr-1"
          dataSource={dataSource}
          renderItem={(item) => {
            if (item.label.includes(search)) {
              return (
                <span
                  onClick={() => handleSelect(item.value)}
                  className="block cursor-pointer border-b border-gray-gray py-[10px]"
                >
                  {item.label}
                </span>
              )
            }
          }}
        />
      </Modal>
    </>
  )
}

export default PrefectureInput
