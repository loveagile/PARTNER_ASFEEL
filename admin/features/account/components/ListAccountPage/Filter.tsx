import { ROLE_OPTIONS, STATUS_ACCOUNT_OPTIONS } from '@/constants/common'
import PATH from '@/constants/path'
import {
  Button,
  Checkbox,
  Col,
  Form,
  FormInstance,
  Input,
  Row,
  Typography,
} from 'antd'
import Link from 'next/link'
import React from 'react'
import { AiOutlineSearch } from 'react-icons/ai'

type FilterProps = {
  form: FormInstance<any>
  handleValuesChange: (changedValues: any, values: any) => void
}

const Filter = ({ form, handleValuesChange }: FilterProps) => {
  const [isShowFilter, setIsShowFilter] = React.useState<boolean>(false)

  return (
    <Form form={form} className="mb-6" onValuesChange={handleValuesChange}>
      <Row justify="space-between" align="middle" className="mb-2 gap-2">
        <Col>
          <Row align="middle">
            <Col>
              <Typography.Title level={3} className="mr-5">
                運営アカウント
              </Typography.Title>
            </Col>
            <Col>
              <Form.Item className="m-0" name="keyword">
                <Input
                  className="rounded-[20px] !border-0"
                  placeholder="キーワードで検索"
                  prefix={
                    <AiOutlineSearch className="text-xl text-gray-gray_dark" />
                  }
                />
              </Form.Item>
            </Col>
            <Col>
              <Button
                type="link"
                className="ml-5 flex items-center rounded-none p-0 font-bold"
                style={{
                  borderWidth: 1.5,
                  borderBottomColor: '#307DC1',
                  height: 'auto',
                  lineHeight: 'initial',
                }}
                onClick={() => setIsShowFilter(!isShowFilter)}
              >
                <AiOutlineSearch fontSize={18} className="mr-2" />
                <span>絞り込み</span>
              </Button>
            </Col>
          </Row>
        </Col>
        <Col>
          <Link href={PATH.account.create}>
            <Button
              type="primary"
              className="h-10 rounded !bg-core-blue_dark px-5 shadow-elevation"
            >
              新規作成
            </Button>
          </Link>
        </Col>
      </Row>
      {isShowFilter && (
        <div className="rounded-xl bg-gray-gray_light px-8 py-3 text-small">
          <Form.Item label="権限" className="mb-2" name="role">
            <Checkbox.Group options={ROLE_OPTIONS} />
          </Form.Item>
          <Form.Item
            label="ステータス"
            className="mb-0"
            colon={false}
            name="isPublish"
          >
            <Checkbox.Group options={STATUS_ACCOUNT_OPTIONS} />
          </Form.Item>
        </div>
      )}
    </Form>
  )
}

export default Filter
