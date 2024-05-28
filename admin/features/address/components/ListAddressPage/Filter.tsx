import PATH from '@/constants/path'
import {
  Button,
  Col,
  Form,
  FormInstance,
  Input,
  Row,
  Select,
  Spin,
  Typography,
} from 'antd'
import Link from 'next/link'
import React from 'react'
import { AiFillCaretDown, AiOutlineSearch } from 'react-icons/ai'

type FilterProps = {
  form: FormInstance<any>
  prefectureOption: any[]
  areaOption: any[]
  handleValuesChange: (changedValues: any, values: any) => void
  isFetchingArea: boolean
}

const Filter = ({
  form,
  prefectureOption,
  areaOption,
  handleValuesChange,
  isFetchingArea,
}: FilterProps) => {
  const [isShowFilter, setIsShowFilter] = React.useState<boolean>(false)

  return (
    <Form form={form} className="mb-6" onValuesChange={handleValuesChange}>
      <Row justify="space-between" align="middle" className="mb-2 gap-2">
        <Col>
          <Row align="middle">
            <Col>
              <Typography.Title level={3} className="mr-5">
                住所（郵便番号）
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
          <Link href={PATH.address.create}>
            <Button
              type="primary"
              className="h-10 rounded !bg-core-blue_dark px-5 shadow-elevation"
            >
              新規作成
            </Button>
          </Link>
        </Col>
      </Row>
      <div
        className={`rounded-xl bg-gray-gray_light px-8 py-3 text-small ${
          isShowFilter ? '' : 'hidden'
        }`}
      >
        <Form.Item label="都道府県" className="mb-2" name="prefecture">
          <Select
            allowClear
            placeholder="都道府県"
            options={prefectureOption}
            className="select_filter"
            popupClassName="select_filter_popup"
            suffixIcon={<AiFillCaretDown className="text-gray-black" />}
          />
        </Form.Item>
        <Form.Item label="エリア" className="mb-0" name="area">
          <Select
            allowClear
            placeholder="エリア"
            options={
              isFetchingArea
                ? [
                    {
                      label: <Spin spinning size="small" />,
                    },
                  ]
                : areaOption
            }
            className="select_filter"
            popupClassName="select_filter_popup"
            suffixIcon={<AiFillCaretDown className="text-gray-black" />}
          />
        </Form.Item>
      </div>
    </Form>
  )
}

export default Filter
