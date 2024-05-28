import { API_ROUTES } from '@/constants/common'
import { customFetchUtils } from '@/utils/common'
import { Form, Input, List, Modal, Select, Typography } from 'antd'
import React from 'react'
import { AiFillCaretDown, AiOutlineSearch } from 'react-icons/ai'
import styles from './index.module.scss'

type SchoolInputProps = {
  value?: any
  onChange?: (value: any) => void
  id?: string
}

const SchoolInput = ({ value, onChange, ...rest }: SchoolInputProps) => {
  const form = Form.useFormInstance()
  const prefectures = Form.useWatch('prefectures', form)
  const [isShowModal, setIsShowModal] = React.useState(false)
  const [search, setSearch] = React.useState('')
  const [schoolTypeList, setSchoolTypeList] = React.useState<any[]>([])
  const [schoolType, setSchoolType] = React.useState<any>(null)
  const [schoolList, setSchoolList] = React.useState<any[]>([])

  const handleSelect = (item: any) => {
    onChange?.(item?.label)
    setIsShowModal(false)
  }

  const fetchSchool = async (type?: string, prefectures?: string) => {
    const res = await customFetchUtils(
      API_ROUTES.ORGANIZATION.schoolType(type, prefectures),
    )
    const data = await res.json()
    const options = data?.map((item: any) => ({
      label: item.name,
      value: item.id,
      city: item?.address?.city,
    }))
    if (type) {
      setSchoolList(options || [])
    } else {
      setSchoolTypeList(options || [])
    }
  }

  React.useEffect(() => {
    fetchSchool(schoolType, prefectures)
  }, [schoolType, prefectures])

  React.useEffect(() => {
    onChange?.(value)
  }, [value])

  return (
    <>
      <span className="cursor-pointer" onClick={() => setIsShowModal(true)}>
        <Input
          value={value || ''}
          prefix={<AiOutlineSearch className="text-xl text-gray-black" />}
          classNames={{
            input: 'cursor-pointer caret-transparent',
          }}
        />
      </span>
      <Modal
        closeIcon={null}
        footer={null}
        open={isShowModal}
        onCancel={() => setIsShowModal(false)}
        className="custom_modal !w-[30rem]"
      >
        <Typography.Title level={3} className="text-center">
          学校検索
        </Typography.Title>
        <Typography.Title level={5}>学校区分</Typography.Title>
        <Select
          className={`${styles.select_school_input} w-full`}
          placeholder="学校区分を選択"
          suffixIcon={<AiFillCaretDown className="text-gray-black" />}
          options={schoolTypeList}
          onSelect={(value) => setSchoolType(value)}
        />

        {schoolType && (
          <>
            <Input
              prefix={
                <AiOutlineSearch className="text-xl text-gray-gray_dark" />
              }
              placeholder="検索"
              className="mt-[30px] rounded-none border-x-0 !border-e-0 bg-gray-gray_lighter px-5"
              classNames={{
                input: 'bg-gray-gray_lighter',
              }}
              onChange={(value) => setSearch(value.target.value)}
            />
            <List
              className="hidden_scroll max-h-[20.25rem] overflow-auto border-b pl-5 pr-1"
              dataSource={schoolList}
              renderItem={(item) => {
                if (item.label.includes(search)) {
                  return (
                    <span
                      onClick={() => {
                        handleSelect(item)
                      }}
                      className="block cursor-pointer border-b border-gray-gray py-[10px]"
                    >
                      {item.label}
                    </span>
                  )
                }
              }}
            />
          </>
        )}
      </Modal>
    </>
  )
}

export default SchoolInput
