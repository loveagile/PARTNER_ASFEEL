'use client'

import React from 'react'
import Filter from './Filter'
import CustomTable from '@/components/atoms/CustomTable'
import { ColumnsType } from 'antd/es/table'
import PATH from '@/constants/path'
import { DEFAULT_PAGE_SIZE, ROLE_OPTIONS } from '@/constants/common'
import Link from 'next/link'
import { FormInstance } from 'antd'
import { PaginationInfo } from '@/constants/model'
import { compareTableField, convertUtcToJapanTime } from '@/utils/common'

const columns = (): ColumnsType<any> => [
  {
    title: 'No',
    dataIndex: 'id',
    key: 'id',
    sorter: (a, b) => compareTableField(a.id, b.id),
  },
  {
    title: '氏名',
    dataIndex: 'fullName',
    key: 'fullName',
    sorter: (a, b) => compareTableField(a.fullName, b.fullName),
  },
  {
    title: '権限',
    dataIndex: 'role',
    key: 'role',
    render: (value) =>
      ROLE_OPTIONS.find((option) => option.value === value)?.label,
    sorter: (a, b) => compareTableField(a.role, b.role),
  },
  {
    title: 'メールアドレス',
    dataIndex: 'email',
    key: 'email',
    sorter: (a, b) => compareTableField(a.email, b.email),
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
          href={PATH.account.edit(item.id)}
        >
          編集
        </Link>
      )
    },
  },
]

type ListAccountPageProps = {
  form: FormInstance<any>
  accountList: any[]
  handleValuesChange: (changedValues: any, values: any) => void
  handleChangePage: (page: number, perPage: number) => void
  pagination?: PaginationInfo
  isLoadingTable: boolean
}

const ListAccountPage = ({
  form,
  accountList = [],
  handleValuesChange,
  pagination,
  isLoadingTable,
}: ListAccountPageProps) => {
  const [currentPage, setCurrentPage] = React.useState<number>(1)
  const [dataSource, setDataSource] = React.useState<any[]>(accountList)

  const handlePagination = (page: number, perPage: number) => {
    setCurrentPage(page)
    const data = accountList.slice((page - 1) * perPage, page * perPage) || []
    setDataSource(data)
  }

  React.useEffect(() => {
    if (!accountList.length) {
      setDataSource([])
      return
    }
    handlePagination(1, DEFAULT_PAGE_SIZE)
  }, [accountList])

  return (
    <div>
      <Filter form={form} handleValuesChange={handleValuesChange} />
      <CustomTable
        dataSource={dataSource}
        columns={columns()}
        scroll={{ x: 1000 }}
        loading={isLoadingTable}
        pagination={{
          onChange: handlePagination,
          current: currentPage || 1,
          pageSize: DEFAULT_PAGE_SIZE,
          total: pagination?.total || 0,
          allTotal: pagination?.allTotal || 0,
          isShowOverallTable: true,
        }}
      />
    </div>
  )
}

export default ListAccountPage
