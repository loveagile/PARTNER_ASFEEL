import Button, {
  ButtonArrow,
  ButtonColor,
  ButtonIcon,
  ButtonShape,
  ButtonSize,
  ButtonType,
} from '@/components/atoms/Button/Button'
import { AttentionType, Input, InputStatus, InputType } from '@/components/atoms'
import { useRouter } from 'next/router'
import SignUpLayout from '@/components/layouts/SignUpLayout'
import BackButton from '@/components/atoms/Button/BackButton'
import { useForm } from 'react-hook-form'
import { useEffect, useState } from 'react'
import SelectBox, { IconTypeSelectBox, SelectBoxSize, SelectBoxType } from '@/components/atoms/Input/SelectBox'
import DatePickerComponent from '@/components/organisms/Calendar'
import { FormField } from '@/components/molecules'
import { IoSend } from 'react-icons/io5'
import { jobTypeList } from '@/utils/constants'
import { useAppSelector, useAppDispatch } from '@/store'
import { GenderEnumKeys, genderEnum } from '@/enums'
import { Timestamp } from 'firebase/firestore'
import { Option } from '@/types'
import { PrivateUser } from '@/models'
import { userExists } from '@/firebase/privateUser'
var validator = require('validator')
import {
  createEmptySignUpToken,
  detectEmoticon,
  isKatakana,
  isStringOnlyNumbers,
  objectToDate,
  setValidationError,
} from '@/utils/common'
import { decrypt, encrypt } from '@/utils/token'
import { getAddressDataByZipCode } from '@/firebase/address'
import { setStoreLoading } from '@/store/reducers/global'
import RadioButtonForEnum from '@/components/atoms/Button/RadioButtonForEnum'
import useSystemName from '@/hooks/useSystemName'
import { API_URL } from '@/utils/constants/apiUrls'
import { EXTERNAL_URLS } from '@/utils/constants/externalUrls'
import { LOCAL_STORAGE } from '@/utils/constants/localStorage'
import { formatDate } from '@/libs/dayjs/dayjs'

const Content = () => {
  const { control, watch, setValue } = useForm({})
  const router = useRouter()
  const dispatch = useAppDispatch()
  const { systemName } = useSystemName()
  const { prefectureOptionList } = useAppSelector((state) => state.global)
  const [gradeList, setGradeList] = useState<Option[]>([])
  const [disabled, setDisabled] = useState<boolean>(false)

  const [registerUserData, setRegisterUserData] = useState<PrivateUser>()
  const [organizationGrade, setOrganizationGrade] = useState<string>('')

  // error
  const [emailError, setEmailError] = useState<string>('')
  const [confirmEmailError, setConfirmEmailError] = useState<string>('')
  const [phoneNumberError, setPhoneNumberError] = useState<string>('')
  const [zipError, setZipError] = useState<string>('')
  const [seiError, setSeiError] = useState<string>('')
  const [meiError, setMeiError] = useState<string>('')
  const [seiKanaError, setSeiKanaError] = useState<string>('')
  const [meiKanaError, setMeiKanaError] = useState<string>('')
  const [zipContent, setZipContent] = useState<string>('')

  const sei = watch('sei') || ''
  const mei = watch('mei') || ''
  const seiKana = watch('seiKana') || ''
  const meiKana = watch('meiKana') || ''
  const [gender, setGender] = useState<GenderEnumKeys | null>(null)
  const [job, setJob] = useState<string>('')
  const organization = watch('organization') || ''
  const faculty = watch('faculty') || ''
  const [grade, setGrade] = useState<string>(registerUserData?.occupation?.grade || '')
  const [birthday, setBirthday] = useState<Timestamp>(
    registerUserData?.birthday || Timestamp.fromDate(new Date('2020/01/01')),
  )
  const zip = watch('zip') || registerUserData?.address?.zip || ''
  const [prefecture, setPrefecture] = useState<string>(registerUserData?.address?.prefecture || '')
  const city = watch('city') || ''
  const address1 = watch('address1') || ''
  const address2 = watch('address2') || ''
  const address = watch('address') || ''
  const phoneNumber = watch('phoneNumber') || registerUserData?.phoneNumber || ''
  const email = watch('email') || ''
  const confirmEmail = watch('confirmEmail') || ''

  useEffect(() => {
    setOrganizationGrade(localStorage.getItem(LOCAL_STORAGE.organizationGrade) || '')

    const _registerUserData = JSON.parse(
      decrypt(localStorage.getItem(LOCAL_STORAGE.signUpData) || createEmptySignUpToken()),
    )
    setRegisterUserData(_registerUserData)

    if (_registerUserData) {
      setGender(_registerUserData.gender)
      setJob(_registerUserData.occupation?.type || '')
      setGrade(_registerUserData.occupation?.grade || '')
      setBirthday(_registerUserData.birthday || '')
      setValue('sei', _registerUserData.name?.sei || '')
      setValue('mei', _registerUserData.name?.mei || '')
      setValue('seiKana', _registerUserData.name?.seiKana || '')
      setValue('meiKana', _registerUserData.name?.meiKana || '')
      setValue('organization', _registerUserData.occupation.organization || '')
      setValue('faculty', _registerUserData.occupation?.faculty || '')
      setValue('zip', _registerUserData.address?.zip || '')
      setValue('city', _registerUserData.address?.city || '')
      setValue('address1', _registerUserData.address?.address1 || '')
      setValue('address2', _registerUserData.address?.address2 || '')
      setValue('phoneNumber', _registerUserData.phoneNumber || '')
      setValue('email', _registerUserData.email || '')
      setValue('confirmEmail', _registerUserData.confirmEmail || '')
      setPrefecture(_registerUserData.address?.prefecture || '')

      const _address = `${_registerUserData.address?.prefecture || ''}${_registerUserData.address?.city || ''}${
        _registerUserData.address?.address1 || ''
      }`
      setValue('address', _address)
    }
  }, [])

  useEffect(() => {
    let temp = [
      {
        value: '',
        placeholder: true,
        text: '選択してください',
        icon: IconTypeSelectBox.OFF,
        size: SelectBoxSize.PC,
      },
    ]
    for (let i = 1; i <= parseInt(organizationGrade); i++) {
      temp.push({
        value: i.toString(),
        placeholder: false,
        text: i.toString() + '学年',
        icon: IconTypeSelectBox.OFF,
        size: SelectBoxSize.PC,
      })
    }

    setGradeList([...temp])
  }, [organizationGrade])

  useEffect(() => {
    if (!registerUserData) return
    setValue('faculty', registerUserData.occupation?.faculty || '')
    setGrade(registerUserData.occupation?.grade || '')
  }, [organization])

  useEffect(() => {
    const commonValidations: boolean =
      !emailError &&
      !confirmEmailError &&
      !phoneNumberError &&
      !zipError &&
      !seiError &&
      !meiError &&
      !seiKanaError &&
      !meiKanaError &&
      sei &&
      mei &&
      seiKana &&
      meiKana &&
      gender &&
      birthday &&
      zip &&
      prefecture &&
      city &&
      address &&
      phoneNumber &&
      email &&
      confirmEmail &&
      email == confirmEmail

    const jobOneValidations: boolean = organization && faculty && grade
    const _disable = job === '大学生' ? !(commonValidations && jobOneValidations) : !commonValidations

    setDisabled(_disable)
  }, [
    emailError,
    confirmEmailError,
    phoneNumberError,
    zipError,
    seiError,
    meiError,
    seiKanaError,
    meiKanaError,
    sei,
    mei,
    seiKana,
    meiKana,
    gender,
    job,
    organization,
    faculty,
    grade,
    birthday,
    zip,
    prefecture,
    city,
    address1,
    address2,
    phoneNumber,
    email,
    confirmEmail,
  ])

  useEffect(() => {
    setValidationError(sei, detectEmoticon, setSeiError, '絵文字は入力できません')
    setValidationError(mei, detectEmoticon, setMeiError, '絵文字は入力できません')
    setValidationError(seiKana, detectEmoticon, setSeiKanaError, '絵文字は入力できません')
    setValidationError(meiKana, detectEmoticon, setMeiKanaError, '絵文字は入力できません')
    setValidationError(seiKana, (val: string) => !isKatakana(val), setSeiKanaError, 'カタカナで入力してください')
    setValidationError(meiKana, (val: string) => !isKatakana(val), setMeiKanaError, 'カタカナで入力してください')
    setValidationError(
      email,
      (val: string) => !validator.isEmail(val),
      setEmailError,
      'メールアドレスを正しく入力してください',
    )
    setValidationError(
      confirmEmail,
      () => confirmEmail != email,
      setConfirmEmailError,
      'メールアドレスを正しく入力してください',
    )

    setValue('phoneNumber', phoneNumber.replace('-', ''))
    if (phoneNumber) {
      setValidationError(
        phoneNumber,
        (val: string) => !isStringOnlyNumbers(val),
        setPhoneNumberError,
        '電話番号を正しく入力してください',
      )
    }

    setValue('zip', zip.replace('-', ''))
    if (zip) {
      if (!isStringOnlyNumbers(zip) || zip.length !== 7) {
        setZipError('7桁の数字で入力してください')
      } else if (zip.length !== 7) {
        setZipError('コードの長さは7でなければなりません')
      } else {
        setZipError('')
      }
    } else {
      setZipError('')
    }

    const oldRegisterUserData: PrivateUser = JSON.parse(
      decrypt(localStorage.getItem(LOCAL_STORAGE.signUpData) || createEmptySignUpToken()),
    )

    const birthdayStr = formatDate(objectToDate(birthday))('YYYYMMDD')
    const initBirthdayStr = formatDate(new Date('2020/01/01'))('YYYYMMDD')

    const updatedRegisterUserData = {
      ...oldRegisterUserData,
      name: {
        sei: sei || oldRegisterUserData.name.sei,
        mei: mei || oldRegisterUserData.name.mei,
        seiKana: seiKana || oldRegisterUserData.name.seiKana,
        meiKana: meiKana || oldRegisterUserData.name.meiKana,
      },
      gender: gender || oldRegisterUserData.gender,
      occupation: {
        type: job || oldRegisterUserData.occupation.type,
        organization: organization || oldRegisterUserData.occupation.organization,
        faculty: faculty || oldRegisterUserData.occupation.faculty,
        grade: grade || oldRegisterUserData.occupation.grade,
      },
      birthday: birthdayStr === initBirthdayStr ? oldRegisterUserData.birthday : birthday,
      address: {
        zip: zip || oldRegisterUserData.address.zip,
        prefecture: prefecture || oldRegisterUserData.address.prefecture,
        city: city || oldRegisterUserData.address.city,
        address1: address1 || oldRegisterUserData.address.address1,
        address2: address2 || oldRegisterUserData.address.address2,
      },
      phoneNumber: phoneNumber || oldRegisterUserData.phoneNumber,
      email: email || oldRegisterUserData.email,
      confirmEmail: confirmEmail || oldRegisterUserData.confirmEmail,
    }

    localStorage.setItem(LOCAL_STORAGE.signUpData, encrypt(JSON.stringify(updatedRegisterUserData)))
  }, [
    sei,
    mei,
    seiKana,
    meiKana,
    gender,
    job,
    organization,
    faculty,
    grade,
    birthday,
    zip,
    prefecture,
    city,
    address1,
    address2,
    phoneNumber,
    email,
    confirmEmail,
  ])

  const searchZipCode = async () => {
    if (zip) {
      setZipContent('')
      const data = await getAddressDataByZipCode(zip)
      if (data) {
        setPrefecture(data.prefectureName || '')
        setValue('city', (data.cityName || '') + (data.address1 || ''))
        setValue('address', `${data.prefectureName || ''}${data.cityName || ''}${data.address1 || ''}`)
      } else {
        setZipContent('無効な郵便番号。')
      }
    }
  }

  const registerUser = async () => {
    try {
      dispatch(setStoreLoading(true))

      if (await userExists(email)) {
        setEmailError('ユーザーはすでに存在しています。')
        dispatch(setStoreLoading(false))
        return
      }

      const response = await fetch(API_URL.requestVerification, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          email,
          systemName,
        }),
      })

      if (response.ok) {
        router.push('/signup/code')
      }
    } catch (error) {
      console.error(error)
      alert('エラーが発生しました。もう一度お試しください。')
    } finally {
      dispatch(setStoreLoading(false))
    }
  }

  if (prefectureOptionList && prefectureOptionList.length > 0) {
    return (
      <div className="relative">
        <div className="absolute left-[10px] top-[10px]">
          <BackButton
            onClick={() => {
              router.push('/signup/skills')
            }}
          />
        </div>

        <div className="px-[24px] py-[30px]">
          <div className="mx-auto max-w-[800px] text-center">
            <div className="">
              <p className="text-[18px] font-bold">プロフィール</p>
              <img src={`/images/icons/resume.svg`} className="mx-auto my-[30px] h-[80px] w-[80px]" alt="" />
            </div>

            <div className="mb-9 text-start">
              <div>
                <div className="grid gap-[30px]">
                  <div>
                    <p className="pb-[4px] text-[14px] font-bold text-core-blue">名前</p>

                    <div className="relative grid grid-cols-2 gap-[10px] pb-[8px]">
                      <FormField
                        control={control}
                        input={{
                          name: 'sei',
                          placeholder: '姓',
                          className: 'w-[100%]',
                        }}
                        attention={{ text: '' }}
                        error={seiError}
                      />
                      <FormField
                        control={control}
                        input={{
                          name: 'mei',
                          placeholder: '名',
                          className: 'w-[100%]',
                          value: registerUserData?.name?.mei && registerUserData.name.mei,
                        }}
                        attention={{ text: '' }}
                        error={meiError}
                      />
                    </div>
                    <div className="relative grid grid-cols-2 gap-[10px]">
                      <FormField
                        control={control}
                        input={{
                          name: 'seiKana',
                          placeholder: 'セイ',
                          status: InputStatus.DEFAULT,
                          className: ' w-[100%]',
                        }}
                        attention={{ text: '' }}
                        error={seiKanaError}
                      />
                      <FormField
                        control={control}
                        input={{
                          name: 'meiKana',
                          placeholder: 'メイ',
                          status: InputStatus.DEFAULT,
                          className: ' w-[100%]',
                        }}
                        attention={{ text: '' }}
                        error={meiKanaError}
                      />
                    </div>
                  </div>

                  <div>
                    <p className="pb-[8px] text-[14px] font-bold text-core-blue">性別</p>

                    <div className="flex items-start sp:gap-[20px] pc:gap-[30px]">
                      <RadioButtonForEnum
                        name={genderEnum.male}
                        value={gender}
                        disabled={false}
                        text={genderEnum.male}
                        mapping={genderEnum}
                        mappingValue={'male'}
                        setValue={setGender}
                      />
                      <RadioButtonForEnum
                        name={genderEnum.female}
                        value={gender}
                        disabled={false}
                        text={genderEnum.female}
                        mapping={genderEnum}
                        mappingValue={'female'}
                        setValue={setGender}
                      />
                      <RadioButtonForEnum
                        name={genderEnum.other}
                        value={gender}
                        disabled={false}
                        text={genderEnum.other}
                        mapping={genderEnum}
                        mappingValue={'other'}
                        setValue={setGender}
                      />
                    </div>
                  </div>

                  <div className="text-[14px]">
                    <p className="pb-[4px] font-bold text-core-blue">職業</p>

                    <div className="grid gap-[4px]">
                      <div>
                        <p className="">職業</p>
                        <div className="">
                          <SelectBox
                            value={job}
                            setValue={(value) => {
                              setJob(value)
                              setValue('organization', '')
                              setValue('faculty', '')
                              setValue('grade', '')
                            }}
                            size={SelectBoxSize.PC}
                            status={SelectBoxType.DEFAULT}
                            options={jobTypeList}
                            className="w-[100%]"
                          />
                        </div>
                      </div>
                      {job === '大学生' ? (
                        <>
                          <div>
                            <p className="">所属名</p>
                            <div
                              onClick={() => {
                                router.push('/signup/profile/search-university')
                              }}
                            >
                              <Input
                                control={control}
                                status={InputStatus.SEARCH}
                                type={InputType.BOX}
                                name="organization"
                                placeholder="学校名を検索して入力"
                                className="w-[100%]"
                              />
                            </div>
                          </div>

                          <div>
                            <p className="">学部</p>
                            <Input
                              control={control}
                              status={InputStatus.DEFAULT}
                              type={InputType.BOX}
                              name="faculty"
                              className="w-[100%]"
                            />
                          </div>

                          <div>
                            <p className="">学年</p>
                            <SelectBox
                              value={grade}
                              setValue={setGrade}
                              size={SelectBoxSize.PC}
                              status={SelectBoxType.DEFAULT}
                              options={gradeList}
                              className="w-[100%]"
                            />
                          </div>
                        </>
                      ) : (
                        <>
                          <div>
                            <p className="">所属名</p>
                            <Input
                              control={control}
                              status={InputStatus.DEFAULT}
                              type={InputType.BOX}
                              name="organization"
                              className="w-[100%]"
                            />
                          </div>
                        </>
                      )}
                    </div>
                  </div>

                  <div className="text-[14px]">
                    <p className="pb-[4px] font-bold text-core-blue">生年月</p>
                    <DatePickerComponent
                      onClick={(value) => setBirthday(Timestamp.fromDate(value))}
                      value={objectToDate(birthday)}
                    />
                  </div>

                  <div>
                    <p className="pb-[4px] font-bold text-core-blue">住所</p>
                    <div className="grid gap-[4px]">
                      <div>
                        <p className="">郵便番号</p>
                        <div className="grid grid-cols-12 gap-[10px]">
                          <div className="col-span-7">
                            <FormField
                              control={control}
                              input={{
                                name: 'zip',
                                status: InputStatus.DEFAULT,
                                type: InputType.BOX,
                              }}
                              attention={{ text: zipContent, status: AttentionType.ERROR }}
                              error={zipError}
                            />
                          </div>
                          <div className="col-span-5">
                            <Button
                              size={ButtonSize.SP}
                              color={ButtonColor.DEFAULT}
                              type={ButtonType.DEFAULT}
                              shape={ButtonShape.RECTANGLE}
                              disabled={zipError ? true : false}
                              icon={ButtonIcon.OFF}
                              arrow={ButtonArrow.OFF}
                              text="郵便番号検索"
                              onclick={() => {
                                searchZipCode()
                              }}
                              className="h-[34px] w-[100%]"
                            />
                          </div>
                        </div>
                      </div>
                      <div className="w-full">
                        <Input control={control} name="address" disabled={true} className="w-full bg-gray-gray_light" />
                        <div className="pt-1 text-timestamp">
                          住所が表示されない場合は
                          <a
                            href={EXTERNAL_URLS.addressNotDisplayed}
                            target="_blank"
                            rel="noopener noreferrer"
                            className="border-b border-core-blue text-core-blue"
                          >
                            こちら
                          </a>
                        </div>
                        <p className="text-timestamp">※番地やアパート名などは入力不要です</p>
                      </div>
                    </div>
                  </div>

                  <div>
                    <p className="pb-[4px] font-bold text-core-blue">携帯電話番号</p>
                    <FormField
                      control={control}
                      input={{
                        name: 'phoneNumber',
                        placeholder: '09012345678',
                        status: InputStatus.DEFAULT,
                      }}
                      attention={{ text: '半角数字で入力してください' }}
                      error={phoneNumberError}
                    />
                  </div>

                  <div className="grid gap-[4px]">
                    <div>
                      <p className="pb-[4px] font-bold text-core-blue">メールアドレス</p>
                      <FormField
                        control={control}
                        input={{
                          name: 'email',
                          placeholder: 'example@spocul.jp',
                          status: InputStatus.DEFAULT,
                        }}
                        attention={{ text: '' }}
                        error={emailError}
                        className="w-[100%]"
                      />
                    </div>

                    <div>
                      <p className="">確認用メールアドレス</p>
                      <FormField
                        control={control}
                        input={{
                          name: 'confirmEmail',
                          placeholder: 'example@spocul.jp',
                          status: InputStatus.DEFAULT,
                        }}
                        attention={{ text: '確認のためもう一度入力してください' }}
                        error={confirmEmailError}
                      />
                    </div>
                  </div>
                </div>
              </div>
            </div>

            <div className="flex flex-col items-center justify-center">
              <Button
                size={ButtonSize.SP}
                color={ButtonColor.SUB}
                type={ButtonType.DEFAULT}
                shape={ButtonShape.ELLIPSE}
                disabled={disabled}
                icon={ButtonIcon.FRONT}
                arrow={ButtonArrow.OFF}
                text="認証メールを送信する"
                iconComponent={<IoSend className="mr-[4px] h-[16px] w-[16px]" />}
                onclick={() => {
                  registerUser()
                }}
                className="mb-8 h-[34px] w-[240px]"
              />
              <p className="whitespace-pre-line text-small font-normal">
                {`「@spocul-bank.jp」からのメールを受信できるように設定をお願いします。\nスカウトのお知らせなど重要なメールをお送りします。`}
              </p>
            </div>
          </div>
        </div>
      </div>
    )
  } else {
    return <></>
  }
}

export default function Page() {
  return (
    <div className="h-full bg-gray-white">
      <SignUpLayout>
        <Content />
      </SignUpLayout>
    </div>
  )
}
