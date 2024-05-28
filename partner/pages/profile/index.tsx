import { useView } from '@/hooks'
import AfterLoginLayout from '@/components/layouts/AfterLoginLayout'
import { TopProfile, TopProfileType } from '@/components/organisms'
import Tab, { TabSize } from '@/components/atoms/PageTop/Tab'
import { State } from '@/components/parts'
import { useCallback, useEffect, useState } from 'react'
import { AiFillWarning } from 'react-icons/ai'
import Button, {
  ButtonArrow,
  ButtonColor,
  ButtonIcon,
  ButtonShape,
  ButtonSize,
  ButtonType,
} from '@/components/atoms/Button/Button'
import { useRouter } from 'next/router'
import { HiOutlineCheck, HiPencil, HiPlus } from 'react-icons/hi'
import Schedule from '@/components/molecules/Table/Schedule'
import CheckBox, { CheckBoxColor } from '@/components/atoms/Button/CheckBox'
import { FormField } from '@/components/molecules'
import { useForm } from 'react-hook-form'
import { AttentionType, Input, InputStatus, InputType } from '@/components/atoms'
import { MdArrowForwardIos, MdEdit } from 'react-icons/md'
import AddBioCard from '@/components/organisms/modal/AddBioCard'
import SelectBox, { IconTypeSelectBox, SelectBoxSize, SelectBoxType } from '@/components/atoms/Input/SelectBox'
import DatePickerComponent from '@/components/organisms/Calendar'
import { Timestamp, getDoc, getDocs, query, where } from 'firebase/firestore'
import { setPrivateUser } from '@/firebase/privateUser'
import { PrivateUser } from '@/models'
import {
  isDataInOfficeHours,
  convFirebaseToDateFormat,
  calculateAge,
  dateFormat,
  formatZip,
  isStringOnlyNumbers,
  isKatakana,
  detectEmoticon,
  setValidationError,
  objectToDate,
  isNotNull,
  isNotEmpty,
  arrayToMap,
  isNotNullOrEmpty,
} from '@/utils/common'
var groupArray = require('group-array')
import { useAppSelector, useAppDispatch } from '@/store'
import {
  setStoreChangeEmail,
  setStoreProfileActiveTab,
  setStoreProfileEditState,
  setStoreProfileOrganizationGrade,
  setStoreUserInfo,
  setStoreUserInfoFromProfile,
} from '@/store/reducers/profile'
import { Career, Option, QuestionsForPrefecture, ScheduleType } from '@/types'
import {
  ExpeditionPossibleEnumKeys,
  GenderEnumKeys,
  TeacherLicenseStatusEnumKeys,
  expeditionPossibleEnum,
  genderEnum,
  subscriptMailEnum,
  teacherLicenseStatusEnum,
} from '@/enums'
import { jobTypeList } from '@/utils/constants'
import { getAddressDataByZipCode } from '@/firebase/address'
import { uploadImage } from '@/libs/firebase/firebase'
import { setStoreLoading } from '@/store/reducers/global'
import CloseAccount from '@/components/organisms/modal/CloseAccount'
import { ColRef, DocRef, getDocIdWithData } from '@/libs/firebase/firestore'
import { useAuthUserStateProvider } from '@/hooks/useAuthUserStateProvider'
import RadioButtonBoolean from '@/components/atoms/Button/RadioButtonForBoolean'
import RadioButtonForEnum from '@/components/atoms/Button/RadioButtonForEnum'
import useSystemName from '@/hooks/useSystemName'
import { EXTERNAL_URLS } from '@/utils/constants/externalUrls'
import { LOCAL_STORAGE } from '@/utils/constants/localStorage'
import { getCityPopulateList } from '@/firebase/city'
import { getClubTypeCategoryPopulateList } from '@/firebase/clubTypeCategory'

export default function Profile() {
  const view = useView()
  const router = useRouter()
  const dispatch = useAppDispatch()
  const { control, watch, setValue } = useForm({})
  const { systemName } = useSystemName()

  const { authUser, clubList, cityList } = useAppSelector((state) => state.global)
  const {
    isProfileEdit,
    isProfileEmailChange,
    profileActiveTab,
    organizationGrade,
    organizationName,
    userInfo,
    initUserInfo,
  } = useAppSelector((state) => state.profile)
  const { logout } = useAuthUserStateProvider()
  dispatch(setStoreProfileOrganizationGrade('4'))

  var scheduleInfo: ScheduleType | undefined = {
    monday: [],
    tuesday: [],
    wednesday: [],
    thursday: [],
    friday: [],
    saturday: [],
    sunday: [],
  }

  const [profileInfo, setProfileInfo] = useState<PrivateUser>(userInfo)

  // タブ
  const [isEdit, setIsEdit] = useState<boolean>(isProfileEdit ? isProfileEdit : false)
  const [activeTab, setActiveTab] = useState<number>(profileActiveTab ? profileActiveTab : 0)

  // プロフィール入力状況フラグ
  const [isCompletedSkillInfo, setIsCompletedSkillInfo] = useState(false)
  const [isCompletedBasicInfo, setIsCompletedBasicInfo] = useState(false)
  const [isCompletedProfile, setIsCompletedProfile] = useState(false)
  const [isEnabledSkillButton, setIsEnabledSkillButton] = useState(false)

  // error
  const [seiError, setSeiError] = useState<string>('')
  const [meiError, setMeiError] = useState<string>('')
  const [seiKanaError, setSeiKanaError] = useState<string>('')
  const [meiKanaError, setMeiKanaError] = useState<string>('')
  const [phoneNumberError, setPhoneNumberError] = useState<string>('')
  const [zipError, setZipError] = useState<string>('')

  // スキル・条件
  const [clubStringList, setClubStringList] = useState<string[]>([])
  const [areaStringList, setAreaStringList] = useState<string[]>([])
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

  const [questionPrefectureList, setQuestionPrefectureList] = useState<QuestionsForPrefecture[]>([])
  const [bioPos, setBioPos] = useState<number>(-1)
  const [bioDateF, setBioDateF] = useState<Date>(new Date())
  const [bioDateT, setBioDateT] = useState<Date>(new Date())
  const [bioTitle, setBioTitle] = useState<string>('')
  const [bioExist, setBioExist] = useState<boolean>(false)

  const [_expedition, setExpedition] = useState<ExpeditionPossibleEnumKeys | null>(null)
  const [_experience, setExperience] = useState<boolean | null>(null)
  const _experienceNote = watch('_experienceNote') || ''
  const [_teacherLicense, setTeacherLicense] = useState<TeacherLicenseStatusEnumKeys | null>(null)
  const _teacherLicenseNote = watch('_teacherLicenseNote') || ''
  const [_otherLicense, setOtherLicense] = useState<boolean | null>(null)
  const _otherLicenseNote = watch('_otherLicenseNote') || ''
  const [_hasDriverLicense, setHasDriverLicense] = useState<boolean | null>(null)
  const [isOpenBioModal, setIsOpenBioModal] = useState(false)
  const [isCloseAccountModal, setIsCloseAccountModal] = useState(false)
  const [birthday, setBirthday] = useState<Timestamp>(userInfo.birthday || Timestamp.now())
  const _pr = watch('_pr') || ''
  const [_career, setCareer] = useState<Career[]>([])

  // 基本情報
  const [avatarFile, setAvatarFile] = useState<File | null>(null)
  const [avatarUrl, setAvatarUrl] = useState<string>('')
  const sei = watch('sei') || ''
  const mei = watch('mei') || ''
  const seiKana = watch('seiKana') || ''
  const meiKana = watch('meiKana') || ''
  const [gender, setGender] = useState<GenderEnumKeys | null>(null)
  const [job, setJob] = useState<string>('')
  const organization = watch('organization') || ''
  const [grade, setGrade] = useState<string>('')
  const faculty = watch('faculty')
  const zip = watch('zip') || ''
  const [zipContent, setZipContent] = useState<string>('')
  const [prefecture, setPrefecture] = useState<string>(userInfo.address?.prefecture || '')
  const city = watch('city') || ''
  const address1 = watch('address1') || ''
  const address2 = watch('address2') || ''
  const address = watch('address') || ''
  const phoneNumber = watch('phoneNumber') || ''
  const email = watch('email')
  const [receiveMail, setReceiveMail] = useState<boolean | null>(null)

  const [gradeList, setGradeList] = useState<Option[]>([])
  const questionValues = questionPrefectureList.map((_, index) => watch(`question${index}`) || '')

  const onChangeTab = (active: number) => {
    setActiveTab(active)
    dispatch(setStoreProfileActiveTab(active))
  }

  function closeBioModal() {
    setIsOpenBioModal(false)
  }

  const clickBioEdit = (career: Career, pos: number) => {
    setBioDateF(career.termOfStart?.toDate())
    setBioDateT(career.termOfEnd?.toDate())
    setBioPos(pos)
    setBioExist(true)
    setBioTitle(career.organizationName)
    setIsOpenBioModal(true)
  }

  function addCareer(career: Career) {
    setCareer([..._career, career])
  }

  function updateCareer(career: Career, index: number) {
    let temp = [..._career]
    temp[index] = career

    setCareer([...temp])
  }

  function removeCareer(index: number) {
    let temp = [..._career]
    temp.splice(index, 1)
    setCareer([...temp])
  }

  useEffect(() => {
    if (!userInfo) return

    setGender(userInfo.gender || null)
    setJob(userInfo.occupation?.type || '')
    setGrade(userInfo.occupation?.grade || '')
    setBirthday(userInfo.birthday || '')
    setPrefecture(userInfo.address?.prefecture || '')
    setReceiveMail(userInfo.subscribeEmail || null)
    setValue('sei', userInfo.name?.sei || '')
    setValue('mei', userInfo.name?.mei || '')
    setValue('seiKana', userInfo.name?.seiKana || '')
    setValue('meiKana', userInfo.name?.meiKana || '')
    setValue('organization', userInfo.occupation.organization || '')
    setValue('faculty', userInfo.occupation?.faculty || '')
    setValue('zip', userInfo.address?.zip || '')
    setValue('city', userInfo.address?.city || '')
    setValue('address1', userInfo.address?.address1 || '')
    setValue('address2', userInfo.address?.address2 || '')
    setValue('phoneNumber', userInfo.phoneNumber || '')
    setValue('email', userInfo.email || '')
    setValue('confirmEmail', userInfo.confirmEmail || '')
    setProfileInfo(userInfo)

    const _address = `${userInfo.address?.prefecture || ''}${userInfo.address?.city || ''}${
      userInfo.address?.address1 || ''
    }`
    setValue('address', _address)
  }, [initUserInfo])

  useEffect(() => {
    const initByUserInfo = async () => {
      try {
        // /////////////////////////////////////////////
        // リモートのデータをローカルに反映する
        // /////////////////////////////////////////////
        if (userInfo.clubs && userInfo.clubs.length > 0) {
          const _clubList = clubList.length === 0 ? await getClubTypeCategoryPopulateList() : clubList
          const clubIdMap = arrayToMap(_clubList, 'id')
          const _clubs = userInfo.clubs.map((club) => {
            const _club = clubIdMap.get(club)!
            return _club
          })
          const groupByLargeCategory = groupArray(_clubs, 'largeCategoryName')
          setClubStringList(
            Object.entries(groupByLargeCategory).map(([key, valueArray]) => {
              const content = (valueArray as any[]).map((data) => data.name).join(', ')
              return `${key} : ${content}`
            }),
          )
        }

        if (userInfo.areasOfActivity && userInfo.areasOfActivity.length > 0) {
          const _cityList = cityList.length === 0 ? await getCityPopulateList() : cityList
          const areaMap = arrayToMap(_cityList, 'id')
          const areas = userInfo.areasOfActivity.map((area) => {
            const _area = areaMap.get(area)!
            return {
              zip: _area.zip,
              prefectureId: _area.prefecture,
              prefectureName: _area.prefectureName,
              city: _area.city,
            }
          })
          const groupByPrefectureName = groupArray(areas, 'prefectureName')
          setAreaStringList(
            Object.entries(groupByPrefectureName).map(([key, valueArray]) => {
              const content = (valueArray as any[]).map((data) => data.city).join(', ')
              return `${key} : ${content}`
            }),
          )

          // 都道府県毎の質問項目を作成
          const _questionsForPrefecture = [] as any // TODO: 型定義をする
          await Promise.all(
            areas.map(async (area) => {
              const snapshot = await getDocs(
                query(
                  ColRef.questionsForPrefecture,
                  where('prefecture', '==', area.prefectureId),
                  where('isPublish', '==', true),
                  where('deletedAt', '==', null),
                ),
              )

              snapshot.docs.forEach((doc) => {
                const data = getDocIdWithData(doc)

                // 重複チェック：idが既に_questionsForPrefectureに存在しない場合のみ追加
                if (!_questionsForPrefecture.some((item: any) => item.id === data.id)) {
                  _questionsForPrefecture.push({
                    id: data.id,
                    prefecture: area.prefectureName,
                    question: data.question,
                    answer: '',
                  })
                }
              })
            }),
          )
          setValue('questionForPrefecture', _questionsForPrefecture)
          setQuestionPrefectureList(_questionsForPrefecture)
        }

        if (userInfo.officeHours) {
          userInfo.officeHours['monday'].indexOf('am') != -1 && setMonM('mon_m')
          userInfo.officeHours['monday'].indexOf('pm') != -1 && setMonA('mon_a')
          userInfo.officeHours['tuesday'].indexOf('am') != -1 && setFireM('fire_m')
          userInfo.officeHours['tuesday'].indexOf('pm') != -1 && setFireA('fire_a')
          userInfo.officeHours['wednesday'].indexOf('am') != -1 && setWaterM('water_m')
          userInfo.officeHours['wednesday'].indexOf('pm') != -1 && setWaterA('water_a')
          userInfo.officeHours['thursday'].indexOf('am') != -1 && setWoodM('wood_m')
          userInfo.officeHours['thursday'].indexOf('pm') != -1 && setWoodA('wood_a')
          userInfo.officeHours['friday'].indexOf('am') != -1 && setMetalM('metal_m')
          userInfo.officeHours['friday'].indexOf('pm') != -1 && setMetalA('metal_a')
          userInfo.officeHours['saturday'].indexOf('am') != -1 && setEarthM('earth_m')
          userInfo.officeHours['saturday'].indexOf('pm') != -1 && setEarthA('earth_a')
          userInfo.officeHours['sunday'].indexOf('am') != -1 && setSunM('sun_m')
          userInfo.officeHours['sunday'].indexOf('pm') != -1 && setSunA('sun_a')
        }

        userInfo.isExpeditionPossible && setExpedition(userInfo.isExpeditionPossible)
        isNotNull(userInfo.experience) && setExperience(userInfo.experience)
        userInfo.experienceNote && setValue('_experienceNote', userInfo.experienceNote)
        userInfo.teacherLicenseStatus && setTeacherLicense(userInfo.teacherLicenseStatus)
        userInfo.teacherLicenseNote && setValue('_teacherLicenseNote', userInfo.teacherLicenseNote)
        isNotNull(userInfo.otherLicense) && setOtherLicense(userInfo.otherLicense)
        userInfo.otherLicenseNote && setValue('_otherLicenseNote', userInfo.otherLicenseNote)
        isNotNull(userInfo.hasDriverLicense) && setHasDriverLicense(userInfo.hasDriverLicense)
        userInfo.pr && setValue('_pr', userInfo.pr)
        userInfo.career && userInfo.career.length > 0 && setCareer(userInfo.career)

        setAvatarUrl(userInfo.avatar || '')
        setValue('sei', userInfo.name?.sei || '')
        setValue('mei', userInfo.name?.mei || '')
        setValue('seiKana', userInfo.name?.seiKana || '')
        setValue('meiKana', userInfo.name?.meiKana || '')
        setGender(userInfo.gender || null)
        setJob(userInfo.occupation?.type || '')
        setValue('organization', userInfo.occupation.organization || '')
        setGrade(userInfo.occupation?.grade || '')
        setPrefecture(userInfo.address?.prefecture || '')
        setValue('faculty', userInfo.occupation?.faculty || '')
        setBirthday(userInfo.birthday || '')
        setValue('zip', userInfo.address?.zip || '')
        setValue('city', userInfo.address?.city || '')
        setValue('address1', userInfo.address?.address1 || '')
        setValue('address2', userInfo.address?.address2 || '')
        setValue('phoneNumber', userInfo.phoneNumber || '')
        setValue('email', userInfo.email || '')
        setValue('confirmEmail', userInfo.confirmEmail || '')
        isNotNull(userInfo.subscribeEmail) && setReceiveMail(userInfo.subscribeEmail)

        // スキル・条件の入力状況を確認する
        const isCompletedClubsAndAreas = userInfo.clubs.length > 0 && userInfo.areasOfActivity.length > 0
        const isCompletedOthers =
          isNotNull(userInfo.officeHours) &&
          isNotNull(userInfo.isExpeditionPossible) &&
          isNotNull(userInfo.experience) &&
          isNotNull(userInfo.teacherLicenseStatus) &&
          isNotNull(userInfo.otherLicense) &&
          isNotNull(userInfo.hasDriverLicense) &&
          isNotNullOrEmpty(userInfo.pr) &&
          isNotNull(userInfo.career) &&
          userInfo.career!.length > 0
        const _isSKillInfo = isCompletedClubsAndAreas && isCompletedOthers
        setIsCompletedSkillInfo(_isSKillInfo)

        // 基本情報の入力状況を確認する
        const _isCompletedBasicInfo =
          isNotEmpty(userInfo.name.mei) &&
          isNotEmpty(userInfo.name.sei) &&
          isNotEmpty(userInfo.name.meiKana) &&
          isNotEmpty(userInfo.name.seiKana) &&
          isNotNull(userInfo.gender) &&
          (userInfo.occupation.type !== '大学生' ||
            (userInfo.occupation.type === '大学生' && isNotEmpty(userInfo.occupation.organization))) &&
          isNotEmpty(userInfo.birthday) &&
          isNotEmpty(userInfo.address.zip) &&
          isNotEmpty(userInfo.address.prefecture) &&
          isNotEmpty(userInfo.address.city) &&
          isNotEmpty(userInfo.phoneNumber) &&
          isNotEmpty(userInfo.email)

        setIsCompletedBasicInfo(_isCompletedBasicInfo)
        setIsCompletedProfile(_isCompletedBasicInfo && _isSKillInfo)
        setIsEnabledSkillButton(isCompletedClubsAndAreas)
        localStorage.setItem(
          LOCAL_STORAGE.isCompleteProfile,
          _isCompletedBasicInfo && _isSKillInfo ? 'complete' : 'not_complete',
        )
      } catch (error) {
        console.error('Profile init error:', error)
      }
    }

    initByUserInfo()
  }, [userInfo])

  useEffect(() => {
    if (!questionValues || questionValues.length === 0) return

    const nonEmptyCount = questionValues.filter((data) => data !== '').length
    if (nonEmptyCount === 0) return

    const updatedValues = questionValues.map((data) => (data === '' ? '-_-_-_' : data))
    localStorage.setItem('question', updatedValues.join('~~!!@@##'))
  }, [questionValues])

  useEffect(() => {
    setGradeList([
      {
        value: '',
        placeholder: true,
        text: '選択してください',
        icon: IconTypeSelectBox.OFF,
        size: SelectBoxSize.PC,
      },
      ...Array.from({ length: parseInt(organizationGrade) }, (_, index) => ({
        value: (index + 1).toString(),
        placeholder: false,
        text: (index + 1).toString() + '学年',
        icon: IconTypeSelectBox.OFF,
        size: SelectBoxSize.PC,
      })),
    ])
  }, [organizationGrade])

  useEffect(() => {
    if (!isEdit) return
    setValidationError(sei, detectEmoticon, setSeiError, '絵文字は入力できません')
    setValidationError(mei, detectEmoticon, setMeiError, '絵文字は入力できません')
    setValidationError(seiKana, detectEmoticon, setSeiKanaError, '絵文字は入力できません')
    setValidationError(meiKana, detectEmoticon, setMeiKanaError, '絵文字は入力できません')
    setValidationError(seiKana, (val: string) => !isKatakana(val), setSeiKanaError, 'カタカナで入力してください')
    setValidationError(meiKana, (val: string) => !isKatakana(val), setMeiKanaError, 'カタカナで入力してください')

    if (phoneNumber) {
      setValue('phoneNumber', phoneNumber.replace('-', ''))
      setValidationError(
        phoneNumber,
        (val: string) => !isStringOnlyNumbers(val),
        setPhoneNumberError,
        '電話番号を正しく入力してください',
      )
    }

    // Validation for Zip
    if (zip) {
      setValue('zip', zip.replace('-', ''))
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

    const isCompletedClubsAndAreas = profileInfo.clubs.length > 0 && profileInfo.areasOfActivity.length > 0
    setIsEnabledSkillButton(isCompletedClubsAndAreas)

    const newProfileInfo = {
      ...profileInfo,
      name: {
        sei,
        mei,
        seiKana,
        meiKana,
      },
      gender,
      occupation: {
        type: job,
        organization,
        faculty,
        grade,
      },
      birthday,
      address: {
        zip,
        prefecture,
        city,
        address1,
        address2,
      },
      phoneNumber,
      email,
      subscribeEmail: receiveMail,
      isExpeditionPossible: _expedition,
      experience: _experience,
      experienceNote: _experienceNote,
      teacherLicenseStatus: _teacherLicense,
      teacherLicenseNote: _teacherLicenseNote,
      otherLicense: _otherLicense,
      otherLicenseNote: _otherLicenseNote,
      hasDriverLicense: _hasDriverLicense,
      pr: _pr,
      career: _career,
    }
    setProfileInfo(newProfileInfo)
    dispatch(setStoreUserInfoFromProfile(newProfileInfo))
  }, [
    _expedition,
    _experience,
    _experienceNote,
    _teacherLicense,
    _teacherLicenseNote,
    _otherLicense,
    _otherLicenseNote,
    _hasDriverLicense,
    _pr,
    _career,
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
    receiveMail,
  ])

  const setOfficeHour = (day: string, type: string) => {
    const { officeHours } = userInfo
    const info: ScheduleType | undefined = officeHours
    scheduleInfo = JSON.parse(JSON.stringify(info))

    if (scheduleInfo) {
      const pos = scheduleInfo[`${day}`].indexOf(type)
      pos == -1 ? scheduleInfo[`${day}`].push(type) : scheduleInfo[`${day}`].splice(pos, 1)

      const newProfileInfo = {
        ...userInfo,
        officeHours: { ...scheduleInfo },
      }
      setProfileInfo(newProfileInfo)
      dispatch(setStoreUserInfo(newProfileInfo))
    }
  }

  const saveProfileData = async () => {
    if (!authUser) return

    try {
      dispatch(setStoreLoading(true))

      const url = avatarFile ? await uploadImage(avatarFile) : userInfo.avatar || ''
      const questionsFromLocalStorage: string[] = localStorage.getItem('question')?.split('~~!!@@##') || []
      const updatedQuestions = questionPrefectureList.map((data, index) => ({
        ...data,
        answer: questionsFromLocalStorage[index]?.replace('-_-_-_', '') || data.answer,
      }))

      const newUserInfo = {
        ...profileInfo,
        avatar: url,
        questionsForPrefecture: [...updatedQuestions],
        updatedAt: Timestamp.now(),
        experience: _experience,
      }

      await setPrivateUser(authUser.uid, newUserInfo)
      setProfileInfo(newUserInfo)
      setQuestionPrefectureList(updatedQuestions)
      setIsEdit(false)
      dispatch(setStoreProfileEditState(false))
    } catch (error) {
      console.error('Profile update error:', error)
      alert('エラーが発生しました。再試行してください。')
    } finally {
      dispatch(setStoreLoading(false))
    }
  }

  const cancelProfileData = async () => {
    if (!authUser) return
    dispatch(setStoreLoading(true))

    const _userInfo = getDocIdWithData(await getDoc(DocRef.privateUser(authUser.uid)))
    setIsEdit(false)
    setAvatarFile(null)
    setAvatarUrl('')
    setProfileInfo(_userInfo)
    dispatch(setStoreUserInfoFromProfile(_userInfo))

    dispatch(setStoreLoading(false))
  }

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

  const handleFileUpload = useCallback(async (event: React.ChangeEvent<HTMLInputElement>) => {
    const newFiles = event.target.files || []
    if (newFiles) {
      let avatarFile = newFiles[0]
      if (avatarFile) {
        setAvatarFile(avatarFile)
        const reader = new FileReader()
        reader.onload = () => {
          setAvatarUrl(reader.result as string)
        }
        reader.readAsDataURL(avatarFile)
      }
    }
  }, [])

  const clickAccCloseConfirm = () => {
    setIsCloseAccountModal(false)
  }

  const clickAccDeleteConfirm = async () => {
    if (!authUser) return

    try {
      const response = await fetch('/api/deleteAccount', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          userUid: authUser.uid,
          userId: userInfo.id,
          userName: `${userInfo.name.sei} ${userInfo.name.mei}`,
          email: userInfo.email,
          systemName,
        }),
      })

      if (response.ok) {
        setIsCloseAccountModal(false)
        localStorage.clear()
        await logout()
        window.location.href = '/'
      } else {
        alert('アカウント削除に失敗しました。')
      }
    } catch (error) {
      console.error('Account deletion error:', error)
      alert('エラーが発生しました。再試行してください。')
    } finally {
      dispatch(setStoreLoading(false))
    }
  }

  return (
    <div className="h-full bg-gray-white">
      <AfterLoginLayout>
        <div>
          <div className="mx-auto max-w-[800px]">
            {profileInfo && (
              <TopProfile
                userInfo={userInfo}
                avatar={avatarUrl}
                status={!isEdit ? TopProfileType.DEFAULT : TopProfileType.EDIT}
                fileUpload={handleFileUpload}
              />
            )}

            <Tab
              tabItems={[
                {
                  url: '#',
                  text: 'スキル・条件',
                  notice: isCompletedSkillInfo ? State.OFF : State.ON,
                  size: TabSize.SP,
                },
                {
                  url: '#',
                  text: '基本情報',
                  notice: isCompletedBasicInfo ? State.OFF : State.ON,
                  size: TabSize.SP,
                },
              ]}
              size={TabSize.SP}
              onChange={onChangeTab}
              isPossible={!isEdit}
              tabIndex={activeTab}
            />

            <div className="px-[24px]">
              {!isCompletedProfile && (
                <div className="pt-[30px] text-center">
                  <div className="flex justify-center pb-[2px] text-core-red">
                    <AiFillWarning className="h-[14px] w-[14px]" />
                    <p className="text-xs font-bold">プロフィールを完成させてください</p>
                  </div>
                  <p className="text-mini">プロフィールを埋めるとより多くのスカウトにつながります</p>
                </div>
              )}

              {!isEdit &&
                (activeTab == 0 ? (
                  <div className="flex items-center justify-center pt-[30px]">
                    <Button
                      size={ButtonSize.SP}
                      color={ButtonColor.SUB}
                      type={ButtonType.SECONDARY}
                      shape={ButtonShape.ELLIPSE}
                      disabled={false}
                      icon={ButtonIcon.FRONT}
                      arrow={ButtonArrow.OFF}
                      text="編集する"
                      iconComponent={<HiPencil className="mr-[4.5px] h-[20px] w-[20px]" />}
                      onclick={() => {
                        setIsEdit(true), dispatch(setStoreProfileEditState(true))
                      }}
                      className="h-[34px] w-[150px]"
                    />
                  </div>
                ) : activeTab == 1 && !isProfileEmailChange ? (
                  <div className="flex items-center justify-center pt-[30px]">
                    <Button
                      size={ButtonSize.SP}
                      color={ButtonColor.SUB}
                      type={ButtonType.SECONDARY}
                      shape={ButtonShape.ELLIPSE}
                      disabled={false}
                      icon={ButtonIcon.FRONT}
                      arrow={ButtonArrow.OFF}
                      text="編集する"
                      iconComponent={<HiPencil className="mr-[4.5px] h-[20px] w-[20px]" />}
                      onclick={() => {
                        setIsEdit(true), dispatch(setStoreProfileEditState(true))
                      }}
                      className="h-[34px] w-[150px]"
                    />
                  </div>
                ) : (
                  <div className="flex items-center justify-center gap-[20px] pt-[30px]">
                    <Button
                      size={ButtonSize.SP}
                      color={ButtonColor.SUB}
                      type={ButtonType.SECONDARY}
                      shape={ButtonShape.ELLIPSE}
                      disabled={false}
                      icon={ButtonIcon.FRONT}
                      arrow={ButtonArrow.OFF}
                      text="編集する"
                      iconComponent={<HiPencil className="mr-[4.5px] h-[20px] w-[20px]" />}
                      onclick={() => {
                        setIsEdit(true), dispatch(setStoreProfileEditState(true))
                      }}
                      className="h-[34px] w-[150px]"
                    />
                    <Button
                      size={ButtonSize.SP}
                      color={ButtonColor.SUB}
                      type={ButtonType.SECONDARY}
                      shape={ButtonShape.ELLIPSE}
                      disabled={false}
                      icon={ButtonIcon.FRONT}
                      arrow={ButtonArrow.OFF}
                      text="変更はありません"
                      textClassName="text-[13px]"
                      iconComponent={<HiOutlineCheck className="mr-[2px] h-[20px] w-[20px]" />}
                      onclick={() => {
                        dispatch(setStoreChangeEmail(false))
                      }}
                      className="h-[34px] w-[150px]"
                    />
                  </div>
                ))}

              {activeTab == 0 && (
                <>
                  <div className="grid gap-[10px] py-[30px] text-start">
                    {!isEdit ? (
                      <p className="text-[14px] font-bold text-core-blue">指導できる種目</p>
                    ) : (
                      <div className="flex gap-[6px] text-[14px]">
                        <p className=" font-bold text-core-blue">指導できる種目</p>
                        <p className="">(複数可)</p>
                      </div>
                    )}

                    {isEdit && <p className="text-xs font-bold">運動系・文化系で可能な種目をすべて登録してください</p>}

                    {clubStringList && clubStringList.length > 0 && (
                      <div className="border-slate-10 rounded-[10px] border border-gray-gray_dark bg-gray-gray_light py-[10px] pl-[20px]">
                        <div className="gap-[10px] text-xs">
                          {clubStringList.map((data, index) => (
                            <p className="" key={index}>
                              {data}
                            </p>
                          ))}
                        </div>
                      </div>
                    )}

                    {isEdit && (
                      <Button
                        size={ButtonSize.SP}
                        color={ButtonColor.SUB}
                        type={ButtonType.SECONDARY}
                        shape={ButtonShape.RECTANGLE}
                        disabled={false}
                        icon={ButtonIcon.FRONT}
                        arrow={ButtonArrow.OFF}
                        text="種目を追加"
                        onclick={() => {
                          router.push('/profile/clubs')
                        }}
                        className="h-[34px] w-full"
                        iconComponent={<HiPlus className="mr-[6px] h-[16px] w-[16px]" />}
                      />
                    )}
                  </div>

                  <div className="grid  gap-[10px] text-start">
                    {!isEdit ? (
                      <p className="text-[14px] font-bold text-core-blue">指導できる地域</p>
                    ) : (
                      <div className="flex gap-[6px] text-[14px]">
                        <p className=" font-bold text-core-blue">指導できる地域</p>
                        <p className="">(複数可)</p>
                      </div>
                    )}

                    {isEdit && <p className="text-xs font-bold">都道府県をまたいで複数登録できます</p>}

                    {areaStringList && areaStringList.length > 0 && (
                      <div className="border-slate-10 rounded-[10px] border border-gray-gray_dark bg-gray-gray_light py-[10px] pl-[20px]">
                        <div className="gap-[10px] text-xs">
                          {areaStringList.map((data, index) => (
                            <p className="" key={index}>
                              {data}
                            </p>
                          ))}
                        </div>
                      </div>
                    )}

                    {isEdit && (
                      <Button
                        size={ButtonSize.SP}
                        color={ButtonColor.SUB}
                        type={ButtonType.SECONDARY}
                        shape={ButtonShape.RECTANGLE}
                        disabled={false}
                        icon={ButtonIcon.FRONT}
                        arrow={ButtonArrow.OFF}
                        text="地域を追加 "
                        onclick={() => {
                          router.push('/profile/areas')
                        }}
                        className="h-[34px] w-full"
                        iconComponent={<HiPlus className="mr-[6px] h-[16px] w-[16px]" />}
                      />
                    )}
                  </div>
                </>
              )}

              <div className="py-[30px]">
                {
                  // not edit tab1
                  !isEdit && activeTab == 0 && (
                    <div className="grid gap-[30px]">
                      <div className="grid  gap-[10px] text-start">
                        <p className="text-[14px] font-bold text-core-blue">指導できる日時</p>

                        {profileInfo?.officeHours && isDataInOfficeHours(profileInfo?.officeHours) ? (
                          <Schedule schedule={profileInfo?.officeHours} size={view == 'PC' ? 'default' : 'mini'} />
                        ) : (
                          <p className="text-xs text-core-red">未入力</p>
                        )}
                      </div>

                      <div className="grid  gap-[10px] text-start">
                        <p className="text-[14px] font-bold text-core-blue">遠征への同行可否</p>
                        {profileInfo.isExpeditionPossible ? (
                          <p className="text-xs">{expeditionPossibleEnum[profileInfo.isExpeditionPossible]}</p>
                        ) : (
                          <p className="text-xs text-core-red">未入力</p>
                        )}
                      </div>

                      <div className="grid  gap-[10px] text-start">
                        <p className="text-[14px] font-bold text-core-blue">指導経験</p>
                        {profileInfo.experience !== null ? (
                          <p className="text-xs">
                            {profileInfo.experienceNote
                              ? profileInfo.experienceNote
                              : profileInfo.experience
                              ? 'あり'
                              : 'なし'}
                          </p>
                        ) : (
                          <p className="text-xs text-core-red">未入力</p>
                        )}
                      </div>

                      <div className="grid  gap-[10px] text-start">
                        <p className="text-[14px] font-bold text-core-blue">教員免許</p>

                        {profileInfo.teacherLicenseStatus ? (
                          <p className="text-xs">
                            {profileInfo.teacherLicenseNote
                              ? profileInfo.teacherLicenseNote
                              : teacherLicenseStatusEnum[profileInfo.teacherLicenseStatus]}
                          </p>
                        ) : (
                          <p className="text-xs text-core-red">未入力</p>
                        )}
                      </div>

                      <div className="grid  gap-[10px] text-start">
                        <div className="flex gap-[6px]">
                          <p className="text-[14px] font-bold text-core-blue">指導者資格</p>
                          <p className="relative -bottom-[2px] text-xs">(教員免許以外)</p>
                        </div>

                        {profileInfo.otherLicense !== null ? (
                          <p className="text-xs">
                            {profileInfo.otherLicenseNote
                              ? profileInfo.otherLicenseNote
                              : profileInfo.otherLicense
                              ? 'あり'
                              : 'なし'}
                          </p>
                        ) : (
                          <p className="text-xs text-core-red">未入力</p>
                        )}
                      </div>

                      <div className="grid  gap-[10px] text-start">
                        <p className="text-[14px] font-bold text-core-blue">自動車運転免許</p>

                        {profileInfo.hasDriverLicense !== null ? (
                          <p className="text-xs">{profileInfo.hasDriverLicense ? 'あり' : 'なし'}</p>
                        ) : (
                          <p className="text-xs text-core-red">未入力</p>
                        )}
                      </div>

                      <div className="grid  gap-[10px] text-start">
                        <p className="text-[14px] font-bold text-core-blue">自己アピール</p>

                        {profileInfo?.pr ? (
                          <p className="text-xs">{profileInfo.pr}</p>
                        ) : (
                          <p className="text-xs text-core-red">未入力</p>
                        )}
                      </div>

                      {profileInfo?.questionsForPrefecture && profileInfo.questionsForPrefecture.length > 0 && (
                        <div className="grid  gap-[10px] text-start">
                          <p className="text-[14px] font-bold text-core-blue">地域項目</p>

                          {profileInfo.questionsForPrefecture.map((data, index) => (
                            <div key={index}>
                              <p className="text-xs">{data.prefecture}</p>
                              <table className="w-full border border-gray-gray">
                                <tbody key={100 + index}>
                                  <tr className="bg-gray-gray_light">
                                    <td>
                                      <p className="mx-[8px] py-[4px] text-xs">{data.question}</p>
                                    </td>
                                  </tr>
                                </tbody>
                                <tbody key={1000 + index}>
                                  <tr>
                                    <td>
                                      <p className="mx-[8px] py-[4px] text-xs">{data.answer}</p>
                                    </td>
                                  </tr>
                                </tbody>
                              </table>
                            </div>
                          ))}
                        </div>
                      )}

                      {profileInfo?.career && profileInfo.career.length > 0 && (
                        <div className="grid  gap-[10px] text-start">
                          <p className="text-[14px] font-bold text-core-blue">経歴</p>

                          {profileInfo.career.map((data, index) => (
                            <div className="flex gap-[8px] text-xs" key={index}>
                              <p>
                                {convFirebaseToDateFormat(data.termOfStart)} ~{' '}
                                {convFirebaseToDateFormat(data.termOfEnd)}
                              </p>
                              <p>{data.organizationName}</p>
                            </div>
                          ))}
                        </div>
                      )}
                    </div>
                  )
                }

                {
                  // edit tab1
                  isEdit && activeTab == 0 && (
                    <div className="grid gap-[30px]">
                      <div className="grid  gap-[10px] text-start">
                        <div className="flex gap-[6px] text-[14px]">
                          <p className=" font-bold text-core-blue">指導できる日時</p>
                          <p className="">(複数可)</p>
                        </div>

                        <div className="grid gap-[16px]">
                          <div className="flex gap-[20px]">
                            <div className="self-center text-[14px] font-bold">月</div>
                            <div className="flex gap-[10px]">
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

                          <div className="flex gap-[20px]">
                            <div className="self-center text-[14px] font-bold">火</div>
                            <div className="flex gap-[10px]">
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

                          <div className="flex gap-[20px]">
                            <div className="self-center text-[14px] font-bold">水</div>
                            <div className="flex gap-[10px]">
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

                          <div className="flex gap-[20px]">
                            <div className="self-center text-[14px] font-bold">木</div>
                            <div className="flex gap-[10px]">
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

                          <div className="flex gap-[20px]">
                            <div className="self-center text-[14px] font-bold">金</div>
                            <div className="flex gap-[10px]">
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

                          <div className="flex gap-[20px]">
                            <div className="self-center text-[14px] font-bold">土</div>
                            <div className="flex gap-[10px]">
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

                          <div className="flex gap-[20px]">
                            <div className="self-center text-[14px] font-bold">日</div>
                            <div className="flex gap-[10px]">
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
                      </div>

                      <div className="grid  gap-[10px] text-start">
                        <p className="text-[14px] font-bold text-core-blue">遠征への同行可否</p>
                        <div className="grid grid-cols-3">
                          <RadioButtonForEnum
                            name="可"
                            value={_expedition}
                            disabled={false}
                            text="可"
                            mapping={expeditionPossibleEnum}
                            mappingValue={'possible'}
                            setValue={setExpedition}
                          />
                          <RadioButtonForEnum
                            name="不可"
                            value={_expedition}
                            disabled={false}
                            text="不可"
                            mapping={expeditionPossibleEnum}
                            mappingValue={'notPossible'}
                            setValue={setExpedition}
                          />
                          <RadioButtonForEnum
                            name="要相談"
                            value={_expedition}
                            disabled={false}
                            text="要相談"
                            mapping={expeditionPossibleEnum}
                            mappingValue={'negotiable'}
                            setValue={setExpedition}
                          />
                        </div>
                      </div>

                      <div className="grid  gap-[10px] text-start">
                        <p className="text-[14px] font-bold text-core-blue">指導経験</p>

                        <div className="grid grid-cols-3">
                          <RadioButtonBoolean
                            name="あり"
                            value={_experience === true}
                            disabled={false}
                            text="あり"
                            setValue={(value: string) => {
                              setExperience(value === 'あり')
                            }}
                          />
                          <RadioButtonBoolean
                            name="なし"
                            value={_experience === false}
                            disabled={false}
                            text="なし"
                            setValue={(value: string) => {
                              setExperience(value === 'あり')
                            }}
                          />
                        </div>

                        {_experience && (
                          <div>
                            <p className="text-[14px]">詳細</p>
                            <FormField
                              control={control}
                              input={{
                                name: '_experienceNote',
                                type: InputType.AREA,
                                status: InputStatus.DEFAULT,
                              }}
                              attention={{ text: '例 : 中学生対象/地域サッカークラブ/指導補助アルバイト' }}
                            />
                          </div>
                        )}
                      </div>

                      <div className="grid  gap-[10px] text-start">
                        <p className="text-[14px] font-bold text-core-blue">教員免許</p>

                        <div className="grid grid-cols-3">
                          <RadioButtonForEnum
                            name="あり"
                            value={_teacherLicense}
                            disabled={false}
                            text="あり"
                            mapping={teacherLicenseStatusEnum}
                            mappingValue="having"
                            setValue={setTeacherLicense}
                          />
                          <RadioButtonForEnum
                            name="なし"
                            value={_teacherLicense}
                            disabled={false}
                            text="なし"
                            mapping={teacherLicenseStatusEnum}
                            mappingValue="nothing"
                            setValue={setTeacherLicense}
                          />
                          <RadioButtonForEnum
                            name="取得予定"
                            value={_teacherLicense}
                            disabled={false}
                            text="取得予定"
                            mapping={teacherLicenseStatusEnum}
                            mappingValue="scheduledAcquisition"
                            setValue={setTeacherLicense}
                          />
                        </div>

                        {_teacherLicense && ['having', 'scheduledAcquisition'].includes(_teacherLicense) && (
                          <div className="">
                            <p className="text-[14px]">種別</p>
                            <FormField
                              control={control}
                              input={{
                                name: '_teacherLicenseNote',
                                type: InputType.AREA,
                                status: InputStatus.DEFAULT,
                              }}
                              attention={{ text: '例 : 中学校教諭一種免許/国語' }}
                            />
                          </div>
                        )}
                      </div>

                      <div className="grid  gap-[10px] text-start">
                        <div className="flex gap-[6px]">
                          <p className="text-[14px] font-bold text-core-blue">指導者資格</p>
                          <p className="relative -bottom-[2px] text-xs">(教員免許以外)</p>
                        </div>

                        <div className="grid grid-cols-3">
                          <RadioButtonBoolean
                            name="あり"
                            value={_otherLicense === true}
                            disabled={false}
                            text="あり"
                            setValue={(value: string) => {
                              setOtherLicense(value === 'あり')
                            }}
                          />
                          <RadioButtonBoolean
                            name="なし"
                            value={_otherLicense === false}
                            disabled={false}
                            text="なし"
                            setValue={(value: string) => {
                              setOtherLicense(value === 'あり')
                            }}
                          />
                        </div>

                        {_otherLicense && (
                          <div className="">
                            <p className="text-[14px]">その他の資格</p>
                            <FormField
                              control={control}
                              input={{
                                name: '_otherLicenseNote',
                                type: InputType.AREA,
                                status: InputStatus.DEFAULT,
                              }}
                              attention={{ text: '' }}
                            />
                          </div>
                        )}
                      </div>

                      <div className="grid  gap-[10px] text-start">
                        <p className="text-[14px] font-bold text-core-blue">自動車運転免許</p>

                        <div className="grid grid-cols-3">
                          <RadioButtonBoolean
                            name="あり"
                            value={_hasDriverLicense === true}
                            disabled={false}
                            text="あり"
                            setValue={(value: string) => {
                              setHasDriverLicense(value === 'あり')
                            }}
                          />
                          <RadioButtonBoolean
                            name="なし"
                            value={_hasDriverLicense === false}
                            disabled={false}
                            text="なし"
                            setValue={(value: string) => {
                              setHasDriverLicense(value === 'あり')
                            }}
                          />
                        </div>
                      </div>

                      <div className="grid  gap-[10px] text-start">
                        <p className="text-[14px] font-bold text-core-blue">自己アピール</p>

                        <FormField
                          control={control}
                          input={{
                            name: '_pr',
                            type: InputType.AREA,
                            status: InputStatus.DEFAULT,
                          }}
                          attention={{ text: '自身の経験やボランティア経験などを入力してください' }}
                        />
                      </div>

                      {questionPrefectureList && questionPrefectureList.length > 0 && (
                        <div className="grid  gap-[10px] text-start">
                          <p className="text-[14px] font-bold text-core-blue">地域項目</p>

                          {questionPrefectureList.map((data, index) => (
                            <div key={index}>
                              <p className="text-[14px]">{data.prefecture}</p>

                              <div>
                                <p className="text-xs">{data.question}</p>
                                <FormField
                                  control={control}
                                  input={{
                                    name: 'question' + index,
                                    type: InputType.AREA,
                                    status: InputStatus.DEFAULT,
                                  }}
                                  attention={{ text: '' }}
                                />
                              </div>
                            </div>
                          ))}
                        </div>
                      )}

                      <div className="grid  gap-[10px] text-start">
                        <p className="text-[14px] font-bold text-core-blue">経歴</p>

                        {_career &&
                          _career.length > 0 &&
                          _career.map((data, index) => (
                            <div className="flex justify-between text-xs" key={index}>
                              <div className="flex gap-[8px]">
                                <p>
                                  {convFirebaseToDateFormat(data.termOfStart)} ~{' '}
                                  {convFirebaseToDateFormat(data.termOfEnd)}
                                </p>
                                <p>{data.organizationName}</p>
                              </div>
                              <MdEdit
                                onClick={() => {
                                  clickBioEdit(data, index)
                                }}
                                className="h-[15px] w-[15px] cursor-pointer text-core-blue"
                              />
                            </div>
                          ))}

                        <Button
                          size={ButtonSize.SP}
                          color={ButtonColor.SUB}
                          type={ButtonType.SECONDARY}
                          shape={ButtonShape.RECTANGLE}
                          disabled={false}
                          icon={ButtonIcon.FRONT}
                          arrow={ButtonArrow.OFF}
                          text="経歴を追加"
                          onclick={() => {
                            setIsOpenBioModal(true)
                            setBioExist(false)
                          }}
                          className="h-[34px] w-full"
                          iconComponent={<HiPlus className="mr-[6px] h-[16px] w-[16px]" />}
                        />
                      </div>
                    </div>
                  )
                }

                {
                  // not edit tab2
                  !isEdit && activeTab == 1 && (
                    <div className="grid gap-[30px]">
                      <div className="grid  gap-[10px] text-start">
                        <p className="text-[14px] font-bold text-core-blue">名前</p>
                        <p className="text-xs">{`${profileInfo.name.sei} ${profileInfo.name.mei} ${profileInfo.name.seiKana} ${profileInfo.name.meiKana}`}</p>
                      </div>

                      <div className="grid  gap-[10px] text-start">
                        <p className="text-[14px] font-bold text-core-blue">性別</p>
                        <p className="text-xs">{profileInfo.gender ? genderEnum[profileInfo.gender] : ''}</p>
                      </div>

                      <div className="grid  gap-[10px] text-start">
                        <p className="text-[14px] font-bold text-core-blue">職業</p>
                        <div className="flex flex-col space-y-1">
                          <p className="text-xs">{profileInfo.occupation.type}</p>
                          <p className="text-xs">
                            {profileInfo.occupation.type === '大学生'
                              ? `${profileInfo.occupation.organization} ${profileInfo.occupation.faculty} ${profileInfo.occupation.grade}年生`
                              : `${profileInfo.occupation.organization || ''}`}
                          </p>
                        </div>
                      </div>

                      <div className="grid  gap-[10px] text-start">
                        <p className="text-[14px] font-bold text-core-blue">生年月</p>
                        <p className="text-xs">
                          {`${dateFormat(profileInfo.birthday)} ${calculateAge(profileInfo.birthday)}`}
                        </p>
                      </div>

                      <div className="grid  gap-[10px] text-start">
                        <p className="text-[14px] font-bold text-core-blue">住所</p>
                        <div>
                          <p className="text-xs">〒{formatZip(profileInfo.address.zip)}</p>
                          <p className="text-xs">{`${profileInfo.address.prefecture}${profileInfo.address.city}${profileInfo.address.address1}${profileInfo.address.address2}`}</p>
                        </div>
                      </div>

                      <div className="grid  gap-[10px] text-start">
                        <p className="text-[14px] font-bold text-core-blue">携帯電話番号</p>
                        <p className="text-xs">{profileInfo.phoneNumber}</p>
                      </div>

                      <div className="grid  gap-[10px] text-start">
                        <p className="text-[14px] font-bold text-core-blue">メールアドレス</p>
                        <p className="text-xs">{profileInfo.email}</p>
                      </div>

                      <div className="grid  gap-[10px] text-start">
                        <p className="text-[14px] font-bold text-core-blue">メール受信設定</p>
                        <p className="text-xs">
                          {profileInfo.subscribeEmail === true
                            ? subscriptMailEnum.receive
                            : profileInfo.subscribeEmail === false
                            ? subscriptMailEnum.not_receive
                            : subscriptMailEnum.not_receive}
                        </p>
                        <p className="text-mini text-gray-gray_dark">
                          ※「受け取らない」に設定しても個別メッセージなど大切なお知らせは届きます。
                        </p>
                      </div>

                      <div className="text-center">
                        <p
                          className="cursor-pointer text-gray-gray_dark sp:text-xs pc:text-[16px]"
                          onClick={() => logout()}
                        >
                          <u>ログアウト</u>
                        </p>
                      </div>

                      <div className="text-center">
                        <p
                          onClick={() => setIsCloseAccountModal(true)}
                          className="cursor-pointer text-xs text-core-red pc:text-[16px]"
                        >
                          <u>アカウントを削除する</u>
                        </p>
                      </div>
                    </div>
                  )
                }

                {
                  // edit tab2
                  isEdit && activeTab == 1 && (
                    <div className="pb-[30px] text-start">
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
                                className: 'w-[100%]',
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
                                className: 'w-[100%]',
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
                            {job == '大学生' ? (
                              <>
                                <div>
                                  <p className="">所属名</p>
                                  <div
                                    onClick={() => {
                                      router.push('/profile/search-university')
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
                              <Input
                                control={control}
                                name="address"
                                disabled={true}
                                className="w-full bg-gray-gray_light"
                              />
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
                            <div className="flex items-center justify-between text-core-blue">
                              <p className="pb-[4px] font-bold">メールアドレス</p>
                              <div
                                className="flex cursor-pointer"
                                onClick={() => {
                                  router.push('/profile/email')
                                }}
                              >
                                <p className="text-xs font-bold">変更する</p>
                                <MdArrowForwardIos className="h-[15px] w-[15px]" />
                              </div>
                            </div>
                            <Input
                              control={control}
                              status={InputStatus.DEFAULT}
                              type={InputType.BOX}
                              disabled={true}
                              name="email"
                              placeholder="example@spocul.jp"
                              className="w-[100%] bg-gray-gray_light"
                            />
                          </div>
                        </div>

                        <div>
                          <p className="pb-[8px] text-[14px] font-bold text-core-blue">メール受信設定</p>

                          <div className="flex items-start gap-[30px]">
                            <RadioButtonBoolean
                              name={subscriptMailEnum.receive}
                              value={receiveMail === true}
                              disabled={false}
                              text={subscriptMailEnum.receive}
                              setValue={(value: string) => {
                                setReceiveMail(value === subscriptMailEnum.receive)
                              }}
                            />
                            <RadioButtonBoolean
                              name={subscriptMailEnum.not_receive}
                              value={receiveMail === false}
                              disabled={false}
                              text={subscriptMailEnum.not_receive}
                              setValue={(value: string) => {
                                console.log('value', value)
                                console.log('bool: ', value === subscriptMailEnum.receive)
                                setReceiveMail(value === subscriptMailEnum.receive)
                              }}
                            />
                          </div>

                          <p className="pt-[4px] text-mini">
                            ※「受け取らない」に設定しても個別メッセージや運営からの大切なお知らせ等は届きます。ご了承ください。
                          </p>
                        </div>
                      </div>
                    </div>
                  )
                }

                {isEdit && (
                  <>
                    <div className="grid grid-cols-5 gap-[10px] pt-[20px]">
                      <div className="col-span-2">
                        <Button
                          size={ButtonSize.SP}
                          color={ButtonColor.CANCEL}
                          type={ButtonType.SECONDARY}
                          shape={ButtonShape.ELLIPSE}
                          disabled={false}
                          icon={ButtonIcon.OFF}
                          arrow={ButtonArrow.OFF}
                          text="キャンセル"
                          onclick={() => {
                            cancelProfileData()
                          }}
                          className="w-[100%] py-[7px]"
                        />
                      </div>

                      <div className="col-span-3">
                        <Button
                          size={ButtonSize.SP}
                          color={ButtonColor.DEFAULT}
                          type={ButtonType.DEFAULT}
                          shape={ButtonShape.ELLIPSE}
                          disabled={!isEnabledSkillButton || !isCompletedBasicInfo}
                          icon={ButtonIcon.OFF}
                          arrow={ButtonArrow.OFF}
                          text="保存する"
                          onclick={() => {
                            saveProfileData()
                          }}
                          className="w-[100%] py-[7px]"
                        />
                      </div>
                    </div>
                  </>
                )}
              </div>
            </div>
          </div>
        </div>
        {isOpenBioModal && (
          <AddBioCard
            pos={bioPos}
            dateFrom={bioDateF}
            dateTo={bioDateT}
            title={bioTitle}
            isExist={bioExist}
            closeModal={closeBioModal}
            addCareer={addCareer}
            removeCareer={removeCareer}
            updateCareer={updateCareer}
          />
        )}

        {isCloseAccountModal && (
          <CloseAccount
            title="アカウントを削除します 本当によろしいですか？"
            imgUrl="warning"
            subTitle="※削除すると、メッセージなどのデータ が全て閲覧できなくなります。"
            button1Text="キャンセル"
            button2Text="削除する"
            button1Click={clickAccCloseConfirm}
            button2Click={clickAccDeleteConfirm}
            className="border border-red-500 bg-white text-red-500 "
            isModalOpen={isCloseAccountModal}
          />
        )}
      </AfterLoginLayout>
    </div>
  )
}
