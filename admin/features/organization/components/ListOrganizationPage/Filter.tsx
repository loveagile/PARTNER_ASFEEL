import {
  Button,
  Checkbox,
  Col,
  Form,
  FormInstance,
  Input,
  Row,
  Select,
  Typography,
} from 'antd'
import { AiFillCaretDown, AiOutlineSearch } from 'react-icons/ai'
import styles from './index.module.css'
import Link from 'next/link'
import PATH from '@/constants/path'
import { OrganizationTypes } from '../../model/organization.model'
import { Prefecture } from '@/constants/model'
import React from 'react'
import { DEBOUNCE_TIME, STATUS_SUSPENDED_OPTIONS } from '@/constants/common'
import * as lodash from 'lodash'

type FilterProps = {
  form: FormInstance<any>
  handleFilter: (values: any) => void
  organizationTypes?: OrganizationTypes[]
  prefectures?: Prefecture[]
}

const Filter = ({
  form,
  organizationTypes = [],
  prefectures = [],
  handleFilter,
}: FilterProps) => {
  const [isShowFilter, setIsShowFilter] = React.useState(false)
  const organizationTypesOption = React.useMemo(
    () =>
      organizationTypes.map((type) => ({
        label: type.name,
        value: type.id!,
      })),
    [organizationTypes],
  )

  const prefecturesOption = React.useMemo(
    () =>
      prefectures.map((prefecture) => ({
        label: prefecture.prefecture,
        value: prefecture.prefecture,
      })),
    [prefectures],
  )

  const handleFilterDebounce = React.useCallback(
    lodash.debounce(handleFilter, DEBOUNCE_TIME),
    [],
  )

  const handleValuesChange = (changedValues: any, values: any) => {
    handleFilterDebounce(values)
  }

  return (
    <Form form={form} className="mb-6" onValuesChange={handleValuesChange}>
      <Row justify="space-between" align="middle" className="mb-2 gap-2">
        <Col>
          <Row align="middle">
            <Col>
              <Typography.Title level={3} className="mr-5">
                学校・団体
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
          <Link href={PATH.organization.create}>
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
          <Form.Item label="都道府県" className="m-0" name="prefecture">
            <Select
              options={prefecturesOption}
              suffixIcon={<AiFillCaretDown className="text-gray-black" />}
              allowClear
              className={`select_filter ${styles.select_prefecture}`}
              popupClassName="select_filter_popup"
              placeholder="都道府県を選択"
            />
          </Form.Item>
          <Form.Item label="学校区分" className="m-0" name="organizationType">
            <Checkbox.Group
              style={{
                columnGap: 10,
                marginLeft: 2,
              }}
              options={organizationTypesOption}
            />
          </Form.Item>
          <Form.Item
            label="ステータス"
            colon={false}
            name="isSuspended"
            className="mb-0"
          >
            <Checkbox.Group
              style={{
                columnGap: 10,
                marginLeft: 2,
              }}
              options={STATUS_SUSPENDED_OPTIONS}
            />
          </Form.Item>
        </div>
      )}
    </Form>
  )
}

const SAMPLE_OPTION_STATUS = [
  {
    label: '利用中',
    value: '利用中',
  },
  {
    label: '利用停止',
    value: '利用停止',
  },
]

export default Filter
