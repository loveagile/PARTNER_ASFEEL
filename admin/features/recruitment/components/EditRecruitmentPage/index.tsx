'use client'

import SchoolInput from '@/components/SchoolInput'
import FormLabel from '@/components/atoms/Form/Label'
import { DAY_OF_WEEK, GENDER_OPTIONS } from '@/constants/common'
import { ErrorValidation } from '@/constants/error'
import { filterOption, getAddressFromZipCode } from '@/utils/common'
import {
  Button,
  Checkbox,
  CheckboxProps,
  Col,
  Form,
  Input,
  InputNumber,
  InputProps,
  Radio,
  Row,
  Select,
  Typography,
} from 'antd'
import React from 'react'
import { AiFillCaretDown } from 'react-icons/ai'
import { BasicInformation } from './BasicInformation'
import { DesiredCondition } from './DesiredCondition'
import styles from './index.module.scss'
import {
  GENDER_LIST_OPTIONS,
  IS_PUBLISH_OPTIONS,
  RECRUITMENT_SCHOOL_OPTIONS,
  REQUIRED_FIELDS,
  TARGET_OPTIONS,
} from '../../common'
import Link from 'next/link'
import OrganizationSelect from '@/components/OrganizationSelect'

type EditRecruitmentPageProps = {
  detailRecruitment?: any
  clubTypeLargeOption?: any
  clubTypeOption?: any
  eventProjects?: any
  handleSubmit: (values: any) => void
}

const NOT_HAVE_SCHOOL_URL =
  'https://www.notion.so/844496564e0740e9b293f190f687836f?pvs=4'
const NOT_HAVE_APPLIED_FOR_PROJECT_URL =
  'https://www.notion.so/6671675aa8214572bd576cce99f7500d?pvs=4'
const NOT_HAVE_CATEGORY_URL =
  'https://www.notion.so/06ab7f25ea5c4c288a2f9fa8f21dd798?pvs=4'
const NOT_HAVE_WORKPLACE_URL =
  'https://www.notion.so/fd9c4a7ee83d427faa30b95b2ef3ecdc?pvs=4'

const EditRecruitmentPage = ({
  detailRecruitment,
  clubTypeLargeOption,
  clubTypeOption,
  eventProjects,
  handleSubmit,
}: EditRecruitmentPageProps) => {
  const [form] = Form.useForm()
  const type = Form.useWatch('type', form)
  const isSchool = type === RECRUITMENT_SCHOOL_OPTIONS[0].value
  const isJoinTeam = type === RECRUITMENT_SCHOOL_OPTIONS[1].value
  const isLocalClub = type === RECRUITMENT_SCHOOL_OPTIONS[2].value
  const [isDisabled, setIsDisabled] = React.useState<boolean>(true)
  const [isLoadingAddress, setIsLoadingAddress] = React.useState<boolean>(false)

  const handleGetAddress = async () => {
    setIsLoadingAddress(true)
    const zip = form.getFieldValue(['workplace', 'zip'])
    try {
      const address = await getAddressFromZipCode(zip)
      form.setFields([
        {
          name: ['workplace'],
          value: {
            zip,
            prefecture: address?.address1,
            city: address?.address2,
            address1: address?.address3,
          },
        },
        {
          name: ['workplace', 'zip'],
          errors: [],
        },
      ])
    } catch (error: any) {
      form.setFields([
        {
          name: ['workplace'],
          value: {
            zip,
            prefecture: '',
            city: '',
            address1: '',
          },
        },
        {
          name: ['workplace', 'zip'],
          errors: [error?.message || ''],
        },
      ])
    }
    setIsLoadingAddress(false)
  }

  const handleValuesChange = (changedValues: any, values: any) => {
    const isDisabled = Object.entries(values).some(([key, value]: any) => {
      let isValueFalsy = !value

      if (key === 'workplace') {
        isValueFalsy = Object.values(value).some((item) => !item)
      }

      if (key === 'workingHours') {
        const { note, ...hours } = value
        isValueFalsy = Object.entries(hours).every(
          ([key, hour]: any) => hour?.length === 0,
        )
      }

      return isValueFalsy && REQUIRED_FIELDS.includes(key)
    })

    setIsDisabled(isDisabled)
  }

  React.useEffect(() => {
    if (!detailRecruitment) return
    form.setFieldsValue({
      ...detailRecruitment,
      recruitment: Number(detailRecruitment?.recruitment) || 0,
    })
  }, [detailRecruitment])

  return (
    <>
      <Typography.Title level={3} className="mb-8 text-center">
        募集依頼内容編集
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
              学校・チーム情報
            </Typography.Text>
          </div>
          <div className="bg-gray-white p-10">
            <Form.Item
              name="isPublish"
              className="absolute right-10 z-10 h-[1.75rem] w-[6.25rem]"
              initialValue={IS_PUBLISH_OPTIONS[0].value}
            >
              <Select
                options={IS_PUBLISH_OPTIONS}
                suffixIcon={<AiFillCaretDown className="text-gray-black" />}
                className="select_filter select_status"
                popupClassName="select_filter_popup"
              />
            </Form.Item>
            <Form.Item
              name="type"
              label={<FormLabel>区分</FormLabel>}
              rules={[
                {
                  required: true,
                  message: ErrorValidation.REQUIRED.message,
                },
              ]}
              labelCol={{ span: 24 }}
              initialValue={RECRUITMENT_SCHOOL_OPTIONS[0].value}
              className="mb-4"
            >
              <Radio.Group options={RECRUITMENT_SCHOOL_OPTIONS} />
            </Form.Item>
            {(isJoinTeam || isLocalClub) && (
              <Form.Item
                name="target"
                label={<FormLabel>対象</FormLabel>}
                labelCol={{ span: 24, className: '!pb-0' }}
                className="mb-4"
              >
                <Checkbox.Group>
                  {TARGET_OPTIONS.map(({ label, value }) => (
                    <CheckBoxDarker
                      key={value}
                      value={value}
                      className="rounded px-4 py-[6px]"
                    >
                      <span className="inline-block w-[90px] text-center">
                        {label}
                      </span>
                    </CheckBoxDarker>
                  ))}
                </Checkbox.Group>
              </Form.Item>
            )}

            <Form.Item
              name="organizationName"
              className="mb-0 max-w-[25rem]"
              rules={[
                {
                  required: true,
                  message: ErrorValidation.REQUIRED.message,
                },
              ]}
            >
              {isSchool ? <SchoolInput /> : <Input />}
            </Form.Item>
            <span className="mb-10 inline-block">
              {isSchool && (
                <>
                  <span>当てはまる学校が無い場合は</span>
                  <Link href={NOT_HAVE_SCHOOL_URL}>
                    <span className="cursor-pointer text-core-blue underline">
                      こちら
                    </span>
                  </Link>
                </>
              )}
              {isJoinTeam && <span>合同チームの名称を入力してください</span>}
              {isLocalClub && <span>地域クラブの名称を入力してください</span>}
            </span>

            <Form.Item
              name="applyForProject"
              label={<FormLabel>募集申請先</FormLabel>}
              rules={[
                {
                  required: true,
                  message: ErrorValidation.REQUIRED.message,
                },
              ]}
              labelCol={{ span: 24 }}
              className="mb-0 max-w-[25rem]"
            >
              <OrganizationSelect />
            </Form.Item>
            <span>募集申請先が無い場合は</span>
            <Link href={NOT_HAVE_APPLIED_FOR_PROJECT_URL}>
              <span className="mb-12 inline-block cursor-pointer text-core-blue underline">
                こちら
              </span>
            </Link>
            <Form.Item
              required
              label={<FormLabel>種目</FormLabel>}
              labelCol={{ span: 24 }}
              className="mb-0 max-w-[25rem]"
            >
              <Form.Item
                name="eventType"
                label="部活タイプ"
                labelCol={{ span: 24, className: '!pb-0' }}
                className="mb-0 max-w-[200px]"
              >
                <Select
                  options={clubTypeLargeOption}
                  suffixIcon={<AiFillCaretDown className="text-gray-black" />}
                />
              </Form.Item>
              <Form.Item
                name="eventName"
                label="種目"
                labelCol={{ span: 24, className: '!pb-0' }}
                className="mb-0 mt-2 max-w-[200px]"
              >
                <Select
                  showSearch
                  filterOption={filterOption}
                  options={clubTypeOption}
                  suffixIcon={<AiFillCaretDown className="text-gray-black" />}
                />
              </Form.Item>
              <span>当てはまる種目が無い場合は</span>
              <Link href={NOT_HAVE_CATEGORY_URL}>
                <span className="mb-4 inline-block cursor-pointer text-core-blue underline">
                  こちら
                </span>
              </Link>
            </Form.Item>
            <Form.Item
              name="gender"
              label="男女区分"
              labelCol={{ span: 24 }}
              rules={[
                {
                  required: true,
                  message: ErrorValidation.REQUIRED.message,
                },
              ]}
            >
              <Radio.Group options={GENDER_LIST_OPTIONS} />
            </Form.Item>
            <Form.Item
              required
              label={<FormLabel>募集人数</FormLabel>}
              labelCol={{ span: 24 }}
              className="max-w-[25rem]"
            >
              <div className="relative">
                <Form.Item
                  name="recruitment"
                  className="mb-0"
                  validateFirst
                  rules={[
                    {
                      required: true,
                      message: ErrorValidation.REQUIRED.message,
                    },
                    {
                      validator(rule, value) {
                        if (!Number.isInteger(value))
                          return Promise.reject('整数で入力してください')

                        return value > 0 && value < 1000
                          ? Promise.resolve()
                          : Promise.reject('1~999の範囲で入力してください')
                      },
                    },
                  ]}
                >
                  <InputNumber />
                </Form.Item>
                <span className="absolute left-[100px] top-3">名</span>
              </div>
            </Form.Item>

            <Form.Item
              required
              label={<FormLabel>主な勤務地</FormLabel>}
              labelCol={{ span: 24 }}
              className="mb-0"
            >
              <div>
                <span className="relative top-[-8px]">
                  ※勤務地が複数ある場合は, 主要な場所を入力してください
                </span>
                <Form.Item
                  label="郵便番号（ハイフン不要）"
                  labelCol={{ span: 24, className: '!pb-0' }}
                  className="mb-0"
                >
                  <div className="flex max-w-[272px] gap-4">
                    <Form.Item
                      noStyle
                      name={['workplace', 'zip']}
                      validateFirst
                      rules={[
                        {
                          required: true,
                          message: ErrorValidation.REQUIRED.message,
                        },
                        {
                          validator: (rule, value) => {
                            if (!value) return Promise.resolve()

                            if (value?.toString().length !== 7) {
                              console.log('value', value)
                              return Promise.reject(
                                ErrorValidation.NUMBER_LENGTH_INVALID.message(
                                  7,
                                ),
                              )
                            }

                            return Promise.resolve()
                          },
                        },
                        {
                          pattern: ErrorValidation.NUMBER_ONLY.regex,
                          message:
                            ErrorValidation.NUMBER_LENGTH_INVALID.message(7),
                        },
                      ]}
                    >
                      <Input />
                    </Form.Item>
                    <Button
                      disabled={isLoadingAddress}
                      type="primary"
                      className="h-[34px]"
                      onClick={handleGetAddress}
                    >
                      郵便番号検索
                    </Button>
                  </div>
                  <span>郵便番号検索ができない場合は</span>
                  <Link href={NOT_HAVE_WORKPLACE_URL}>
                    <span className="inline-block cursor-pointer text-core-blue underline">
                      こちら
                    </span>
                  </Link>
                </Form.Item>
                <Form.Item
                  label="住所"
                  colon={false}
                  labelCol={{
                    span: 24,
                    className: '!pb-0',
                  }}
                  className="mt-2 max-w-[25rem]"
                  name="workplace"
                >
                  <WorkplaceInput disabled />
                </Form.Item>
                <Form.Item
                  required
                  name="workingHours"
                  label={<FormLabel>勤務時間</FormLabel>}
                  className="mb-0"
                  colon={false}
                  labelCol={{
                    span: 24,
                    className: '!pb-4',
                  }}
                >
                  <WorkingHoursInput />
                </Form.Item>
                <Form.Item
                  name={['workingHours', 'note']}
                  label={<FormLabel>補足</FormLabel>}
                  colon={false}
                  className="mb-0 ml-5"
                >
                  <Input.TextArea className="!min-h-[90px]" />
                </Form.Item>
                <span className="mb-10 ml-14 inline-block">
                  勤務時間等について, 補足事項があればご記入ください
                </span>
                <Form.Item
                  required
                  label={<FormLabel>活動の紹介</FormLabel>}
                  colon={false}
                  labelCol={{
                    span: 24,
                    className: '!pb-0',
                  }}
                  className="mb-0"
                  name="activityDescription"
                >
                  <Input.TextArea className="!min-h-[90px]" />
                </Form.Item>
                <span>
                  例1）県大会ベスト4以上の実績があり全国大会を目指しています
                </span>
                <br />
                <span>
                  例2）初心者中心で部員数も少ないですが楽しみながら頑張っています
                </span>
              </div>
            </Form.Item>
          </div>
        </div>

        <DesiredCondition />
        <BasicInformation />

        <div className="my-16 flex justify-center">
          <Form.Item noStyle shouldUpdate>
            {() => (
              <Button
                type="primary"
                htmlType="submit"
                className="h-14 rounded-[30px] px-16"
                disabled={
                  isDisabled ||
                  !form.isFieldsTouched() ||
                  form.getFieldsError().some((item) => item.errors.length)
                }
              >
                {detailRecruitment ? '編集する' : '登録する'}
              </Button>
            )}
          </Form.Item>
        </div>
      </Form>
    </>
  )
}

type WorkingHoursInputProps = {
  value?: { [key: string]: ('am' | 'pm')[] }
  onChange?: (value: any) => void
}

const WorkingHoursInput = ({ value, onChange }: WorkingHoursInputProps) => {
  const [workingHours, setWorkingHours] = React.useState<any>(value)

  const handleChange = (key: string, valueHour: string, isChecked: boolean) => {
    const newWorkingHours = {
      ...workingHours,
      [key]: isChecked
        ? [...(workingHours?.[key] || []), valueHour]
        : workingHours?.[key]?.filter((item: string) => item !== valueHour),
    }

    setWorkingHours(newWorkingHours)
    onChange?.(newWorkingHours)
  }

  React.useEffect(() => {
    if (!value) return
    setWorkingHours(value)
  }, [value])

  return (
    <div>
      {DAY_OF_WEEK.map(({ label, value: key }, index) => {
        return (
          <Row gutter={16} className="mb-4 gap-10" key={key}>
            <Col>
              <span className="ml-5 text-h4">{label}</span>
            </Col>
            <Col>
              <CheckBoxDarker
                className="rounded py-[6px] pl-4"
                checked={workingHours?.[key]?.includes('am')}
                onChange={(e) => handleChange(key, 'am', e.target.checked)}
              >
                <span className="pe-9 ps-9">午 前</span>
              </CheckBoxDarker>
            </Col>
            <Col>
              <CheckBoxDarker
                className="rounded py-[6px] pl-4"
                checked={workingHours?.[key]?.includes('pm')}
                onChange={(e) => handleChange(key, 'pm', e.target.checked)}
              >
                <span className="pe-9 ps-9">午 後</span>
              </CheckBoxDarker>
            </Col>
          </Row>
        )
      })}
    </div>
  )
}

export const CheckBoxDarker = (props: CheckboxProps) => {
  const className = `bg-gray-gray_lighter ${styles.check_box_darker} ${props.className}`
  return <Checkbox {...props} className={className} />
}

type WorkplaceInputProps = {
  value?: any
  onChange?: (value: any) => void
} & InputProps

const WorkplaceInput = ({ value, onChange, ...props }: WorkplaceInputProps) => {
  const displayValue = `${value?.prefecture || ''}${value?.city || ''}${
    value?.address1 || ''
  }`
  return <Input value={displayValue} onChange={onChange} {...props} />
}

export default EditRecruitmentPage
