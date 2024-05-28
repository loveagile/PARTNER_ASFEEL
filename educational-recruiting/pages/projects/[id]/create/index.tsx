import { AttentionType, IconTypeLabel, IconTypeSelectBox, Input, InputStatus, InputType, Label, RequiredLabelType } from '@/components/atoms'
import BackButton from '@/components/atoms/Button/BackButton'
import Button, { ButtonShape } from '@/components/atoms/Button/Button'
import CheckBox, { CheckBoxColor } from '@/components/atoms/Button/CheckBox'
import RadioButton from '@/components/atoms/Button/RadioButton'
import SelectBox, { SelectBoxSize, SelectBoxType } from '@/components/atoms/Input/SelectBox'
import SchoolLayout from '@/components/layouts/SchoolLayout'
import { FormField } from '@/components/molecules'
import { LeadersWantedProject } from '@/models'
import { Address, Option, ScheduleType } from '@/types'
import { detectEmoticon, getPrefectureFromHostname, isDataInOfficeHours, isKatakana, isStringOnlyNumbers } from '@/utils/common'
import { createEmptyRegisterLeadersWantedProjectToken, decrypt, encrypt } from '@/utils/token'
import Link from 'next/link'
import Router from 'next/router'
import { useEffect, useState } from 'react'
import { useForm } from 'react-hook-form'
var validator = require('validator')
import { useAppSelector } from '@/store'
import { getAddressDataByZipCode } from '@/firebase/address'
import SchoolSearchSingle from '@/components/organisms/modal/SchoolSearchSingle'
import { CONSTANT, LOCAL_STORAGE_KEY } from '@/constants/constant_text'

const FormSection = ({ children, title, subTitle }: { children: React.ReactNode; title: string; subTitle?: string }) => {
  return (
    <div className="flex flex-col gap-10 border rounded-[10px] bg-gray-white border-gray-gray w-full pb-10">
      <div className="flex pc:flex-row sp:flex-col pc:items-center sp:items-start w-full pc:gap-5 sp:gap-1 px-5 py-3 bg-light-blue_light rounded-t-[10px]">
        <div className="pc:text-h4 sp:text-[14px] sp:font-bold text-core-blue ">{title}</div>
        <div className="text-mini">{subTitle}</div>
      </div>
      {children}
    </div>
  )
}

var tmp_register_data
var register_leaders_event_project_data: LeadersWantedProject
if (typeof window !== 'undefined') {
  tmp_register_data = localStorage.getItem(LOCAL_STORAGE_KEY.leadersProject)
  if (!tmp_register_data) {
    tmp_register_data = createEmptyRegisterLeadersWantedProjectToken()
  }

  register_leaders_event_project_data = JSON.parse(decrypt(tmp_register_data))
}

export default function Page() {
  const { control, watch, setValue } = useForm({})

  var scheduleInfo: ScheduleType | undefined = {
    monday: [],
    tuesday: [],
    wednesday: [],
    thursday: [],
    friday: [],
    saturday: [],
    sunday: [],
  }

  const [schedule, setSchedule] = useState<ScheduleType>()

  const { prefectureList, clubList, organizationTypeList } = useAppSelector((state) => state.global)

  // error
  const [emailError, setEmailError] = useState<string>('')
  const [confirmEmailError, setConfirmEmailError] = useState<string>('')
  const [phoneNumberError, setPhoneNumberError] = useState<string>('')
  const [zipError, setZipError] = useState<string>('')
  const [zipContent, setZipContent] = useState<string>('')
  const [seiError, setSeiError] = useState<string>('')
  const [meiError, setMeiError] = useState<string>('')
  const [seiKanaError, setSeiKanaError] = useState<string>('')
  const [meiKanaError, setMeiKanaError] = useState<string>('')
  const [recruitmentError, setRecruitmentError] = useState<string>('')

  // first FormSection
  const [type, setType] = useState<string>('')
  const organizationName = watch('organizationName') || ''
  const organizationType = watch('organizationType') || ''
  const [applyForProject, setApplyForProject] = useState<string>('')
  const [eventType, setEventType] = useState<string>('')
  const [eventName, setEventName] = useState<string>('')
  const [gender, setGender] = useState<string>('')
  const recruitment = watch('recruitment') || '1'
  const zip = watch('zip') || ''
  const address = watch('address') || ''
  const [workplace, setWorkPlace] = useState<Address>({
    address1: '',
    address2: '',
    city: '',
    prefecture: '',
    zip: 0,
  })

  // office hours
  const [mon_m, setMonM] = useState<string>('')
  const [mon_a, setMonA] = useState<string>('')
  const [fire_m, setFireM] = useState<string>('')
  const [fire_a, setFireA] = useState<string>('')
  const [water_m, setWaterM] = useState<string>('')
  const [water_a, setWaterA] = useState<string>('')
  const [wood_m, setWoodM] = useState<string>('')
  const [wood_a, setWoodA] = useState<string>('')
  const [metal_m, setMetalM] = useState<string>('')
  const [metal_a, setMetalA] = useState<string>('')
  const [earth_m, setEarthM] = useState<string>('')
  const [earth_a, setEarthA] = useState<string>('')
  const [sun_m, setSunM] = useState<string>('')
  const [sun_a, setSunA] = useState<string>('')

  const [target, setTarget] = useState<string[]>([])
  const [targetChanged, setTargetChanged] = useState<boolean>(false)
  const workingHoursNote = watch('workingHoursNote') || ''
  const activityDescription = watch('activityDescription') || ''

  // second FormSection
  const [desiredGender, setDesiredGender] = useState<string>('')
  const [desiredAge, setDesiredAge] = useState<string[]>([])
  const [desiredAgeChanged, setDesiredAgeChanged] = useState<boolean>(false)
  const desiredQualifications = watch('desiredQualifications') || ''
  const desiredTalent = watch('desiredTalent') || ''
  const desiredSalary = watch('desiredSalary') || ''
  const desiredNote = watch('desiredNote') || ''

  //third FormSection
  const sei = watch('sei') || ''
  const mei = watch('mei') || ''
  const seiKana = watch('seiKana') || ''
  const meiKana = watch('meiKana') || ''
  const position = watch('position') || ''
  const phoneNumber = watch('phoneNumber') || ''
  const email = watch('email') || ''
  const confirmEmail = watch('confirmEmail') || ''

  const [isOpenSearchModal, setIsOpenSearchModal] = useState(false)
  const [clubListItem, setClubListItem] = useState<Option[]>([])

  const disabled: boolean =
    !emailError &&
    !confirmEmailError &&
    !phoneNumberError &&
    !zipError &&
    !meiError &&
    !seiError &&
    !meiKanaError &&
    !seiKanaError &&
    !recruitmentError &&
    type &&
    // target && target.length > 0 &&
    organizationName &&
    applyForProject &&
    eventType &&
    eventName &&
    // gender &&
    recruitment &&
    zip &&
    address &&
    schedule &&
    isDataInOfficeHours(schedule) &&
    // workingHoursNote &&
    activityDescription &&
    desiredGender &&
    desiredAge &&
    desiredAge.length > 0 &&
    // desiredQualifications &&
    // desiredSalary &&
    // desiredNote &&
    sei &&
    mei &&
    seiKana &&
    meiKana &&
    phoneNumber &&
    email &&
    confirmEmail &&
    email == confirmEmail
      ? false
      : true

  useEffect(() => {
    targetChanged && setTargetChanged(false)
    desiredAgeChanged && setDesiredAgeChanged(false)
  }, [targetChanged, desiredAgeChanged])

  useEffect(() => {
    const exampleList = clubList

    let temp = [
      {
        value: '',
        placeholder: true,
        text: '選択してください',
        icon: IconTypeSelectBox.OFF,
        size: SelectBoxSize.PC,
      },
    ]
    exampleList.map((data, i) => {
      data.largeCategoryName == eventType &&
        temp.push({
          value: data.name,
          text: data.name,
          placeholder: false,
          icon: IconTypeSelectBox.OFF,
          size: SelectBoxSize.PC,
        })
    })
    setClubListItem([...temp])
  }, [clubList, eventType])

  function setValidationError(value: string, detectFunc: Function, setErrorFunc: Function, errorMsg: string) {
    if (value && detectFunc(value)) {
      setErrorFunc(errorMsg)
    } else {
      setErrorFunc('')
    }
  }

  useEffect(() => {
    // Validation for Emoticons
    setValidationError(sei, detectEmoticon, setSeiError, '絵文字は入力できません')
    setValidationError(mei, detectEmoticon, setMeiError, '絵文字は入力できません')
    setValidationError(seiKana, detectEmoticon, setSeiKanaError, '絵文字は入力できません')
    setValidationError(meiKana, detectEmoticon, setMeiKanaError, '絵文字は入力できません')

    // Validation for Katakana
    setValidationError(seiKana, (val: string) => !isKatakana(val), setSeiKanaError, 'カタカナで入力してください')
    setValidationError(meiKana, (val: string) => !isKatakana(val), setMeiKanaError, 'カタカナで入力してください')

    // Validation for Email
    setValidationError(email, (val: string) => !validator.isEmail(val), setEmailError, 'メールアドレスを正しく入力してください')
    setValidationError(confirmEmail, (val: string) => val !== email, setConfirmEmailError, '本メールと同じでなければなりません。')

    // Validation for Phone Number
    setValue('phoneNumber', phoneNumber.replace('-', ''))
    if (phoneNumber) {
      setValidationError(phoneNumber, (val: string) => !isStringOnlyNumbers(val), setPhoneNumberError, '電話番号を正しく入力してください')
    }

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

    // Validation for Recruitment
    setValidationError(recruitment, (val: string) => !/^(?!0+$)[0-9]{1,3}$/.test(val), setRecruitmentError, '3桁までの整数で入力してください')

    register_leaders_event_project_data = {
      ...register_leaders_event_project_data,
      type: type ? type : register_leaders_event_project_data.type,
      organizationName: organizationName ? organizationName : register_leaders_event_project_data.organizationName,
      organizationType: organizationType ? organizationType : register_leaders_event_project_data.organizationType,
      applyForProject: applyForProject ? applyForProject : register_leaders_event_project_data.applyForProject,
      eventType: eventType ? eventType : register_leaders_event_project_data.eventType,
      eventName: eventName ? eventName : register_leaders_event_project_data.eventName,
      gender: gender ? gender : register_leaders_event_project_data.gender,
      recruitment: recruitment ? recruitment : register_leaders_event_project_data.recruitment,
      workplace: {
        ...register_leaders_event_project_data.workplace,
        zip: zip ? zip.replace('-', '') : register_leaders_event_project_data.workplace.zip,
      },
      workingHoursNote: workingHoursNote ? workingHoursNote : register_leaders_event_project_data.workingHoursNote,
      activityDescription: activityDescription ? activityDescription : register_leaders_event_project_data.activityDescription,
      desiredGender: desiredGender ? desiredGender : register_leaders_event_project_data.desiredGender,
      desiredQualifications: desiredQualifications ? desiredQualifications : register_leaders_event_project_data.desiredQualifications,
      desiredTalent: desiredTalent ? desiredTalent : register_leaders_event_project_data.desiredTalent,
      desiredSalary: desiredSalary ? desiredSalary : register_leaders_event_project_data.desiredSalary,
      desiredNote: desiredNote ? desiredNote : register_leaders_event_project_data.desiredNote,
      name: {
        sei: sei ? sei : register_leaders_event_project_data.name.sei,
        mei: mei ? mei : register_leaders_event_project_data.name.mei,
        seiKana: seiKana ? seiKana : register_leaders_event_project_data.name.seiKana,
        meiKana: meiKana ? meiKana : register_leaders_event_project_data.name.meiKana,
      },
      position: position ? position : register_leaders_event_project_data.position,
      phoneNumber: phoneNumber ? phoneNumber.replace(/-/g, '') : register_leaders_event_project_data.phoneNumber,
      email: email ? email : register_leaders_event_project_data.email,
      confirmEmail: confirmEmail ? confirmEmail : register_leaders_event_project_data.confirmEmail,
    }

    localStorage.setItem(LOCAL_STORAGE_KEY.leadersProject, encrypt(JSON.stringify(register_leaders_event_project_data)))
  }, [
    type,
    organizationName,
    applyForProject,
    eventType,
    eventName,
    gender,
    recruitment,
    zip,
    workingHoursNote,
    activityDescription,
    desiredGender,
    desiredAge,
    desiredQualifications,
    desiredTalent,
    desiredSalary,
    desiredNote,
    sei,
    mei,
    seiKana,
    meiKana,
    position,
    phoneNumber,
    email,
    confirmEmail,
  ])

  const [whereToApplyList, setWhereToApplyList] = useState<Option[]>([])
  useEffect(() => {
    let tmp_register_data

    if (localStorage.getItem('project_completed') === 'completed') {
      localStorage.setItem('project_completed', 'not_completed')
      tmp_register_data = createEmptyRegisterLeadersWantedProjectToken()
    } else {
      tmp_register_data = localStorage.getItem(LOCAL_STORAGE_KEY.leadersProject) || createEmptyRegisterLeadersWantedProjectToken()
    }

    register_leaders_event_project_data = JSON.parse(decrypt(tmp_register_data))
    if (!register_leaders_event_project_data) {
      return
    }

    if (register_leaders_event_project_data.workingHours) {
      register_leaders_event_project_data.workingHours['monday'].indexOf('am') != -1 && setMonM('mon_m')
      register_leaders_event_project_data.workingHours['monday'].indexOf('pm') != -1 && setMonA('mon_a')
      register_leaders_event_project_data.workingHours['tuesday'].indexOf('am') != -1 && setFireM('fire_m')
      register_leaders_event_project_data.workingHours['tuesday'].indexOf('pm') != -1 && setFireA('fire_a')
      register_leaders_event_project_data.workingHours['wednesday'].indexOf('am') != -1 && setWaterM('water_m')
      register_leaders_event_project_data.workingHours['wednesday'].indexOf('pm') != -1 && setWaterA('water_a')
      register_leaders_event_project_data.workingHours['thursday'].indexOf('am') != -1 && setWoodM('wood_m')
      register_leaders_event_project_data.workingHours['thursday'].indexOf('pm') != -1 && setWoodA('wood_a')
      register_leaders_event_project_data.workingHours['friday'].indexOf('am') != -1 && setMetalM('metal_m')
      register_leaders_event_project_data.workingHours['friday'].indexOf('pm') != -1 && setMetalA('metal_a')
      register_leaders_event_project_data.workingHours['saturday'].indexOf('am') != -1 && setEarthM('earth_m')
      register_leaders_event_project_data.workingHours['saturday'].indexOf('pm') != -1 && setEarthA('earth_a')
      register_leaders_event_project_data.workingHours['sunday'].indexOf('am') != -1 && setSunM('sun_m')
      register_leaders_event_project_data.workingHours['sunday'].indexOf('pm') != -1 && setSunA('sun_a')
    }

    setType(register_leaders_event_project_data.type || '')
    setSchedule(register_leaders_event_project_data.workingHours || '')
    setTarget(register_leaders_event_project_data.target || [])
    setValue('organizationName', register_leaders_event_project_data.organizationName)
    setApplyForProject(register_leaders_event_project_data.applyForProject || '')
    setEventType(register_leaders_event_project_data.eventType || '')
    setEventName(register_leaders_event_project_data.eventName || '')
    setGender(register_leaders_event_project_data.gender || '')
    setValue('recruitment', register_leaders_event_project_data.recruitment || '')
    setValue('zip', register_leaders_event_project_data.workplace.zip || '')
    setValue(
      'address',
      `${register_leaders_event_project_data.workplace.prefecture}${register_leaders_event_project_data.workplace.city}${register_leaders_event_project_data.workplace.address2}`,
    )
    setValue('workingHoursNote', register_leaders_event_project_data.activityDescription || '')
    setValue('activityDescription', register_leaders_event_project_data.activityDescription || '')
    setDesiredGender(register_leaders_event_project_data.desiredGender || '')
    setDesiredAge(register_leaders_event_project_data.desiredAge || [])
    setValue('desiredQualifications', register_leaders_event_project_data.desiredQualifications || '')
    setValue('desiredTalent', register_leaders_event_project_data.desiredTalent || '')
    setValue('desiredSalary', register_leaders_event_project_data.desiredSalary || '')
    setValue('desiredNote', register_leaders_event_project_data.desiredNote || '')
    setValue('sei', register_leaders_event_project_data.name.sei || '')
    setValue('mei', register_leaders_event_project_data.name.mei || '')
    setValue('seiKana', register_leaders_event_project_data.name.seiKana || '')
    setValue('meiKana', register_leaders_event_project_data.name.meiKana || '')
    setValue('position', register_leaders_event_project_data.position || '')
    setValue('phoneNumber', register_leaders_event_project_data.phoneNumber || '')
    setValue('email', register_leaders_event_project_data.email || '')
    setValue('confirmEmail', register_leaders_event_project_data.confirmEmail || '')

    const fetchCoordinators = async () => {
      // コーディネーター一覧を取得
      const prefecture = getPrefectureFromHostname()
      const res = await fetch(`/api/coordinators?prefecture=${prefecture}`, {
        method: 'GET',
        headers: {
          'Content-Type': 'application/json',
        },
      })

      const resJson = (await res.json()) as { coordinators: { organizationName: string }[] }
      const options = resJson.coordinators.map((coordinator) => {
        return {
          value: coordinator.organizationName,
          text: coordinator.organizationName,
          placeholder: false,
          icon: IconTypeSelectBox.OFF,
          size: SelectBoxSize.PC,
        }
      })
      setWhereToApplyList([
        {
          value: '',
          placeholder: true,
          text: '選択してください',
          icon: IconTypeSelectBox.OFF,
          size: SelectBoxSize.PC,
        },
        ...options,
      ])
    }
    fetchCoordinators()
  }, [])

  const setOfficeHour = (day: string, type: string) => {
    tmp_register_data = localStorage.getItem(LOCAL_STORAGE_KEY.leadersProject)
    if (!tmp_register_data) {
      tmp_register_data = createEmptyRegisterLeadersWantedProjectToken()
    }

    register_leaders_event_project_data = JSON.parse(decrypt(tmp_register_data))

    const { workingHours } = register_leaders_event_project_data
    const info: ScheduleType | undefined = workingHours
    scheduleInfo = JSON.parse(JSON.stringify(info))

    if (scheduleInfo) {
      const pos = scheduleInfo[`${day}`].indexOf(type)
      pos == -1 ? scheduleInfo[`${day}`].push(type) : scheduleInfo[`${day}`].splice(pos, 1)

      setSchedule(scheduleInfo)
      localStorage.setItem(
        LOCAL_STORAGE_KEY.leadersProject,
        encrypt(
          JSON.stringify({
            ...register_leaders_event_project_data,
            workingHours: { ...scheduleInfo },
          }),
        ),
      )
    }
  }

  // search zip code
  const searchZipCode = async () => {
    if (zip) {
      let tmp_zip = zip.replace('-', '')
      const address_data = await getAddressDataByZipCode(tmp_zip)

      if (address_data) {
        setZipContent('')
        const index = prefectureList.findIndex((element) => element.prefecture == address_data.prefectureName)
        setWorkPlace({
          ...workplace,
          zip: tmp_zip,
          address1: address_data.areaName ? address_data.areaName : workplace.address1,
          address2: address_data.address1 ? address_data.address1 : workplace.address2,
          city: address_data.cityName ? address_data.city : workplace.city,
          prefecture: index != -1 ? prefectureList[index].prefecture : workplace.prefecture,
        })

        localStorage.setItem(
          LOCAL_STORAGE_KEY.leadersProject,
          encrypt(
            JSON.stringify({
              ...register_leaders_event_project_data,
              workplace: {
                zip: tmp_zip,
                address1: address_data.areaName ? address_data.areaName : workplace.address1,
                address2: address_data.address1 ? address_data.address1 : workplace.address2,
                city: address_data.cityName ? address_data.cityName : workplace.city,
                prefecture: index != -1 ? prefectureList[index].prefecture : workplace.prefecture,
              },
            }),
          ),
        )

        setValue('address', `${index != -1 && prefectureList[index].prefecture}${address_data.cityName}${address_data.address1}`)
      } else {
        setZipContent('無効な郵便番号。')
      }
    }
  }

  const checkTargetBox = (value: string) => {
    const updatedTarget = target.includes(value) ? target.filter((item) => item !== value) : [...target, value]
    setTarget(updatedTarget)

    localStorage.setItem(
      LOCAL_STORAGE_KEY.leadersProject,
      encrypt(
        JSON.stringify({
          ...register_leaders_event_project_data,
          target: updatedTarget,
        }),
      ),
    )
    setTargetChanged(true)
  }

  const checkDesiredAgeBox = (key: string) => {
    if (desiredAge.includes(key)) {
      desiredAge.splice(desiredAge.indexOf(key), 1)
      setDesiredAge(desiredAge)
      setDesiredAgeChanged(true)
    } else {
      desiredAge.push(key)
      setDesiredAge(desiredAge)
    }

    localStorage.setItem(
      LOCAL_STORAGE_KEY.leadersProject,
      encrypt(
        JSON.stringify({
          ...register_leaders_event_project_data,
          desiredAge: [...desiredAge],
        }),
      ),
    )

    setDesiredAgeChanged(true)
  }

  const selectType = (value: string) => {
    setValue('organizationName', '')
    setValue('organizationType', '')
    setTarget([])
    setType(value)

    localStorage.setItem(
      LOCAL_STORAGE_KEY.leadersProject,
      encrypt(
        JSON.stringify({
          ...register_leaders_event_project_data,
          target: [],
          type: value,
          organizationName: '',
          organizationType: '',
        }),
      ),
    )
    setTargetChanged(true)
  }

  const closeSchoolSearchModal = (schoolNames?: string[], schoolType?: string) => {
    if (!schoolNames || !schoolType) {
      setIsOpenSearchModal(false)
      return
    }

    const schoolName = schoolNames.filter((item) => item !== '')
    const organizationType = organizationTypeList.find((item) => item.id == schoolType)
    setValue('organizationName', schoolName.join(', '))
    setValue('organizationType', organizationType?.name)
    setIsOpenSearchModal(false)
  }

  return (
    <div className="h-full ">
      <SchoolLayout>
        <div className="relative">
          <div className="fixed pc:top-[104px] sp:top-[74px] pc:left-10 sp:left-[10px]">
            <BackButton
              onClick={() => {
                Router.push('/')
              }}
            />
          </div>
          <div className="flex flex-col items-center py-10 gap-10 sp:px-[20px] max-w-[880px] m-auto pc:px-0">
            <div className="pc:text-h1 sp:text-h2">募集依頼内容入力</div>
            <FormSection title="学校・チーム情報" subTitle="※学校・チーム名はスカウトした候補者のみに提示されます">
              <div className="flex flex-col items-start w-full gap-4 pc:px-10 sp:px-7 ">
                <Label text="区分" requiredLabelText="必須" icon={IconTypeLabel.OFF} status={RequiredLabelType.REQUIRED} />
                <div className="flex items-start pc:flex-row pc:gap-10 sp:gap-3 sp:flex-col">
                  <RadioButton name="school" value={type} disabled={false} text="学 校" setValue={(value) => selectType(value.toString())} />
                  <RadioButton name="team" value={type} disabled={false} text="合同チーム" setValue={(value) => selectType(value.toString())} />
                  <RadioButton name="club" value={type} disabled={false} text="地域クラブ" setValue={(value) => selectType(value.toString())} />
                </div>
                {type == 'school' ? (
                  <div className="flex flex-col items-start gap-[2px]">
                    <div onClick={() => setIsOpenSearchModal(true)}>
                      <Input
                        control={control}
                        placeholder="学校検索"
                        status={InputStatus.SEARCH}
                        type={InputType.BOX}
                        name="organizationName"
                        className=" pc:w-[400px] sp:w-[222px]"
                      />
                    </div>
                    <div className="text-timestamp">
                      当てはまる学校が無い場合は
                      <Link
                        href="https://www.notion.so/844496564e0740e9b293f190f687836f?pvs=4"
                        target="_blank"
                        className="border-b text-core-blue border-core-blue"
                      >
                        こちら
                      </Link>
                    </div>
                  </div>
                ) : type == 'team' ? (
                  <>
                    <div className="flex flex-col items-start gap-2 ">
                      <div className="text-body_pc">対象</div>

                      <div className="items-center gap-5 sp:grid pc:grid-cols-4 sp:grid-cols-1">
                        <CheckBox
                          text={CONSTANT.ELEMENTARY_STUDENT}
                          name={CONSTANT.ELEMENTARY_STUDENT}
                          onChange={() => checkTargetBox(CONSTANT.ELEMENTARY_STUDENT)}
                          backgroundColor={CheckBoxColor.GrayLighter}
                          className=" w-[185px]"
                          value={target.includes(CONSTANT.ELEMENTARY_STUDENT) ? CONSTANT.ELEMENTARY_STUDENT : ''}
                        />
                        <CheckBox
                          text={CONSTANT.JUNIOR_HIGH_STUDENT}
                          name={CONSTANT.JUNIOR_HIGH_STUDENT}
                          onChange={() => checkTargetBox(CONSTANT.JUNIOR_HIGH_STUDENT)}
                          backgroundColor={CheckBoxColor.GrayLighter}
                          className=" w-[185px]"
                          value={target.includes(CONSTANT.JUNIOR_HIGH_STUDENT) ? CONSTANT.JUNIOR_HIGH_STUDENT : ''}
                        />
                        <CheckBox
                          text={CONSTANT.HIGH_SCHOOL_STUDENT}
                          name={CONSTANT.HIGH_SCHOOL_STUDENT}
                          onChange={() => checkTargetBox(CONSTANT.HIGH_SCHOOL_STUDENT)}
                          backgroundColor={CheckBoxColor.GrayLighter}
                          className=" w-[185px]"
                          value={target.includes(CONSTANT.HIGH_SCHOOL_STUDENT) ? CONSTANT.HIGH_SCHOOL_STUDENT : ''}
                        />
                        <CheckBox
                          text={CONSTANT.COLLEGE_STUDENT_OR_GENERAL}
                          name={CONSTANT.COLLEGE_STUDENT_OR_GENERAL}
                          onChange={() => checkTargetBox(CONSTANT.COLLEGE_STUDENT_OR_GENERAL)}
                          backgroundColor={CheckBoxColor.GrayLighter}
                          className=" w-[185px]"
                          value={target.includes(CONSTANT.COLLEGE_STUDENT_OR_GENERAL) ? CONSTANT.COLLEGE_STUDENT_OR_GENERAL : ''}
                        />
                      </div>
                    </div>

                    <div className="flex flex-col items-start gap-1">
                      <Input control={control} name="organizationName" className=" pc:w-[400px] sp:w-[250px]" />
                      <div className="text-timestamp">合同チームの名称を入力してください</div>
                    </div>
                  </>
                ) : (
                  type == 'club' && (
                    <>
                      <div className="flex flex-col items-start gap-2 ">
                        <div className="text-body_pc">対象</div>

                        <div className="items-center gap-5 sp:grid pc:grid-cols-4 sp:grid-cols-1">
                          <CheckBox
                            text={CONSTANT.ELEMENTARY_STUDENT}
                            name={CONSTANT.ELEMENTARY_STUDENT}
                            onChange={() => checkTargetBox(CONSTANT.ELEMENTARY_STUDENT)}
                            backgroundColor={CheckBoxColor.GrayLighter}
                            className=" w-[185px]"
                            value={target.includes(CONSTANT.ELEMENTARY_STUDENT) ? CONSTANT.ELEMENTARY_STUDENT : ''}
                          />
                          <CheckBox
                            text={CONSTANT.JUNIOR_HIGH_STUDENT}
                            name={CONSTANT.JUNIOR_HIGH_STUDENT}
                            onChange={() => checkTargetBox(CONSTANT.JUNIOR_HIGH_STUDENT)}
                            backgroundColor={CheckBoxColor.GrayLighter}
                            className=" w-[185px]"
                            value={target.includes(CONSTANT.JUNIOR_HIGH_STUDENT) ? CONSTANT.JUNIOR_HIGH_STUDENT : ''}
                          />
                          <CheckBox
                            text={CONSTANT.HIGH_SCHOOL_STUDENT}
                            name={CONSTANT.HIGH_SCHOOL_STUDENT}
                            onChange={() => checkTargetBox(CONSTANT.HIGH_SCHOOL_STUDENT)}
                            backgroundColor={CheckBoxColor.GrayLighter}
                            className=" w-[185px]"
                            value={target.includes(CONSTANT.HIGH_SCHOOL_STUDENT) ? CONSTANT.HIGH_SCHOOL_STUDENT : ''}
                          />
                          <CheckBox
                            text={CONSTANT.COLLEGE_STUDENT_OR_GENERAL}
                            name={CONSTANT.COLLEGE_STUDENT_OR_GENERAL}
                            onChange={() => checkTargetBox(CONSTANT.COLLEGE_STUDENT_OR_GENERAL)}
                            backgroundColor={CheckBoxColor.GrayLighter}
                            className=" w-[185px]"
                            value={target.includes(CONSTANT.COLLEGE_STUDENT_OR_GENERAL) ? CONSTANT.COLLEGE_STUDENT_OR_GENERAL : ''}
                          />
                        </div>
                      </div>

                      <div className="flex flex-col items-start gap-1">
                        <Input control={control} name="organizationName" className=" pc:w-[400px] sp:w-[250px]" />
                        <div className="text-timestamp">地域クラブの名称を入力してください</div>
                      </div>
                    </>
                  )
                )}
              </div>

              <div className="flex flex-col items-start w-full gap-4 pc:px-10 sp:px-7 ">
                <Label text="募集申請先" requiredLabelText="必須" icon={IconTypeLabel.OFF} status={RequiredLabelType.REQUIRED} />
                <div className="flex flex-col items-start gap-[2px]">
                  <SelectBox
                    value={applyForProject}
                    setValue={(value) => {
                      setApplyForProject(value)
                    }}
                    size={SelectBoxSize.PC}
                    status={SelectBoxType.DEFAULT}
                    options={whereToApplyList}
                    className=" sp:w-[222px] pc:w-[400px]"
                  />
                  <div className="text-timestamp">
                    募集申請先が無い場合は
                    <Link
                      href="https://asfeel.notion.site/6671675aa8214572bd576cce99f7500d?pvs=4"
                      className="border-b text-core-blue border-core-blue"
                      target="_blank"
                    >
                      こちら
                    </Link>
                  </div>
                </div>
              </div>

              <div className="flex flex-col items-start w-full gap-4 pc:px-10 sp:px-7 ">
                <Label text="種目" requiredLabelText="必須" icon={IconTypeLabel.OFF} status={RequiredLabelType.REQUIRED} />
                <div className="flex flex-col items-start gap-2">
                  <div className="text-body_sp">部活タイプ</div>
                  <SelectBox
                    value={eventType}
                    setValue={(value) => setEventType(value)}
                    size={SelectBoxSize.PC}
                    status={SelectBoxType.DEFAULT}
                    options={[
                      {
                        value: '',
                        placeholder: true,
                        text: '選択してください',
                        icon: IconTypeSelectBox.OFF,
                        size: SelectBoxSize.PC,
                      },
                      {
                        value: '運動系',
                        text: '運動系',
                        size: SelectBoxSize.PC,
                        icon: IconTypeSelectBox.OFF,
                      },
                      {
                        value: '文化系',
                        text: '文化系',
                        size: SelectBoxSize.PC,
                        icon: IconTypeSelectBox.OFF,
                      },
                    ]}
                    className=" sp:w-[222px] pc:w-[400px]"
                  />
                </div>
                <div className="flex flex-col items-start gap-2">
                  <div className="text-body_sp">種目</div>
                  <div className="flex flex-col items-start gap-0.5">
                    {clubListItem && clubListItem.length > 1 && (
                      <SelectBox
                        value={eventName}
                        setValue={(value) => setEventName(value)}
                        size={SelectBoxSize.PC}
                        status={SelectBoxType.DEFAULT}
                        options={...clubListItem}
                        className=" sp:w-[222px] pc:w-[400px]"
                      />
                    )}
                    <div className="text-timestamp">
                      当てはまる種目が無い場合は
                      <Link
                        href="https://www.notion.so/06ab7f25ea5c4c288a2f9fa8f21dd798?pvs=4"
                        target="_blank"
                        className="border-b text-core-blue border-core-blue"
                      >
                        こちら
                      </Link>
                    </div>
                  </div>
                </div>
                <div className="flex flex-col items-start gap-2">
                  <div className="text-body_sp">男女区分</div>
                  <div className="flex flex-row items-start pc:gap-10 sp:gap-3">
                    <RadioButton name="男子" value={gender} disabled={false} text="男子" setValue={setGender} />
                    <RadioButton name="女子" value={gender} disabled={false} text="女子" setValue={setGender} />
                    <RadioButton name="男女" value={gender} disabled={false} text="男女" setValue={setGender} />
                  </div>
                </div>
              </div>

              <div className="flex flex-col items-start w-full pc:px-10 sp:px-7 ">
                <Label text="募集人数" requiredLabelText="必須" icon={IconTypeLabel.OFF} status={RequiredLabelType.REQUIRED} />
                <div className="flex flex-row items-end gap-3 pt-4 pb-1">
                  <Input control={control} name="recruitment" className=" w-[100px]" status={InputStatus.Number} />
                  <div className="text-body_pc">名</div>
                </div>
                {recruitmentError != '' && <div className={'pc:text-timestamp text-[12px] text-core-red'}>{recruitmentError}</div>}
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
                    <Input control={control} name="address" disabled={true} className=" pc:w-[400px] sp:w-[222px] bg-gray-gray_light" />
                  </div>
                </div>
              </div>

              <div className="flex flex-col items-start w-full gap-4 pc:px-10 sp:px-7">
                <Label text="勤務時間" requiredLabelText="必須" icon={IconTypeLabel.OFF} status={RequiredLabelType.REQUIRED} />
                <div className="flex flex-col items-start gap-4">
                  <div className="flex flex-row gap-10 px-5 ">
                    <div className="m-auto pc:text-h4 sp:text-h5">月</div>
                    <div className="flex items-start pc:flex-row pc:gap-10 sp:gap-4 sp:flex-col">
                      <CheckBox
                        text="午 前"
                        name="mon_m"
                        onChange={() => {
                          setMonM(mon_m == 'mon_m' ? '' : 'mon_m'), setOfficeHour('monday', 'am')
                        }}
                        backgroundColor={CheckBoxColor.GrayLighter}
                        className=" w-[100px]"
                        value={mon_m}
                      />
                      <CheckBox
                        text="午 後"
                        name="mon_a"
                        onChange={() => {
                          setMonA(mon_a == 'mon_a' ? '' : 'mon_a'), setOfficeHour('monday', 'pm')
                        }}
                        value={mon_a}
                        backgroundColor={CheckBoxColor.GrayLighter}
                        className=" w-[100px]"
                      />
                    </div>
                  </div>
                  <div className="flex flex-row gap-10 px-5 ">
                    <div className="m-auto pc:text-h4 sp:text-h5">火</div>
                    <div className="flex items-start pc:flex-row pc:gap-10 sp:gap-4 sp:flex-col">
                      <CheckBox
                        text="午 前"
                        name="fire_m"
                        onChange={() => {
                          setFireM(fire_m == 'fire_m' ? '' : 'fire_m'), setOfficeHour('tuesday', 'am')
                        }}
                        backgroundColor={CheckBoxColor.GrayLighter}
                        className=" w-[100px]"
                        value={fire_m}
                      />
                      <CheckBox
                        text="午 後"
                        name="fire_a"
                        onChange={() => {
                          setFireA(fire_a == 'fire_a' ? '' : 'fire_a'), setOfficeHour('tuesday', 'pm')
                        }}
                        value={fire_a}
                        backgroundColor={CheckBoxColor.GrayLighter}
                        className=" w-[100px]"
                      />
                    </div>
                  </div>
                  <div className="flex flex-row gap-10 px-5 ">
                    <div className="m-auto pc:text-h4 sp:text-h5">水</div>
                    <div className="flex items-start pc:flex-row pc:gap-10 sp:gap-4 sp:flex-col">
                      <CheckBox
                        text="午 前"
                        name="water_m"
                        onChange={() => {
                          setWaterM(water_m == 'water_m' ? '' : 'water_m'), setOfficeHour('wednesday', 'am')
                        }}
                        backgroundColor={CheckBoxColor.GrayLighter}
                        className=" w-[100px]"
                        value={water_m}
                      />
                      <CheckBox
                        text="午 後"
                        name="water_a"
                        onChange={() => {
                          setWaterA(water_a == 'water_a' ? '' : 'water_a'), setOfficeHour('wednesday', 'pm')
                        }}
                        value={water_a}
                        backgroundColor={CheckBoxColor.GrayLighter}
                        className=" w-[100px]"
                      />
                    </div>
                  </div>
                  <div className="flex flex-row gap-10 px-5 ">
                    <div className="m-auto pc:text-h4 sp:text-h5">木</div>
                    <div className="flex items-start pc:flex-row pc:gap-10 sp:gap-4 sp:flex-col">
                      <CheckBox
                        text="午 前"
                        name="wood_m"
                        onChange={() => {
                          setWoodM(wood_m == 'wood_m' ? '' : 'wood_m'), setOfficeHour('thursday', 'am')
                        }}
                        backgroundColor={CheckBoxColor.GrayLighter}
                        className=" w-[100px]"
                        value={wood_m}
                      />
                      <CheckBox
                        text="午 後"
                        name="wood_a"
                        onChange={() => {
                          setWoodA(wood_a == 'wood_a' ? '' : 'wood_a'), setOfficeHour('thursday', 'pm')
                        }}
                        value={wood_a}
                        backgroundColor={CheckBoxColor.GrayLighter}
                        className=" w-[100px]"
                      />
                    </div>
                  </div>
                  <div className="flex flex-row gap-10 px-5 ">
                    <div className="m-auto pc:text-h4 sp:text-h5">金</div>
                    <div className="flex items-start pc:flex-row pc:gap-10 sp:gap-4 sp:flex-col">
                      <CheckBox
                        text="午 前"
                        name="metal_m"
                        onChange={() => {
                          setMetalM(metal_m == 'metal_m' ? '' : 'metal_m'), setOfficeHour('friday', 'am')
                        }}
                        backgroundColor={CheckBoxColor.GrayLighter}
                        className=" w-[100px]"
                        value={metal_m}
                      />
                      <CheckBox
                        text="午 後"
                        name="metal_a"
                        onChange={() => {
                          setMetalA(metal_a == 'metal_a' ? '' : 'metal_a'), setOfficeHour('friday', 'pm')
                        }}
                        value={metal_a}
                        backgroundColor={CheckBoxColor.GrayLighter}
                        className=" w-[100px]"
                      />
                    </div>
                  </div>
                  <div className="flex flex-row gap-10 px-5 ">
                    <div className="m-auto pc:text-h4 sp:text-h5">土</div>
                    <div className="flex items-start pc:flex-row pc:gap-10 sp:gap-4 sp:flex-col">
                      <CheckBox
                        text="午 前"
                        name="earth_m"
                        onChange={() => {
                          setEarthM(earth_m == 'earth_m' ? '' : 'earth_m'), setOfficeHour('saturday', 'am')
                        }}
                        backgroundColor={CheckBoxColor.GrayLighter}
                        className=" w-[100px]"
                        value={earth_m}
                      />
                      <CheckBox
                        text="午 後"
                        name="earth_a"
                        onChange={() => {
                          setEarthA(earth_a == 'earth_a' ? '' : 'earth_a'), setOfficeHour('saturday', 'pm')
                        }}
                        value={earth_a}
                        backgroundColor={CheckBoxColor.GrayLighter}
                        className=" w-[100px]"
                      />
                    </div>
                  </div>
                  <div className="flex flex-row gap-10 px-5 ">
                    <div className="m-auto pc:text-h4 sp:text-h5">日</div>
                    <div className="flex items-start pc:flex-row pc:gap-10 sp:gap-4 sp:flex-col">
                      <CheckBox
                        text="午 前"
                        name="sun_m"
                        onChange={() => {
                          setSunM(sun_m == 'sun_m' ? '' : 'sun_m'), setOfficeHour('sunday', 'am')
                        }}
                        backgroundColor={CheckBoxColor.GrayLighter}
                        className=" w-[100px]"
                        value={sun_m}
                      />
                      <CheckBox
                        text="午 後"
                        name="sun_a"
                        onChange={() => {
                          setSunA(sun_a == 'sun_a' ? '' : 'sun_a'), setOfficeHour('sunday', 'pm')
                        }}
                        value={sun_a}
                        backgroundColor={CheckBoxColor.GrayLighter}
                        className=" w-[100px]"
                      />
                    </div>
                  </div>
                </div>
                <div className="flex pc:flex-row sp:flex-col items-start w-full pc:gap-6 sp:gap-3 pl-5">
                  <div className="text-h4 whitespace-nowrap">補足</div>
                  <div className="flex flex-col items-start w-full gap-1">
                    <Input control={control} type={InputType.AREA} name="workingHoursNote" className="w-full" />
                    <div className="text-timestamp">勤務時間等について, 補足事項があればご記入ください</div>
                  </div>
                </div>
              </div>

              <div className="flex flex-col items-start w-full gap-4 pc:px-10 sp:px-7">
                <Label text="活動の紹介" requiredLabelText="必須" icon={IconTypeLabel.OFF} status={RequiredLabelType.REQUIRED} />
                <div className="flex flex-col w-full gap-1">
                  <Input control={control} type={InputType.AREA} name="activityDescription" className="w-full" />
                  <div className="text-timestamp">
                    例1）県大会ベスト4以上の実績があり全国大会を目指しています <br />
                    例2）初心者中心で部員数も少ないですが楽しみながら頑張っています
                  </div>
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
                  <RadioButton name="男性" value={desiredGender} disabled={false} text="男性" setValue={setDesiredGender} />
                  <RadioButton name="女性" value={desiredGender} disabled={false} text="女性" setValue={setDesiredGender} />
                  <RadioButton name="どちらでも" value={desiredGender} disabled={false} text="どちらでも" setValue={setDesiredGender} />
                </div>
              </div>

              <div className="flex flex-col items-start w-full gap-4 pc:px-10 sp:px-7 ">
                <div className="flex pc:items-center sp:items-start pc:gap-4 pc:flex-row sp:flex-col sp:gap-1">
                  <Label text="年齢" requiredLabelText="必須" icon={IconTypeLabel.OFF} status={RequiredLabelType.REQUIRED} />
                  <div className="text-timestamp">※募集者には公開されません</div>
                </div>
                <div className="items-start gap-5 lg:flex-row lg:flex md:grid-cols-2 md:grid sp:grid sp:grid-cols-2">
                  <CheckBox
                    text="10代"
                    name="10代"
                    onChange={() => checkDesiredAgeBox('10代')}
                    backgroundColor={CheckBoxColor.GrayLighter}
                    className=" pc:w-[110px] sp:[100px]"
                    value={desiredAge.includes('10代') == true ? '10代' : ''}
                  />
                  <CheckBox
                    text="20代"
                    name="20代"
                    onChange={() => checkDesiredAgeBox('20代')}
                    backgroundColor={CheckBoxColor.GrayLighter}
                    className="  pc:w-[110px] sp:[100px]"
                    value={desiredAge.includes('20代') == true ? '20代' : ''}
                  />
                  <CheckBox
                    text="30代"
                    name="30代"
                    onChange={() => checkDesiredAgeBox('30代')}
                    backgroundColor={CheckBoxColor.GrayLighter}
                    className="  pc:w-[110px] sp:[100px]"
                    value={desiredAge.includes('30代') == true ? '30代' : ''}
                  />
                  <CheckBox
                    text="40代"
                    name="40代"
                    onChange={() => checkDesiredAgeBox('40代')}
                    backgroundColor={CheckBoxColor.GrayLighter}
                    className="  pc:w-[110px] sp:[100px]"
                    value={desiredAge.includes('40代') == true ? '40代' : ''}
                  />
                  <CheckBox
                    text="50代"
                    name="50代"
                    onChange={() => checkDesiredAgeBox('50代')}
                    backgroundColor={CheckBoxColor.GrayLighter}
                    className="  pc:w-[110px] sp:[100px]"
                    value={desiredAge.includes('50代') == true ? '50代' : ''}
                  />
                  <CheckBox
                    text="60代以上"
                    name="60代以上"
                    onChange={() => checkDesiredAgeBox('60代以上')}
                    backgroundColor={CheckBoxColor.GrayLighter}
                    className=" pc:w-[150px] sp:w-[110px]"
                    value={desiredAge.includes('60代以上') == true ? '60代以上' : ''}
                  />
                </div>
              </div>

              <div className="flex flex-col items-start w-full gap-4 pc:px-10 sp:px-7">
                <Label text="資格に関する希望" requiredLabelText="任意" icon={IconTypeLabel.OFF} status={RequiredLabelType.OPTIONAL} />
                <div className="flex flex-col w-full gap-1 ">
                  <Input control={control} type={InputType.AREA} name="desiredQualifications" className="w-full" />
                  <div className="text-timestamp">
                    例1）部活動指導員や教員免許を取得もしくは取得予定
                    <br />
                    例2）競技指導資格の取得を将来的に考えている方
                  </div>
                </div>
              </div>

              <div className="flex flex-col items-start w-full gap-4 pc:px-10 sp:px-7">
                <Label text="求める人材" requiredLabelText="任意" icon={IconTypeLabel.OFF} status={RequiredLabelType.OPTIONAL} />
                <div className="flex flex-col w-full gap-1">
                  <Input control={control} type={InputType.AREA} name="desiredTalent" className="w-full" />
                  <div className="text-timestamp">
                    例1）指導経験のある方 <br />
                    例2）大会や合宿等の遠征同行できる方
                  </div>
                </div>
              </div>

              <div className="flex flex-col items-start w-full gap-4 pc:px-10 sp:px-7">
                <Label text="給与・報酬" requiredLabelText="任意" icon={IconTypeLabel.OFF} status={RequiredLabelType.OPTIONAL} />
                <div className="flex flex-col w-full gap-1">
                  <Input control={control} type={InputType.AREA} name="desiredSalary" className="w-full" />
                  <div className="text-timestamp">例）時給○○円 / 日当○○円 / 保有資格により要相談</div>
                </div>
              </div>

              <div className="flex flex-col items-start w-full gap-4 pc:px-10 sp:px-7">
                <div className="flex pc:items-center sp:items-start pc:gap-4 pc:flex-row sp:flex-col sp:gap-1">
                  <Label text="備考" requiredLabelText="任意" icon={IconTypeLabel.OFF} status={RequiredLabelType.OPTIONAL} />
                  <div className="text-timestamp">※募集者には公開されません</div>
                </div>
                <div className="flex flex-col w-full gap-1">
                  <Input control={control} type={InputType.AREA} name="desiredNote" className="w-full" />
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
                  <div className="text-timestamp">※募集者には公開されません</div>
                </div>

                <Input control={control} name="position" className=" pc:w-[200px] sp:w-[222px]" />
              </div>

              <div className="flex flex-col items-start w-full gap-4 pc:px-10 sp:px-7 ">
                <div className="flex pc:items-center sp:items-start pc:gap-4 pc:flex-row sp:flex-col sp:gap-1">
                  <Label text="電話番号" requiredLabelText="必須" icon={IconTypeLabel.OFF} status={RequiredLabelType.REQUIRED} />
                  <div className="text-timestamp">※募集者には公開されません</div>
                </div>

                <div className="flex flex-col items-start gap-1">
                  <FormField
                    control={control}
                    input={{
                      name: 'phoneNumber',
                      placeholder: '09012345678',
                      status: InputStatus.DEFAULT,
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
                  <div className="text-timestamp">※募集者には公開されません</div>
                </div>

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

                <div className="flex flex-col items-start gap-1 sp:w-full">
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

        {isOpenSearchModal && (
          <SchoolSearchSingle
            value={organizationName.split(', ')}
            closeModal={(schoolNames, schoolType) => closeSchoolSearchModal(schoolNames, schoolType)}
          />
        )}
      </SchoolLayout>
    </div>
  )
}
