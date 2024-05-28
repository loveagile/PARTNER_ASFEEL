'use client'

import React from 'react'
import Filter from './Filter'
import CustomTable from '@/components/atoms/CustomTable'
import { ColumnsType } from 'antd/es/table'
import PATH from '@/constants/path'
import { DEFAULT_PAGE_SIZE, PROJECT_TYPE_OPTIONS } from '@/constants/common'
import Link from 'next/link'
import { CheckboxOptionType, FormInstance } from 'antd'
import { PaginationInfo } from '@/constants/model'
import { DefaultOptionType } from 'antd/es/select'
import { compareTableField, convertUtcToJapanTime } from '@/utils/common'

const columns = (): ColumnsType<any> => [
  {
    title: 'No',
    dataIndex: 'coordinatorIdOfPrefecture',
    key: 'coordinatorIdOfPrefecture',
    sorter: (a, b) => compareTableField(a.coordinatorIdOfPrefecture, b.coordinatorIdOfPrefecture),
  },
  {
    title: '担当地域',
    dataIndex: 'prefectures',
    key: 'prefectures',
    sorter: (a, b) => compareTableField(a.prefectures, b.prefectures),
  },
  {
    title: '対応募集区分',
    dataIndex: 'projectType',
    key: 'projectType',
    sorter: (a, b) => compareTableField(a.projectType, b.projectType),
    render: (value) =>
      PROJECT_TYPE_OPTIONS.find((option) => option.value === value)?.label,
  },
  {
    title: '組織区分',
    dataIndex: 'organizationType',
    key: 'organizationType',
    sorter: (a, b) => compareTableField(a.organizationType, b.organizationType),
  },
  {
    title: '団体名',
    dataIndex: 'organizationName',
    key: 'organizationName',
    sorter: (a, b) => compareTableField(a.organizationName, b.organizationName),
  },
  {
    title: '登録日',
    dataIndex: 'createdAt',
    key: 'createdAt',
    sorter: (a, b) => compareTableField(a.createdAt, b.createdAt),
    render: (value) => convertUtcToJapanTime(value),
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
          href={PATH.coordinator.edit(item.id)}
        >
          編集
        </Link>
      )
    },
  },
]

type ListCategoryPageProps = {
  form: FormInstance<any>
  coordinatorList: any[]
  organizationTypeOption: CheckboxOptionType[]
  parentOption: DefaultOptionType[]

  prefectureOption: DefaultOptionType[]
  cityOption: DefaultOptionType[]
  handleFilter: (values: any) => void
  handleChangePage: (page: number, perPage: number) => void
  pagination?: PaginationInfo
  isLoadingTable: boolean
}

const ListCoordinatorPage = ({
  form,
  coordinatorList = [],
  organizationTypeOption = [],
  parentOption = [],
  prefectureOption = [],
  cityOption = [],
  handleFilter,
  handleChangePage,
  pagination,
  isLoadingTable,
}: ListCategoryPageProps) => {
  return (
    <div>
      <Filter
        form={form}
        handleFilter={handleFilter}
        organizationTypeOption={organizationTypeOption}
        parentOption={parentOption}
        cityOption={cityOption}
        prefectureOption={prefectureOption}
      />
      <CustomTable
        loading={isLoadingTable}
        dataSource={coordinatorList}
        columns={columns()}
        scroll={{ x: 1200 }}
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

export default ListCoordinatorPage
