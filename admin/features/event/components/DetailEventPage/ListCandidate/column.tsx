import { Checkbox } from 'antd'
import { ColumnsType } from 'antd/es/table'
import { PiWarningFill } from 'react-icons/pi'

import { getColumns } from '@/components/atoms/CustomTable'
import { SCOUT_STATUS } from '@/constants/common'
import { compareTableField, convertUtcToJapanTime } from '@/utils/common'

type columnParams = {
  allCandidateIds?: string[]
  selectedUserIds?: string[]
  handleSelectUser?: (
    selectedUserIds?: string[],
    deselectedUserIds?: string[],
  ) => void
}

export const column = ({
  allCandidateIds = [],
  selectedUserIds = [],
  handleSelectUser,
}: columnParams): ColumnsType<any> | undefined => {
  let columns: ColumnsType<any> | undefined = [
    {
      title: 'No',
      dataIndex: 'id',
      key: 'id',
      render(value, record, index) {
        return (
          <span className="flex items-center gap-1">
            {record?.precautions && (
              <PiWarningFill fontSize={16} className="text-core-red" />
            )}
            {value}
          </span>
        )
      },
      sorter: (a, b) => compareTableField(a.id, b.id),
    },
    {
      title: '氏名',
      dataIndex: 'userName',
      key: 'userName',
      sorter: (a, b) => compareTableField(a.userName, b.userName),
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
      title: '候補選出日',
      dataIndex: 'createdAt',
      key: 'createdAt',
      render: (value) => {
        const seconds = Number(value) * 1000
        if (!seconds) return <></>

        return <span>{convertUtcToJapanTime(seconds)}</span>
      },
      sorter: (a, b) => compareTableField(a.createdAt, b.createdAt),
    },
    {
      title: 'スカウト',
      dataIndex: 'scoutStatus',
      key: 'scoutStatus',
      render(value, record, index) {
        let className = ''

        if (value?.value === SCOUT_STATUS.unsend) {
          className = 'text-core-red'
        }

        if (value?.value === SCOUT_STATUS.scouted) {
          className = 'text-core-blue'
        }

        return <span className={`${className}`}>{value?.label || ''}</span>
      },
    },
    {
      title: 'スカウト送信日',
      dataIndex: 'scoutSendDate',
      key: 'scoutSendDate',
      render: (value) => {
        const timestamp = Number(value) * 1000
        if (!value || !timestamp) return <></>

        return <span>{convertUtcToJapanTime(timestamp)}</span>
      },
    },
  ]

  if (handleSelectUser) {
    const isCheckAll =
      selectedUserIds?.length &&
      allCandidateIds?.length &&
      selectedUserIds?.length === allCandidateIds?.length
    columns = [
      ...columns,
      {
        title: (
          <Checkbox
            checked={!!isCheckAll}
            onChange={(e) => {
              if (e.target.checked) {
                handleSelectUser(allCandidateIds)
              } else {
                handleSelectUser([], allCandidateIds)
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
