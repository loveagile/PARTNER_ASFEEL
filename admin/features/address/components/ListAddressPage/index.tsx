'use client'

import React from 'react'
import Filter from './Filter'
import CustomTable from '@/components/atoms/CustomTable'
import { ColumnsType } from 'antd/es/table'
import PATH from '@/constants/path'
import { DEFAULT_PAGE_SIZE } from '@/constants/common'
import Link from 'next/link'
import { PaginationInfo } from '@/constants/model'
import { FormInstance } from 'antd'
import { compareTableField, convertUtcToJapanTime } from '@/utils/common'

const columns = (): ColumnsType<any> => [
  {
    title: '郵便番号',
    dataIndex: 'zip',
    key: 'zip',
    width: '10%',
    sorter: (a, b) => compareTableField(a.zip, b.zip),
  },
  {
    title: '都道府県',
    dataIndex: 'prefectureText',
    key: 'prefectureText',
    width: '10%',
    sorter: (a, b) => compareTableField(a.prefectureText, b.prefectureText),
  },
  {
    title: 'エリア',
    dataIndex: 'areaTextFull',
    key: 'areaTextFull',
    width: '12%',
    sorter: (a, b) => compareTableField(a.areaTextFull, b.areaTextFull),
  },
  {
    title: '市区町村',
    dataIndex: 'cityText',
    key: 'cityText',
    width: '12%',
    sorter: (a, b) => compareTableField(a.cityText, b.cityText),
  },
  {
    title: '番地',
    dataIndex: 'address1Full',
    key: 'address1Full',
    width: '12%',
    sorter: (a, b) => compareTableField(a.address1Full, b.address1Full),
  },
  {
    title: '登録日',
    dataIndex: 'createdAt',
    key: 'createdAt',
    width: '12%',
    render: (value) => convertUtcToJapanTime(value),
    sorter: (a, b) => compareTableField(a.createdAt, b.createdAt),
  },
  {
    title: '最終更新日',
    dataIndex: 'updatedAt',
    key: 'updatedAt',
    width: '13%',
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
          href={PATH.address.edit(item.id)}
        >
          編集
        </Link>
      )
    },
  },
]

type ListAddressPageProps = {
  form: FormInstance<any>
  addressList: any[]
  prefectureOption: any[]
  areaOption: any[]
  handleValuesChange: (changedValues: any, values: any) => void
  handleChangePage: (page: number, perPage: number) => void
  pagination?: PaginationInfo
  isLoadingTable: boolean
  isFetchingArea: boolean
}

const ListZipCodePage = ({
  form,
  addressList,
  prefectureOption,
  areaOption,
  handleValuesChange,
  handleChangePage,
  pagination,
  isLoadingTable,
  isFetchingArea,
}: ListAddressPageProps) => {
  return (
    <div>
      <Filter
        form={form}
        prefectureOption={prefectureOption}
        areaOption={areaOption}
        handleValuesChange={handleValuesChange}
        isFetchingArea={isFetchingArea}
      />
      <CustomTable
        loading={isLoadingTable}
        dataSource={addressList}
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

export default ListZipCodePage
