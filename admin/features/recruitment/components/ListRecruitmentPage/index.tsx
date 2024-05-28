'use client'
import CustomTable from '@/components/atoms/CustomTable'
import { DEFAULT_PAGE_SIZE, COMMON_STATUS } from '@/constants/common'
import { compareTableField, convertUtcToJapanTime } from '@/utils/common'
import { ColumnsType } from 'antd/es/table'
import styles from './index.module.scss'
import RecruitmentCounter from '../../../../components/atoms/RecruitmentCounter'
import { BsFillPersonFill } from 'react-icons/bs'
import { MdChatBubble } from 'react-icons/md'
import { useRouter } from 'next/navigation'
import PATH from '@/constants/path'
import React from 'react'
import { FormInstance } from 'antd'
import { PaginationInfo } from '@/constants/model'
import Filter from './Filter'

const COLUMN_CREATED_AT = {
  [COMMON_STATUS.IN_PREPARATION]: {
    title: '登録日',
    dataIndex: 'createdAt',
  },
  [COMMON_STATUS.IN_PUBLIC]: {
    title: '募集開始日',
    dataIndex: 'startedAt',
  },
  [COMMON_STATUS.FINISH]: {
    title: '募集終了日',
    dataIndex: 'finishedAt',
  },
}

const columns = (recruitmentStatus: COMMON_STATUS): ColumnsType<any> => {
  let listColumn: ColumnsType<any> = [
    {
      title: '学校・団体名',
      dataIndex: 'organizationName',
      key: 'organizationName',
      width: 400,
      sorter: (a, b) =>
        compareTableField(a.organizationName, b.organizationName),
      render(value, record) {
        const isChecked = record?.isChecked

        return (
          <div className="relative left-[-10px] flex items-center gap-1">
            <span
              className={`inline-block h-[10px] w-[10px] rounded-full ${
                isChecked ? '' : 'bg-core-red'
              }`}
            ></span>

            <span>{value}</span>
          </div>
        )
      },
    },
    {
      title: '種目',
      dataIndex: 'eventName',
      key: 'eventName',
      sorter: (a, b) => compareTableField(a.eventName, b.eventName),
    },
    {
      title: '性別',
      dataIndex: 'gender',
      key: 'gender',
      sorter: (a, b) => compareTableField(a.gender, b.gender),
    },
    {
      title: '採用状況',
      key: 'count',
      render(value, record, index) {
        return <RecruitmentCounter record={record} />
      },
    },
  ]

  if (recruitmentStatus === COMMON_STATUS.IN_PUBLIC) {
    listColumn = listColumn.concat([
      {
        title: '候補',
        key: 'candidateIcon',
        align: 'center',
        render(value, record, index) {
          const color = record?.candidate ? 'text-core-sky' : 'text-gray-gray'

          return (
            <span className="flex justify-center">
              <BsFillPersonFill className={`text-xl ${color}`} />
            </span>
          )
        },
      },
      {
        title: 'メッセージ',
        key: 'messageIcon',
        align: 'center',
        render(value, record, index) {
          const color = record?.message ? 'text-core-sky' : 'text-gray-gray'

          return (
            <span className="flex justify-center">
              <MdChatBubble className={`text-xl ${color}`} />
            </span>
          )
        },
      },
    ])
  }

  listColumn.push({
    title: COLUMN_CREATED_AT[recruitmentStatus].title,
    dataIndex: COLUMN_CREATED_AT[recruitmentStatus].dataIndex,
    key: COLUMN_CREATED_AT[recruitmentStatus].dataIndex,
    render: (value) => {
      return (
        <span className="text-gray-gray_dark">
          {convertUtcToJapanTime(value)}
        </span>
      )
    },
    sorter: (a, b) =>
      compareTableField(
        a[COLUMN_CREATED_AT[recruitmentStatus].dataIndex],
        b[COLUMN_CREATED_AT[recruitmentStatus].dataIndex],
      ),
  })

  return listColumn
}

type ListRecruitmentPageProps = {
  isLoadingTable: boolean
  form: FormInstance<any>
  recruitmentList: any[]
  prefectures: any[]
  eventTypes: any[]
  eventNames: any[]
  handleValuesChange: (changedValues: any, values: any) => void
  handleChangePage: (page: number, perPage: number) => void
  pagination?: PaginationInfo
  recruitmentStatus: COMMON_STATUS
}

const ListRecruitmentPage = ({
  form,
  recruitmentList = [],
  prefectures = [],
  eventTypes = [],
  eventNames = [],
  handleValuesChange,
  handleChangePage,
  pagination,
  isLoadingTable,
  recruitmentStatus,
}: ListRecruitmentPageProps) => {
  const router = useRouter()

  const handleClickRow = React.useCallback(
    (record: any) => {
      switch (recruitmentStatus) {
        case COMMON_STATUS.IN_PREPARATION:
          return router.push(PATH.recruitment.detail.prepare(record?.id))
        case COMMON_STATUS.IN_PUBLIC:
          return router.push(PATH.recruitment.detail.public(record?.id))
        default:
          return router.push(PATH.recruitment.detail.finish(record?.id))
      }
    },
    [recruitmentStatus],
  )

  return (
    <div className={styles.wrapper}>
      <Filter
        prefectures={prefectures}
        eventTypes={eventTypes}
        eventNames={eventNames}
        form={form}
        handleValuesChange={handleValuesChange}
        recruitmentStatus={recruitmentStatus}
      />
      <CustomTable
        loading={isLoadingTable}
        dataSource={recruitmentList}
        columns={columns(recruitmentStatus)}
        scroll={{ x: 1200 }}
        onRow={(record) => ({
          onClick: () => handleClickRow(record),
        })}
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

export default ListRecruitmentPage
