'use client'

import Link from 'next/link'
import { useState } from 'react'
import { Button, Col, FormInstance, Row } from 'antd'
import { ColumnsType } from 'antd/es/table'
import { PiWarningFill } from 'react-icons/pi'
import dayjs from 'dayjs'
import utc from 'dayjs/plugin/utc'
dayjs.extend(utc)

import CustomTable from '@/components/atoms/CustomTable'
import { ClubType, PaginationInfo, Prefecture } from '@/constants/model'
import PATH from '@/constants/path'
import { DEFAULT_PAGE_SIZE } from '@/constants/common'
import { compareTableField, convertUtcToJapanTime } from '@/utils/common'
import ImportIcon from '@/components/atoms/Icon/Import'

import Filter from './Filter'
import ModalImportCsv from './ModalImportCsv'

interface ListRegistrantPageProps {
  form: FormInstance<any>
  registrantList: any[]
  handleValuesChange: (changedValues: any, values: any) => void
  handleChangePage: (page: number, perPage: number) => void
  isLoadingTable: boolean
  pagination?: PaginationInfo
  clubTypes: ClubType[]
  prefectures: Prefecture[]
}

const columns = (): ColumnsType<any> => [
  {
    title: 'No',
    dataIndex: 'userIdOfPrefecture',
    key: 'userIdOfPrefecture',
    sorter: (a, b) => compareTableField(a.userIdOfPrefecture, b.userIdOfPrefecture),
    render(value, record, index) {
      return (
        <span className="flex items-center justify-between">
          {record?.precautions && (
            <PiWarningFill fontSize={16} className="text-core-red" />
          )}
          {value}
        </span>
      )
    },
  },
  {
    title: '氏名',
    dataIndex: 'userName',
    key: 'userName',
    sorter: (a, b) => compareTableField(a.userName, b.userName),
  },
  {
    title: '種目',
    dataIndex: 'onlyClubs',
    render: (value) => {
      if (!Array.isArray(value) || !value.length) return <></>

      return <span>{(value || []).join(',')}</span>
    },
    sorter: (a, b) => compareTableField((a || []).length, (b || []).length),
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
    title: '連絡先',
    dataIndex: 'phoneNumber',
    key: 'phoneNumber',
  },
  {
    title: '登録日',
    dataIndex: 'createdAt',
    key: 'createdAt',
    render: (value) => {
      if (!value) return <></>

      return (
        <span className="text-gray-gray_dark">
          {convertUtcToJapanTime(dayjs.unix(value).utc().format())}
        </span>
      )
    },
    sorter: (a, b) => compareTableField(a.createdAt, b.createdAt),
  },
  {
    title: '最終更新日',
    dataIndex: 'updatedAt',
    key: 'updatedAt',
    render: (value) => {
      if (!value) return <></>

      return (
        <span className="text-gray-gray_dark">
          {convertUtcToJapanTime(dayjs.unix(value).utc().format())}
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
          href={PATH.registrant.edit(item.id)}
        >
          編集
        </Link>
      )
    },
  },
]

const ListRegistrantPage = ({
  form,
  registrantList,
  isLoadingTable,
  pagination,
  handleChangePage,
  handleValuesChange,
  clubTypes,
  prefectures,
}: ListRegistrantPageProps) => {
  const [showModelImportCsv, setShowModelImportCsv] = useState(false)

  return (
    <>
      <ModalImportCsv
        open={showModelImportCsv}
        onCancel={() => {
          setShowModelImportCsv(false)
        }}
        prefectures={prefectures}
      />
      <Filter
        form={form}
        clubTypes={clubTypes}
        handleValuesChange={handleValuesChange}
      />
      <Row justify="end" className="mb-2">
        <Col>
          <Button
            className="border- flex items-center gap-2 rounded-md border-2 border-[#A6C6E2] px-3 py-2 text-core-blue"
            onClick={() => setShowModelImportCsv(true)}
          >
            <ImportIcon />
            <span> CSVインポート</span>
          </Button>
        </Col>
      </Row>
      <CustomTable
        loading={isLoadingTable}
        dataSource={registrantList}
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
      ></CustomTable>
    </>
  )
}

export default ListRegistrantPage
