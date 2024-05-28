'use client'

import FormItem from '@/components/atoms/Form/FormItem'
import FormLabel from '@/components/atoms/Form/Label'
import InputKana from '@/components/atoms/InputKana'
import InputNumber from '@/components/atoms/InputNumber'
import PrefectureInput from '@/components/atoms/PrefectureInput'
import { STATUS_SUSPENDED_OPTIONS } from '@/constants/common'
import { ErrorValidation } from '@/constants/error'
import { getOrganizationTypes, getPrefectures } from '@/libs/firebase/firestore'
import { getAddressFromZipCode } from '@/utils/common'
import {
  Button,
  Form,
  FormInstance,
  Input,
  Radio,
  Select,
  Typography,
} from 'antd'
import React from 'react'
import { AiFillCaretDown } from 'react-icons/ai'

type CreateOrganizationPageProps = {
  form: FormInstance<any>
  handleSubmit: (values: any) => void
  handleDelete?: () => void
  detailOrganization?: any
}

const CreateEditOrganizationPage = ({
  form,
  detailOrganization,
  handleSubmit,
  handleDelete,
}: CreateOrganizationPageProps) => {
  const zipCode = Form.useWatch(['address', 'zip'], form)
  const [isSearchZipCode, setIsSearchZipCode] = React.useState(false)
  const [isDisableSubmit, setIsDisableSubmit] = React.useState(true)
  const [organizationTypes, setOrganizationTypes] = React.useState<any[]>([])
  const [prefectures, setPrefectures] = React.useState<any[]>([])

  const organizationTypesOption = React.useMemo(
    () =>
      organizationTypes.map((type) => ({
        label: type.name,
        value: type.id!,
      })),
    [organizationTypes],
  )
  const prefecturesOption = React.useMemo(
    () =>
      prefectures.map((prefecture) => ({
        label: prefecture.prefecture,
        value: prefecture.prefecture!,
      })),
    [prefectures],
  )
  const handleFindZipCode = async (zipCode: string) => {
    setIsSearchZipCode(true)
    try {
      const data = await getAddressFromZipCode(zipCode)
      const prefecture = prefecturesOption.find(
        (item) => item.label === data?.address1,
      )?.value

      form.setFieldsValue({
        address: {
          prefecture,
          city: `${data.address2}${data?.address3}`,
        },
      })
    } catch (error: any) {
      form.setFields([
        {
          name: ['address', 'zip'],
          errors: [error?.message || ''],
        },
      ])
    }
    setIsSearchZipCode(false)
  }

  const handleValuesChange = (changedValues: any, values: any) => {
    const isDisableSubmit = Object.entries(values).some(
      ([key, value]: [string, any]) => {
        if (key === 'address') {
          return Object.entries(value).some(
            ([key, value]) => !value && key !== 'address2',
          )
        }
        return !value && key !== 'isSuspended'
      },
    )
    setIsDisableSubmit(isDisableSubmit)
  }

  React.useEffect(() => {
    ;(async () => {
      const [organizationTypes, prefectures] = await Promise.all([
        getOrganizationTypes(),
        getPrefectures(),
      ])
      setOrganizationTypes(organizationTypes)
      setPrefectures(prefectures)
    })()
  }, [])

  React.useEffect(() => {
    if (!detailOrganization) return
    form.setFieldsValue(detailOrganization)
  }, [detailOrganization])

  return (
    <>
      <Typography.Title level={3} className="mb-8 text-center">
        {detailOrganization ? '学校・団体情報編集' : '学校・団体情報登録'}
      </Typography.Title>
      <Form
        form={form}
        requiredMark={false}
        onFinish={(values) =>
          handleSubmit({
            ...values,
            organizationTypeText: organizationTypesOption.find(
              (item) => item.value === values.organizationType,
            )?.label,
          })
        }
        onValuesChange={handleValuesChange}
      >
        <div className="relative overflow-hidden rounded-xl">
          <div className="bg-light-blue_light px-5 py-3">
            <Typography.Text className="font-bold text-core-blue">
              基本情報
            </Typography.Text>
          </div>
          <div className="bg-gray-white p-10">
            {detailOrganization && (
              <Form.Item
                name="isSuspended"
                className="absolute right-10 z-10 h-[1.75rem] w-[6.25rem]"
              >
                <Select
                  options={STATUS_SUSPENDED_OPTIONS.map((item) => ({
                    ...item,
                    value: !!item.value,
                  }))}
                  suffixIcon={<AiFillCaretDown className="text-gray-black" />}
                  className="select_filter select_status"
                  popupClassName="select_filter_popup"
                />
              </Form.Item>
            )}
            <FormItem
              name="organizationId"
              className="max-w-[18.75rem]"
              isCheckEmoji
              rules={[
                {
                  required: true,
                  message: ErrorValidation.REQUIRED.message,
                },
              ]}
              label={<FormLabel>学校ID</FormLabel>}
              labelCol={{ span: 24 }}
            >
              <Input className="pl-4" />
            </FormItem>
            {/* <Form.Item
              name="prefecture"
              rules={[
                {
                  required: true,
                  message: ErrorValidation.REQUIRED.message,
                },
              ]}
              label={<FormLabel>都道府県</FormLabel>}
              labelCol={{ span: 24 }}
              className="!max-w-[18.75rem]"
            >
              <PrefectureInput dataSource={prefecturesOption} />
            </Form.Item> */}
            <Form.Item
              name="organizationType"
              label={<FormLabel>区分</FormLabel>}
              rules={[
                {
                  required: true,
                  message: ErrorValidation.REQUIRED.message,
                },
              ]}
              labelCol={{ span: 24 }}
            >
              <Radio.Group
                options={organizationTypesOption}
                className="radio_create_organization max-w-[50%]"
              />
            </Form.Item>
            <Form.Item
              label={<FormLabel>学校名・団体名</FormLabel>}
              required
              labelCol={{ span: 24 }}
            >
              <FormItem
                name="name"
                isCheckEmoji
                rules={[
                  {
                    required: true,
                    message: ErrorValidation.REQUIRED.message,
                  },
                  {
                    max: 30,
                    message:
                      ErrorValidation.CHARACTER_LENGTH_INVALID.message(30),
                  },
                ]}
                className="mb-4 max-w-[18.75rem]"
              >
                <Input />
              </FormItem>
              <FormItem
                name="nameKana"
                isCheckEmoji
                rules={[
                  {
                    required: true,
                    message: ErrorValidation.REQUIRED.message,
                  },
                  {
                    pattern: ErrorValidation.KANA_ONLY.regex,
                    message: ErrorValidation.KANA_ONLY.message,
                  },
                ]}
                className="mb-0 max-w-[18.75rem]"
              >
                <InputKana />
              </FormItem>
            </Form.Item>
            <Typography.Title level={5} className="!text-core-blue">
              住所
            </Typography.Title>
            <Form.Item
              label="郵便番号"
              className="mb-0 max-w-[18.75rem]"
              labelCol={{
                span: 24,
                className: '!pb-0 h-[26px]',
              }}
            >
              <div className="flex gap-3">
                <Form.Item
                  name={['address', 'zip']}
                  className="mb-0"
                  validateFirst
                  rules={[
                    {
                      pattern: ErrorValidation.NUMBER_ONLY.regex,
                      message: ErrorValidation.NUMBER_LENGTH_INVALID.message(7),
                    },
                    {
                      required: true,
                      message: ErrorValidation.REQUIRED.message,
                    },
                    {
                      max: 7,
                      message: ErrorValidation.NUMBER_LENGTH_INVALID.message(7),
                    },
                  ]}
                >
                  <InputNumber placeholder="郵便番号" />
                </Form.Item>
                <Form.Item shouldUpdate className="mb-0">
                  {() => {
                    const isDisabledZipButton =
                      !zipCode ||
                      form.getFieldError(['address', 'zip']).length > 0 ||
                      isSearchZipCode

                    return (
                      <Button
                        type="primary"
                        className="h-[34px]"
                        disabled={isDisabledZipButton}
                        onClick={() =>
                          !isDisabledZipButton && handleFindZipCode(zipCode)
                        }
                      >
                        郵便番号検索
                      </Button>
                    )
                  }}
                </Form.Item>
              </div>
            </Form.Item>
            <Form.Item
              name={['address', 'prefecture']}
              label="都道府県"
              className="mb-0 max-w-[18.75rem]"
              labelCol={{
                span: 24,
                className: '!pb-0 h-[26px]',
              }}
              rules={[
                {
                  required: true,
                  message: ErrorValidation.REQUIRED.message,
                },
              ]}
            >
              <PrefectureInput dataSource={prefecturesOption} />
            </Form.Item>
            <FormItem
              name={['address', 'city']}
              isCheckEmoji
              label="市区町村"
              className="mb-0 max-w-[18.75rem]"
              labelCol={{
                span: 24,
                className: '!pb-0 h-[26px]',
              }}
              rules={[
                {
                  required: true,
                  message: ErrorValidation.REQUIRED.message,
                },
                {
                  max: 20,
                  message: ErrorValidation.CHARACTER_LENGTH_INVALID.message(20),
                },
              ]}
            >
              <Input placeholder="市区町村" />
            </FormItem>
            <FormItem
              name={['address', 'address1']}
              isCheckEmoji
              label="番地"
              className="mb-0 max-w-[18.75rem]"
              labelCol={{
                span: 24,
                className: '!pb-0 h-[26px]',
              }}
              rules={[
                {
                  required: true,
                  message: ErrorValidation.REQUIRED.message,
                },
                {
                  max: 20,
                  message: ErrorValidation.CHARACTER_LENGTH_INVALID.message(20),
                },
              ]}
            >
              <Input placeholder="番地" />
            </FormItem>
            <FormItem
              name={['address', 'address2']}
              isCheckEmoji
              label="建物名・部屋番号"
              className="max-w-[18.75rem]"
              labelCol={{
                span: 24,
                className: '!pb-0 h-[26px]',
              }}
              rules={[
                {
                  max: 50,
                  message: ErrorValidation.CHARACTER_LENGTH_INVALID.message(50),
                },
              ]}
            >
              <Input placeholder="建物名・部屋番号" />
            </FormItem>
            <Form.Item
              name="phoneNumber"
              label={<FormLabel>電話番号</FormLabel>}
              labelCol={{ span: 24 }}
              className="mb-0"
              rules={[
                {
                  required: true,
                  message: ErrorValidation.REQUIRED.message,
                },
                {
                  pattern: ErrorValidation.NUMBER_ONLY.regex,
                  message: ErrorValidation.NUMBER_ONLY.message,
                },
              ]}
            >
              <InputNumber className="max-w-[15rem]" />
            </Form.Item>
            <span className="text-gray-black">
              つながりやすい連絡先をご入力ください（ハイフン不要）
            </span>
          </div>
        </div>
        <div className="my-16 flex justify-center">
          <Form.Item shouldUpdate>
            {() => {
              return (
                <Button
                  type="primary"
                  htmlType="submit"
                  className="h-14 rounded-[30px] px-16"
                  disabled={
                    isDisableSubmit ||
                    (!form.isFieldsTouched() && !detailOrganization) ||
                    form.getFieldsError().some((item) => item.errors.length)
                  }
                >
                  {detailOrganization ? '編集する' : '登録する'}
                </Button>
              )
            }}
          </Form.Item>
        </div>
        <div className="mb-[2.5rem] text-center">
          {detailOrganization && (
            <button
              onClick={handleDelete}
              type="button"
              className="text-core-red underline"
            >
              この学校・団体を削除する
            </button>
          )}
        </div>
      </Form>
    </>
  )
}

export default CreateEditOrganizationPage
