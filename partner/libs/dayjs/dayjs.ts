import dayjs from 'dayjs'
import 'dayjs/locale/ja'
dayjs.locale('ja')

export const formatType = {
  YYYYMMDD: 'YYYYMMDD',
  YYYYMMDDHHMMSS: 'YYYYMMDDHHmmss',
  slashYYYYMMDD: 'YYYY/MM/DD',
  slashYYYYMMDDHHMMSS: 'YYYY/MM/DD HH:mm:ss',
  slashYYYYMMDDHHMM: 'YYYY/MM/DD HH:mm',
  hyphenYYYYMMDD: 'YYYY-MM-DD',
  hyphenYYYYMMDDHHMMSS: 'YYYY-MM-DD HH:mm:ss',
  slashYYYYMMDDW: 'YYYY/MM/DD (ddd)',
} as const

type FormatType = keyof typeof formatType

/**
 * 日付フォーマット
 * paramがない場合は現在日時が入る
 */
export const formatDate = (date?: Date | string) => (format: FormatType) => {
  const _date = date ?? new Date()

  switch (format) {
    case 'YYYYMMDD':
      return dayjs(_date).format(formatType.YYYYMMDD)
    case 'YYYYMMDDHHMMSS':
      return dayjs(_date).format(formatType.YYYYMMDDHHMMSS)
    case 'slashYYYYMMDD':
      return dayjs(_date).format(formatType.slashYYYYMMDD)
    case 'slashYYYYMMDDHHMMSS':
      return dayjs(_date).format(formatType.slashYYYYMMDDHHMMSS)
    case 'slashYYYYMMDDHHMM':
      return dayjs(_date).format(formatType.slashYYYYMMDDHHMM)
    case 'hyphenYYYYMMDD':
      return dayjs(_date).format(formatType.hyphenYYYYMMDD)
    case 'hyphenYYYYMMDDHHMMSS':
      return dayjs(_date).format(formatType.hyphenYYYYMMDDHHMMSS)
    case 'slashYYYYMMDDW':
      return dayjs(_date).format('YYYY/MM/DD (ddd)')
  }
}

export const appTimestamp = () => {
  return dayjs().valueOf()
}

export const todayStartTimestamp = () => {
  return dayjs().startOf('day').valueOf()
}

export const appDayjs = dayjs
