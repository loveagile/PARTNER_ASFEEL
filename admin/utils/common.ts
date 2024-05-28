import {
  API_ROUTES,
  DEFAULT_PAGE_SIZE,
  KANA_CHAR_MAP,
  MAX_PAGE_SIZE,
  SELECTED_CANDIDATE_STATUS,
} from '@/constants/common'
import { ErrorValidation } from '@/constants/error'
import PATH from '@/constants/path'
import { NextResponse } from 'next/server'
import dayjs from 'dayjs'
import { UserPDFProps } from '@/components/UserPDF'
import { formatBirthdayString } from './time'

/**
 * Sleep
 */
export const sleep = (msec: number) =>
  new Promise((resolve) => setTimeout(resolve, msec))

/**
 * 本番チェック
 */
export const isRemote = process.env.NODE_ENV === 'production'
export const isDev = process.env.NEXT_PUBLIC_PROJECT_ID === 'police-devlop'

/**
 * 本アプリのログ
 */
export class Logger {
  /**
   * 検証用
   */
  static log = (message: any, ...payload: any) =>
    console.log(`📝[LOG]: ${message}${payload}`)
  static warn = (message: any, ...payload: any) =>
    console.warn(`⚠️[WARN]: ${message}${payload}`)
  static error = (message: any, ...payload: any) =>
    console.error(`🚨[ERROR]: ${message}${payload}`)
  static success = (message: any, ...payload: any) =>
    console.log(`✅[SUCCESS]: ${message}${payload}`)
}

/**
 * プロミス化
 */
export const promisify = <T>(
  fn: (...args: any[]) => void,
): ((...args: any[]) => Promise<T>) => {
  return function (...args: any[]): Promise<T> {
    return new Promise<T>((resolve, reject) => {
      fn(...args, (err: any, result: T) => {
        if (err) {
          reject(err)
        } else {
          resolve(result)
        }
      })
    })
  }
}

/**
 * ファイルの拡張子を取得
 */
export const getFileExtension = (file: File) => {
  const filename = file.name
  const dotIndex = filename.lastIndexOf('.')
  if (dotIndex === -1) {
    return ''
  }
  return filename.substring(dotIndex + 1)
}

/**
 * 電話番号をフォーマットします
 */
export const formatGlobalPhoneNumber = (phoneNumber: string) => {
  // 先頭の0を削除します
  phoneNumber = phoneNumber.replace(/^0+/, '')

  // 電話番号の長さを確認します
  if (phoneNumber.length === 10) {
    // 10桁の場合は国番号（+81）を追加します
    const formattedNumber =
      '+81' +
      phoneNumber.substring(0, 3) +
      phoneNumber.substring(3, 6) +
      phoneNumber.substring(6)
    return formattedNumber
  } else if (phoneNumber.length === 11) {
    // 11桁の場合は国番号（+）を追加します
    const formattedNumber =
      '+' +
      phoneNumber.substring(0, 1) +
      phoneNumber.substring(1, 4) +
      phoneNumber.substring(4, 7) +
      phoneNumber.substring(7)
    return formattedNumber
  } else {
    // サポートされていない電話番号の長さの場合はエラーメッセージを返します
    return 'サポートされていない電話番号の長さです'
  }
}

/**
 * Firebase Authenticationの電話番号を日本の形式に変換する関数
 */
export function convertPhoneNumber(input: string): string {
  const prefix = '+81'
  const convertedPrefix = '0'

  if (input.startsWith(prefix)) {
    const phoneNumber = input.slice(prefix.length)
    return convertedPrefix + phoneNumber
  }

  return input
}

/**
 * secondsをYYYY-MM-DD HH:mm形式に変換
 */
export const convertSecondsToYYYYMMDDHHmm = (seconds: number) => {
  const date = new Date(seconds * 1000)
  const year = date.getFullYear()
  const month = ('0' + (date.getMonth() + 1)).slice(-2)
  const day = ('0' + date.getDate()).slice(-2)
  const hour = ('0' + date.getHours()).slice(-2)
  const minute = ('0' + date.getMinutes()).slice(-2)
  return `${year}/${month}/${day} ${hour}:${minute}`
}

export const addComma = (num: number) => {
  return num.toLocaleString()
}

type Address = {
  address1: string
  address2: string
  address3: string
  kana1: string
  kana2: string
  kana3: string
  prefcode: string
  zipcode: string
}

export const getAddressFromZipCode = async (zipCode: string) => {
  try {
    const addressResponse = await fetch(
      `https://zipcloud.ibsnet.co.jp/api/search?zipcode=${zipCode}`,
    )
    const data = await addressResponse.json()
    if (data?.status !== 200 && data?.message) {
      throw new Error(data.message)
    }

    if (data?.results?.length === 0 || !data?.results) {
      throw new Error(ErrorValidation.ZIP_CODE_NOT_FOUND.message)
    }

    return data?.results?.[0] as Address
  } catch (error: any) {
    throw error
  }
}

export const convertFullWidthToHalfWidth = (str: string) => {
  // Just cover Latin letters, add other case if needed
  return str.replace(/[！-～]/g, (s) => {
    return String.fromCharCode(s.charCodeAt(0) - 0xfee0)
  })
}

export const convertHalfWidthToFullWidth = (str: string) => {
  // Just cover Katakana, add other case if needed
  return str.replace(new RegExp(`[${KANA_CHAR_MAP.half}]`, 'g'), (s) => {
    const halfIndex = KANA_CHAR_MAP.half.indexOf(s)
    return halfIndex === -1 ? s : KANA_CHAR_MAP.full[halfIndex]
  })
}

export const convertUtcToJapanTime = (
  utc: string | number,
  isHideHour: boolean = false,
) => {
  if (typeof utc !== 'number' && typeof utc !== 'string') return ''

  const inputDate = new Date(utc)

  const formattedDateString = inputDate.toLocaleString('ja-JP', {
    year: 'numeric',
    month: '2-digit',
    day: '2-digit',
    weekday: 'short',
    hour: isHideHour ? undefined : '2-digit',
    minute: isHideHour ? undefined : '2-digit',
  })

  return formattedDateString
}

export const parsePageNumber = (
  page?: number | string | null,
  perPage?: number | string | null,
) => {
  const parsedPage = Number(page) || 1
  const parsedPerPage = Number(perPage) || DEFAULT_PAGE_SIZE

  return {
    page: parsedPage,
    perPage: parsedPerPage,
    from: (parsedPage - 1) * parsedPerPage,
    size: parsedPerPage,
  }
}

export const compareTableField = (a: number | string, b: number | string) => {
  if (typeof a === 'number' && typeof b === 'number') {
    return a - b
  }
  if (typeof a === 'string' && typeof b === 'string') {
    return a.localeCompare(b)
  }

  // Add other case if needed

  return 1
}

export const parseQueryParam = (value: string | null) => {
  try {
    if (!value) return value
    if (value === 'undefined') return undefined
    return JSON.parse(value)
  } catch (error) {
    return value
  }
}

export const convertUrlSearchParams = (params: { [key: string]: any }) => {
  const urlSearchParams = new URLSearchParams()

  Object.entries(params).forEach(([key, value]) => {
    if (value === undefined) return
    if (Array.isArray(value)) {
      value.forEach((item) => {
        urlSearchParams.append(key, encodeURIComponent(item))
      })
    } else {
      urlSearchParams.append(key, encodeURIComponent(value))
    }
  })

  return urlSearchParams
}

export const handleError = (error: any) => {
  console.error('error trace', error)
  return NextResponse.json(
    {
      error,
    },
    {
      status: 500,
    },
  )
}

export const fetchPrefecture = async (
  setPrefectures: React.Dispatch<React.SetStateAction<any[]>>,
) => {
  try {
    const res = await customFetchUtils(API_ROUTES.ADDRESS.find)
    const data = await res.json()

    setPrefectures(
      data?.map((item: any) => ({
        ...item,
        label: item?.prefecture,
        value: item?.id,
      })) || [],
    )
  } catch (error) {
    console.log(error)
  }
}

export const fetchParentOrganization = async (
  additionalParams: object = {},
) => {
  const urlSearchParams = convertUrlSearchParams({
    page: 1,
    perPage: MAX_PAGE_SIZE,
    parentId: 'NULL', //elastic search doesn't support null value
    ...additionalParams,
  })

  const res = await customFetchUtils(
    `${API_ROUTES.COORDINATOR.list}?${urlSearchParams || ''}`,
  )
  const data = await res.json()

  const parentOrganization = (data?.data?.map((item: any) => ({
    label: item?.organizationName,
    value: item?.id,
  })) || []) as {
    label: string
    value: string | null
  }[]

  parentOrganization.unshift({
    label: 'なし',
    value: 'NULL', //elastic search doesn't support null value
  })

  return parentOrganization
}

export const fetchAreaOption = async (prefecture?: string) => {
  const urlSearchParams = convertUrlSearchParams({
    prefecture,
  })

  const res: any = await customFetchUtils(
    `${API_ROUTES.ADDRESS.areas}?${urlSearchParams || ''}`,
  )
  const response = await res.json()

  const areaOption = response.map((item: any) => ({
    ...item,
    label: item.area,
    value: item.id,
  }))

  return areaOption
}

export const customFetchUtils = async (
  input: RequestInfo | URL,
  init?: RequestInit,
) => {
  const res = await fetch(input, init)

  if (!res.ok) {
    if (res.status === ErrorValidation.UNAUTHORIZED.code) {
      window.location.href = PATH.auth.login
    }
  }

  return res
}

export const filterOption = (input: string, option: any) => {
  return option?.label?.toLowerCase()?.includes(input?.toLowerCase())
}

export const transformDetailCandidateData = (detailCandidate: any) => {
  const clubsDisplay: any = {}
  detailCandidate?.clubs?.map((club: any, index: number) => {
    const large = club?.largeCategory
    const clubName = club?.name

    if (!clubsDisplay[large]) {
      clubsDisplay[large] = []
    }

    clubsDisplay[large].push(clubName)
  })

  const areasOfActivityDisplay: any = {}
  detailCandidate?.areasOfActivity?.map((address: any, index: number) => {
    const prefecture = address?.prefectureName
    const city = address?.city

    if (!areasOfActivityDisplay[prefecture]) {
      areasOfActivityDisplay[prefecture] = []
    }

    areasOfActivityDisplay[prefecture].push(city)
  })

  const careerDisplay = detailCandidate?.career?.map(
    (item: any, index: number) => {
      const termOfStart = dayjs(item?.termOfStart?.seconds * 1000).format(
        'YYYY/MM',
      )
      const termOfEnd = dayjs(item?.termOfEnd?.seconds * 1000).format('YYYY/MM')

      return {
        termOfStart,
        termOfEnd,
        organizationName: item?.organizationName,
      }
    },
  )

  const questionsForPrefectureDisplay: any = {}
  detailCandidate?.questionsForPrefecture?.map(
    (question: any, index: number) => {
      const prefecture = question?.prefecture
      const questionText = question?.question
      const answerText = question?.answer

      if (!questionsForPrefectureDisplay[prefecture]) {
        questionsForPrefectureDisplay[prefecture] = []
      }

      questionsForPrefectureDisplay[prefecture].push({
        question: questionText,
        answer: answerText,
      })
    },
  )

  const transformData: any = {
    avatar: detailCandidate?.avatar || '',
    fullName: detailCandidate?.fullName || '',
    age: detailCandidate?.age?.toString() || '',
    gender: detailCandidate?.gender || '',
    createdAt:
      convertUtcToJapanTime(
        Number(detailCandidate?.createdAt?.seconds * 1000),
      ) || '',
    updatedAt:
      convertUtcToJapanTime(
        Number(detailCandidate?.updatedAt?.seconds * 1000),
      ) || '',
    occupation: {
      type: detailCandidate?.occupation?.type || '',
      organization: detailCandidate?.occupation?.organization || '',
      faculty: detailCandidate?.occupation?.faculty || '',
      grade: detailCandidate?.occupation?.grade || '',
    },
    workingHours: detailCandidate?.officeHours || {},
    birthday:
      formatBirthdayString(Number(detailCandidate?.birthday?.seconds) * 1000) ||
      '',
    phoneNumber: detailCandidate?.phoneNumber || '',
    email: detailCandidate?.email || '',
    clubsDisplay: clubsDisplay || {},
    areasOfActivityDisplay: areasOfActivityDisplay || {},
    isExpeditionPossible: detailCandidate?.isExpeditionPossible || '',
    experienceText: `${detailCandidate?.experience || ''}${
      detailCandidate?.experienceNote
        ? '/' + detailCandidate?.experienceNote
        : ''
    }`,
    teacherLicenseText: `${detailCandidate?.teacherLicenseStatus || ''}${
      detailCandidate?.teacherLicenseNote
        ? '/' + detailCandidate?.teacherLicenseNote
        : ''
    }`,
    otherLicense: `${detailCandidate?.otherLicense || ''}${
      detailCandidate?.otherLicenseNote
        ? '/' + detailCandidate?.otherLicenseNote
        : ''
    }`,
    questionsForPrefectureDisplay: questionsForPrefectureDisplay || {},
    hasDriverLicense: detailCandidate?.hasDriverLicense || '',
    pr: detailCandidate?.pr || '',
    careerDisplay: careerDisplay || [],
    precautions: detailCandidate?.precautions || '',
  }

  return transformData
}

export const transformDetainCandidatePdf = (detailCandidate: any) => {
  const transformData = transformDetailCandidateData(detailCandidate)

  const dataPdf: UserPDFProps['data'] = {
    ...transformData,
    eventsTeach: Object.entries(detailCandidate.clubsDisplay || {})
      .map(([key, value]: any) => {
        return `${key} : ${value?.join(', ')}`
      })
      .join('\n'),
    areaTeach: Object.entries(detailCandidate.areasOfActivityDisplay || {})
      .map(([key, value]: any) => {
        return `${key} : ${value?.join(', ')}`
      })
      .join('\n'),
  }

  return dataPdf
}

export const getStatusBgColor = (status: string) => {
  let bgColor = ''
  switch (status) {
    case SELECTED_CANDIDATE_STATUS.notStarted:
      bgColor = 'bg-light-red_light'
      break
    case SELECTED_CANDIDATE_STATUS.inProgress:
      bgColor = 'bg-light-blue_light'
      break
    case SELECTED_CANDIDATE_STATUS.interview:
      bgColor = 'bg-tools-purple_light'
      break
    case SELECTED_CANDIDATE_STATUS.adopted:
      bgColor = 'bg-light-green_light'
      break
    default:
      bgColor = 'bg-gray-gray_light'
      break
  }

  return bgColor
}
