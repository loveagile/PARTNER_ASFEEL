'use client'

import CustomTable from '@/components/atoms/CustomTable'
import { DEFAULT_PAGE_SIZE } from '@/constants/common'
import { ColumnsType } from 'antd/es/table'
import React from 'react'
import Filter from './Filter'
import PATH from '@/constants/path'
import Link from 'next/link'
import { CheckboxOptionType, FormInstance } from 'antd'
import { PaginationInfo } from '@/constants/model'
import { compareTableField, convertUtcToJapanTime } from '@/utils/common'

const columns = (): ColumnsType<any> => [
  {
    title: '都道府県',
    dataIndex: 'prefecture',
    key: 'prefecture',
    sorter: (a, b) => compareTableField(a.prefecture, b.prefecture),
  },
  {
    title: '質問内容',
    dataIndex: 'question',
    key: 'question',
    sorter: (a, b) => compareTableField(a.question, b.question),
  },
  {
    title: '登録日',
    dataIndex: 'createdAt',
    key: 'createdAt',
    render: (value) => convertUtcToJapanTime(value),
    sorter: (a, b) => compareTableField(a.createdAt, b.createdAt),
  },
  {
    title: '最終更新日',
    dataIndex: 'updatedAt',
    key: 'updatedAt',
    render: (value) => {
      return (
        <span className="text-gray-gray_dark">
          {convertUtcToJapanTime(value)}
        </span>
      )
    },
    sorter: (a, b) => compareTableField(a.updatedAt, b.updatedAt),
  },
  {
    key: 'action',
    align: 'right',
    render: (item) => {
      return (
        <Link
          className="mr-10 whitespace-nowrap rounded-[0.25rem] border border-opacity-10 px-3 py-1 !text-inherit"
          href={PATH.question.edit(item.id)}
        >
          編集
        </Link>
      )
    },
  },
]

type ListQuestionPageProps = {
  isLoadingTable: boolean
  form: FormInstance<any>
  questionList: any[]
  handleValuesChange: (changedValues: any, values: any) => void
  handleChangePage: (page: number, perPage: number) => void
  prefectures?: CheckboxOptionType[]
  pagination?: PaginationInfo
}

const ListQuestionPage = ({
  form,
  prefectures = [],
  questionList = [],
  handleValuesChange,
  handleChangePage,
  pagination,
  isLoadingTable,
}: ListQuestionPageProps) => {
  return (
    <div>
      <Filter
        form={form}
        prefectures={prefectures}
        handleValuesChange={handleValuesChange}
      />
      <CustomTable
        loading={isLoadingTable}
        dataSource={questionList}
        columns={columns()}
        scroll={{ x: 1000 }}
        pagination={{
          onChange: handleChangePage,
          current: pagination?.page || 1,
          pageSize: DEFAULT_PAGE_SIZE,
          total: pagination?.total || 0,
          allTotal: pagination?.allTotal || 0,
          isShowOverallTable: true,
        }}
      />
    </div>
  )
}

export default ListQuestionPage
