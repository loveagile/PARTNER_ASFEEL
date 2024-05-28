'use client'

import { compareTableField, convertUtcToJapanTime } from '@/utils/common'
import PATH from '@/constants/path'
import { ColumnsType } from 'antd/es/table'
import Link from 'next/link'

export const columns = (): ColumnsType<any> => [
  {
    title: '学校ID',
    dataIndex: 'organizationId',
    key: 'organizationId',
    width: '8%',
    sorter: (a, b) => compareTableField(a.organizationId, b.organizationId),
  },
  {
    title: '都道府県',
    dataIndex: ['address', 'prefecture'],
    key: 'prefecture',
    width: '8%',
    sorter: (a, b) => compareTableField(a.prefecture, b.prefecture),
  },
  {
    title: '区分',
    dataIndex: 'organizationTypeText',
    key: 'organizationTypeText',
    width: '8%',
    sorter: (a, b) =>
      compareTableField(a.organizationTypeText, b.organizationTypeText),
  },
  {
    title: '学校名/団体名',
    dataIndex: 'name',
    key: 'name',
    width: '12%',
    sorter: (a, b) => compareTableField(a.name, b.name),
  },
  {
    title: '電話番号',
    dataIndex: 'phoneNumber',
    key: 'phoneNumber',
    width: '12%',
    sorter: (a, b) => compareTableField(a.phoneNumber, b.phoneNumber),
  },
  {
    title: '登録日',
    dataIndex: 'createdAt',
    key: 'createdAt',
    width: '12%',
    sorter: (a, b) => compareTableField(a.createdAt, b.createdAt),
    render: (value) => convertUtcToJapanTime(value),
  },
  {
    title: '最終更新日',
    dataIndex: 'updatedAt',
    key: 'updatedAt',
    width: '12%',
    render: (value) => (
      <span className="text-gray-gray_dark">
        {convertUtcToJapanTime(value)}
      </span>
    ),
    sorter: (a, b) => compareTableField(a.updatedAt, b.updatedAt),
  },
  {
    key: 'action',
    align: 'right',
    render: (item) => {
      return (
        <Link
          className="mr-10 whitespace-nowrap rounded-[0.25rem] border border-opacity-10 px-3 py-1 !text-inherit"
          href={PATH.organization.edit(item.id)}
        >
          編集
        </Link>
      )
    },
  },
]
