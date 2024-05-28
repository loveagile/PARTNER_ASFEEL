'use client'

import CityInput from '@/components/CityInput2'
import FormLabel from '@/components/atoms/Form/Label'
import InputKana from '@/components/atoms/InputKana'
import {
  API_ROUTES,
  IS_BOARD_EDUCATION_OPTIONS,
  ORGANIZATION_TYPE_LABEL,
  PROJECT_TYPE,
  PROJECT_TYPE_OPTIONS,
  STATUS_SUSPENDED_OPTIONS,
} from '@/constants/common'
import { ErrorValidation } from '@/constants/error'
import {
  customFetchUtils,
  fetchParentOrganization,
  fetchPrefecture as fetchPrefectures,
} from '@/utils/common'
import {
  Button,
  Form,
  FormInstance,
  Input,
  Radio,
  Select,
  Spin,
  Typography,
} from 'antd'
import React from 'react'
import { AiFillCaretDown, AiOutlinePlus } from 'react-icons/ai'
import { BsFillEyeFill, BsFillEyeSlashFill } from 'react-icons/bs'
import SchoolInput from '../../../../components/SchoolInput'

type CreateEditCoordinatorPageProps = {
  form: FormInstance<any>
  detailCoordinator?: any
  handleSubmit: (values: any) => void
  handleDelete?: () => void
  handleIsLoading?: (value: boolean) => void
}

const CreateEditCoordinatorPage = ({
  form,
  detailCoordinator,
  handleSubmit,
  handleDelete,
  handleIsLoading,
}: CreateEditCoordinatorPageProps) => {
  const cityInputRef = React.useRef<any>(null)
  const organizationType = Form.useWatch('organizationType', form)
  const prefectures = Form.useWatch('prefectures', form)
  const cities = Form.useWatch('cities', form)
  const [organizationTypeOptions, setOrganizationTypeOptions] = React.useState<
    any[]
  >([])
  const [prefecturesOption, setPrefecturesOption] = React.useState<any[]>([])
  const [parentOptions, setParentOptions] = React.useState<any[]>([])
  const [isDisabled, setIsDisabled] = React.useState<boolean>(true)

  const fetchOrganizationType = async () => {
    const res = await customFetchUtils(API_ROUTES.ORGANIZATION.type)
    const data = await res.json()
    const organizationTypeOptions = data?.map((item: any) => ({
      label: item.name,
      value: item.id,
    }))

    setOrganizationTypeOptions(organizationTypeOptions || [])
    form.setFieldValue('organizationType', organizationTypeOptions?.[0]?.value)
  }

  const fetchParent = async (prefectures?: any) => {
    try {
      const parentOption = await fetchParentOrganization({
        prefectures,
      })
      setParentOptions(parentOption)
    } catch (error) {
      console.log(error)
    }
  }

  const handleValuesChange = async (changedValues: any, values: any) => {
    if (changedValues?.organizationType) {
      form.setFieldsValue({
        organizationName: undefined,
        cities: undefined,
      })

      setIsDisabled(true)
      return
    }

    if (changedValues?.prefectures) {
      if (
        values?.organizationType ===
        organizationTypeOptions?.find(
          (option) => option?.label === ORGANIZATION_TYPE_LABEL.SCHOOL,
        )?.value
      ) {
        form.resetFields(['organizationName'])
      }

      form.resetFields(['parentId'])
      setParentOptions([])
      await fetchParent(values?.prefectures)
    }

    if (changedValues?.email && values?.confirmEmail) {
      await form.validateFields(['confirmEmail'])
    }

    if (changedValues?.newPassword && values?.confirmNewPassword) {
      await form.validateFields(['confirmNewPassword'])
    }

    if (!detailCoordinator) {
      delete values?.currentPassword
      delete values?.currentEmail
    } else {
      if (
        !values?.currentPassword &&
        !values?.newPassword &&
        !values?.confirmNewPassword
      ) {
        delete values?.currentPassword
        delete values?.newPassword
        delete values?.confirmNewPassword
      }
    }

    const isDisabled = Object.entries(values).some(([key, value]: any) => {
      if (key === 'name') {
        return !value?.sei || !value?.mei || !value?.seiKana || !value?.meiKana
      }

      return !value && key !== 'isSuspended' && key !== 'isBoardOfEducation'
    })

    setIsDisabled(isDisabled)
  }

  React.useEffect(() => {
    handleIsLoading?.(true)
    Promise.all([
      fetchOrganizationType(),
      fetchPrefectures(setPrefecturesOption),
      fetchParent(),
    ])
      .then(() => {
        if (!detailCoordinator) return
        form.setFieldsValue(detailCoordinator)
      })
      .finally(() => {
        handleIsLoading?.(false)
      })
  }, [detailCoordinator])

  React.useEffect(() => {
    if (!prefectures && !detailCoordinator) return
    form.setFieldValue('cities', detailCoordinator?.cities || [])
  }, [prefectures, detailCoordinator])

  const isShowCityInput =
    organizationType !==
    organizationTypeOptions?.find(
      (item) => item.label === ORGANIZATION_TYPE_LABEL.SCHOOL,
    )?.value

  const handlePrevSubmit = (values: any) => {
    const prefectureSelected = prefecturesOption.find(
      (prefectureOption) => prefectureOption.id === prefectures,
    )

    handleSubmit({
      ...values,
      prefectureCode: prefectureSelected.prefectureCode,
    })
  }

  return (
    <>
      <Typography.Title level={3} className="mb-8 text-center">
        {detailCoordinator
          ? 'コーディネーターアカウント編集'
          : 'コーディネーターアカウント登録'}
      </Typography.Title>
      <Form
        form={form}
        requiredMark={false}
        onFinish={handlePrevSubmit}
        onValuesChange={handleValuesChange}
      >
        <div className="relative overflow-hidden rounded-xl">
          <div className="bg-light-blue_light px-5 py-3">
            <Typography.Text className="font-bold ">団体情報</Typography.Text>
          </div>

          <div className="bg-gray-white p-10">
            {detailCoordinator && (
              <Form.Item
                name="isSuspended"
                className="absolute right-10 z-10 h-[1.75rem] w-[6.25rem]"
              >
                <Select
                  options={STATUS_SUSPENDED_OPTIONS}
                  suffixIcon={<AiFillCaretDown className="text-gray-black" />}
                  className="select_filter select_status"
                  popupClassName="select_filter_popup"
                />
              </Form.Item>
            )}
            <Form.Item
              name="projectType"
              required
              label={<FormLabel>対応募集区分</FormLabel>}
              labelCol={{ span: 24 }}
              initialValue={PROJECT_TYPE.LEADER}
            >
              <Radio.Group options={PROJECT_TYPE_OPTIONS} />
            </Form.Item>
            <Form.Item
              name="organizationType"
              required
              label={<FormLabel>組織区分</FormLabel>}
              labelCol={{ span: 24 }}
            >
              <Radio.Group options={organizationTypeOptions} />
            </Form.Item>
            <Form.Item
              name="prefectures"
              required
              label={<FormLabel>都道府県</FormLabel>}
              labelCol={{ span: 24 }}
              className="max-w-[12.5rem]"
              rules={[
                {
                  required: true,
                  message: ErrorValidation.REQUIRED.message,
                },
              ]}
            >
              <Select
                options={prefecturesOption}
                suffixIcon={<AiFillCaretDown className="text-gray-black" />}
              />
            </Form.Item>
            <Form.Item
              required
              label={<FormLabel>市区町村</FormLabel>}
              labelCol={{ span: 24 }}
              className={`mb-0 ${isShowCityInput ? '' : 'hidden'}`}
            >
              <Button
                className="flex h-[34px] w-full max-w-[12.5rem]
                items-center justify-center !border-core-blue !text-core-blue"
                icon={<AiOutlinePlus fontSize={20} />}
                htmlType="button"
                onClick={async () => {
                  await form.validateFields(['prefectures'])
                  cityInputRef.current?.showCityModal()
                }}
              >
                市区町村を追加
              </Button>
              <Form.Item
                name="cities"
                className="mb-0 w-72"
                rules={[
                  {
                    required: true,
                    message: '',
                  },
                ]}
              >
                <CityInput ref={cityInputRef} prefectureParam={prefectures}>
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
            <Form.Item
              name="isBoardOfEducation"
              label={<FormLabel>教育委員会</FormLabel>}
              colon={false}
              labelCol={{ span: 24, className: 'mb-2' }}
              required
              rules={[
                {
                  required: true,
                  message: '',
                },
              ]}
              initialValue={IS_BOARD_EDUCATION_OPTIONS[0].value}
            >
              <Radio.Group options={IS_BOARD_EDUCATION_OPTIONS} />
            </Form.Item>
            <Form.Item
              name="organizationName"
              required
              label={<FormLabel>学校名</FormLabel>}
              labelCol={{ span: 24 }}
              className="max-w-[25rem]"
            >
              {isShowCityInput ? <Input /> : <SchoolInput />}
            </Form.Item>
            <Form.Item
              name="parentId"
              required
              label={<FormLabel>親団体</FormLabel>}
              labelCol={{ span: 24 }}
              style={{
                marginBottom: 0,
              }}
              className={isShowCityInput ? `max-w-[25rem]` : `max-w-[12.5rem]`}
              rules={[
                {
                  validator: (_, value) => {
                    if (!value && value !== null)
                      return Promise.reject(ErrorValidation.REQUIRED.message)
                    return Promise.resolve()
                  },
                },
              ]}
            >
              <Select
                notFoundContent={<Spin size="small" spinning />}
                options={parentOptions}
                suffixIcon={<AiFillCaretDown className="text-gray-black" />}
              />
            </Form.Item>
          </div>

          <ContactInformation detailCoordinator={detailCoordinator} />

          <div className="my-16 flex justify-center">
            <Form.Item shouldUpdate>
              {() => (
                <Button
                  type="primary"
                  htmlType="submit"
                  className="h-14 rounded-[30px] px-16"
                  disabled={
                    isDisabled ||
                    (!form.isFieldsTouched() && !detailCoordinator) ||
                    form.getFieldsError().some((item) => item.errors.length)
                  }
                >
                  {detailCoordinator ? '編集する' : '登録する'}
                </Button>
              )}
            </Form.Item>
          </div>
        </div>
        <div className="mb-[2.5rem] text-center">
          {detailCoordinator && (
            <button
              onClick={handleDelete}
              type="button"
              className="text-core-red underline"
            >
              このアカウントを削除する
            </button>
          )}
        </div>
      </Form>
    </>
  )
}

export default CreateEditCoordinatorPage

const ContactInformation = ({
  detailCoordinator,
}: {
  detailCoordinator: any
}) => {
  const form = Form.useFormInstance()

  React.useEffect(() => {
    if (!detailCoordinator) return
    form.setFieldValue('currentEmail', detailCoordinator?.email)
  }, [detailCoordinator])

  return (
    <>
      <div className="mt-10 bg-light-blue_light px-5 py-3">
        <Typography.Text className="font-bold text-core-blue">
          担当情報
        </Typography.Text>
      </div>
      <div className="bg-gray-white p-10">
        <Form.Item
          required
          label={<FormLabel>氏名</FormLabel>}
          labelCol={{ span: 24 }}
        >
          <div>
            <div className="max-w-[26rem] gap-4 sm:flex">
              <Form.Item
                name={['name', 'sei']}
                className="mb-4"
                rules={[
                  {
                    required: true,
                    message: ErrorValidation.REQUIRED.message,
                  },
                ]}
              >
                <Input />
              </Form.Item>
              <Form.Item
                name={['name', 'mei']}
                className="mb-4 lg:mb-0"
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
            <div className="max-w-[26rem] gap-4 sm:flex">
              <Form.Item
                name={['name', 'seiKana']}
                className="mb-4"
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
              >
                <InputKana />
              </Form.Item>
              <Form.Item
                name={['name', 'meiKana']}
                className="mb-0"
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
              >
                <InputKana />
              </Form.Item>
            </div>
          </div>
        </Form.Item>
        <Form.Item
          name="phoneNumber"
          required
          label={<FormLabel>電話番号</FormLabel>}
          labelCol={{ span: 24 }}
          className="mb-0"
          validateFirst
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
          <Input className="max-w-[15rem]" />
        </Form.Item>
        <span className="mb-10 inline-block text-[12px] text-gray-black">
          つながりやすい連絡先をご入力ください（ハイフン不要）
        </span>
        <Form.Item
          required={!detailCoordinator}
          label={<FormLabel>メールアドレス</FormLabel>}
          labelCol={{ span: 24 }}
          className="max-w-[25rem]"
        >
          <Form.Item name="currentEmail" hidden />
          <Form.Item
            className="mb-4"
            name="email"
            rules={[
              {
                required: true,
                message: ErrorValidation.REQUIRED.message,
              },
              {
                type: 'email',
                message: ErrorValidation.EMAIL.message,
              },
            ]}
          >
            <Input />
          </Form.Item>
          <Form.Item
            name="confirmEmail"
            className="mb-0"
            validateFirst
            rules={[
              {
                required: true,
                message: ErrorValidation.REQUIRED.message,
              },
              {
                validator: (_, value) =>
                  value === form.getFieldValue('email')
                    ? Promise.resolve()
                    : Promise.reject(ErrorValidation.EMAIL.message),
              },
            ]}
          >
            <Input />
          </Form.Item>
          <span className="text-[12px] text-gray-black">
            確認のためもう一度入力してください
          </span>
        </Form.Item>

        <Form.Item
          required={detailCoordinator ? false : true}
          labelCol={{ span: 24 }}
          label={<FormLabel>パスワード変更</FormLabel>}
          colon={false}
        >
          {detailCoordinator && (
            <Form.Item
              name="currentPassword"
              className="mb-2"
              label="現在のパスワード"
              labelCol={{
                span: 24,
                className: '!pb-0',
              }}
              colon={false}
              validateFirst
              rules={[
                {
                  required: !detailCoordinator,
                  message: ErrorValidation.REQUIRED.message,
                },
                {
                  pattern: ErrorValidation.PASSWORD.regex,
                  message: ErrorValidation.PASSWORD.message,
                },
              ]}
            >
              <Input.Password
                iconRender={(visible) =>
                  visible ? (
                    <BsFillEyeFill size={24} cursor="pointer" />
                  ) : (
                    <BsFillEyeSlashFill size={24} cursor="pointer" />
                  )
                }
                className="max-w-[25rem]"
              />
            </Form.Item>
          )}
          <Form.Item
            name="newPassword"
            className="mb-0"
            label={detailCoordinator ? '新しいパスワード' : 'パスワード'}
            labelCol={{
              span: 24,
              className: '!pb-0',
            }}
            colon={false}
            validateFirst
            rules={[
              {
                required: !detailCoordinator,
                message: ErrorValidation.REQUIRED.message,
              },
              {
                pattern: ErrorValidation.PASSWORD.regex,
                message: ErrorValidation.PASSWORD.message,
              },
            ]}
          >
            <Input.Password
              iconRender={(visible) =>
                visible ? (
                  <BsFillEyeFill size={24} cursor="pointer" />
                ) : (
                  <BsFillEyeSlashFill size={24} cursor="pointer" />
                )
              }
              className="max-w-[25rem]"
            />
          </Form.Item>
          <span className="text-[12px] text-gray-black">
            英数字8文字以上で入力してください
          </span>
          <Form.Item
            name="confirmNewPassword"
            className="mb-0 mt-2"
            label="パスワードの確認"
            labelCol={{
              span: 24,
              className: '!pb-0',
            }}
            colon={false}
            validateFirst
            rules={[
              {
                required: !detailCoordinator,
                message: ErrorValidation.REQUIRED.message,
              },
              {
                validator: (_, value) => {
                  const newPassword = form.getFieldValue('newPassword')
                  if (!newPassword) {
                    return Promise.resolve()
                  }

                  return value === newPassword
                    ? Promise.resolve()
                    : Promise.reject(ErrorValidation.PASSWORD.message)
                },
              },
            ]}
          >
            <Input.Password
              iconRender={(visible) =>
                visible ? (
                  <BsFillEyeFill size={24} cursor="pointer" />
                ) : (
                  <BsFillEyeSlashFill size={24} cursor="pointer" />
                )
              }
              className="max-w-[25rem]"
            />
          </Form.Item>
          <span className="text-[12px] text-gray-black">
            もう一度同じパスワードを入力してください
          </span>
        </Form.Item>
      </div>
    </>
  )
}

// const SAMPLE_ORGANIZATION_TYPE = [
//   {
//     label: '公的機関',
//     value: 1,
//   },
//   {
//     label: '学校',
//     value: 2,
//   },
//   {
//     label: 'その他',
//     value: 3,
//   },
// ]

// const SAMPLE_PREFECTURE = [
//   {
//     label: '北海道',
//     value: 'hokkaido',
//   },
//   {
//     label: '青森県',
//     value: 'aomori',
//   },
// ]

// const SAMPLE_DATA = [
//   {
//     label: '小学校',
//     value: 'elementary',
//   },
//   {
//     label: '中学校',
//     value: 'junior',
//   },
//   {
//     label: '高等学校',
//     value: 'high',
//   },
//   {
//     label: '中等教育学校',
//     value: 'secondary',
//   },
//   {
//     label: '高等専門学校',
//     value: 'technical',
//   },
//   {
//     label: '大学',
//     value: 'university',
//   },
//   {
//     label: 'クラブチーム',
//     value: 'club',
//   },
//   {
//     label: 'その他',
//     value: 'other',
//   },
// ]
