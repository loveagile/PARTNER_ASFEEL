'use client'

import React, { useState, useEffect } from 'react'
import { GoTriangleDown } from 'react-icons/go'

export enum StatusType {
  NotStarted = '未対応',
  InProgress = '対応中',
  Interview = '面談',
  Adopted = '採用',
  Change = '一括変更',
  NotAdopted = '不採用',
  Cancel = '辞退',
}

interface Props {
  className?: string
  currentStatus: StatusType
  isForChange?: boolean
}

const Status: React.FC<Props> = ({
  className = '',
  currentStatus,
  isForChange = false,
}) => {
  const statusList = isForChange
    ? [
        { id: 1, name: StatusType.NotStarted },
        { id: 2, name: StatusType.InProgress },
        { id: 3, name: StatusType.Interview },
        { id: 4, name: StatusType.Adopted },
        { id: 5, name: StatusType.Change },
        { id: 6, name: StatusType.NotAdopted },
        { id: 7, name: StatusType.Cancel },
      ]
    : [
        { id: 1, name: StatusType.NotStarted },
        { id: 2, name: StatusType.InProgress },
        { id: 3, name: StatusType.Interview },
        { id: 4, name: StatusType.Adopted },
        { id: 5, name: StatusType.NotAdopted },
        { id: 6, name: StatusType.Cancel },
      ]

  let clickedStatus: StatusType

  const setStyledClass = (status: StatusType) => {
    let styledClass = ''
    let bgClass = 'bg-gray-gray_light'
    let textClass = 'text-timestamp'
    let widthClass = 'w-[74px]'

    switch (status) {
      case StatusType.NotStarted:
        bgClass = 'bg-light-red_light'
        break
      case StatusType.InProgress:
        bgClass = 'bg-light-blue_light'
        break
      case StatusType.Interview:
        bgClass = 'bg-tools-purple_light'
        break
      case StatusType.Adopted:
        bgClass = 'bg-light-green_light'
        break
      case StatusType.Change:
        widthClass = 'w-[88px] h-[26px]'
        textClass = 'text-mini'
        break

      default:
        break
    }

    styledClass = `${textClass} ${widthClass} ${bgClass}`

    return styledClass
  }

  const [selectedStatus, setSelectedStatus] = useState(currentStatus)
  const [showStatusList, setShowStatusList] = useState(false)
  const [matchingClass, setMatchingClass] = useState(
    setStyledClass(currentStatus),
  )

  useEffect(() => {
    setSelectedStatus(currentStatus)
  }, [currentStatus])

  const handleClickOutside = (e: MouseEvent) => {
    const target = e.target as HTMLElement
    if (
      !target.classList.contains('custom-select-option') &&
      !target.classList.contains('selected-text')
    ) {
      setShowStatusList(false)
    }
  }

  useEffect(() => {
    document.addEventListener('mousedown', handleClickOutside)
    return () => {
      document.removeEventListener('mousedown', handleClickOutside)
    }
  }, [])

  const handleListDisplay = () => {
    setShowStatusList((prevState) => !prevState)
  }

  const handleOptionClick = (e: React.MouseEvent<HTMLLIElement>) => {
    const target = e.target as HTMLElement
    let clickedOption = target.getAttribute('data-name') || ''
    statusList.map((status) => {
      if (status.name == clickedOption) {
        clickedStatus = status.name
      }
    })

    setSelectedStatus(clickedStatus)
    setShowStatusList(false)

    let styledClass = setStyledClass(clickedStatus)
    setMatchingClass(styledClass)
  }

  console.log('here => ', selectedStatus, matchingClass)

  return (
    <div className={`relative inline-block ${className}`}>
      <div
        className={`relative rounded border border-gray-gray_dark px-3 py-1 ${matchingClass} ${
          showStatusList ? 'selected-text active' : 'selected-text'
        }`}
        onClick={handleListDisplay}
      >
        {selectedStatus}
        <GoTriangleDown className="absolute bottom-0 right-[6px] top-0 my-auto" />
      </div>
      {showStatusList && (
        <ul className="absolute z-50 w-full rounded border-x border-gray-gray_dark">
          {statusList.map((status) => {
            return (
              <li
                className="custom-select-option cursor-pointer list-none border-b border-gray-gray_dark bg-gray-gray_light px-3 py-1 text-timestamp"
                data-name={status.name}
                key={status.id}
                onClick={handleOptionClick}
              >
                {status.name}
              </li>
            )
          })}
        </ul>
      )}
    </div>
  )
}

export default Status
