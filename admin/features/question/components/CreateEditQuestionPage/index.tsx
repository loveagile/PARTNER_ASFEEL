'use client'

import PrefectureInput from '@/components/atoms/PrefectureInput'
import { API_ROUTES, STATUS_CATEGORY_OPTIONS } from '@/constants/common'
import { ErrorValidation } from '@/constants/error'
import useModal from '@/hooks/useModal'
import { customFetchUtils } from '@/utils/common'
import { Typography, Form, Input, Select, Button } from 'antd'
import React from 'react'
import { AiFillCaretDown } from 'react-icons/ai'

type CreateEditQuestionPageProps = {
  detailQuestion?: any
  handleSubmit: (values: any) => void
  handleDelete?: () => void
}

const CreateEditQuestionPage = ({
  detailQuestion,
  handleSubmit,
  handleDelete,
}: CreateEditQuestionPageProps) => {
  const [form] = Form.useForm()
  const { showSuccess, showConfirm } = useModal()
  const [prefectureSource, setPrefectureSource] = React.useState<any[]>([])
  const [isDisabled, setIsDisabled] = React.useState<boolean>(true)

  const handleValuesChange = (changedValues: any, values: any) => {
    const isDisabled = Object.entries(values).some(
      ([key, value]) => !value && key !== 'isPublish',
    )

    setIsDisabled(isDisabled)
  }

  const handleFetchPrefecture = async () => {
    try {
      const res = await customFetchUtils(API_ROUTES.ADDRESS.find)
      const data = await res.json()

      setPrefectureSource(
        data?.map((item: any) => ({
          label: item?.prefecture,
          value: item?.id,
        })) || [],
      )
    } catch (error) {
      console.log(error)
    }
  }

  React.useEffect(() => {
    if (!detailQuestion) return
    form.setFieldsValue(detailQuestion)
  }, [detailQuestion])

  React.useEffect(() => {
    handleFetchPrefecture()
  }, [])

  return (
    <>
      <Typography.Title level={3} className="mb-8 text-center">
        {detailQuestion ? '独自質問編集' : '独自質問登録'}
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
            {detailQuestion && (
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
              地域項目
            </Typography.Title>
            <Form.Item
              name="prefecture"
              label="都道府県"
              labelCol={{ span: 24, className: '!pb-0 h-[26px]' }}
              className="mb-6 max-w-[19rem]"
              rules={[
                {
                  required: true,
                  message: ErrorValidation.REQUIRED.message,
                },
              ]}
            >
              <PrefectureInput dataSource={prefectureSource} />
            </Form.Item>
            <Form.Item
              name="question"
              label="質問内容"
              // <span dangerouslySetInnerHTML={{ __html: SAMPLE_QUESTION }} />
              labelCol={{ span: 24, className: '!pb-0 h-[26px]' }}
              className="mb-0 max-w-[19.5rem]"
              rules={[
                {
                  required: true,
                  message: ErrorValidation.REQUIRED.message,
                },
              ]}
            >
              <Input.TextArea className="!min-h-[5rem]" />
            </Form.Item>
          </div>
          <div className="my-16 flex justify-center">
            <Button
              type="primary"
              htmlType="submit"
              className="h-14 rounded-[30px] px-16"
              disabled={
                isDisabled ||
                (!form.isFieldsTouched() && !detailQuestion) ||
                form.getFieldsError().some((item) => item.errors.length)
              }
            >
              {detailQuestion ? '編集する' : '登録する'}
            </Button>
          </div>
        </div>
        <div className="mb-[2.5rem] text-center">
          {detailQuestion && (
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

export default CreateEditQuestionPage
