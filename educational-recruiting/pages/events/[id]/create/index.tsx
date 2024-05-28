import { AttentionType, IconTypeLabel, Input, InputStatus, InputType, Label, RequiredLabelType } from '@/components/atoms'
import BackButton from '@/components/atoms/Button/BackButton'
import Button, { ButtonColor, ButtonShape, ButtonType } from '@/components/atoms/Button/Button'
import CheckBox, { CheckBoxColor } from '@/components/atoms/Button/CheckBox'
import RadioButton from '@/components/atoms/Button/RadioButton'
import SchoolLayout from '@/components/layouts/SchoolLayout'
import { FormField } from '@/components/molecules'
import DateFrame from '@/components/organisms/DateFrame'
import SchoolSearch from '@/components/organisms/modal/SchoolSearch'
import { getAddressDataByZipCode } from '@/firebase/address'
import { EventProject } from '@/models'
import { useAppSelector } from '@/store'
import { Address, OfficeHourType } from '@/types'
import { detectEmoticon, isKatakana, isStringOnlyNumbers } from '@/utils/common'
import { createEmptyRegisterEventProjectToken, decrypt, encrypt } from '@/utils/token'
import { Timestamp } from 'firebase/firestore'
import Router from 'next/router'
import { useEffect, useState } from 'react'
import { useForm } from 'react-hook-form'
import { BsPlus } from 'react-icons/bs'
var validator = require('validator')

const FormSection = ({ children, title, subTitle }: { children: React.ReactNode; title: string; subTitle?: string }) => {
  return (
    <div className="flex flex-col gap-10 border rounded-[10px] bg-gray-white border-gray-gray w-full pb-10">
      <div className="flex flex-row items-center w-full gap-5 px-5 py-3 bg-light-blue_light rounded-t-[10px]">
        <div className="text-h4 text-core-blue ">{title}</div>
        <div className="text-mini">{subTitle}</div>
      </div>
      {children}
    </div>
  )
}

var tmp_regsiter_data
var register_event_project_data: EventProject
if (typeof window !== 'undefined') {
  tmp_regsiter_data = localStorage.getItem('reg_event_project')
  if (!tmp_regsiter_data) {
    tmp_regsiter_data = createEmptyRegisterEventProjectToken()
  }

  register_event_project_data = JSON.parse(decrypt(tmp_regsiter_data))
}

export default function Page() {
  const { control, watch, setValue } = useForm({})

  const { prefectureList, prefectureOptionList } = useAppSelector((state) => state.global)

  // error
  const [emailError, setEmailError] = useState<string>('')
  const [confirmEmailError, setConfirmEmailError] = useState<string>('')
  const [phoneNumberError, setPhoneNumberError] = useState<string>('')
  const [zipError, setZipError] = useState<string>('')
  const [zipContent, setZipContent] = useState<string>('')
  const [zip2Error, setZip2Error] = useState<string>('')
  const [zip2Content, setZip2Content] = useState<string>('')
  const [seiError, setSeiError] = useState<string>('')
  const [meiError, setMeiError] = useState<string>('')
  const [seiKanaError, setSeiKanaError] = useState<string>('')
  const [meiKanaError, setMeiKanaError] = useState<string>('')
  const [numberOfApplicantsError, setNumberOfApplicantsError] = useState<string>('')

  // first FormSection
  const title = watch('title') || ''
  const organizer = watch('organizer') || ''
  const numberOfApplicants = watch('numberOfApplicants') || '1'
  const zip = watch('zip') || ''
  const address = watch('address') || ''
  const officeHoursNote = watch('officeHoursNote') || ''
  const jobDescription = watch('jobDescription') || ''
  const [workplace, setWorkPlace] = useState<Address>({
    address1: '',
    address2: '',
    city: '',
    prefecture: '',
    zip: 0,
  })
  const [schoolName, setSchoolName] = useState<string[]>([])
  const [officeHours, setOfficeHours] = useState<OfficeHourType[]>([])

  // second FormSection
  const [gender, setGender] = useState('')
  const people = watch('people') || ''
  const salary = watch('salary') || ''
  const note = watch('note') || ''

  //third FormSection
  const sei = watch('sei') || ''
  const mei = watch('mei') || ''
  const seiKana = watch('seiKana') || ''
  const meiKana = watch('meiKana') || ''
  const position = watch('position') || ''
  const zip2 = watch('zip2') || ''
  const [prefecture, setPrefecture] = useState('')
  const city = watch('city') || ''
  const address1 = watch('address1') || ''
  const address2 = watch('address2') || ''
  const basicInfoAddress = watch('basicInfoAddress') || ''
  const phoneNumber = watch('phoneNumber') || ''
  const email = watch('email') || ''
  const confirmEmail = watch('confirmEmail') || ''

  const [isOpenSearchModal, setIsOpenSearchModal] = useState(false)

  const [checkValue, setCheckValue] = useState('')
  const onchange = (value: string) => {
    checkValue ? setCheckValue('') : setCheckValue(value)
  }

  const disabled: boolean =
    !emailError &&
    !confirmEmailError &&
    !phoneNumberError &&
    !zipError &&
    !zip2Error &&
    !seiError &&
    !meiError &&
    !seiKanaError &&
    !meiKanaError &&
    !numberOfApplicantsError &&
    title &&
    organizer &&
    numberOfApplicants &&
    zip &&
    address &&
    officeHours &&
    officeHours.length > 0 &&
    jobDescription &&
    gender &&
    sei &&
    mei &&
    seiKana &&
    meiKana &&
    zip2 &&
    prefecture &&
    city &&
    phoneNumber &&
    email &&
    confirmEmail &&
    email == confirmEmail
      ? false
      : true

  function setValidationError(value: string, detectFunc: Function, setErrorFunc: Function, errorMsg: string) {
    if (value && detectFunc(value)) {
      setErrorFunc(errorMsg)
    } else {
      setErrorFunc('')
    }
  }

  useEffect(() => {
    // Validation for name and emoji
    setValidationError(sei, detectEmoticon, setSeiError, '絵文字は入力できません')
    setValidationError(mei, detectEmoticon, setMeiError, '絵文字は入力できません')

    // Validation for name kana and emoji
    setValidationError(seiKana, (val: string) => !isKatakana(val), setSeiKanaError, 'カタカナで入力してください')
    setValidationError(seiKana, detectEmoticon, setSeiKanaError, '絵文字は入力できません')
    setValidationError(meiKana, (val: string) => !isKatakana(val), setMeiKanaError, 'カタカナで入力してください')
    setValidationError(meiKana, detectEmoticon, setMeiKanaError, '絵文字は入力できません')

    // Validation for email
    setValidationError(email, (val: string) => !validator.isEmail(val), setEmailError, 'メールアドレスを正しく入力してください')
    setValidationError(confirmEmail, (val: string) => val !== email, setConfirmEmailError, '本メールと同じでなければなりません。')

    // Validation for phone number
    setValue('phoneNumber', phoneNumber.replace('-', ''))
    setValidationError(phoneNumber, (val: string) => !isStringOnlyNumbers(val), setPhoneNumberError, '電話番号を正しく入力してください')

    // Validation for Zip
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

    // Validation for Zip
    setValue('zip2', zip2.replace('-', ''))
    if (zip2) {
      if (!isStringOnlyNumbers(zip2) || zip2.length !== 7) {
        setZip2Error('7桁の数字で入力してください')
      } else if (zip2.length !== 7) {
        setZip2Error('コードの長さは7でなければなりません')
      } else {
        setZip2Error('')
      }
    } else {
      setZip2Error('')
    }

    setValidationError(
      numberOfApplicants,
      (val: string) => !/^(?!0+$)[0-9]{1,3}$/.test(val),
      setNumberOfApplicantsError,
      '3桁までの数字で入力してください',
    )

    register_event_project_data = {
      ...register_event_project_data,
      title: title ? title : register_event_project_data.title,
      organizer: organizer ? organizer : register_event_project_data.organizer,
      numberOfApplicants: numberOfApplicants ? numberOfApplicants : register_event_project_data.numberOfApplicants,
      workplace: {
        ...register_event_project_data.workplace,
        zip: zip ? zip.replace('-', '') : register_event_project_data.workplace.zip,
      },
      officeHours: officeHours && officeHours.length > 0 ? officeHours : register_event_project_data.officeHours,
      officeHoursNote: officeHoursNote ? officeHoursNote : register_event_project_data.officeHoursNote,
      jobDescription: jobDescription ? jobDescription : register_event_project_data.jobDescription,
      gender: gender ? gender : register_event_project_data.gender,
      people: people ? people : register_event_project_data.people,
      salary: salary ? salary : register_event_project_data.salary,
      note: note ? note : register_event_project_data.note,
      name: {
        sei: sei ? sei : register_event_project_data.name.sei,
        mei: mei ? mei : register_event_project_data.name.mei,
        seiKana: seiKana ? seiKana : register_event_project_data.name.seiKana,
        meiKana: meiKana ? meiKana : register_event_project_data.name.meiKana,
      },
      position: position ? position : register_event_project_data.position,
      address: {
        address1: address1 ? address1 : register_event_project_data.address.address1,
        address2: address2 ? address2 : register_event_project_data.address.address2,
        city: city ? city : register_event_project_data.address.city,
        prefecture: prefecture ? prefecture : register_event_project_data.address.prefecture,
        zip: zip2 ? zip2.replace('-', '') : register_event_project_data.address.zip,
      },
      phoneNumber: phoneNumber ? phoneNumber.replace(/-/g, '') : register_event_project_data.phoneNumber,
      email: email ? email : register_event_project_data.email,
      confirmEmail: confirmEmail ? confirmEmail : register_event_project_data.confirmEmail,
      officeHourType: checkValue ? checkValue : register_event_project_data.officeHourType,
    }

    localStorage.setItem('reg_event_project', encrypt(JSON.stringify(register_event_project_data)))
  }, [
    title,
    organizer,
    numberOfApplicants,
    zip,
    officeHours,
    officeHoursNote,
    jobDescription,
    gender,
    people,
    salary,
    note,
    sei,
    mei,
    seiKana,
    meiKana,
    position,
    zip2,
    prefecture,
    city,
    address1,
    address2,
    phoneNumber,
    email,
    confirmEmail,
    checkValue,
  ])

  useEffect(() => {
    let event_completed_status = localStorage.getItem('event_completed')
    if (event_completed_status == 'completed') {
      localStorage.setItem('event_completed', 'not_completed')
      tmp_regsiter_data = createEmptyRegisterEventProjectToken()
    } else {
      tmp_regsiter_data = localStorage.getItem('reg_event_project')
      if (!tmp_regsiter_data) {
        tmp_regsiter_data = createEmptyRegisterEventProjectToken()
      }
    }

    register_event_project_data = JSON.parse(decrypt(tmp_regsiter_data))

    setValue('title', register_event_project_data.title || '')
    setValue('organizer', register_event_project_data.organizer || '')
    setSchoolName(register_event_project_data.schoolName || [])
    setValue('numberOfApplicants', register_event_project_data.numberOfApplicants || '')
    setOfficeHours(register_event_project_data.officeHours || [])
    setValue('officeHoursNote', register_event_project_data.officeHoursNote || '')
    setValue('jobDescription', register_event_project_data.jobDescription || '')
    setValue('zip', register_event_project_data.workplace.zip || '')
    setValue(
      'address',
      `${register_event_project_data.workplace.prefecture}${register_event_project_data.workplace.city}${register_event_project_data.workplace.address2}`,
    )
    setValue('zip2', register_event_project_data.address.zip || '')
    setPrefecture(register_event_project_data.address.prefecture || '')
    setValue('city', register_event_project_data.address.city)
    setValue('address1', register_event_project_data.address.address1)
    setValue('address2', register_event_project_data.address.address2)
    setGender(register_event_project_data.gender || '')
    setValue('people', register_event_project_data.people || '')
    setValue('salary', register_event_project_data.salary || '')
    setValue('note', register_event_project_data.note || '')
    setValue('sei', register_event_project_data.name.sei || '')
    setValue('mei', register_event_project_data.name.mei || '')
    setValue('seiKana', register_event_project_data.name.seiKana || '')
    setValue('meiKana', register_event_project_data.name.meiKana || '')
    setValue('position', register_event_project_data.position || '')
    setValue('phoneNumber', register_event_project_data.phoneNumber || '')
    setValue('email', register_event_project_data.email || '')
    setValue('confirmEmail', register_event_project_data.confirmEmail || '')
    setCheckValue(register_event_project_data.officeHourType || '')

    const _basicInfoAddress = `${register_event_project_data.address.prefecture}${register_event_project_data.address.city}${register_event_project_data.address.address1}`
    setValue('basicInfoAddress', _basicInfoAddress || '')
  }, [])

  // search zip code
  const searchZipCode = async () => {
    if (zip) {
      let tmp_zip = zip.replace('-', '')
      const address_data = await getAddressDataByZipCode(tmp_zip)
      console.log('Address--------', address_data)

      if (address_data) {
        setZipContent('')
        const index = prefectureList.findIndex((element) => element.prefecture == address_data.prefectureName)
        if (index != -1) {
          console.log('prefecture item', prefectureList[index].prefecture)
        } else {
          console.log('not item')
        }
        setWorkPlace({
          ...workplace,
          zip: tmp_zip,
          address1: address_data.areaName ? address_data.areaName : workplace.address1,
          address2: address_data.address1 ? address_data.address1 : workplace.address2,
          city: address_data.cityName ? address_data.city : workplace.city,
          prefecture: index != -1 ? prefectureList[index].prefecture : workplace.prefecture,
        })

        register_event_project_data = {
          ...register_event_project_data,
          workplace: {
            zip: tmp_zip,
            address1: address_data.areaName ? address_data.areaName : workplace.address1,
            address2: address_data.address1 ? address_data.address1 : workplace.address2,
            city: address_data.cityName ? address_data.cityName : workplace.city,
            prefecture: index != -1 ? prefectureList[index].prefecture : workplace.prefecture,
          },
        }

        const token = encrypt(JSON.stringify(register_event_project_data))
        localStorage.setItem('reg_event_project', token)

        setValue('address', `${index != -1 ? prefectureList[index].prefecture : ''}${address_data.cityName}${address_data.address1}`)
      } else {
        setZipContent('無効な郵便番号。')
      }
    }
  }

  // search zip2 code
  const searchZipCode2 = async () => {
    if (zip2) {
      const data = await getAddressDataByZipCode(zip2)

      if (data) {
        setZip2Content('')
        setPrefecture(data.prefectureName || '')
        setValue('city', data.cityName + data.address1 || '')
        setValue('basicInfoAddress', `${data.prefectureName}${data.cityName}${data.address1}`)
      } else {
        setZip2Content('無効な郵便番号。')
      }
    }
  }

  const addOfficeHourDate = () => {
    console.log('here office hour')
    if (checkValue == '日ごとに時間を設定する') {
      register_event_project_data.officeHours.push({
        date: Timestamp.now(),
        start: {
          hour: '09',
          min: '00',
        },
        end: {
          hour: '17',
          min: '00',
        },
      })
    } else {
      if (register_event_project_data.officeHours.length == 0) {
        register_event_project_data.officeHours.push({
          date: Timestamp.now(),
          start: {
            hour: '09',
            min: '00',
          },
          end: {
            hour: '17',
            min: '00',
          },
        })
      } else {
        register_event_project_data.officeHours.push({
          date: Timestamp.now(),
          start: register_event_project_data.officeHours[0].start,
          end: register_event_project_data.officeHours[0].end,
        })
      }
    }

    setOfficeHours([...register_event_project_data.officeHours])

    localStorage.setItem('reg_event_project', encrypt(JSON.stringify(register_event_project_data)))
  }

  const removeDate = (pos: number) => {
    tmp_regsiter_data = localStorage.getItem('reg_event_project')
    if (!tmp_regsiter_data) {
      tmp_regsiter_data = createEmptyRegisterEventProjectToken()
    }

    register_event_project_data = JSON.parse(decrypt(tmp_regsiter_data))

    setOfficeHours([...register_event_project_data.officeHours])
  }

  const closeSchoolSearchModal = (value: string[]) => {
    setIsOpenSearchModal(false)
    setSchoolName(value)

    register_event_project_data = {
      ...register_event_project_data,
      schoolName: [...value],
    }

    localStorage.setItem('reg_event_project', encrypt(JSON.stringify(register_event_project_data)))
  }

  return (
    <div className="h-full ">
      <SchoolLayout>
        <div className="relative">
          <div className="fixed pc:top-[104px] sp:top-[74px] pc:left-10 sp:left-[10px]">
            <BackButton
              onClick={() => {
                Router.push('/events')
              }}
            />
          </div>
          <div className="flex flex-col items-center py-10 gap-10 sp:px-[20px] max-w-[880px] m-auto pc:px-0">
            <div className="pc:text-h1 sp:text-h2">募集依頼内容入力</div>
            <FormSection title="イベント情報">
              <div className="flex flex-col items-start w-full gap-4 pc:px-10 sp:px-7 ">
                <Label text="タイトル" requiredLabelText="必須" icon={IconTypeLabel.OFF} status={RequiredLabelType.REQUIRED} />
                <div className="flex flex-col items-start gap-[2px] w-full">
                  <Input control={control} type={InputType.BOX} name="title" className="w-full " />
                  <div className="text-timestamp">例）シティマラソンの運営スタッフ</div>
                </div>
              </div>

              <div className="flex flex-col items-start w-full gap-4 pc:px-10 sp:px-7 ">
                <Label text="主催団体" requiredLabelText="必須" icon={IconTypeLabel.OFF} status={RequiredLabelType.REQUIRED} />
                <div className="flex flex-col items-start gap-[2px] w-full">
                  <Input control={control} type={InputType.BOX} name="organizer" className="w-full " />
                  <div className="text-timestamp">例）市民マラソン大会実行委員会</div>
                </div>
              </div>

              <div className="flex flex-col items-start w-full gap-4 pc:px-10 sp:px-7 ">
                <Label text="募集を申請する学校" requiredLabelText="必須" icon={IconTypeLabel.OFF} status={RequiredLabelType.REQUIRED} />
                <div className="flex flex-col items-start gap-2">
                  <p>{schoolName && schoolName.length > 0 && schoolName.join(', ')}</p>
                  <Button
                    text={'学校を選択'}
                    color={ButtonColor.SUB}
                    type={ButtonType.SECONDARY}
                    shape={ButtonShape.RECTANGLE}
                    onclick={() => setIsOpenSearchModal(true)}
                    className=" w-[222px] py-[6.5px] "
                  />
                </div>
              </div>

              <div className="flex flex-col items-start w-full pc:px-10 sp:px-7 ">
                <Label text="募集人数" requiredLabelText="必須" icon={IconTypeLabel.OFF} status={RequiredLabelType.REQUIRED} />
                <div className="flex flex-row items-end gap-3 pt-4 pb-1">
                  <Input control={control} name="numberOfApplicants" className=" w-[100px]" status={InputStatus.Number} />
                  <div className="text-body_pc">名</div>
                </div>
                {numberOfApplicantsError != '' && <div className={'pc:text-timestamp text-[12px] text-core-red'}>{numberOfApplicantsError}</div>}
              </div>

              <div className="flex flex-col items-start w-full gap-4 pc:px-10 sp:px-7 ">
                <div className="flex flex-col items-start gap-2">
                  <Label text="主な勤務地" requiredLabelText="必須" icon={IconTypeLabel.OFF} status={RequiredLabelType.REQUIRED} />
                  <div className="text-timestamp">※勤務地が複数ある場合は, 主要な場所を入力してください</div>
                </div>

                <div className="flex flex-col items-start gap-2">
                  <div className="text-body_sp">郵便番号</div>
                  <div className="flex flex-col items-start gap-0.5">
                    <div className="flex items-start gap-4 pc:flex-row sp:flex-col">
                      <div className="w-full">
                        <FormField
                          control={control}
                          input={{
                            name: 'zip',
                            status: InputStatus.DEFAULT,
                            type: InputType.BOX,
                            className: ' pc:w-[120px] sp:w-[222px]',
                          }}
                          attention={{
                            text: zipContent,
                            status: AttentionType.ERROR,
                          }}
                          error={zipError}
                        />
                      </div>
                      <div className="w-full">
                        <Button
                          text="郵便番号検索"
                          disabled={!zip}
                          onclick={() => {
                            searchZipCode()
                          }}
                          className="pc:px-5 py-[6.5px] sp:w-full"
                        />
                      </div>
                    </div>
                    <div className="text-timestamp">
                      郵便番号検索ができない場合は
                      <a
                        href="https://www.notion.so/fd9c4a7ee83d427faa30b95b2ef3ecdc?pvs=4"
                        target="_blank"
                        className="border-b text-core-blue border-core-blue"
                      >
                        こちら
                      </a>
                    </div>
                  </div>
                  <div className="flex flex-col items-start gap-2">
                    <div className="text-body_sp">住所</div>
                    <Input control={control} disabled={true} name="address" className=" pc:w-[400px] sp:w-[222px] bg-gray-gray_light" />
                  </div>
                </div>
              </div>

              <div className="flex flex-col items-start w-full gap-4 pc:px-10 sp:px-7">
                <Label text="勤務日時" requiredLabelText="必須" icon={IconTypeLabel.OFF} status={RequiredLabelType.REQUIRED} />

                <div className="flex items-start pc:flex-row pc:gap-5 sp:gap-3 sp:flex-col">
                  <Button
                    text={
                      <div className="flex flex-row gap-[2px] items-center">
                        <BsPlus className="h-[24px] w-[24px]" />
                        <div>日付を追加</div>
                      </div>
                    }
                    color={ButtonColor.SUB}
                    type={ButtonType.SECONDARY}
                    shape={ButtonShape.RECTANGLE}
                    onclick={() => {
                      addOfficeHourDate()
                    }}
                    className="pc:px-[47px] sp:w-[222px] py-[6px] "
                  />
                  <CheckBox
                    text="日ごとに時間を設定する"
                    name="日ごとに時間を設定する"
                    onChange={onchange}
                    backgroundColor={CheckBoxColor.GrayLight}
                    className=" w-[240px] bg-transparent"
                    value={checkValue}
                  />
                </div>

                <div className="flex flex-col items-start pc:gap-2 sp:gap-7">
                  {officeHours &&
                    officeHours.length > 0 &&
                    officeHours.map((data, index) => (
                      <DateFrame key={index} data={data} pos={index} changeType={checkValue == '日ごとに時間を設定する'} remove={removeDate} />
                    ))}
                  {/* <DateFrame date="2023/3/21 (火)" /> */}
                </div>
                <div className="flex pc:flex-row sp:flex-col items-start w-full pc:gap-6 sp:gap-3 pl-5">
                  <div className="text-h4 whitespace-nowrap">補足</div>
                  <div className="flex flex-col items-start w-full gap-1">
                    <Input control={control} type={InputType.AREA} name="officeHoursNote" className="w-full" />
                    <div className="text-timestamp">勤務時間等について, 補足事項があればご記入ください</div>
                  </div>
                </div>
              </div>

              <div className="flex flex-col items-start w-full gap-4 pc:px-10 sp:px-7">
                <Label text="業務の内容" requiredLabelText="必須" icon={IconTypeLabel.OFF} status={RequiredLabelType.REQUIRED} />
                <div className="flex flex-col w-full gap-1">
                  <Input control={control} type={InputType.AREA} name="jobDescription" className="w-full" />
                  <div className="text-timestamp">例）受付・交通誘導など</div>
                </div>
              </div>
            </FormSection>

            <FormSection title="希望条件">
              <div className="flex flex-col items-start w-full gap-4 pc:px-10 sp:px-7 ">
                <div className="flex pc:items-center sp:items-start pc:gap-4 pc:flex-row sp:flex-col sp:gap-1">
                  <Label text="性別" requiredLabelText="必須" icon={IconTypeLabel.OFF} status={RequiredLabelType.REQUIRED} />
                  <div className="text-timestamp">※募集者には公開されません</div>
                </div>

                <div className="flex items-start gap-10 pc:flex-row sp:flex-col sp:gap-3">
                  <RadioButton name="男性" value={gender} disabled={false} text="男性" setValue={setGender} />
                  <RadioButton name="女性" value={gender} disabled={false} text="女性" setValue={setGender} />
                  <RadioButton name="どちらでも" value={gender} disabled={false} text="どちらでも" setValue={setGender} />
                </div>
              </div>

              <div className="flex flex-col items-start w-full gap-4 pc:px-10 sp:px-7">
                <Label text="求める人材" requiredLabelText="任意" icon={IconTypeLabel.OFF} status={RequiredLabelType.OPTIONAL} />
                <div className="flex flex-col w-full gap-1 ">
                  <Input control={control} type={InputType.AREA} name="people" className="w-full" />
                  <div className="text-timestamp">
                    例1）体力に自信のある方
                    <br />
                    例2）イベントの裏側に興味のある方
                  </div>
                </div>
              </div>

              <div className="flex flex-col items-start w-full gap-4 pc:px-10 sp:px-7">
                <Label text="給与・報酬" requiredLabelText="必須" icon={IconTypeLabel.OFF} status={RequiredLabelType.REQUIRED} />
                <div className="flex flex-col w-full gap-1">
                  <Input control={control} type={InputType.AREA} name="salary" className="w-full" />
                  <div className="text-timestamp">例）時給○○円 / 日当○○円 / 保有資格により要相談</div>
                </div>
              </div>

              <div className="flex flex-col items-start w-full gap-4 pc:px-10 sp:px-7">
                <div className="flex pc:items-center sp:items-start pc:gap-4 pc:flex-row sp:flex-col sp:gap-1">
                  <Label text="備考" requiredLabelText="任意" icon={IconTypeLabel.OFF} status={RequiredLabelType.OPTIONAL} />
                  <div className="text-timestamp">※募集者には公開されません</div>
                </div>
                <div className="flex flex-col w-full gap-1">
                  <Input control={control} type={InputType.AREA} name="note" className="w-full" />
                  <div className="text-timestamp">コーディネーターに伝えたいことがあればご記入ください</div>
                </div>
              </div>
            </FormSection>

            <FormSection title="基本情報">
              <div className="flex flex-col items-start w-full gap-4 pc:px-10 sp:px-7 ">
                <div className="flex pc:items-center sp:items-start pc:gap-4 pc:flex-row sp:flex-col sp:gap-1">
                  <Label text="担当者名" requiredLabelText="必須" icon={IconTypeLabel.OFF} status={RequiredLabelType.REQUIRED} />
                  <div className="text-timestamp">※募集者には公開されません</div>
                </div>

                <div className="items-start gap-4 pc:flex pc:flex-row sp:grid sp:grid-cols-1">
                  <FormField
                    control={control}
                    input={{
                      name: 'sei',
                      placeholder: '姓',
                      // status: InputStatus.DEFAULT,
                      className: ' w-[200px] sp:w-[222px]',
                    }}
                    attention={{ text: '' }}
                    error={seiError}
                  />
                  <FormField
                    control={control}
                    input={{
                      name: 'mei',
                      placeholder: '名',
                      // status: InputStatus.DEFAULT,
                      className: ' w-[200px] sp:w-[222px]',
                    }}
                    attention={{ text: '' }}
                    error={meiError}
                  />
                </div>

                <div className="items-start gap-4 pc:flex pc:flex-row sp:grid sp:grid-cols-1">
                  <FormField
                    control={control}
                    input={{
                      name: 'seiKana',
                      placeholder: 'セイ',
                      status: InputStatus.DEFAULT,
                      className: ' w-[200px] sp:w-[222px]',
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
                      className: ' w-[200px] sp:w-[222px]',
                    }}
                    attention={{ text: '' }}
                    error={meiKanaError}
                  />
                </div>
              </div>

              <div className="flex flex-col items-start w-full gap-4 pc:px-10 sp:px-7 ">
                <div className="flex pc:items-center sp:items-start pc:gap-4 pc:flex-row sp:flex-col sp:gap-1">
                  <Label text="役職" requiredLabelText="任意" icon={IconTypeLabel.OFF} status={RequiredLabelType.OPTIONAL} />
                </div>
                <Input control={control} name="position" className=" w-[200px] sp:w-[222px]" />
              </div>

              <div className="flex flex-col items-start w-full gap-4 pc:px-10 sp:px-7 ">
                <div className="flex flex-col items-start gap-2">
                  <Label text="住所" requiredLabelText="必須" icon={IconTypeLabel.OFF} status={RequiredLabelType.REQUIRED} />
                </div>

                <div className="flex flex-col items-start gap-2">
                  <div className="text-body_sp">郵便番号</div>
                  <div className="flex items-start gap-4 pc:flex-row sp:flex-col">
                    <div className="w-full">
                      <FormField
                        control={control}
                        input={{
                          name: 'zip2',
                          status: InputStatus.DEFAULT,
                          type: InputType.BOX,
                          className: ' pc:w-[120px] sp:w-[222px]',
                        }}
                        attention={{
                          text: zip2Content,
                          status: AttentionType.ERROR,
                        }}
                        error={zip2Error}
                      />
                    </div>
                    <div className="w-full">
                      <Button
                        text="郵便番号検索"
                        disabled={!zip2}
                        onclick={() => {
                          searchZipCode2()
                        }}
                        className="pc:px-5 py-[6.5px] sp:w-full"
                      />
                    </div>
                  </div>
                </div>

                <div className="flex flex-col items-start gap-2">
                  <Input control={control} name="basicInfoAddress" disabled={true} className="pc:w-[400px] sp:w-[222px] bg-gray-gray_light" />
                  <div className="pt-1 text-timestamp">
                    住所が表示されない場合は
                    <a
                      href="https://www.notion.so/asfeel/fd9c4a7ee83d427faa30b95b2ef3ecdc"
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

              <div className="flex flex-col items-start w-full gap-4 pc:px-10 sp:px-7 ">
                <div className="flex pc:items-center sp:items-start pc:gap-4 pc:flex-row sp:flex-col sp:gap-1">
                  <Label text="電話番号" requiredLabelText="必須" icon={IconTypeLabel.OFF} status={RequiredLabelType.REQUIRED} />
                </div>

                <div className="flex flex-col items-start gap-1">
                  <FormField
                    control={control}
                    input={{
                      name: 'phoneNumber',
                      placeholder: '09012345678',
                      status: InputStatus.DEFAULT,
                      className: ' pc:w-[240px] sp:w-[222px]',
                    }}
                    attention={{
                      text: '半角数字で入力してください',
                    }}
                    error={phoneNumberError}
                  />
                  <div className="text-timestamp">つながりやすい連絡先をご入力ください</div>
                </div>
              </div>

              <div className="flex flex-col items-start w-full gap-4 pc:px-10 sp:px-7 ">
                <div className="flex pc:items-center sp:items-start pc:gap-4 pc:flex-row sp:flex-col sp:gap-1">
                  <Label text="メールアドレス" requiredLabelText="必須" icon={IconTypeLabel.OFF} status={RequiredLabelType.REQUIRED} />
                </div>

                <FormField
                  control={control}
                  input={{
                    name: 'email',
                    placeholder: 'example@spocul.jp',
                    className: ' pc:w-[400px] sp:w-[300px] ',
                    status: InputStatus.DEFAULT,
                  }}
                  attention={{ text: '' }}
                  error={emailError}
                  className="w-[100%]"
                />

                <div className="flex flex-col items-start gap-1 sp:w-full">
                  <FormField
                    control={control}
                    input={{
                      name: 'confirmEmail',
                      placeholder: 'example@spocul.jp',
                      status: InputStatus.DEFAULT,
                      className: ' pc:w-[400px] sp:w-[300px]  ',
                    }}
                    attention={{ text: '確認のためもう一度入力してください' }}
                    error={confirmEmailError}
                  />
                  {/* <Input
                      control={control}
                      name="confirmEmail"
                      placeholder="example@spocul.jp"
                      status={InputStatus.EMAIL}
                    /> */}
                </div>
              </div>
            </FormSection>

            <div className="flex items-center py-5">
              <Button
                text="確認画面へ進む"
                onclick={() => {
                  Router.push('/projects/new/confirm')
                }}
                className=" px-[60px] py-[16.5px]"
                shape={ButtonShape.ELLIPSE}
                disabled={disabled}
              />
            </div>
          </div>
        </div>

        {isOpenSearchModal && <SchoolSearch closeModal={(value) => closeSchoolSearchModal(value)} value={schoolName} />}
      </SchoolLayout>
    </div>
  )
}
