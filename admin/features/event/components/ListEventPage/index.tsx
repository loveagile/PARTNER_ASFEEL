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

const columns = (eventStatus: COMMON_STATUS): ColumnsType<any> => {
  let listColumn: ColumnsType<any> = [
    {
      title: '学校・団体名',
      dataIndex: 'schoolName',
      key: 'schoolName',
      sorter: (a, b) =>
        compareTableField(
          Array.isArray(a.schoolName) ? a.schoolName.join('、') : a.schoolName,
          Array.isArray(b.schoolName) ? b.schoolName.join('、') : b.schoolName,
        ),
      render(value, record) {
        return (
          <div className="relative left-[-10px] flex items-center gap-1">
            <span
              className={`inline-block h-[10px] w-[10px] rounded-full ${
                record?.isChecked ? '' : 'bg-core-red'
              }`}
            ></span>

            <span>{Array.isArray(value) ? value.join('、') : value}</span>
          </div>
        )
      },
    },
    {
      title: '種目',
      dataIndex: 'title',
      key: 'title',
      sorter: (a, b) => compareTableField(a.title, b.title),
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

  if (eventStatus === COMMON_STATUS.IN_PUBLIC) {
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
    title: COLUMN_CREATED_AT[eventStatus].title,
    dataIndex: COLUMN_CREATED_AT[eventStatus].dataIndex,
    key: COLUMN_CREATED_AT[eventStatus].dataIndex,
    render: (value) => {
      return (
        <span className="text-gray-gray_dark">
          {convertUtcToJapanTime(value)}
        </span>
      )
    },
    sorter: (a, b) =>
      compareTableField(
        a[COLUMN_CREATED_AT[eventStatus].dataIndex],
        b[COLUMN_CREATED_AT[eventStatus].dataIndex],
      ),
  })

  return listColumn
}

type ListEventPageProps = {
  isLoadingTable: boolean
  form: FormInstance<any>
  eventList: any[]
  prefectures: any[]
  handleValuesChange: (changedValues: any, values: any) => void
  handleChangePage: (page: number, perPage: number) => void
  pagination?: PaginationInfo
  eventStatus: COMMON_STATUS
}

const ListEventPage = ({
  form,
  eventList = [],
  prefectures = [],
  handleValuesChange,
  handleChangePage,
  pagination,
  isLoadingTable,
  eventStatus,
}: ListEventPageProps) => {
  const router = useRouter()

  const handleClickRow = React.useCallback(
    (record: any) => {
      switch (eventStatus) {
        case COMMON_STATUS.IN_PREPARATION:
          return router.push(PATH.event.detail.prepare(record?.id))
        case COMMON_STATUS.IN_PUBLIC:
          return router.push(PATH.event.detail.public(record?.id))
        default:
          return router.push(PATH.event.detail.finish(record?.id))
      }
    },
    [eventStatus],
  )

  return (
    <div className={styles.wrapper}>
      <Filter
        prefectures={prefectures}
        form={form}
        handleValuesChange={handleValuesChange}
        eventStatus={eventStatus}
      />
      <CustomTable
        loading={isLoadingTable}
        dataSource={eventList}
        columns={columns(eventStatus)}
        scroll={{ x: 1000 }}
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

export default ListEventPage
