'use client'

import CityInput from '@/components/CityInput2'
import CustomDatePicker from '@/components/atoms/CustomDatePicker'
import CustomTimePicker from '@/components/atoms/CustomTimePicker'
import PrefectureInput from '@/components/atoms/PrefectureInput'
import { API_ROUTES, STATUS_NOTIFICATION_OPTIONS } from '@/constants/common'
import { ErrorValidation } from '@/constants/error'
import { customFetchUtils } from '@/utils/common'
import { Button, Form, Input, Select, Typography } from 'antd'
import dayjs from 'dayjs'
import React from 'react'
import { AiFillCaretDown, AiOutlinePlus } from 'react-icons/ai'

type CreateEditNotificationPageProps = {
  handleSubmit: (values: any) => void
  handleDelete?: () => void
  detailNotification?: any
}

const CreateEditNotificationPage = ({
  detailNotification,
  handleSubmit,
  handleDelete,
}: CreateEditNotificationPageProps) => {
  const cityInputRef = React.useRef<any>(null)
  const [form] = Form.useForm()
  const prefecture = Form.useWatch('prefecture', form)
  const cities = Form.useWatch('cities', form)
  const [prefectureSource, setPrefectureSource] = React.useState<any[]>([])
  const [isDisabled, setIsDisabled] = React.useState<boolean>(true)

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

  const handleOpenCityModal = async () => {
    await form.validateFields(['prefecture'])
    cityInputRef.current?.showCityModal()
  }

  const handleValuesChange = (changedValues: any, values: any) => {
    const isDisabled = Object.entries(values).some(
      ([key, value]) => !value && key !== 'isSuspended' && key !== 'cities',
    )

    setIsDisabled(isDisabled)
  }

  React.useEffect(() => {
    if (!detailNotification) return
    form.setFieldsValue(detailNotification)
  }, [detailNotification])

  React.useEffect(() => {
    handleFetchPrefecture()
  }, [])

  React.useEffect(() => {
    if (!detailNotification && !prefecture) return
    form.setFieldValue('cities', detailNotification?.cities || [])
  }, [detailNotification, prefecture])

  return (
    <>
      <Typography.Title level={3} className="mb-8 text-center">
        {detailNotification ? 'お知らせ編集' : 'お知らせ登録'}
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
            {detailNotification && (
              <Form.Item
                name="status"
                className="absolute right-10 z-10 h-[1.75rem] w-[6.25rem]"
              >
                <Select
                  options={STATUS_NOTIFICATION_OPTIONS}
                  suffixIcon={<AiFillCaretDown className="text-gray-black" />}
                  className="select_filter select_status"
                  popupClassName="select_filter_popup"
                />
              </Form.Item>
            )}

            <div>
              <Typography.Title level={5} className="!text-core-blue">
                送信先
              </Typography.Title>
              <Form.Item
                name="prefecture"
                label="都道府県"
                labelCol={{ span: 24, className: '!pb-0 h-[26px]' }}
                className="mb-0 max-w-[300px]"
                rules={[
                  { required: true, message: ErrorValidation.REQUIRED.message },
                ]}
              >
                <PrefectureInput dataSource={prefectureSource} />
              </Form.Item>
              <Form.Item
                label="市区町村"
                labelCol={{ span: 24, className: '!pb-0 h-[26px]' }}
                className="mb-0"
              >
                <Button
                  className="flex w-full max-w-[12.5rem] items-center
                justify-center !border-core-blue !text-core-blue"
                  icon={<AiOutlinePlus fontSize={20} />}
                  htmlType="button"
                  onClick={handleOpenCityModal}
                >
                  市区町村を追加
                </Button>
                <Form.Item shouldUpdate name="cities" className="mb-0 w-72">
                  <CityInput
                    ref={cityInputRef}
                    prefectureParam={form.getFieldValue('prefecture')}
                  >
                    {!!cities?.length ? (
                      <Input.TextArea
                        className="mb-8 mt-4
                      !min-h-[4.75rem] !cursor-text rounded-[0.25rem] 
                      !bg-inherit !text-inherit
                      hover:border-gray-gray_dark"
                        disabled
                        style={{
                          resize: 'none',
                        }}
                        autoSize
                      />
                    ) : (
                      <></>
                    )}
                  </CityInput>
                </Form.Item>
              </Form.Item>
              <div className="mt-2 max-w-[8.5rem]">
                <Typography.Title level={5} className=" !text-core-blue">
                  送信日時
                </Typography.Title>
                <Form.Item
                  label="日付"
                  labelCol={{
                    span: 24,
                    className: '!pb-0 h-[26px]',
                  }}
                  name="date"
                  initialValue={dayjs()}
                  className="mb-0"
                  rules={[
                    {
                      required: true,
                      message: ErrorValidation.REQUIRED.message,
                    },
                  ]}
                >
                  <CustomDatePicker />
                </Form.Item>
                <Form.Item
                  label="時間"
                  labelCol={{
                    span: 24,
                    className: '!pb-0 h-[26px]',
                  }}
                  initialValue={dayjs()}
                  name="time"
                  rules={[
                    {
                      required: true,
                      message: ErrorValidation.REQUIRED.message,
                    },
                  ]}
                >
                  <CustomTimePicker />
                </Form.Item>
              </div>
              <Typography.Title level={5} className="!text-core-blue">
                お知らせ内容
              </Typography.Title>
              <Form.Item
                name="title"
                label="タイトル"
                labelCol={{
                  span: 24,
                  className: '!pb-0 h-[26px] font-bold',
                }}
                className="mb-0 w-full max-w-[40rem] "
                rules={[
                  { required: true, message: ErrorValidation.REQUIRED.message },
                ]}
              >
                <Input />
              </Form.Item>
              <Form.Item
                name="url"
                label="URL"
                labelCol={{
                  span: 24,
                  className: '!pb-0 h-[26px] font-bold',
                }}
                className="w-full max-w-[40rem]"
                rules={[
                  { required: true, message: ErrorValidation.REQUIRED.message },
                ]}
              >
                <Input />
              </Form.Item>
            </div>
          </div>
        </div>
        <div className="my-16 flex justify-center">
          <Button
            disabled={
              isDisabled ||
              (!form.isFieldsTouched() && !detailNotification) ||
              form.getFieldsError().some((item) => item.errors.length)
            }
            type="primary"
            htmlType="submit"
            className="h-14 rounded-[30px] px-16"
          >
            {detailNotification ? '編集する' : '登録する'}
          </Button>
        </div>
        <div className="mb-[2.5rem] text-center">
          {detailNotification && (
            <button
              onClick={handleDelete}
              type="button"
              className="text-core-red underline"
            >
              このお知らせを削除する
            </button>
          )}
        </div>
      </Form>
    </>
  )
}

export default CreateEditNotificationPage
