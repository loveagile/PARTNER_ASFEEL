import { Checkbox, Col, Form, FormInstance, Input, Row } from 'antd'
import { AiOutlineSearch } from 'react-icons/ai'

import { SELECTED_CANDIDATE_STATUS } from '@/constants/common'

import TableSelection from './TableSelection'
import styles from './index.module.scss'

type ListSelectionProps = {
  form: FormInstance<any>
  selectionList: any[]
  handleValuesChange: (changedValues: any, allValues: any) => void
  handleChangeList: (
    changeValues: { [key: string]: any },
    userId: string,
  ) => void
  isLoadingTable: boolean
  detailEvent: any
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
  // setIsLoading: (isLoading: boolean) => void
}

const ListSelection = ({
  form,
  selectionList = [],
  handleValuesChange,
  detailEvent = {},
  isLoadingTable,
  handleChangeList,
  handleChangePage,
  selectedUsers = [],
  handleSelectUser,
  pagination = {}, //   setIsLoading,
  handleBulkDownloadPdf,
  handleChangeBulkStatus,
}: ListSelectionProps) => {
  return (
    <div className={styles.wrapper}>
      <Form form={form} onValuesChange={handleValuesChange}>
        <Row gutter={20} align="middle" className="mt-5">
          <Col>
            <span className="text-h1">選考</span>
          </Col>
          <Col className="text-core-blue">
            <span className="text-h2">{pagination?.total}</span>
            <span className="text-small">名</span>
          </Col>
          <Col>
            <Form.Item noStyle name="keyword">
              <Input
                className="rounded-[20px] border-gray-gray"
                placeholder="キーワードで検索"
                prefix={
                  <AiOutlineSearch className="text-xl text-gray-gray_dark" />
                }
              />
            </Form.Item>
          </Col>
          <Col>
            <Form.Item noStyle name="isMessageOnly" valuePropName="checked">
              <Checkbox className={styles.message_checkbox}>
                メッセージ未読のみ
              </Checkbox>
            </Form.Item>
          </Col>
          <Col>
            <div className="h-6 w-[1px] bg-gray-gray"></div>
          </Col>
          <Col>
            <Form.Item noStyle name="isShowNG" valuePropName="checked">
              <Checkbox>不採用・辞退も表示</Checkbox>
            </Form.Item>
          </Col>
        </Row>
        <TableSelection
          detailEvent={detailEvent}
          handleChangeBulkStatus={handleChangeBulkStatus}
          selectedUsers={selectedUsers}
          handleSelectUser={handleSelectUser}
          selectionList={selectionList}
          handleChangeList={handleChangeList}
          isLoadingTable={isLoadingTable}
          handleChangePage={handleChangePage}
          pagination={pagination}
          handleBulkDownloadPdf={handleBulkDownloadPdf}
        />
      </Form>
    </div>
  )
}

export default ListSelection
