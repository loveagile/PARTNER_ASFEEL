import { getCityPopulate } from '@/firebase/city'
import { getClubTypeCategoryPopulate } from '@/firebase/clubTypeCategory'
import { City, ClubTypeCategory, EventProject, LeadersWantedProject, Prefecture, PrivateUser } from '@/models'
import { MessageRoomType, QuestionsForPrefecture, ScheduleType } from '@/types'
import { Timestamp } from 'firebase/firestore'
import { DetailedJobCardProps } from '@/components/organisms/Card/DetailedJobCard'
import { encrypt } from './token'
import { format, isToday } from 'date-fns'
import { ja } from 'date-fns/locale'
import { PREFECTURE_MAP, PREFECTURE_TYPE } from './constants'
import { Option } from '@/types'
import { IconTypeSelectBox, SelectBoxSize } from '@/components/atoms/Input/SelectBox'
import { schoolTypeEnum } from '@/components/organisms/Card/JobCard'
/**
 * 本番チェック
 */
export const isProduction = process.env.NODE_ENV === 'production'

// katakana validation handle
export const isKatakana = (input: string): boolean => {
  const katakanaRegex = /^[\u30A0-\u30FF]+$/
  return katakanaRegex.test(input)
}

// check the string contain only number
export const isStringOnlyNumbers = (str: string): boolean => {
  return /^\d+$/.test(str)
}

// check the empty data of office hours
export const isDataInOfficeHours = (data: ScheduleType): boolean => {
  let cnt = 0
  Object.values(data).map((office) => {
    cnt += office.length
  })

  return !(cnt == 0)
}

// check the empty data of question prefecture
export const isDataInQuestionPrefecture = (data: QuestionsForPrefecture[]): boolean => {
  let cnt = 0

  data.map((que) => (que.question || que.answer) && cnt++)

  return !(cnt == 0)
}

// get areas data
export const getAreasData = async (areaIds: string[]): Promise<City[]> => {
  const areas = await Promise.all(areaIds.map((areaId) => getCityPopulate(areaId.toString())))

  // Filter out null values, if any document doesn't exist
  return areas.filter((area) => area !== null) as City[]
}

// get clubs data
export const getClubsData = async (clubIds: string[]): Promise<ClubTypeCategory[]> => {
  const clubPromises = clubIds.map((clubId) => getClubTypeCategoryPopulate(clubId.toString()))
  const clubs = await Promise.all(clubPromises)

  // Filter out null values, if any document doesn't exist
  return clubs.filter((club) => club !== null) as ClubTypeCategory[]
}

// convert timestamp to date format
export const convFirebaseToDateFormat = (time: Timestamp): string => {
  const date = time.toDate()

  // extract the year and month components
  const year = date.getFullYear()
  const month = date.getMonth() + 1 // add 1 to convert from 0-indexed to 1-indexed

  // create a string in the format yyyy-mm
  const formattedDate = `${year}-${month.toString().padStart(2, '0')}`
  return formattedDate
}

// calculate age
export const calculateAge = (birthdate: Timestamp): string => {
  const timestamp = new Timestamp(birthdate.seconds, birthdate.nanoseconds)

  const custom_date = timestamp.toDate()

  const today = new Date()
  const age = today.getFullYear() - custom_date.getFullYear()
  if (
    today.getMonth() < custom_date.getMonth() ||
    (today.getMonth() === custom_date.getMonth() && today.getDate() < custom_date.getDate())
  ) {
    return `(満${age - 1}歳)`
  } else {
    return `(満${age}歳)`
  }
}

export const notiDateFormat = (data: Timestamp): string => {
  const date = data.toDate()

  return format(date, 'yyyy/MM/dd(EEE) HH:mm', { locale: ja })
}

export const messageRoomDateFormat = (data: Timestamp): string => {
  const timestamp = new Timestamp(data.seconds, data.nanoseconds)

  const date = timestamp.toDate()

  if (isToday(date)) {
    return format(date, 'HH:mm')
  } else {
    return format(date, 'yyyy/MM/dd')
  }
}

export const messageRoomAnnounceDateFormat = (data: Timestamp): string => {
  const timestamp = new Timestamp(data.seconds, data.nanoseconds)

  const date = timestamp.toDate()

  return format(date, 'HH:mm')
}

// customize the date to japanese
export const dateFormat = (date: Timestamp): string => {
  const timestamp = new Timestamp(date.seconds, date.nanoseconds)

  const custom_date = timestamp.toDate()
  const formattedDate = `${custom_date.getFullYear()}年${custom_date.getMonth() + 1}月${custom_date.getDate()}日`

  return formattedDate
}

// timestamp object to date
export const objectToDate = (date: Timestamp): Date => {
  const timestamp = new Timestamp(date.seconds, date.nanoseconds)

  const custom_date = timestamp.toDate()

  return custom_date
}

// customize the zip code to xxx-xxxx
export const formatZip = (zip: number): string => {
  const formattedNumber = `${zip.toString().substr(0, 3)}-${zip.toString().substr(3)}`
  return formattedNumber
}

// get prefecture name when input prefecture db id
export const getPrefectureName = (id: string, prefectureList: Prefecture[]): string => {
  const index = prefectureList.findIndex((prefecture) => prefecture.id == id)

  if (index != -1) {
    return prefectureList[index].prefecture
  } else {
    return 'ooo'
  }
}

export const customizeEventList = (projects: EventProject[]) => {
  if (!projects || projects.length === 0) return []

  return projects.map((data) => {
    return {
      url: data.subTitle,
      title: data.title,
      subTitle: data.subTitle ? data.subTitle : '',
      description: data.jobDescription,
      gender: data.gender,
      school: data.schoolName,
      count: data.numberOfApplicants,
      address: data.workplace,
      id: data.id,
      type: 'event',
    }
  })
}

export const customizeLeaderProjectList = (projects: LeadersWantedProject[]) => {
  if (!projects || projects.length === 0) return []

  return projects.map((data) => {
    const schoolType =
      data.type === 'school' ? data.organizationType : schoolTypeEnum[data.type as keyof typeof schoolTypeEnum]

    return {
      url: data.eventName,
      title: data.organizationName,
      subTitle: data.eventName,
      description: data.activityDescription,
      gender: data.gender,
      school: data.target && data.target.join(', '),
      schoolType,
      count: data.recruitment,
      address: data.workplace,
      id: data.id,
      type: 'leader',
    }
  })
}

export const customizeDetailedEventList = (eventProject: EventProject[]) => {
  let tmpEventProject: DetailedJobCardProps[] = []

  if (eventProject && eventProject.length > 0) {
    eventProject.map((data) => {
      tmpEventProject.push({
        url: 'ball',
        title: data.title,
        subTitle: data.subTitle,
        description: data.jobDescription,
        gender: data.gender,
        school: data.schoolName,
        count: data.numberOfApplicants,
        background: 'football',
        id: data.id,
      })
    })

    return tmpEventProject
  } else {
    return []
  }
}

export const customizeDetailedLeadersWantedProjectList = (leadersWantedProject: LeadersWantedProject[]) => {
  let tmpEventProject: DetailedJobCardProps[] = []

  if (leadersWantedProject && leadersWantedProject.length > 0) {
    leadersWantedProject.map((data) => {
      tmpEventProject.push({
        url: `sports/${data.eventName}`,
        title: data.organizationName,
        subTitle: data.eventName,
        description: data.activityDescription,
        gender: data.gender,
        school: data.target && data.target.join(', '),
        count: data.recruitment,
        background: 'football',
        id: data.id,
      })
    })

    return tmpEventProject
  } else {
    return []
  }
}

export const createEmptySignUpToken = () => {
  const signup_user_data: PrivateUser = {
    createdAt: Timestamp.now(),
    updatedAt: Timestamp.now(),
    email: '',
    confirmEmail: '',
    name: {
      sei: '',
      mei: '',
      seiKana: '',
      meiKana: '',
    },
    gender: null,
    occupation: {
      type: '',
      organization: '',
      faculty: '',
      grade: '',
    },
    birthday: Timestamp.now(),
    address: {
      zip: 0,
      prefecture: '',
      city: '',
      address1: '',
      address2: '',
    },
    phoneNumber: 0,
    clubs: [],
    areasOfActivity: [],
    areaNotes: [],
    officeHours: {
      monday: [],
      tuesday: [],
      wednesday: [],
      thursday: [],
      friday: [],
      saturday: [],
      sunday: [],
    },
    isExpeditionPossible: null,
    experience: null,
    experienceNote: '',
    teacherLicenseStatus: null,
    teacherLicenseNote: '',
    otherLicense: null,
    otherLicenseNote: '',
    hasDriverLicense: null,
    pr: '',
    questionsForPrefecture: [],
    career: [],
    subscribeEmail: true,
    isSuspended: false,
    isDeletedAccount: false,
    avatar: '',
  }

  localStorage.setItem('signup_data', encrypt(JSON.stringify(signup_user_data)))
  return encrypt(JSON.stringify(signup_user_data))
}

export const detectEmoticon = (input: string): boolean => {
  return /\p{Extended_Pictographic}/u.test(input)
}

export const getSubDomain = () => {
  const hostname = window.location.hostname

  return hostname === 'localhost' ? 'dev-spocul' : hostname.split('-')[0]
}

export const getPrefectureFromHostname = (language: 'en' | 'ja' = 'en') => {
  const hostname = window.location.hostname

  const match =
    hostname === 'localhost'
      ? 'saitama' // または開発環境のデフォルトの都道府県
      : (hostname.match(/(?:dev-)?(.+?)-(?:partner|educational-recruiting)/) || [])[1]

  return language === 'ja' ? PREFECTURE_MAP[match as PREFECTURE_TYPE] : match
}

export function setValidationError(value: string, detectFunc: Function, setErrorFunc: Function, errorMsg: string) {
  if (value && detectFunc(value)) {
    setErrorFunc(errorMsg)
  } else {
    setErrorFunc('')
  }
}

export const customizePrefectureList = (prefectureList: Prefecture[]): Option[] => {
  return prefectureList.map((data) => {
    return {
      value: data.prefecture || '',
      placeholder: false,
      text: data.prefecture,
      icon: IconTypeSelectBox.OFF,
      size: SelectBoxSize.PC,
    }
  })
}

export const sleep = (msec: number) => new Promise((resolve) => setTimeout(resolve, msec))

// not nullチェック
export const isNotNull = (value: any) => {
  return !isNull(value)
}

// nullチェック
export const isNull = (value: any) => {
  return value === null || value === undefined
}

// not 空文字チェック
export const isNotEmpty = (value: any) => {
  return !isEmpty(value)
}

// 空文字チェック
export const isEmpty = (value: any) => {
  return value === ''
}

// not null or 空文字チェック
export const isNotNullOrEmpty = (value: any) => {
  return isNotNull(value) && isNotEmpty(value)
}

// 与えられた配列データとkey名でMapを作成する
export function arrayToMap<T extends object, K extends keyof T>(array: T[], key: K): Map<T[K], T> {
  const map = new Map<T[K], T>()
  for (const item of array) {
    if (key in item) {
      map.set(item[key], item)
    }
  }
  return map
}

export const calculateUnreadMessages = (messages: MessageRoomType[], authUserId: string) => {
  return messages.reduce(
    (totalUnread, message) =>
      totalUnread +
      message.members.reduce((count, member) => count + (member.userId === authUserId ? member.unreadCount : 0), 0),
    0,
  )
}
