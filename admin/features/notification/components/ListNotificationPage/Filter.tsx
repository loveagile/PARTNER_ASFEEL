import { STATUS_NOTIFICATION_OPTIONS } from '@/constants/common'
import { City } from '@/constants/model'
import PATH from '@/constants/path'
import { filterOption } from '@/utils/common'
import {
  Button,
  Checkbox,
  CheckboxOptionType,
  Col,
  Form,
  FormInstance,
  Input,
  Row,
  Select,
  Typography,
} from 'antd'
import Link from 'next/link'
import React from 'react'
import { AiFillCaretDown, AiOutlineSearch } from 'react-icons/ai'

type FilterProps = {
  form: FormInstance<any>
  handleValuesChange: (changedValues: any, values: any) => void
  prefectures: CheckboxOptionType[]
  citiesOptions: City[]
}

const Filter = ({
  form,
  prefectures = [],
  citiesOptions = [],
  handleValuesChange,
}: FilterProps) => {
  const currentPrefecture = Form.useWatch(['prefecture'], form)
  const cityInputRef = React.useRef<any>(null)
  const [isShowFilter, setIsShowFilter] = React.useState<boolean>(false)

  React.useEffect(() => {
    form.resetFields(['cities'])
  }, [currentPrefecture])

  return (
    <Form form={form} className="mb-6" onValuesChange={handleValuesChange}>
      <Row justify="space-between" align="middle" className="mb-2 gap-2">
        <Col>
          <Row align="middle">
            <Col>
              <Typography.Title level={3} className="mr-5">
                お知らせ
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
          <Link href={PATH.notification.create}>
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
          <Form.Item label="都道府県" className="mb-0" name="prefecture">
            <Select
              allowClear
              placeholder="都道府県"
              showSearch
              filterOption={filterOption}
              options={prefectures}
              className="select_filter"
              popupClassName="select_filter_popup"
              suffixIcon={<AiFillCaretDown className="text-gray-black" />}
            />
          </Form.Item>
          <Form.Item label="市区町村" className="mb-0" name="cities">
            {/* <CityInput
              ref={cityInputRef}
              prefectureParam={form.getFieldValue('prefecture')}
            >
              <Input
                className="h-6 w-[9.4rem] !text-ellipsis rounded-md font-normal caret-transparent"
                onClick={() => cityInputRef.current?.showCityModal()}
                allowClear
                onChange={(e) => {
                  if (!e.target.value) {
                    form.setFieldsValue({ cities: [] })
                    const values = form.getFieldsValue()
                    handleValuesChange(
                      {
                        cities: [],
                      },
                      {
                        ...values,
                        cities: [],
                      },
                    )
                  }
                }}
              />
            </CityInput> */}
            <Select
              allowClear
              placeholder="都道府県"
              showSearch
              filterOption={filterOption}
              options={citiesOptions.filter((item) =>
                currentPrefecture
                  ? item.prefecture === currentPrefecture
                  : true,
              )}
              className="select_filter"
              popupClassName="select_filter_popup"
              suffixIcon={<AiFillCaretDown className="text-gray-black" />}
            />
          </Form.Item>
          <Form.Item
            name="status"
            label="ステータス"
            className="mb-0"
            colon={false}
          >
            <Checkbox.Group options={STATUS_NOTIFICATION_OPTIONS} />
          </Form.Item>
        </div>
      )}
    </Form>
  )
}

export default Filter
