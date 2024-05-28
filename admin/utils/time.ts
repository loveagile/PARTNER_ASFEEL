import { Timestamp } from 'firebase/firestore'

export const getTimestampFromDocument = (
  time: Timestamp | number,
): number | undefined => {
  if (time === undefined) return time

  if (typeof time === 'number') return time

  if (typeof time === 'object' && time.seconds) {
    return time.seconds
  }

  return undefined
}

export const formatBirthdayString = (inputDate: string | number) => {
  if (typeof inputDate === 'string' || typeof inputDate === 'number') {
    const dobDate: Date = new Date(inputDate)
    const year: number = dobDate.getFullYear()
    const month: number = dobDate.getMonth()
    const date: number = dobDate.getDate()
    return (
      year.toString() + '年' + month.toString() + '月' + date.toString() + '日'
    )
  }

  return ''
}
