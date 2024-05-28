import { PREFECTURE_MAP, PREFECTURE_TYPE } from '@/constants/constant_text'
import { ScheduleType } from '@/types'
import { Timestamp } from 'firebase/firestore'

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

// timestamp object to date
export const objectToDate = (date: Timestamp): Date => {
  const timestamp = new Timestamp(date.seconds, date.nanoseconds)

  const custom_date = timestamp.toDate()

  return custom_date
}

export const detectEmoticon = (input: string): boolean => {
  const emojiPattern =
    /[\u{1F600}-\u{1F64F}\u{1F300}-\u{1F5FF}\u{1F680}-\u{1F6FF}\u{1F700}-\u{1F77F}\u{1F780}-\u{1F7FF}\u{1F800}-\u{1F8FF}\u{1F900}-\u{1F9FF}\u{1FA00}-\u{1FA6F}\u{1FA70}-\u{1FAFF}\u{2600}-\u{26FF}\u{2700}-\u{27BF}\u{2300}-\u{23FF}\u{2B50}\u{1F004}\u{1F0CF}\u{25FE}\u{25FB}\u{25AA}\u{25AB}\u{2B1C}\u{2B1B}\u{25FD}\u{25FC}\u{20E3}]/gu
  return emojiPattern.test(input)
}

export const getPrefectureFromHostname = (language: 'en' | 'ja' = 'en') => {
  const hostname = window.location.hostname

  const match =
    hostname === 'localhost'
      ? 'saitama' // または開発環境のデフォルトの都道府県
      : (hostname.match(/(?:dev-)?(.+?)-(?:partner|educational-recruiting)/) || [])[1]

  return language === 'ja' ? PREFECTURE_MAP[match as PREFECTURE_TYPE] : match
}

export const getSubDomain = () => {
  const hostname = window.location.hostname

  return hostname === 'localhost' ? 'dev-spocul' : hostname.split('-')[0]
}
