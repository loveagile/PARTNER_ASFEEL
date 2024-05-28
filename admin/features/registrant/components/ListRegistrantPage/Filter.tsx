import { ClubType } from '@/constants/model'
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
import React from 'react'
import { AiFillCaretDown, AiOutlineSearch } from 'react-icons/ai'

type FilterProps = {
  form: FormInstance<any>
  handleValuesChange: (changedValues: any, values: any) => void
  clubTypes: ClubType[]
}

export const GENDER_OPTIONS = [
  { label: '男性', value: '男' },
  { label: '女性', value: '女' },
  { label: '無回答', value: '無回答' },
]

export const AGE_OPTIONS = [
  {
    label: '10代',
    value: 10,
  },
  {
    label: '20代',
    value: 20,
  },
  {
    label: '30代',
    value: 30,
  },
  {
    label: '40代',
    value: 40,
  },
  {
    label: '50代',
    value: 50,
  },
  {
    label: '60代～',
    value: 60,
  },
]

export const LICENSE_OPTIONS = [
  {
    label: '教員免許あり',
    value: 'teacherLicenseStatus-having',
  },
  {
    label: '教員免許取得予定',
    value: 'teacherLicenseStatus-scheduledAcquisition',
  },
  {
    label: '教員免許以外の指導者資格あり',
    value: 'otherLicense',
  },
  {
    label: '自動車運転免許あり',
    value: 'hasDriverLicense',
  },
]

export const OTHER_OPTIONS = [
  {
    label: '大会・合宿遠征同行可・要相談',
    value: 'isExpeditionPossible',
  },
  {
    label: '指導経験あり',
    value: 'experience',
  },
]

export const STATUS_OPTIONS = [
  {
    label: '利用中',
    value: false,
  },
  {
    label: '利用停止',
    value: true,
  },
]

const Filter = ({ form, handleValuesChange, clubTypes = [] }: FilterProps) => {
  const [isShowFilter, setIsShowFilter] = React.useState<boolean>(false)

  const clubTypeOptions = React.useMemo(
    () =>
      clubTypes.map((clubType) => ({
        label: clubType.name,
        value: clubType.name,
      })),
    [clubTypes],
  )

  return (
    <Form form={form} className="mb-6" onValuesChange={handleValuesChange}>
      <Row className="mb-2 gap-2 align-baseline">
        <Col>
          <Typography.Title level={3} className="mr-5">
            登録者
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
          <Form.Item className="mb-2" name="clubType">
            <Select
              allowClear
              placeholder="すべての種目"
              options={clubTypeOptions}
              className="select_filter"
              popupClassName="select_filter_popup"
              suffixIcon={<AiFillCaretDown className="text-gray-black" />}
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
      {isShowFilter && (
        <div className="rounded-xl bg-gray-gray_light px-8 py-3 text-small">
          <Form.Item label="性別" className="mb-2" name="gender">
            <Checkbox.Group options={GENDER_OPTIONS} />
          </Form.Item>
          <Form.Item label="年齢" className="mb-2" name="age">
            <Checkbox.Group options={AGE_OPTIONS} />
          </Form.Item>
          <Form.Item label="資格" className="mb-2" name="license">
            <Checkbox.Group options={LICENSE_OPTIONS} />
          </Form.Item>
          <Form.Item label="その他" className="mb-2" name="other">
            <Checkbox.Group options={OTHER_OPTIONS} />
          </Form.Item>
          <Form.Item
            label="ステータス"
            className="mb-2"
            colon={false}
            name="isSuspended"
          >
            <Checkbox.Group options={STATUS_OPTIONS} />
          </Form.Item>
        </div>
      )}
    </Form>
  )
}

export default Filter
