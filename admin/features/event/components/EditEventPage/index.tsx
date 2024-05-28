import {
  Form,
  Typography,
  Input,
  InputNumber,
  Button,
  Radio,
  Checkbox,
} from 'antd'
import React from 'react'
import { InputProps } from 'antd/lib/input'
import { AiOutlinePlus } from 'react-icons/ai'
import * as lodash from 'lodash'

import dayjs from 'dayjs'
import utc from 'dayjs/plugin/utc'
dayjs.extend(utc)

import FormLabel from '@/components/atoms/Form/Label'
import { ErrorValidation } from '@/constants/error'
import { getAddressFromZipCode } from '@/utils/common'
import InputKana from '@/components/atoms/InputKana'

import { GENDER_LIST_OPTIONS, REQUIRED_FIELDS } from '../../common'
import { Event } from '../../model/event.model'
import ModalSchoolName from './ModalSchoolName'
import ModalOfficeHours from './ModalOfficeHours'
import { daysOfWeekInJapanese } from '@/constants/datetime'

type EditEventPageProps = {
  detailEvent?: Event
  handleSubmit: (values: any) => void
}

const EditEventPage = ({ detailEvent, handleSubmit }: EditEventPageProps) => {
  const [form] = Form.useForm()
  const schoolName = Form.useWatch('schoolName', form)
  const timeForEachDay = Form.useWatch('timeForEachDay', form)
  const [offices, setOffices] = React.useState<any[]>([])
  const officeHours = Form.useWatch('officeHours', form)

  const [isOpenModalSchoolName, setIsOpenModalSchoolName] =
    React.useState<boolean>(false)
  const [isOpenModalOfficeHours, setIsOpenModalOfficeHours] =
    React.useState<boolean>(false)
  const [isDisabled, setIsDisabled] = React.useState<boolean>(true)
  const [isLoadingAddress, setIsLoadingAddress] = React.useState<boolean>(false)

  const handleGetAddress = (key: string) => async () => {
    setIsLoadingAddress(true)
    const zip = form.getFieldValue([key, 'zip'])
    try {
      const address = await getAddressFromZipCode(zip)
      form.setFields([
        {
          name: [key],
          value: {
            zip,
            prefecture: address?.address1,
            city: address?.address2,
            address1: address?.address3,
          },
        },
        {
          name: [key, 'zip'],
          errors: [],
        },
      ])
    } catch (error: any) {
      form.setFields([
        {
          name: [key],
          value: {
            zip,
            prefecture: '',
            city: '',
            address1: '',
          },
        },
        {
          name: [key, 'zip'],
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

      // if (key === 'workingHours') {
      //   const { note, ...hours } = value
      //   isValueFalsy = Object.entries(hours).every(
      //     ([key, hour]: any) => hour?.length === 0,
      //   )
      // }

      return isValueFalsy && REQUIRED_FIELDS.includes(key)
    })

    setIsDisabled(isDisabled)
  }

  React.useEffect(() => {
    if (!detailEvent) return

    form.setFieldsValue({
      ...detailEvent,
    })
    setOffices(detailEvent?.officeHours || [])
  }, [detailEvent])

  const handleDeleteOfficeHours = (index: number) => () => {
    const offs = officeHours.filter((office: any, idx: any) => idx !== index)
    setOffices(offs)
    form.setFieldValue('officeHours', offs)
  }

  const handleSubmitSchoolName = (value: string[]) => {
    form.setFieldValue('schoolName', value)
    setIsOpenModalSchoolName(false)
    setIsDisabled(false)
  }

  const handleSubmitModalOfficeHours = (value: any) => {
    const newOffice = {
      date: {
        seconds: dayjs(value.date).unix(),
      },
    }
    setOffices((prevState) => [...prevState, newOffice])
    form.setFieldValue('officeHours', [...(officeHours || []), newOffice])
    setIsOpenModalOfficeHours(false)
    setIsDisabled(false)
  }

  const handlePrevSubmit = (value: any) => {
    const onlyOneTime = value.timeForEachDay
    const currentOffices = value.officeHours || []
    const officeHoursUpdated = currentOffices.map((office: any, index: any) => {
      return {
        date: dayjs.unix(lodash.get(office, 'date.seconds')).utc(),
        start: {
          hour: onlyOneTime
            ? lodash.get(currentOffices, '[0].start.hour') || '00'
            : lodash.get(office, 'start.hour') || '00',
          min: onlyOneTime
            ? lodash.get(currentOffices, '[0].start.min') || '00'
            : lodash.get(office, 'start.min') || '00',
        },
        end: {
          hour: onlyOneTime
            ? lodash.get(currentOffices, '[0].end.hour') || '23'
            : lodash.get(office, 'end.hour') || '23',
          min: onlyOneTime
            ? lodash.get(currentOffices, '[0].end.min') || '59'
            : lodash.get(office, 'end.min') || '59',
        },
      }
    })

    handleSubmit({
      ...value,
      officeHours: officeHoursUpdated,
    })
  }

  return (
    <>
      <Typography.Title level={3} className="mb-8 text-center">
        募集依頼内容入力
      </Typography.Title>
      <Form
        form={form}
        requiredMark={false}
        onFinish={handlePrevSubmit}
        onValuesChange={handleValuesChange}
      >
        <div className="event-information">
          <div className="relative overflow-hidden rounded-xl">
            <div className="bg-light-blue_light px-5 py-3">
              <Typography.Text className="font-bold text-core-blue">
                イベント情報
              </Typography.Text>
            </div>
            <div className="bg-gray-white p-10">
              <div className="mb-10">
                <Form.Item
                  required
                  label={<FormLabel>タイトル</FormLabel>}
                  labelCol={{ span: 24 }}
                  name="title"
                  className="mb-0"
                  rules={[
                    {
                      required: true,
                      message: ErrorValidation.REQUIRED.message,
                    },
                  ]}
                >
                  <Input />
                </Form.Item>
                <span className="text-[12px] text-gray-black">
                  例）シティマラソンの運営スタッフ
                </span>
              </div>
              <div className="mb-10">
                <Form.Item
                  required
                  label={<FormLabel>主催団体</FormLabel>}
                  labelCol={{ span: 24 }}
                  name="organizer"
                  className="mb-0"
                  rules={[
                    {
                      required: true,
                      message: ErrorValidation.REQUIRED.message,
                    },
                  ]}
                >
                  <Input />
                </Form.Item>
                <span className="text-[12px] text-gray-black">
                  例）市民マラソン大会実行委員会
                </span>
              </div>
              <div>
                <Form.Item
                  required
                  label={<FormLabel>募集を申請する学校</FormLabel>}
                  labelCol={{ span: 24 }}
                  name="schoolName"
                >
                  <div>
                    <span>
                      {Array.isArray(schoolName)
                        ? schoolName.join('、')
                        : schoolName}
                    </span>
                    <Button
                      type="link"
                      className="mt-4 flex items-center justify-center gap-1 rounded-md border-core-sky py-3"
                      onClick={() => setIsOpenModalSchoolName(true)}
                    >
                      <span>学校を選択</span>
                    </Button>
                  </div>
                </Form.Item>
                <ModalSchoolName
                  currentSchoolName={schoolName}
                  open={isOpenModalSchoolName}
                  onCancel={() => setIsOpenModalSchoolName(false)}
                  handleOk={handleSubmitSchoolName}
                />
              </div>

              <Form.Item
                required
                label={<FormLabel>募集人数</FormLabel>}
                labelCol={{ span: 24 }}
                className="max-w-[25rem]"
              >
                <div className="relative">
                  <Form.Item
                    name="numberOfApplicants"
                    className="mb-0"
                    validateFirst
                    rules={[
                      {
                        required: true,
                        message: ErrorValidation.REQUIRED.message,
                      },
                      {
                        pattern: /\d+/,
                        message: '整数で入力してください',
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
                <span>
                  ※勤務地が複数ある場合は, 主要な場所を入力してください
                </span>
                <Form.Item
                  label="郵便番号"
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
                      onClick={handleGetAddress('workplace')}
                    >
                      郵便番号検索
                    </Button>
                  </div>
                </Form.Item>
                <Form.Item
                  colon={false}
                  labelCol={{
                    span: 24,
                    className: '!pb-0',
                  }}
                  className="mb-1 mt-2 max-w-[25rem]"
                  name="workplace"
                >
                  <WorkplaceInput disabled />
                </Form.Item>
                <span>郵便番号検索ができない場合は</span>
                <span className="inline-block cursor-pointer text-core-blue underline">
                  こちら
                </span>
              </Form.Item>
              <Form.Item
                required
                label={<FormLabel>勤務日時</FormLabel>}
                labelCol={{ span: 24 }}
                className="officeHours mb-0 mt-8"
              >
                <>
                  <div className="flex gap-6">
                    <Button
                      onClick={() => setIsOpenModalOfficeHours(true)}
                      type="link"
                      className="flex items-center justify-center gap-1 rounded-md border-core-sky py-3"
                    >
                      <AiOutlinePlus /> <span>日付を追加</span>
                    </Button>
                    <Form.Item
                      className="mb-0"
                      name="timeForEachDay"
                      valuePropName="checked"
                    >
                      <Checkbox>日ごとに時間を設定する</Checkbox>
                    </Form.Item>
                  </div>
                  {offices?.length ? (
                    <div className="mt-4 flex flex-col gap-2">
                      {offices?.map((officeHour: any, index: any) => (
                        <div key={index} className="flex items-center gap-3">
                          <span>
                            {dayjs
                              .unix(officeHour?.date?.seconds)
                              .utc()
                              .format('YYYY/MM/DD')}
                            (
                            {
                              daysOfWeekInJapanese[
                                dayjs
                                  .unix(officeHour?.date?.seconds)
                                  .utc()
                                  .day()
                              ]
                            }
                            )
                            <Form.Item
                              className="mb-0 hidden"
                              name={['officeHours', index, 'date', 'seconds']}
                            >
                              <InputNumber />
                            </Form.Item>
                          </span>
                          <div className="flex gap-2">
                            <div className="flex gap-2">
                              <Form.Item
                                className="mb-0"
                                rules={[
                                  {
                                    pattern:
                                      ErrorValidation.VALIDATE_NUMBER_HOUR
                                        .regex,
                                    message:
                                      ErrorValidation.VALIDATE_NUMBER_HOUR
                                        .message,
                                  },
                                ]}
                                name={['officeHours', index, 'start', 'hour']}
                              >
                                <Input
                                  className="w-16"
                                  disabled={timeForEachDay && index !== 0}
                                />
                              </Form.Item>
                              <span>:</span>
                              <Form.Item
                                className="mb-0"
                                rules={[
                                  {
                                    pattern:
                                      ErrorValidation.VALIDATE_NUMBER_MINUTE
                                        .regex,
                                    message:
                                      ErrorValidation.VALIDATE_NUMBER_MINUTE
                                        .message,
                                  },
                                ]}
                                name={['officeHours', index, 'start', 'min']}
                              >
                                <Input
                                  className="w-16"
                                  disabled={timeForEachDay && index !== 0}
                                />
                              </Form.Item>
                            </div>
                            <span>~</span>
                            <div className="flex gap-2">
                              <Form.Item
                                className="mb-0"
                                rules={[
                                  {
                                    pattern:
                                      ErrorValidation.VALIDATE_NUMBER_HOUR
                                        .regex,
                                    message:
                                      ErrorValidation.VALIDATE_NUMBER_HOUR
                                        .message,
                                  },
                                ]}
                                name={['officeHours', index, 'end', 'hour']}
                              >
                                <Input
                                  className="w-16"
                                  disabled={timeForEachDay && index !== 0}
                                />
                              </Form.Item>
                              <span>:</span>
                              <Form.Item
                                className="mb-0"
                                rules={[
                                  {
                                    pattern:
                                      ErrorValidation.VALIDATE_NUMBER_MINUTE
                                        .regex,
                                    message:
                                      ErrorValidation.VALIDATE_NUMBER_MINUTE
                                        .message,
                                  },
                                ]}
                                name={['officeHours', index, 'end', 'min']}
                              >
                                <Input
                                  className="w-16"
                                  disabled={timeForEachDay && index !== 0}
                                />
                              </Form.Item>
                            </div>
                          </div>
                          <Button
                            type="text"
                            className="text-core-red"
                            onClick={handleDeleteOfficeHours(index)}
                          >
                            削除
                          </Button>
                        </div>
                      ))}
                    </div>
                  ) : (
                    <></>
                  )}
                  <div className=" ml-6 mt-6 flex gap-6">
                    <FormLabel>補足</FormLabel>
                    <div className="flex-1">
                      <Form.Item
                        required
                        labelCol={{ span: 24 }}
                        className="mb-0"
                        name="officeHoursNote"
                      >
                        <Input.TextArea rows={4} />
                      </Form.Item>
                      <span>
                        勤務時間等について, 補足事項があればご記入ください
                      </span>
                    </div>
                  </div>
                </>
              </Form.Item>
              <ModalOfficeHours
                open={isOpenModalOfficeHours}
                isDisabledSelectTime={timeForEachDay && officeHours?.length}
                onCancel={() => setIsOpenModalOfficeHours(false)}
                handleOk={handleSubmitModalOfficeHours}
              />
              <div className="jobDescription mt-8">
                <Form.Item
                  required
                  label={<FormLabel>業務の内容</FormLabel>}
                  labelCol={{ span: 24 }}
                  className="mb-0"
                  name="jobDescription"
                >
                  <Input.TextArea rows={4} />
                </Form.Item>
                <span>例）受付・交通誘導など</span>
              </div>
            </div>
          </div>
        </div>

        <div className="desired-condition mt-10">
          <div className="relative overflow-hidden rounded-xl">
            <div className="bg-light-blue_light px-5 py-3">
              <Typography.Text className="font-bold text-core-blue">
                希望条件
              </Typography.Text>
            </div>
            <div className=" bg-gray-white p-10">
              <Form.Item
                required
                name="gender"
                label={<FormLabel>性別</FormLabel>}
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

              <div className="people mt-8">
                <Form.Item
                  label={<FormLabel>求める人材</FormLabel>}
                  labelCol={{ span: 24 }}
                  className="mb-0"
                  name="people"
                >
                  <Input.TextArea rows={4} />
                </Form.Item>
                <div className="flex flex-col">
                  <span>例1）体力に自信のある方</span>
                  <span>例2）イベントの裏側に興味のある方</span>
                </div>
              </div>

              <div className="salary mt-8">
                <Form.Item
                  required
                  label={<FormLabel>給与・報酬</FormLabel>}
                  labelCol={{ span: 24 }}
                  className="mb-0"
                  name="salary"
                >
                  <Input.TextArea rows={4} />
                </Form.Item>
                <span>例）時給○○円 / 日当○○円 / 保有資格により要相談</span>
              </div>

              <div className="note mt-8">
                <Form.Item
                  label={<FormLabel>備考</FormLabel>}
                  labelCol={{ span: 24 }}
                  className="mb-0"
                  name="note"
                >
                  <Input.TextArea rows={4} />
                </Form.Item>
                <span>
                  コーディネーターに伝えたいことがあればご記入ください
                </span>
              </div>
            </div>
          </div>
        </div>

        <div className="desired-condition mt-10">
          <div className="relative overflow-hidden rounded-xl">
            <div className="bg-light-blue_light px-5 py-3">
              <Typography.Text className="font-bold text-core-blue">
                基本情報
              </Typography.Text>
            </div>
            <div className=" bg-gray-white p-10">
              <Form.Item
                required
                label={<FormLabel>担当者名</FormLabel>}
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
                label={<FormLabel>役職</FormLabel>}
                labelCol={{ span: 24 }}
                className="mb-0 max-w-[25rem]"
                name="position"
              >
                <Input />
              </Form.Item>
              <Form.Item
                required
                label={<FormLabel>住所</FormLabel>}
                labelCol={{ span: 24 }}
                className="mb-0 mt-8"
              >
                <Form.Item
                  label="郵便番号"
                  labelCol={{ span: 24, className: '!pb-0' }}
                  className="mb-0"
                >
                  <div className="flex max-w-[272px] gap-4">
                    <Form.Item
                      noStyle
                      name={['address', 'zip']}
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
                      onClick={handleGetAddress('address')}
                    >
                      郵便番号検索
                    </Button>
                  </div>
                </Form.Item>
                <Form.Item
                  colon={false}
                  labelCol={{
                    span: 24,
                    className: '!pb-0',
                  }}
                  className="mb-1 mt-2 max-w-[25rem]"
                  name="address"
                >
                  <WorkplaceInput disabled />
                </Form.Item>
                <span>郵便番号検索ができない場合は</span>
                <span className="inline-block cursor-pointer text-core-blue underline">
                  こちら
                </span>
              </Form.Item>
              <div className="phone mt-8">
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
              </div>
              <Form.Item
                required
                label={<FormLabel>メールアドレス</FormLabel>}
                labelCol={{ span: 24 }}
                className="max-w-[25rem]"
              >
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
            </div>
          </div>
        </div>

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
                {detailEvent ? '編集する' : '登録する'}
              </Button>
            )}
          </Form.Item>
        </div>
      </Form>
    </>
  )
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

export default EditEventPage
