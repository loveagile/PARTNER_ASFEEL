'use client'

import {
  Button,
  Checkbox,
  DatePicker,
  Form,
  FormInstance,
  Input,
  Radio,
  Select,
  Typography,
} from 'antd'
import dayjs from 'dayjs'
import utc from 'dayjs/plugin/utc'
import lodash from 'lodash'
import React, { useEffect } from 'react'
import { AiFillCaretDown, AiOutlinePlus } from 'react-icons/ai'
import { MdModeEditOutline } from 'react-icons/md'
dayjs.extend(utc)

import FormItem from '@/components/atoms/Form/FormItem'
import FormLabel from '@/components/atoms/Form/Label'
import InputKana from '@/components/atoms/InputKana'
import InputNumber from '@/components/atoms/InputNumber'
import PrefectureInput from '@/components/atoms/PrefectureInput'
import { API_ROUTES } from '@/constants/common'
import { ErrorValidation } from '@/constants/error'
import { customFetchUtils, getAddressFromZipCode } from '@/utils/common'

import { Prefecture } from '@/constants/model'
import { getClubTypeMedium, getClubTypes } from '@/libs/firebase/firestore'
import {
  ICity,
  IClubTypes,
  RegistrantDetail,
} from '../../models/registrant.model'
import ModelAreas from './ModalAreas'
import ModalCareer, { CareerDetail } from './ModalCareer'
import ModelClubTypes from './ModalClubTypes'
import ModalOrganizationSelect from './ModalOrganizationSelect'

type EditRegistrantPageProps = {
  form: FormInstance<any>
  detailRegistrant: RegistrantDetail
  handleSubmit: (values: any) => void
  handleDelete?: () => void
  prefectures: Prefecture[]
  clubTypesLarge: any[]
  handleCancel: () => void
  setIsLoading?: React.Dispatch<React.SetStateAction<boolean>>
}

const EditRegistrantPage = ({
  form,
  handleSubmit,
  handleDelete,
  detailRegistrant,
  prefectures = [],
  clubTypesLarge,
  handleCancel,
  setIsLoading,
}: EditRegistrantPageProps) => {
  const STATUS_ACCOUNT_OPTIONS = [
    {
      label: '利用停止',
      value: true,
    },
    {
      label: '利用中',
      value: false,
    },
  ]
  const GENDER_OPTIONS = [
    { label: '男性', value: 'male' },
    { label: '女性', value: 'female' },
    { label: '回答しない', value: 'other' },
  ]

  const OCCUPATION_UNIVERSITY_STUDENT = '大学生'

  const OCCUPATION_OPTIONS = [
    { label: '大学生', value: '大学生' },
    { label: '会社員', value: '会社員' },
    { label: '自営業/個人事業', value: '自営業/個人事業' },
    { label: 'その他', value: 'その他' },
    { label: '教員', value: '教員' },
    { label: '公務員（教員以外）', value: '公務員（教員以外）' },
    { label: '専業主婦(夫)', value: '専業主婦(夫)' },
  ]
  const GRADE_OPTIONS = [
    { label: '1年生', value: '1' },
    { label: '2年生', value: '2' },
    { label: '3年生', value: '3' },
    { label: '4年生', value: '4' },
    { label: '5年生', value: '5' },
    { label: '6年生', value: '6' },
  ]
  const OFFICE_HOURS_OPTIONS = [
    { label: '午 前', value: 'am' },
    { label: '午 後', value: 'pm' },
  ]
  const OFFICE_HOURS_KEYS = [
    { value: 'monday', label: '月' },
    { value: 'tuesday', label: '火' },
    { value: 'wednesday', label: '水' },
    { value: 'thursday', label: '木' },
    { value: 'friday', label: '金' },
    { value: 'saturday', label: '土' },
    { value: 'sunday', label: '日' },
  ]
  const IS_EXPEDITION_POSSIBLE_OPTIONS = [
    { value: 'possible', label: '可' },
    { value: 'notPossible', label: '不可' },
    { value: 'negotiable', label: '要相談' },
  ]
  const EXPERIENCE_OPTIONS = [
    { value: true, label: 'あり' },
    { value: false, label: 'なし' },
  ]
  const TEACHER_LICENSE_OPTIONS = [
    { value: 'having', label: 'あり' },
    { value: 'nothing', label: 'なし' },
    { value: 'scheduledAcquisition', label: '取得予定' },
  ]
  const OTHER_LICENSE_OPTIONS = [
    { value: true, label: 'あり' },
    { value: false, label: 'なし' },
  ]
  const DRIVER_LICENSE_OPTIONS = [
    { value: true, label: 'あり' },
    { value: false, label: 'なし' },
  ]

  const [isSearchZipCode, setIsSearchZipCode] = React.useState(false)
  const zipCode = Form.useWatch(['address', 'zip'], form)
  const [questionsForPrefecture, setQuestionsForPrefecture] = React.useState<
    any[]
  >([])
  const [careers, setCareers] = React.useState<CareerDetail[]>([])
  const [isSelectOrganization, setIsSelectOrganization] =
    React.useState<boolean>(false)
  const [careerDetail, setCareerDetail] = React.useState<
    CareerDetail | 'created' | null
  >(null)
  const [isOpenModalClubTypes, setIsOpenModalClubTypes] =
    React.useState<boolean>(false)
  const [currentClubTypes, setCurrentClubTypes] = React.useState<IClubTypes[]>(
    [],
  )
  const [clubShow, setClubShow] = React.useState<Record<string, string[]>>({})

  const [isOpenModalAreasOfActivity, setIsOpenModalAreasOfActivity] =
    React.useState<boolean>(false)
  const [currentAreasOfActivity, setCurrentAreasOfActivity] = React.useState<
    ICity[]
  >([])
  const [areasOfActivityShow, setAreasOfActivityShow] = React.useState<
    Record<string, string[]>
  >({})

  const occupationType = Form.useWatch(['occupation', 'type'], form)

  useEffect(() => {
    if (
      occupationType === OCCUPATION_UNIVERSITY_STUDENT &&
      isSelectOrganization !== true
    ) {
      // form.setFieldValue(['occupation', 'organization'], undefined)
      setIsSelectOrganization(true)
    }
    if (
      occupationType !== OCCUPATION_UNIVERSITY_STUDENT &&
      isSelectOrganization !== false
    )
      setIsSelectOrganization(false)
  }, [occupationType])

  const [areas, setAreas] = React.useState<any[]>([])
  const [cities, setCities] = React.useState<any[]>([])
  const [clubTypes, setClubTypes] = React.useState<any[]>([])
  const [clubTypesMedium, setClubTypesMedium] = React.useState<any[]>([])

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

  const prefecturesOption = React.useMemo(
    () =>
      prefectures.map((prefecture) => ({
        label: prefecture.prefecture,
        value: prefecture.prefecture,
      })),
    [prefectures],
  )

  React.useEffect(() => {
    if (!detailRegistrant) return

    if (
      detailRegistrant.questionsForPrefecture &&
      detailRegistrant.questionsForPrefecture.length
    ) {
      setQuestionsForPrefecture(detailRegistrant.questionsForPrefecture)
    }

    if (detailRegistrant.clubs && detailRegistrant.clubs.length) {
      setCurrentClubTypes(detailRegistrant.clubs)
      const show: Record<string, string[]> = {}
      const largeConvert: Record<string, string> = {}
      clubTypesLarge.forEach((large) => {
        largeConvert[large.id] = large.name
        show[large.name] = []
      })
      detailRegistrant.clubs.forEach((club) => {
        show[largeConvert[club.largeCategory]].push(club.name)
      })

      setClubShow(show)
    }

    if (
      detailRegistrant.areasOfActivity &&
      detailRegistrant.areasOfActivity.length
    ) {
      setCurrentAreasOfActivity(detailRegistrant.areasOfActivity)
      const show: Record<string, string[]> = {}
      const prefectureConvert: Record<string, string> = {}
      prefectures.forEach((prefecture) => {
        prefectureConvert[prefecture.id!] = prefecture.prefecture
        show[prefecture.prefecture] = []
      })
      detailRegistrant.areasOfActivity.forEach((city) => {
        show[prefectureConvert[city.prefecture]]?.push(city.city)
      })

      setAreasOfActivityShow(show)
    }

    if (detailRegistrant.career && detailRegistrant.career.length) {
      setCareers(
        detailRegistrant.career.map((career) => {
          return {
            organizationName: career.organizationName,
            termOfStart: dayjs.unix(career.termOfStart.seconds).utc(),
            termOfEnd: dayjs.unix(career.termOfEnd.seconds).utc(),
          }
        }),
      )
    }

    delete detailRegistrant.confirmEmail
    form.setFieldsValue({
      ...detailRegistrant,
      birthday: detailRegistrant?.birthday?.seconds
        ? dayjs.unix(detailRegistrant.birthday.seconds).utc()
        : undefined,
      confirmEmail: detailRegistrant.email,
    })
  }, [detailRegistrant])

  const handleModalClubTypeSubmit = (
    values: IClubTypes[],
    show: Record<string, string[]>,
  ) => {
    setCurrentClubTypes(values)
    setClubShow(show)
  }

  const handlePreSubmit = (values: any) => {
    delete values.careers
    delete values.confirmEmail

    handleSubmit({
      ...values,
      career: careers,
      clubs: currentClubTypes.map((currentCT) => currentCT.id),
      areasOfActivity: currentAreasOfActivity.map(
        (currentAre) => currentAre.id,
      ),
    })
  }
  const handleModalAreasOfActivitySubmit = (
    values: ICity[],
    show: Record<string, string[]>,
  ) => {
    setCurrentAreasOfActivity(values)
    setAreasOfActivityShow(show)
  }

  const handleOpenModalAreasOfActivity = async () => {
    try {
      setIsLoading && setIsLoading(true)
      const promiseAll: any[] = []

      promiseAll.push(
        !areas.length
          ? customFetchUtils(API_ROUTES.ADDRESS.areas).then((res) => res.json())
          : null,
      )

      promiseAll.push(
        !cities.length
          ? customFetchUtils(API_ROUTES.ADDRESS.cities).then((res) =>
              res.json(),
            )
          : null,
      )

      const [resAreas, resCities] = await Promise.all(promiseAll)

      resAreas && resAreas.length && setAreas(resAreas)
      resCities && resCities.length && setCities(resCities)
      setIsOpenModalAreasOfActivity(true)
    } finally {
      setIsLoading && setIsLoading(false)
    }
  }

  const handleOpenModalClubTypes = async () => {
    try {
      setIsLoading && setIsLoading(true)
      const promiseAll: any[] = []

      promiseAll.push(!clubTypesMedium.length ? getClubTypeMedium() : null)

      promiseAll.push(!clubTypes.length ? getClubTypes() : null)

      const [resClubTypesMedium, resClubTypes] = await Promise.all(promiseAll)

      resClubTypesMedium &&
        resClubTypesMedium.length &&
        setClubTypesMedium(resClubTypesMedium)
      resClubTypes && resClubTypes.length && setClubTypes(resClubTypes)
      setIsOpenModalClubTypes(true)
    } finally {
      setIsLoading && setIsLoading(false)
    }
  }

  const handleValuesChange = async (changedValues: any, values: any) => {
    if (changedValues?.email || values?.confirmEmail) {
      await form.validateFields(['confirmEmail'])
    }
  }

  return (
    <>
      <Typography.Title level={3} className="mb-8 text-center">
        登録者内容編集
      </Typography.Title>
      <Form
        form={form}
        requiredMark={false}
        onFinish={handlePreSubmit}
        onValuesChange={handleValuesChange}
      >
        <div className="basic-information">
          <div className="relative overflow-hidden rounded-xl">
            <div className="bg-light-blue_light px-5 py-3">
              <Typography.Text className="font-bold text-core-blue">
                基本情報
              </Typography.Text>
            </div>
            <div className="bg-gray-white p-10">
              <Form.Item
                name="isSuspended"
                className="absolute right-10 z-10 h-[1.75rem] w-[6.25rem]"
              >
                <Select
                  options={STATUS_ACCOUNT_OPTIONS}
                  suffixIcon={<AiFillCaretDown className="text-gray-black" />}
                  className="select_filter select_status"
                  popupClassName="select_filter_popup"
                />
              </Form.Item>
              <Form.Item
                required
                label={<FormLabel>登録者名</FormLabel>}
                labelCol={{ span: 24 }}
                className="basic-name"
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
                      className="mb-4 md:mb-0"
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
                required
                label={<FormLabel>性別</FormLabel>}
                labelCol={{ span: 24 }}
                name="gender"
                rules={[
                  {
                    required: true,
                    message: ErrorValidation.REQUIRED.message,
                  },
                ]}
              >
                <Radio.Group>
                  {GENDER_OPTIONS.map((option) => (
                    <Radio key={option.value} value={option.value}>
                      {option.label}
                    </Radio>
                  ))}
                </Radio.Group>
              </Form.Item>
              <Form.Item
                required
                label={<FormLabel>職業</FormLabel>}
                labelCol={{ span: 24 }}
                className="basic-occupation max-w-[25rem]"
              >
                <div>
                  <span className="text-[12px] text-gray-black">職種</span>
                  <Form.Item
                    name={['occupation', 'type']}
                    className="mb-4"
                    rules={[
                      {
                        required: true,
                        message: ErrorValidation.REQUIRED.message,
                      },
                    ]}
                  >
                    <Select
                      options={OCCUPATION_OPTIONS}
                      suffixIcon={
                        <AiFillCaretDown className="text-gray-black" />
                      }
                    />
                  </Form.Item>
                </div>
                <div>
                  <span className="text-[12px] text-gray-black">所属名</span>
                  <Form.Item
                    name={['occupation', 'organization']}
                    className="mb-4"
                    rules={[
                      {
                        required: isSelectOrganization,
                        message: ErrorValidation.REQUIRED.message,
                      },
                    ]}
                  >
                    {isSelectOrganization ? (
                      <ModalOrganizationSelect prefecture={prefecturesOption} />
                    ) : (
                      <Input />
                    )}
                  </Form.Item>
                </div>
                <div>
                  <span className="text-[12px] text-gray-black">学部</span>
                  <Form.Item name={['occupation', 'faculty']} className="mb-4">
                    <Input />
                  </Form.Item>
                </div>
                <div>
                  <span className="text-[12px] text-gray-black">学年</span>
                  <Form.Item name={['occupation', 'grade']} className="mb-4">
                    <Select
                      options={GRADE_OPTIONS}
                      suffixIcon={
                        <AiFillCaretDown className="text-gray-black" />
                      }
                    />
                  </Form.Item>
                </div>
              </Form.Item>
              <div className="mb-10">
                <Form.Item
                  required
                  label={<FormLabel>電話番号</FormLabel>}
                  labelCol={{ span: 24 }}
                  name="phoneNumber"
                  className="mb-0 max-w-[15rem]"
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
                  <InputNumber />
                </Form.Item>
                <span className="text-[12px] text-gray-black">
                  つながりやすい連絡先をご入力ください（ハイフン不要）
                </span>
              </div>
              <Form.Item
                label={
                  <FormLabel className="text-core-blue">生年月日</FormLabel>
                }
                labelCol={{ span: 24 }}
                name="birthday"
                className="max-w-[25rem]"
              >
                <DatePicker format={'YYYY/MM/DD'} />
              </Form.Item>
              <div>
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
                          message:
                            ErrorValidation.NUMBER_LENGTH_INVALID.message(7),
                        },
                        {
                          required: true,
                          message: ErrorValidation.REQUIRED.message,
                        },
                        {
                          max: 7,
                          message:
                            ErrorValidation.NUMBER_LENGTH_INVALID.message(7),
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
                      message:
                        ErrorValidation.CHARACTER_LENGTH_INVALID.message(20),
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
                      max: 20,
                      message:
                        ErrorValidation.CHARACTER_LENGTH_INVALID.message(20),
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
                      message:
                        ErrorValidation.CHARACTER_LENGTH_INVALID.message(50),
                    },
                  ]}
                >
                  <Input placeholder="建物名・部屋番号" />
                </FormItem>
              </div>
              <Form.Item
                required
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
                  className="mb-0"
                  name="confirmEmail"
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
        <div className="skills-conditions-information mt-10">
          <div className="relative overflow-hidden rounded-xl">
            <div className="bg-light-blue_light px-5 py-3">
              <Typography.Text className="font-bold text-core-blue">
                基本情報
              </Typography.Text>
            </div>
            <div className=" bg-gray-white p-10">
              <div className="clubType">
                <div className="clubType-title flex gap-2">
                  <Typography.Title level={5} className="!text-core-blue">
                    指導できる種目
                  </Typography.Title>
                  <span className="text-gray-black">(複数可)</span>
                </div>
                <div className="clubType-caption mb-2 text-xs font-bold text-gray-black">
                  運動系・文化系で可能な種目をすべて登録してください
                </div>
                {clubShow &&
                  Object.values(clubShow).some(
                    (listCt) => listCt && listCt.length,
                  ) && (
                    <div className="clubType-content mb-3 rounded-xl border-gray-gray_dark bg-gray-gray_lighter px-5 py-3 text-gray-black">
                      {Object.keys(clubShow).map((ctLarge) =>
                        clubShow[ctLarge].length ? (
                          <div
                            key={ctLarge}
                            className="clubType-item flex gap-1"
                          >
                            <span className="clubType-item--key text-inherit">
                              {ctLarge}
                            </span>
                            <span>:</span>
                            <span className="clubType-item--value text-inherit">
                              {clubShow[ctLarge].join(',')}
                            </span>
                          </div>
                        ) : (
                          <></>
                        ),
                      )}
                    </div>
                  )}
                <Button
                  type="link"
                  className="flex w-full items-center justify-center gap-2 rounded-2xl border-core-sky py-3"
                  onClick={handleOpenModalClubTypes}
                >
                  <AiOutlinePlus /> <span>種目を追加</span>
                </Button>
                <ModelClubTypes
                  open={isOpenModalClubTypes}
                  onCancel={() => setIsOpenModalClubTypes(false)}
                  clubTypes={clubTypes}
                  clubTypesMedium={clubTypesMedium}
                  clubTypesLarge={clubTypesLarge}
                  handleOk={handleModalClubTypeSubmit}
                  currentClubTypes={currentClubTypes}
                />
              </div>
              <div className="areas mt-8">
                <div className="areas-title flex gap-2">
                  <Typography.Title level={5} className="!text-core-blue">
                    指導できる地域
                  </Typography.Title>
                  <span className="text-gray-black">(複数可)</span>
                </div>
                <div className="areas-caption mb-2 text-xs font-bold text-gray-black">
                  都道府県をまたいで複数登録できます
                </div>
                {areasOfActivityShow &&
                  Object.values(areasOfActivityShow).some(
                    (listArea) => listArea && listArea.length,
                  ) && (
                    <div className="areas-content mb-3 rounded-xl border-gray-gray_dark bg-gray-gray_lighter px-5 py-3 text-gray-black">
                      {Object.keys(areasOfActivityShow).map((prefectureKey) =>
                        areasOfActivityShow[prefectureKey].length ? (
                          <div
                            key={prefectureKey}
                            className="areas-item flex gap-1"
                          >
                            <span className="areas-item--key text-inherit">
                              {prefectureKey}
                            </span>
                            <span>:</span>
                            <span className="areas-item--value text-inherit">
                              {areasOfActivityShow[prefectureKey].join(',')}
                            </span>
                          </div>
                        ) : (
                          <></>
                        ),
                      )}
                    </div>
                  )}
                <Button
                  type="link"
                  className="flex w-full items-center justify-center gap-2 rounded-2xl border-core-sky py-3"
                  onClick={handleOpenModalAreasOfActivity}
                >
                  <AiOutlinePlus /> <span>地域を追加</span>
                </Button>
                <ModelAreas
                  open={isOpenModalAreasOfActivity}
                  onCancel={() => setIsOpenModalAreasOfActivity(false)}
                  cities={cities}
                  areas={areas}
                  prefectures={prefectures}
                  handleOk={handleModalAreasOfActivitySubmit}
                  areasOfActivity={currentAreasOfActivity}
                />
              </div>
              <div className="office-hours mt-8">
                <div className="office-hours-title flex gap-2">
                  <Typography.Title level={5} className="!text-core-blue">
                    指導できる日時
                  </Typography.Title>
                  <span className="text-gray-black">(複数可)</span>
                </div>
                <div className="office-hours-content ">
                  {OFFICE_HOURS_KEYS.map((officeHoursKey) => (
                    <Form.Item
                      name={['officeHours', officeHoursKey.value]}
                      label={officeHoursKey.label}
                      key={officeHoursKey.value}
                      colon={false}
                    >
                      <Checkbox.Group className="ml-2 w-full items-center gap-4">
                        {OFFICE_HOURS_OPTIONS.map((val) => (
                          <div
                            key={val.value}
                            className="flex flex-1 bg-gray-gray_lighter px-3 py-2"
                          >
                            <Checkbox
                              value={val.value}
                              rootClassName="flex w-full"
                              style={{
                                justifyContent: 'space-around',
                              }}
                            >
                              {val.label}
                            </Checkbox>
                          </div>
                        ))}
                      </Checkbox.Group>
                    </Form.Item>
                  ))}
                </div>
              </div>
              <Form.Item
                label={
                  <FormLabel className="text-core-blue">
                    遠征への同行可否
                  </FormLabel>
                }
                labelCol={{ span: 24 }}
                name="isExpeditionPossible"
              >
                <Radio.Group>
                  {IS_EXPEDITION_POSSIBLE_OPTIONS.map((option) => (
                    <Radio key={option.value} value={option.value}>
                      {option.label}
                    </Radio>
                  ))}
                </Radio.Group>
              </Form.Item>
              <Form.Item
                label={
                  <FormLabel className="text-core-blue">指導経験</FormLabel>
                }
                labelCol={{ span: 24 }}
                name="experience"
                className="mb-4"
              >
                <Radio.Group>
                  {EXPERIENCE_OPTIONS.map((option) => (
                    <Radio key={`${option.value}`} value={option.value}>
                      {option.label}
                    </Radio>
                  ))}
                </Radio.Group>
              </Form.Item>
              <div>
                <span>詳細</span>
                <Form.Item
                  labelCol={{ span: 24 }}
                  name="experienceNote"
                  className="mb-0 max-w-[25rem]"
                >
                  <Input.TextArea rows={4} />
                </Form.Item>
                <span>
                  例 : 中学生対象/地域サッカークラブ/指導補助アルバイト
                </span>
              </div>
              <div>
                <Form.Item
                  label={
                    <FormLabel className="text-core-blue">教員免許</FormLabel>
                  }
                  labelCol={{ span: 24 }}
                  name="teacherLicenseStatus"
                  className="mb-4 mt-8"
                >
                  <Radio.Group>
                    {TEACHER_LICENSE_OPTIONS.map((option) => (
                      <Radio key={`${option.value}`} value={option.value}>
                        {option.label}
                      </Radio>
                    ))}
                  </Radio.Group>
                </Form.Item>
                <div>
                  <span>種別</span>
                  <Form.Item
                    labelCol={{ span: 24 }}
                    name="teacherLicenseNote"
                    className="mb-0 max-w-[25rem]"
                  >
                    <Input.TextArea rows={4} />
                  </Form.Item>
                  <span>例 : 中学校教諭一種免許/国語</span>
                </div>
              </div>
              <div className="mt-8">
                <div className="flex gap-2">
                  <Typography.Title level={5} className="!text-core-blue">
                    指導者資格
                  </Typography.Title>
                  <span className="text-gray-black">(教員免許以外)</span>
                </div>
                <Form.Item
                  labelCol={{ span: 24 }}
                  name="otherLicense"
                  className="mb-4"
                >
                  <Radio.Group>
                    {OTHER_LICENSE_OPTIONS.map((option) => (
                      <Radio key={`${option.value}`} value={option.value}>
                        {option.label}
                      </Radio>
                    ))}
                  </Radio.Group>
                </Form.Item>
                <div>
                  <span className="font-bold">その他の資格</span>
                  <Form.Item
                    labelCol={{ span: 24 }}
                    name="otherLicenseNote"
                    className="mb-0 max-w-[25rem]"
                  >
                    <Input.TextArea rows={4} />
                  </Form.Item>
                </div>
              </div>
              <Form.Item
                label={
                  <FormLabel className="text-core-blue">
                    自動車運転免許
                  </FormLabel>
                }
                labelCol={{ span: 24 }}
                name="hasDriverLicense"
                className="mb-4 mt-8"
              >
                <Radio.Group>
                  {DRIVER_LICENSE_OPTIONS.map((option) => (
                    <Radio key={`${option.value}`} value={option.value}>
                      {option.label}
                    </Radio>
                  ))}
                </Radio.Group>
              </Form.Item>
              <div>
                <Typography.Title level={5} className="!text-core-blue">
                  自己アピール
                </Typography.Title>
                <Form.Item labelCol={{ span: 24 }} name="pr" className="mb-0">
                  <Input.TextArea rows={4} />
                </Form.Item>
                <span>自身の経験やボランティア経験などを入力してください</span>
              </div>
              {questionsForPrefecture &&
              Array.isArray(questionsForPrefecture) &&
              questionsForPrefecture.length ? (
                <div className="questions mt-8">
                  <Typography.Title level={5} className="!text-core-blue">
                    地域項目
                  </Typography.Title>
                  {questionsForPrefecture.map(
                    (
                      questions: {
                        id: string
                        prefecture: string
                        question: string
                        answer: string
                      },
                      index: number,
                    ) => (
                      <div key={questions.id} className="mt-3">
                        <span className="block">{questions.prefecture}</span>
                        <span>{questions.question}</span>
                        <Form.Item
                          labelCol={{ span: 24 }}
                          name={['questionsForPrefecture', index, 'id']}
                          className="hidden"
                        />
                        <Form.Item
                          labelCol={{ span: 24 }}
                          name={['questionsForPrefecture', index, 'prefecture']}
                          className="hidden"
                        />
                        <Form.Item
                          labelCol={{ span: 24 }}
                          name={['questionsForPrefecture', index, 'question']}
                          className="hidden"
                        />
                        <Form.Item
                          labelCol={{ span: 24 }}
                          name={['questionsForPrefecture', index, 'answer']}
                          className="mb-0 max-w-[25rem]"
                        >
                          <Input.TextArea rows={4} />
                        </Form.Item>
                      </div>
                    ),
                  )}
                </div>
              ) : (
                <></>
              )}
              <div className="mt-8 flex flex-col gap-4">
                {careers.map((careers, index) => (
                  <div
                    key={`${careers.organizationName}-${index}`}
                    className="flex max-w-[25rem] gap-3"
                  >
                    <span className="flex gap-1">
                      <span>
                        {dayjs(careers.termOfStart).format('YYYY/MM')}
                      </span>
                      {'~'}
                      <span>{dayjs(careers.termOfEnd).format('YYYY/MM')}</span>
                    </span>
                    <span className="flex-1">{careers.organizationName}</span>
                    <button
                      onClick={() =>
                        setCareerDetail({
                          ...careers,
                          index,
                        })
                      }
                    >
                      <MdModeEditOutline className="text-xl text-core-blue" />
                    </button>
                  </div>
                ))}
                <Button
                  type="link"
                  className="flex w-full items-center justify-center gap-2 rounded-2xl border-core-sky py-3"
                  onClick={() => setCareerDetail('created')}
                >
                  <AiOutlinePlus /> <span>経歴を追加</span>
                </Button>
                <ModalCareer
                  careerDetail={careerDetail}
                  onCancel={() => setCareerDetail(null)}
                  handleDelete={(career) => {
                    if (
                      career.index !== undefined &&
                      lodash.isNumber(career.index) &&
                      !lodash.isNaN(career)
                    ) {
                      setCareers((preState) => {
                        preState.splice(career.index!, 1)
                        return [...preState]
                      })
                      setCareerDetail(null)
                    }
                  }}
                  handleOk={(career, isCreated) => {
                    if (isCreated) {
                      setCareers((prevState) => {
                        return [...prevState, career]
                      })
                    } else {
                      setCareers((preState) => {
                        preState.splice(career.index!, 1, career)
                        return [...preState]
                      })
                    }
                    return setCareerDetail(null)
                  }}
                />
              </div>
              <Form.Item
                labelCol={{ span: 24 }}
                label={
                  <FormLabel className="text-core-blue">注意事項メモ</FormLabel>
                }
                name={['precautions']}
                className="mt-8 max-w-[25rem]"
              >
                <Input.TextArea rows={4} />
              </Form.Item>
              <div className="mt-8 flex gap-5">
                <Button
                  onClick={handleCancel}
                  className="h-9 flex-1 rounded-2xl bg-gray-gray_dark text-white"
                >
                  キャンセル
                </Button>
                <Button
                  type="primary"
                  className="h-9 flex-1 rounded-2xl bg-core-sky"
                  htmlType="submit"
                >
                  編集する
                </Button>
              </div>
            </div>
          </div>
        </div>
      </Form>
      <div className="mt-10 text-center">
        <button
          onClick={handleDelete}
          type="button"
          className="text-[1rem] text-core-red underline"
        >
          この登録者を削除する
        </button>
      </div>
    </>
  )
}

export default EditRegistrantPage
