import { convertToJapaneseAmPm, convertToJapaneseDayName } from '@/utils/convert'
import React from 'react'

interface ScheduleProps {
  className?: string
  schedule: {
    [key: string]: string[]
  }
  size: 'default' | 'small' | 'mini'
}

const Schedule: React.FC<ScheduleProps> = ({ className = '', schedule, size }) => {
  const daysOfWeek = ['monday', 'tuesday', 'wednesday', 'thursday', 'friday', 'saturday', 'sunday']
  const amPm = ['am', 'pm']

  const hasSchedule = (day: string, time: string) => {
    const daySchedule = schedule[day]
    if (!daySchedule) {
      return false
    }
    return daySchedule.includes(time)
  }

  const sizes = {
    default: {
      blackDotSize: 'w-5 h-5',
      cellSize: 'min-w-[67px]',
      textClass: 'text-body_sp',
    },
    small: {
      blackDotSize: 'w-4 h-4',
      cellSize: 'min-w-[51px]',
      textClass: 'text-timestamp',
    },
    mini: {
      blackDotSize: 'w-[14px] h-[14px]',
      cellSize: 'min-w-[28px]',
      textClass: 'text-timestamp',
    },
  }

  const { blackDotSize, cellSize, textClass } = sizes[size]

  return (
    <div className={`${className}`}>
      <table className="w-full text-center">
        <thead className="bg-gray-gray_lighter">
          <tr>
            <th className="border border-gray-gray"></th>
            {daysOfWeek.map((day) => (
              <th key={day} className={`${textClass} h-5 border border-gray-gray ${cellSize} leading-none`}>
                {convertToJapaneseDayName(day)}
              </th>
            ))}
          </tr>
        </thead>
        <tbody>
          {amPm.map((time) => (
            <tr key={time}>
              <td className={`${textClass} bg-gray-gray_lighter border border-gray-gray ${cellSize} py-[5px]`}>{convertToJapaneseAmPm(time)}</td>
              {daysOfWeek.map((day) => (
                <td key={`${day}-${time}`} className={`border border-gray-gray align-middle ${size === 'small' ? 'bg-gray-white' : ''} ${cellSize}`}>
                  {hasSchedule(day, time) ? <span className={`block mx-auto ${blackDotSize} rounded-full bg-gray-black`}></span> : null}
                </td>
              ))}
            </tr>
          ))}
        </tbody>
      </table>
    </div>
  )
}

export default React.memo(Schedule)
