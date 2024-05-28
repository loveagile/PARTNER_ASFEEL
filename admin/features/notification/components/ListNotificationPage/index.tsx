'use client'

import CustomTable from '@/components/atoms/CustomTable'
import { DEFAULT_PAGE_SIZE } from '@/constants/common'
import { City, PaginationInfo } from '@/constants/model'
import PATH from '@/constants/path'
import { compareTableField, convertUtcToJapanTime } from '@/utils/common'
import { CheckboxOptionType, FormInstance } from 'antd'
import { ColumnsType } from 'antd/es/table'
import Link from 'next/link'
import Filter from './Filter'

const columns = (citiesOptions: City[]): ColumnsType<any> => [
  {
    title: '送信先',
    dataIndex: 'prefecture',
    key: 'prefecture',
    sorter: (a, b) => compareTableField(a.prefecture, b.prefecture),
  },
  {
    title: 'タイトル',
    dataIndex: 'title',
    key: 'title',
    sorter: (a, b) => compareTableField(a.title, b.title),
  },
  {
    title: 'URL',
    dataIndex: 'url',
    key: 'url',
    sorter: (a, b) => compareTableField(a.url, b.url),
  },
  {
    title: '送信日',
    dataIndex: 'sentAt',
    key: 'sentAt',
    width: '14%',
    render: (value) => convertUtcToJapanTime(value),
    sorter: (a, b) => compareTableField(a.createdAt, b.createdAt),
  },
  {
    title: '最終更新日',
    dataIndex: 'updatedAt',
    key: 'updatedAt',
    width: '14%',
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
    title: '市区町村',
    dataIndex: 'cities',
    key: 'cities',
    width: '20%',
    render: (cities) => {
      const citiesText =
        cities
          ?.map((cityId: any) => {
            const city = citiesOptions.find((item) => item.id === cityId)
            return city?.city
          })
          ?.join('、') || ''

      return <span className="line-clamp-2">{citiesText}</span>
    },
  },
  {
    key: 'action',
    align: 'right',
    render: (item) => {
      return (
        <Link
          className="mr-10 whitespace-nowrap rounded-[0.25rem] border border-opacity-10 px-3 py-1 !text-inherit"
          href={PATH.notification.edit(item.id)}
        >
          編集
        </Link>
      )
    },
  },
]

type ListNotificationPageProps = {
  form: FormInstance<any>
  notificationList: any[]
  handleValuesChange: (changedValues: any, values: any) => void
  handleChangePage: (page: number, perPage: number) => void
  prefectures?: CheckboxOptionType[]
  pagination?: PaginationInfo
  isLoadingTable: boolean
  citiesOptions?: any[]
}

const ListNotificationPage = ({
  form,
  prefectures = [],
  citiesOptions = [],
  notificationList = [],
  handleValuesChange,
  handleChangePage,
  pagination,
  isLoadingTable,
}: ListNotificationPageProps) => {
  return (
    <div>
      <Filter
        form={form}
        prefectures={prefectures}
        citiesOptions={citiesOptions}
        handleValuesChange={handleValuesChange}
      />
      <CustomTable
        loading={isLoadingTable}
        dataSource={notificationList}
        columns={columns(citiesOptions)}
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

export default ListNotificationPage
