'use client'

import { API_ROUTES, STATUS_CATEGORY_OPTIONS } from '@/constants/common'
import { ErrorValidation } from '@/constants/error'
import { customFetchUtils } from '@/utils/common'
import { Button, Form, Input, Select, Typography } from 'antd'
import { CheckboxOptionType } from 'antd/lib/checkbox'
import React from 'react'
import { AiFillCaretDown } from 'react-icons/ai'

type CreateEditCategoryPageProps = {
  detailCategory?: any
  handleSubmit: (values: any) => void
  handleDelete?: () => void
}

const CreateEditCategoryPage = ({
  detailCategory,
  handleSubmit,
  handleDelete,
}: CreateEditCategoryPageProps) => {
  const [form] = Form.useForm()
  const [isDisabled, setIsDisabled] = React.useState<boolean>(true)
  const [largeCategory, setLargeCategory] = React.useState<any[]>([])
  const [mediumCategory, setMediumCategory] = React.useState<any[]>([])
  const mediumCategoryRef = React.useRef<any[]>([])

  const handleFetchLargeCategory = async () => {
    try {
      const res = await customFetchUtils(API_ROUTES.CATEGORY.type('large'))
      const data = await res.json()

      setLargeCategory(data || [])
    } catch (error) {
      console.log(error)
    }
  }

  const handleFetchMediumCategory = async (detailCategory: any) => {
    try {
      const res = await customFetchUtils(API_ROUTES.CATEGORY.type('medium'))
      const data = await res.json()

      mediumCategoryRef.current = data || []

      if (detailCategory?.largeCategory) {
        const data = mediumCategoryRef.current.filter(
          (item) => detailCategory?.largeCategory === item?.largeCategory,
        )
        setMediumCategory(data || [])
      } else {
        setMediumCategory(data || [])
      }
    } catch (error) {
      console.log(error)
    }
  }

  const handleValuesChange = (changedValues: any, values: any) => {
    if (changedValues?.hasOwnProperty('largeCategory')) {
      form.resetFields(['mediumCategory'])
      delete values.mediumCategory

      const data = changedValues?.largeCategory
        ? mediumCategoryRef.current.filter(
            (item) => changedValues?.largeCategory === item?.largeCategory,
          )
        : mediumCategoryRef.current

      setMediumCategory(data)
    }

    const isDisabled = Object.entries(values).some(
      ([key, value]) => !value && key !== 'isPublish',
    )
    setIsDisabled(isDisabled)
  }

  React.useEffect(() => {
    handleFetchLargeCategory()
    handleFetchMediumCategory(detailCategory)
    if (detailCategory) {
      form.setFieldsValue(detailCategory)
    }
  }, [detailCategory])

  const largeCategoryOptions: CheckboxOptionType[] = React.useMemo(() => {
    return largeCategory.map((item) => ({
      label: item.name,
      value: item.id,
    }))
  }, [largeCategory])

  const mediumCategoryOptions: CheckboxOptionType[] = React.useMemo(() => {
    return mediumCategory.map((item) => ({
      label: item.name,
      value: item.id,
    }))
  }, [mediumCategory])

  return (
    <>
      <Typography.Title level={3} className="mb-8 text-center">
        {detailCategory ? '種目分類編集' : '種目分類登録'}
      </Typography.Title>
      <Form
        form={form}
        requiredMark={false}
        onFinish={handleSubmit}
        onValuesChange={handleValuesChange}
      >
        <div className="relative overflow-hidden rounded-xl">
          <div className="bg-light-blue_light px-5 py-3">
            <Typography.Text className="font-bold text-core-blue">
              基本情報
            </Typography.Text>
          </div>
          <div className="bg-gray-white p-10">
            {detailCategory && (
              <Form.Item
                name="isPublish"
                className="absolute right-10 z-10 h-[1.75rem] w-[6.25rem]"
              >
                <Select
                  options={STATUS_CATEGORY_OPTIONS}
                  suffixIcon={<AiFillCaretDown className="text-gray-black" />}
                  className="select_filter select_status"
                  popupClassName="select_filter_popup"
                />
              </Form.Item>
            )}
            <Typography.Title level={5} className="!text-core-blue">
              カテゴリ
            </Typography.Title>
            <Form.Item
              name="largeCategory"
              label="大カテゴリ"
              labelCol={{ span: 24, className: '!pb-0 h-[26px] font-bold' }}
              className="mb-0 max-w-[19rem]"
              rules={[
                {
                  required: true,
                  message: ErrorValidation.REQUIRED.message,
                },
              ]}
            >
              <Select
                options={largeCategoryOptions}
                suffixIcon={<AiFillCaretDown className="text-gray-black" />}
                placeholder="大カテゴリを選択"
              />
            </Form.Item>
            <Form.Item
              name="mediumCategory"
              label="中カテゴリ"
              labelCol={{ span: 24, className: '!pb-0 h-[26px] font-bold' }}
              className="mb-0 max-w-[19rem]"
              rules={[
                {
                  required: true,
                  message: ErrorValidation.REQUIRED.message,
                },
              ]}
            >
              <Select
                suffixIcon={<AiFillCaretDown className="text-gray-black" />}
                options={mediumCategoryOptions}
                placeholder="中カテゴリを選択"
              />
            </Form.Item>
            <Form.Item
              name="name"
              label="名称"
              labelCol={{ span: 24, className: '!pb-0 h-[26px] font-bold' }}
              className="mb-0 max-w-[19rem]"
              rules={[
                {
                  required: true,
                  message: ErrorValidation.REQUIRED.message,
                },
              ]}
            >
              <Input placeholder="サッカー" />
            </Form.Item>
          </div>
          <div className="my-16 flex justify-center">
            <Button
              type="primary"
              htmlType="submit"
              className="h-14 rounded-[30px] px-16"
              disabled={
                isDisabled ||
                (!form.isFieldsTouched() && !detailCategory) ||
                form.getFieldsError().some((item) => item.errors.length)
              }
            >
              {detailCategory ? '編集する' : '登録する'}
            </Button>
          </div>
        </div>
        <div className="mb-[2.5rem] text-center">
          {detailCategory && (
            <button
              onClick={handleDelete}
              type="button"
              className="text-core-red underline"
            >
              この種目を削除する
            </button>
          )}
        </div>
      </Form>
    </>
  )
}

export default CreateEditCategoryPage
