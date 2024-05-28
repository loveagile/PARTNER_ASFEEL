import {
  DEBOUNCE_TIME,
  PROJECT_TYPE_OPTIONS,
  STATUS_SUSPENDED_OPTIONS,
} from '@/constants/common'
import PATH from '@/constants/path'
import {
  Button,
  Checkbox,
  CheckboxOptionType,
  Col,
  Form,
  FormInstance,
  Input,
  Row,
  Spin,
  Typography,
} from 'antd'
import { DefaultOptionType } from 'antd/es/select'
import Link from 'next/link'
import { AiOutlineSearch } from 'react-icons/ai'
import CustomMultipleSelect from './CustomMultipleSelect'
import React from 'react'
import * as lodash from 'lodash'

type FilterProps = {
  form: FormInstance<any>
  organizationTypeOption: CheckboxOptionType[]
  parentOption: DefaultOptionType[]
  prefectureOption: DefaultOptionType[]
  cityOption: DefaultOptionType[]
  handleFilter: (values: any) => void
}

const Filter = ({
  form,
  organizationTypeOption = [],
  prefectureOption = [],
  cityOption = [],
  parentOption = [],
  handleFilter,
}: FilterProps) => {
  const [isShowFilter, setIsShowFilter] = React.useState(false)
  const handleFilterDebounce = React.useCallback(
    lodash.debounce(handleFilter, DEBOUNCE_TIME),
    [],
  )

  const handleValuesChange = (changedValues: any, values: any) => {
    if (changedValues?.prefectures) {
      form.resetFields(['cities'])
      handleFilterDebounce({
        ...values,
        cities: undefined,
      })
      return
    }
    handleFilterDebounce(values)
  }

  return (
    <Form className="mb-6" form={form} onValuesChange={handleValuesChange}>
      <Row justify="space-between" align="middle" className="mb-2 gap-2">
        <Col>
          <Row align="middle">
            <Col>
              <Typography.Title level={3} className="mr-5">
                コーディネーターアカウント
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
                onClick={() => {
                  setIsShowFilter(!isShowFilter)
                }}
              >
                <AiOutlineSearch fontSize={18} className="mr-2" />
                <span>絞り込み</span>
              </Button>
            </Col>
          </Row>
        </Col>
        <Col>
          <Link href={PATH.coordinator.create}>
            <Button
              type="primary"
              className="h-10 rounded !bg-core-blue_dark px-5 shadow-elevation"
            >
              新規作成
            </Button>
          </Link>
        </Col>
      </Row>

      {
        <div
          className={`rounded-xl bg-gray-gray_light px-8 py-3 text-small ${
            isShowFilter ? '' : 'hidden'
          }`}
        >
          <Form.Item label="対応募集区分" className="mb-2" name="projectType">
            <Checkbox.Group options={PROJECT_TYPE_OPTIONS} />
          </Form.Item>
          <Form.Item label="組織区分" className="mb-2" name="organizationType">
            <Checkbox.Group options={organizationTypeOption} />
          </Form.Item>
          <Form.Item label="ステータス" className="mb-2" name="isSuspended">
            <Checkbox.Group options={STATUS_SUSPENDED_OPTIONS} />
          </Form.Item>
          <Form.Item label="親団体" className="mb-4" name="parentId">
            <CustomMultipleSelect
              options={parentOption}
              className="md:min-w-[21.75rem]"
            />
          </Form.Item>
          <Form.Item label="都道府県" className="mb-4" name="prefectures">
            <CustomMultipleSelect
              options={prefectureOption}
              className="md:min-w-[21.75rem]"
            />
          </Form.Item>
          <Form.Item label="市区町村" className="mb-0" name="cities">
            <CustomMultipleSelect
              notFoundContent={
                !cityOption?.length ? (
                  <Spin size="small" spinning={true} />
                ) : (
                  <div className="ml-3 text-gray-gray">
                    データが見つかりません
                  </div>
                )
              }
              options={cityOption}
              filterOption={(input, option) => {
                return !!option?.label
                  ?.toString()
                  ?.toLowerCase()
                  .includes(input.toLowerCase())
              }}
              className="md:min-w-[21.75rem]"
            />
          </Form.Item>
        </div>
      }
    </Form>
  )
}

export default Filter
