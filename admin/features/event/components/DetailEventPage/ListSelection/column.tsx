import { Checkbox, Select } from 'antd'
import { ColumnsType } from 'antd/es/table'
import { AiFillCaretDown } from 'react-icons/ai'
import { MdChatBubble } from 'react-icons/md'
import { PiWarningFill } from 'react-icons/pi'
import React from 'react'
import * as lodash from 'lodash'

import { getColumns } from '@/components/atoms/CustomTable'
import {
  SELECTED_CANDIDATE_OPTIONS,
  SELECTED_CANDIDATE_STATUS,
} from '@/constants/common'
import { compareTableField, convertUtcToJapanTime } from '@/utils/common'

import { INTERVIEW_STATUS, SORT_STATUS_ORDER } from '@/constants/common'
import styles from './index.module.scss'

type columnParams = {
  allSelectionIds?: string[]
  selectedUserIds?: string[]
  handleSelectUser: (
    selectedUserIds?: string[],
    deselectedUserIds?: string[],
  ) => void
  // candidateStatus: any
  // setCandidateStatus: (status: SELECTED_CANDIDATE_STATUS) => void
  handleChangeList: (
    changeValues: { [key: string]: any },
    userId: string,
  ) => void
  handleCellInterviewDate: (data: any) => any
}

export const column = ({
  allSelectionIds = [],
  selectedUserIds = [],
  handleSelectUser,
  handleChangeList,
  handleCellInterviewDate,
}: columnParams): ColumnsType<any> | undefined => {
  let columns: ColumnsType<any> | undefined = [
    {
      title: '氏名',
      dataIndex: 'userName',
      key: 'userName',
      sorter: (a, b) => compareTableField(a.userName, b.userName),
      render(value, record, index) {
        return (
          <span className="flex items-center justify-between">
            {record?.precautions && (
              <PiWarningFill fontSize={16} className="text-core-red" />
            )}
            {value}
            <div className="ml-6 w-[58px] rounded-[20px] bg-gray-gray text-center text-timestamp leading-[21px]">
              {record?.applyOrScout}
            </div>
          </span>
        )
      },
    },
    {
      title: '年齢',
      dataIndex: 'age',
      key: 'age',
      sorter: (a, b) => compareTableField(a.age, b.age),
    },
    {
      title: '性別',
      dataIndex: 'gender',
      key: 'gender',
      sorter: (a, b) => compareTableField(a.gender, b.gender),
    },
    {
      title: '職業',
      dataIndex: 'occupation',
      key: 'occupation',
    },
    {
      title: '所属',
      dataIndex: 'organization',
      key: 'organization',
    },
    {
      title: 'ステータス',
      dataIndex: 'selectedCandidateStatus',
      key: 'selectedCandidateStatus',
      sorter: (a, b) =>
        compareTableField(
          lodash.get(SORT_STATUS_ORDER, [a.selectedCandidateStatus]),
          lodash.get(SORT_STATUS_ORDER, [b.selectedCandidateStatus]),
        ),
      render(value, record) {
        console.log('🚀 ~ file: column.tsx:94 ~ render ~ value:', value)
        const userId = record?.id
        let bgColor = ''
        switch (value) {
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

        return (
          <div className={styles.column_wrapper}>
            <Select
              value={value}
              onSelect={(selectValue) => {
                handleChangeList(
                  {
                    selectedCandidateStatus: selectValue,
                  },
                  userId,
                )
              }}
              onClick={(e) => {
                e.stopPropagation()
              }}
              options={SELECTED_CANDIDATE_OPTIONS}
              className={`p-0 ${bgColor}`}
              suffixIcon={<AiFillCaretDown className="text-gray-black" />}
            />
          </div>
        )
      },
    },
    {
      title: '面接日時',
      dataIndex: 'interviewDate',
      key: 'interviewDate',
      render(value, record) {
        const isInterview = INTERVIEW_STATUS.includes(
          record?.selectedCandidateStatus,
        )

        if (!isInterview) return <></>

        const renderDate = value ? convertUtcToJapanTime(value) : '面接日を入力'

        return <span className="text-small text-core-blue">{renderDate}</span>
      },
      sorter: (a, b) => compareTableField(a.interviewDate, b.interviewDate),
      onCell: handleCellInterviewDate,
    },
    {
      title: '最終メッセージ',
      dataIndex: 'lastMessageDate',
      key: 'lastMessageDate',
      render(value) {
        return <span>{convertUtcToJapanTime(value)}</span>
      },
      sorter: (a, b) => compareTableField(a.lastMessageDate, b.lastMessageDate),
    },
    {
      title: 'メッセージ',
      key: 'message',
      render(value, record, index) {
        return (
          <div className="flex justify-center">
            <MdChatBubble
              fontSize={20}
              className={`${
                value?.isUnread ? 'text-core-sky' : 'text-gray-gray'
              }`}
            />
          </div>
        )
      },
    },
    // {
    //   title: '候補選出日',
    //   dataIndex: 'createdAt',
    //   key: 'createdAt',
    //   render: (value) => {
    //     const seconds = Number(value) * 1000
    //     if (!seconds) return <></>

    //     return <span>{convertUtcToJapanTime(seconds)}</span>
    //   },
    //   sorter: (a, b) => compareTableField(a.createdAt, b.createdAt),
    // },
  ]

  if (handleSelectUser) {
    const isCheckAll =
      selectedUserIds?.length &&
      allSelectionIds?.length &&
      selectedUserIds?.length === allSelectionIds?.length
    columns = [
      ...columns,
      {
        title: (
          <Checkbox
            checked={!!isCheckAll}
            onChange={(e) => {
              if (e.target.checked) {
                handleSelectUser(allSelectionIds)
              } else {
                handleSelectUser([], allSelectionIds)
              }
            }}
          />
        ),
        key: 'checkbox',
        onCell: () => {
          return {
            onClick: (event) => {
              event.stopPropagation()
            },
          }
        },
        render: (value, record) => (
          <Checkbox
            key={record.id}
            checked={selectedUserIds?.includes(record.id)}
            onChange={(e) => {
              if (e.target.checked) {
                handleSelectUser([record.id])
              } else {
                handleSelectUser([], [record.id])
              }
            }}
          />
        ),
      },
    ]
  }

  return getColumns(columns)
}
