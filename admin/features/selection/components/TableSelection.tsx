import ModalDetailCandidate from '@/components/ModalDetailCandidate'
import SubCustomTable from '@/components/SubCustomTable'
import {
  DEFAULT_PAGE_SIZE,
  PROJECT_TYPE,
  SELECTED_CANDIDATE_OPTIONS,
  SELECTED_CANDIDATE_STATUS,
} from '@/constants/common'
import { Button, Col, Row, Select } from 'antd'
import React from 'react'
import { AiFillCaretDown } from 'react-icons/ai'
import { BiSolidDownload } from 'react-icons/bi'
import { column } from './column'
import styles from './index.module.scss'
import { INTERVIEW_STATUS } from '../common'
import ModalInterviewDate from '@/components/ModalInterviewDate'

type TableSelectionProps = {
  isLoadingTable: boolean
  selectionList: any[]
  handleChangeList: (
    changeValues: { [key: string]: any },
    userId: string,
  ) => void
  handleChangePage: (page: number, perPage: number) => void
  pagination: any
  selectedUsers: any[]
  handleSelectUser: (
    selectedUserIds?: string[],
    deselectedUserIds?: string[],
  ) => void
  handleBulkDownloadPdf: (userId: string[]) => void
  handleChangeBulkStatus: (
    status: SELECTED_CANDIDATE_STATUS,
    userId: string[],
  ) => void
  detailRecruitment: any
}

const TableSelection = ({
  selectionList,
  isLoadingTable,
  handleChangeList,
  handleChangePage,
  pagination,
  selectedUsers,
  handleSelectUser,
  handleBulkDownloadPdf,
  handleChangeBulkStatus,
  detailRecruitment,
}: TableSelectionProps) => {
  const selectionRef = React.useRef<any>(null)
  const interviewDateRef = React.useRef<any>(null)
  const [bulkSelectValue, setBulkSelectValue] = React.useState<any>(null)
  const allSelectionIds = selectionList?.map((item) => item?.id)

  const handleCellInterviewDate = (data: any) => ({
    onClick: (e: React.MouseEvent<any, MouseEvent>) => {
      if (!INTERVIEW_STATUS.includes(data?.selectedCandidateStatus)) return
      e.stopPropagation()
      interviewDateRef.current?.show(data)
    },
  })

  const handleChangeStatus = async (value: any) => {
    if (!value) return

    setBulkSelectValue(value)
    await handleChangeBulkStatus(value, selectedUsers)
    setBulkSelectValue(null)
  }

  return (
    <div className={styles.wrapper_table}>
      <Row justify="end" gutter={10}>
        <Col>
          <Select
            disabled={selectedUsers.length === 0}
            value={bulkSelectValue}
            onChange={handleChangeStatus}
            placeholder="一括変更"
            className="p-0"
            suffixIcon={<AiFillCaretDown className="text-gray-black" />}
            options={SELECTED_CANDIDATE_OPTIONS}
          />
        </Col>
        <Col>
          <Button
            disabled={selectedUsers.length === 0}
            className={`${styles.pdf_btn} flex h-[26px] items-center !border-core-blue_dark px-2 py-0 !text-core-blue_dark`}
            onClick={() => handleBulkDownloadPdf(selectedUsers)}
          >
            <BiSolidDownload fontSize={16} />
            <span className="text-mini">PDF出力</span>
          </Button>
        </Col>
      </Row>
      <SubCustomTable
        style={{
          marginTop: '20px',
        }}
        loading={isLoadingTable}
        dataSource={selectionList}
        columns={column({
          handleSelectUser,
          allSelectionIds: allSelectionIds,
          selectedUserIds: selectedUsers,
          handleChangeList,
          handleCellInterviewDate,
        })}
        scroll={{ x: 1200 }}
        pagination={{
          onChange: handleChangePage,
          current: pagination?.page || 1,
          pageSize: DEFAULT_PAGE_SIZE,
          total: pagination?.total || 0,
        }}
        rowClassName="cursor-pointer"
        onRow={(record) => {
          return {
            onClick: () => {
              selectionRef.current?.show(record)
            },
          }
        }}
      />
      <ModalDetailCandidate
        ref={selectionRef}
        selectedUsers={selectedUsers}
        handleSelectUser={handleSelectUser}
        detailRecruitment={detailRecruitment}
        projectType={PROJECT_TYPE.LEADER}
        isShowChat
      />
      <ModalInterviewDate
        ref={interviewDateRef}
        handleChangeList={handleChangeList}
      />
    </div>
  )
}

export default TableSelection
