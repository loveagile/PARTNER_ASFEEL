'use client'

import React from 'react'
import Filter from './Filter'
import CustomTable from '@/components/atoms/CustomTable'
import { ColumnsType } from 'antd/es/table'
import PATH from '@/constants/path'
import { DEFAULT_PAGE_SIZE } from '@/constants/common'
import Link from 'next/link'
import { CheckboxOptionType, FormInstance } from 'antd'
import { PaginationInfo } from '@/constants/model'
import { compareTableField, convertUtcToJapanTime } from '@/utils/common'

const columns = (): ColumnsType<any> => [
  {
    title: '大カテゴリ',
    dataIndex: 'largeCategory',
    key: 'largeCategory',
    sorter: (a, b) => compareTableField(a.largeCategory, b.largeCategory),
  },
  {
    title: '中カテゴリ',
    dataIndex: 'mediumCategory',
    key: 'mediumCategory',
    sorter: (a, b) => compareTableField(a.mediumCategory, b.mediumCategory),
  },
  {
    title: '名称',
    dataIndex: 'name',
    key: 'name',
    sorter: (a, b) => compareTableField(a.name, b.name),
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
          href={PATH.category.edit(item.id)}
        >
          編集
        </Link>
      )
    },
  },
]

type ListCategoryPageProps = {
  form: FormInstance<any>
  categoryList: any[]
  largeCategory: CheckboxOptionType[]
  mediumCategory: CheckboxOptionType[]
  nameCategory: CheckboxOptionType[]
  handleValuesChange: (changedValues: any, values: any) => void
  handleChangePage: (page: number, perPage: number) => void
  pagination?: PaginationInfo
  isLoadingTable: boolean
  isLoadingName: boolean
}

const ListCategoryPage = ({
  form,
  categoryList = [],
  largeCategory = [],
  mediumCategory = [],
  nameCategory = [],
  handleValuesChange,
  handleChangePage,
  pagination,
  isLoadingTable,
  isLoadingName,
}: ListCategoryPageProps) => {
  return (
    <div>
      <Filter
        form={form}
        largeCategory={largeCategory}
        mediumCategory={mediumCategory}
        nameCategory={nameCategory}
        handleValuesChange={handleValuesChange}
        isLoadingName={isLoadingName}
      />
      <CustomTable
        loading={isLoadingTable}
        dataSource={categoryList}
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

export default ListCategoryPage
