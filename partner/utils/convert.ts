export function convertToJapaneseDayName(dayName: string): string {
  const days: { [key: string]: string } = {
    sunday: '日',
    monday: '月',
    tuesday: '火',
    wednesday: '水',
    thursday: '木',
    friday: '金',
    saturday: '土',
  }

  if (days.hasOwnProperty(dayName)) {
    return days[dayName]
  } else {
    return 'Invalid day name'
  }
}

export function convertToJapaneseAmPm(enStr: string): string {
  const amPm: { [key: string]: string } = {
    am: '午前',
    pm: '午後',
  }

  if (amPm.hasOwnProperty(enStr)) {
    return amPm[enStr]
  } else {
    return 'Invalid day name'
  }
}
