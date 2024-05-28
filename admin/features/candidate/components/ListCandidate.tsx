import { Checkbox, Col, Form, FormInstance, Input, Row } from 'antd'
import { AiOutlineSearch } from 'react-icons/ai'
import TableCandidate from './TableCandidate'
import styles from './index.module.scss'

type ListCandidateProps = {
  form: FormInstance<any>
  candidateList: any[]
  setCandidateList: (candidateList: any[]) => void
  pagination: any
  isLoadingTable: boolean
  detailRecruitment: any
  handleValuesChange: (changedValues: any, values: any) => void
  handleChangePage: (page: number, perPage: number) => void
  setIsLoading: (isLoading: boolean) => void
}

const ListCandidate = ({
  form,
  handleChangePage,
  handleValuesChange,
  isLoadingTable,
  detailRecruitment,
  pagination,
  candidateList,
  setCandidateList,
  setIsLoading,
}: ListCandidateProps) => {
  return (
    <div className={`mt-5 ${styles.wrapper}`}>
      <Form form={form} onValuesChange={handleValuesChange}>
        <Row gutter={20} align="middle">
          <Col>
            <span className="text-h1">候補</span>
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
            <Form.Item noStyle name="isUnSendOnly" valuePropName="checked">
              <Checkbox className="large_filter_checkbox">
                スカウト未送信のみ
              </Checkbox>
            </Form.Item>
          </Col>
          {/* <Col>
            <Form.Item noStyle name="isUnReadOnly" valuePropName="checked">
              <Checkbox className="large_filter_checkbox" value={2}>
                メッセージ未読のみ
              </Checkbox>
            </Form.Item>
          </Col>
          <Col>
            <div className="h-6 w-[1px] bg-gray-gray"></div>
          </Col>
          <Col>
            <Form.Item noStyle name="isShowNG" valuePropName="checked">
              <Checkbox className="large_filter_checkbox">
                興味なし・NGも表示
              </Checkbox>
            </Form.Item>
          </Col> */}
        </Row>
        <div className="mt-7">
          <TableCandidate
            setCandidateList={setCandidateList}
            detailRecruitment={detailRecruitment}
            handleChangePage={handleChangePage}
            isLoadingTable={isLoadingTable}
            pagination={pagination}
            candidateList={candidateList}
            setIsLoading={setIsLoading}
          />
        </div>
      </Form>
    </div>
  )
}

export default ListCandidate
