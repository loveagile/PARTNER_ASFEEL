import { COMMON_STATUS } from '@/constants/common'
import { filterOption } from '@/utils/common'
import {
  Button,
  Checkbox,
  Col,
  Form,
  Input,
  Row,
  Select,
  Typography,
} from 'antd'
import { CheckboxOptionType } from 'antd/lib/checkbox'
import { FormInstance } from 'antd/lib/form/Form'
import React from 'react'
import { AiFillCaretDown, AiOutlineSearch } from 'react-icons/ai'
import { GENDER_LIST_OPTIONS, IS_PUBLISH_OPTIONS } from '../../common'

type FilterProps = {
  form: FormInstance<any>
  prefectures: CheckboxOptionType[]
  eventStatus: COMMON_STATUS
  handleValuesChange: (changedValues: any, values: any) => void
}

const Filter = ({
  form,
  eventStatus,
  prefectures = [],
  handleValuesChange,
}: FilterProps) => {
  const [isShowFilter, setIsShowFilter] = React.useState<boolean>(false)

  const title = React.useMemo(() => {
    if (eventStatus === COMMON_STATUS.IN_PREPARATION) {
      return '準備中'
    }

    if (eventStatus === COMMON_STATUS.IN_PUBLIC) {
      return '募集中'
    }

    if (eventStatus === COMMON_STATUS.FINISH) {
      return '終了'
    }
  }, [eventStatus])

  return (
    <Form form={form} className="mb-6" onValuesChange={handleValuesChange}>
      <Row justify="space-between" align="middle" className="mb-2 gap-2">
        <Col>
          <Row align="middle">
            <Col>
              <Typography.Title level={3} className="mr-5">
                {title}
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
            {eventStatus === COMMON_STATUS.IN_PUBLIC && (
              <Col>
                <Form.Item
                  name="isOnly"
                  valuePropName="checked"
                  className="mb-0 ml-6"
                >
                  <Checkbox>要対応のみ</Checkbox>
                </Form.Item>
              </Col>
            )}
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
      </Row>
      {isShowFilter && (
        <div className="rounded-xl bg-gray-gray_light px-8 py-3 text-small">
          <Form.Item label="都道府県" className="mb-2" name="prefecture">
            <Select
              allowClear
              showSearch
              filterOption={filterOption}
              placeholder="都道府県を選択"
              options={prefectures}
              className="select_filter"
              popupClassName="select_filter_popup"
              suffixIcon={<AiFillCaretDown className="text-gray-black" />}
            />
          </Form.Item>
          <Form.Item label="性別" className="mb-2" name="gender">
            <Checkbox.Group options={GENDER_LIST_OPTIONS} />
          </Form.Item>
          <Form.Item label="ステータス" className="mb-2" name="isPublish">
            <Checkbox.Group options={IS_PUBLISH_OPTIONS} />
          </Form.Item>
        </div>
      )}
    </Form>
  )
}

export default Filter
