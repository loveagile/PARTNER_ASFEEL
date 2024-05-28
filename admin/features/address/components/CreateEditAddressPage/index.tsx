'use client'

import LoadingView from '@/components/LoadingView'
import InputNumber from '@/components/atoms/InputNumber'
import { API_ROUTES } from '@/constants/common'
import { ErrorValidation } from '@/constants/error'
import {
  convertUrlSearchParams,
  customFetchUtils,
  fetchAreaOption,
  fetchPrefecture,
  filterOption,
} from '@/utils/common'
import { Button, Form, Input, Select, Spin, Typography } from 'antd'
import React from 'react'
import { AiFillCaretDown } from 'react-icons/ai'

type CreateEditAddressPageProps = {
  detailAddress?: any
  handleSubmit: (values: any) => void
  handleDelete?: () => void
}

const CreateEditAddressPage = ({
  detailAddress,
  handleSubmit,
  handleDelete,
}: CreateEditAddressPageProps) => {
  const [form] = Form.useForm()
  const [isDisabled, setIsDisabled] = React.useState<boolean>(true)
  const [areaOption, setAreaOption] = React.useState<any[]>([])
  const [prefectureOption, setPrefectureOption] = React.useState<any[]>([])
  const [citiesOption, setCitiesOption] = React.useState<any[]>([])
  const [isLoading, setIsLoading] = React.useState<boolean>(false)

  const [isFetchingArea, setIsFetchingArea] = React.useState<boolean>(false)
  const [isFetchingCities, setIsFetchingCities] = React.useState<boolean>(false)

  const transformAddressesValues = (values: any) => {
    const prefecture =
      prefectureOption.find((item) => item.value === values.prefecture) || ''
    const area = areaOption.find((item) => item.value === values.area) || ''
    const city = citiesOption.find((item) => item.value === values.city) || ''

    return {
      ...values,
      prefecture,
      area,
      city,
    }
  }

  const fetchArea = async (prefecture?: string) => {
    setIsFetchingArea(true)
    try {
      const areaOption = await fetchAreaOption(prefecture)
      setAreaOption(areaOption)
    } catch (error) {
      console.log(error)
    }
    setIsFetchingArea(false)
  }

  const fetchCities = async (prefectures?: string, areas?: string) => {
    setIsFetchingCities(true)
    try {
      const params = convertUrlSearchParams({ prefectures, areas })
      const res = await customFetchUtils(
        `${API_ROUTES.ADDRESS.cities}?${params}`,
      )
      const data = await res.json()

      const citiesOption =
        data?.map((item: any) => ({
          ...item,
          label: item?.city,
          value: item?.id,
        })) || []

      setCitiesOption(citiesOption)
    } catch (error) {
      console.log(error)
    }
    setIsFetchingCities(false)
  }

  const handleValuesChange = async (changedValues: any, values: any) => {
    if (changedValues?.prefecture) {
      form.resetFields(['area'])
      fetchArea(changedValues?.prefecture)
      values.area = undefined
    }

    if (changedValues?.area || changedValues?.prefecture) {
      form.resetFields(['city'])
      fetchCities(values?.prefecture, values?.area)
      values.city = undefined
    }

    const isDisabled = Object.entries(values).some(([key, value]) => !value)
    setIsDisabled(isDisabled)
  }

  const handleFinish = (values: any) => {
    handleSubmit(transformAddressesValues(values))
  }

  React.useEffect(() => {
    setIsLoading(true)
    ;(async () => {
      try {
        await Promise.all([
          fetchPrefecture(setPrefectureOption),
          fetchArea(detailAddress?.prefecture),
          fetchCities(detailAddress?.prefecture, detailAddress?.area),
        ])

        if (!detailAddress) return
        form.setFieldsValue(detailAddress)
      } catch (error) {
        console.log(error)
      }
    })()
    setIsLoading(false)
  }, [detailAddress])

  return (
    <>
      <LoadingView spinning={isLoading} />
      <Typography.Title level={3} className="mb-8 text-center">
        {detailAddress
          ? '住所（郵便番号）情報編集'
          : '住所（郵便番号）情報登録'}
      </Typography.Title>
      <Form
        form={form}
        requiredMark={false}
        onFinish={handleFinish}
        onValuesChange={handleValuesChange}
      >
        <div className="relative overflow-hidden rounded-xl">
          <div className="bg-light-blue_light px-5 py-3">
            <Typography.Text className="font-bold text-core-blue">
              基本情報
            </Typography.Text>
          </div>
          <div className="bg-gray-white p-10">
            <Typography.Title level={5} className="!mb-0 !text-core-blue">
              住所
            </Typography.Title>
            <Form.Item
              name="zip"
              label="郵便番号"
              labelCol={{ span: 24, className: '!pb-0 h-[26px]' }}
              className="mb-0 max-w-[19rem]"
              rules={[
                {
                  required: true,
                  message: ErrorValidation.REQUIRED.message,
                },
                {
                  pattern: ErrorValidation.NUMBER_ONLY.regex,
                  message: ErrorValidation.NUMBER_ONLY.message,
                },
                {
                  len: 7,
                  message: ErrorValidation.NUMBER_LENGTH_INVALID.message(7),
                },
              ]}
              validateFirst
            >
              <InputNumber />
            </Form.Item>
            <Form.Item
              name="prefecture"
              label="都道府県"
              labelCol={{ span: 24, className: '!pb-0 h-[26px]' }}
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
                options={prefectureOption}
                showSearch
                filterOption={filterOption}
              />
            </Form.Item>
            <Form.Item
              name="area"
              label="エリア"
              labelCol={{ span: 24, className: '!pb-0 h-[26px]' }}
              className="mb-0 max-w-[19rem]"
              rules={[
                {
                  required: true,
                  message: ErrorValidation.REQUIRED.message,
                },
              ]}
            >
              <Select
                options={
                  isFetchingArea
                    ? [
                        {
                          label: <Spin spinning size="small" />,
                        },
                      ]
                    : areaOption
                }
                suffixIcon={<AiFillCaretDown className="text-gray-black" />}
                showSearch
                filterOption={filterOption}
              />
            </Form.Item>
            <Form.Item
              name="city"
              label="市区町村"
              labelCol={{ span: 24, className: '!pb-0 h-[26px]' }}
              className="mb-0 max-w-[19rem]"
              rules={[
                {
                  required: true,
                  message: ErrorValidation.REQUIRED.message,
                },
              ]}
            >
              <Select
                options={
                  isFetchingCities
                    ? [
                        {
                          label: <Spin spinning size="small" />,
                        },
                      ]
                    : citiesOption
                }
                suffixIcon={null}
                showSearch
                filterOption={filterOption}
              />
            </Form.Item>
            <Form.Item
              name="address1"
              label="番地"
              labelCol={{ span: 24, className: '!pb-0 h-[26px]' }}
              className="mb-0 max-w-[19rem]"
              rules={[
                {
                  required: true,
                  message: ErrorValidation.REQUIRED.message,
                },
              ]}
            >
              <Input />
            </Form.Item>
          </div>
          <div className="my-16 flex justify-center">
            <Button
              type="primary"
              htmlType="submit"
              className="h-14 rounded-[30px] px-16"
              disabled={
                isDisabled ||
                (!form.isFieldsTouched() && !detailAddress) ||
                form.getFieldsError().some((item) => item.errors.length)
              }
            >
              {detailAddress ? '編集する' : '登録する'}
            </Button>
          </div>
        </div>
        <div className="mb-[2.5rem] text-center">
          {detailAddress && (
            <button
              onClick={handleDelete}
              type="button"
              className="text-core-red underline"
            >
              この住所（郵便番号）を削除する
            </button>
          )}
        </div>
      </Form>
    </>
  )
}

export default CreateEditAddressPage
