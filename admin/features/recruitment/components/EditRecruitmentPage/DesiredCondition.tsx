import FormLabel from '@/components/atoms/Form/Label'
import { Checkbox, Form, Input, Radio, Typography } from 'antd'
import { CheckBoxDarker } from '.'
import { ErrorValidation } from '@/constants/error'

const DESIRED_GENDER_OPTIONS = [
  {
    label: '男性',
    value: '男性',
  },
  {
    label: '女性',
    value: '女性',
  },
  {
    label: 'どちらでも',
    value: 'どちらでも',
  },
]

const DESIRED_AGE_OPTIONS = [
  {
    label: '10代',
    value: '10代',
  },
  {
    label: '20代',
    value: '20代',
  },
  {
    label: '30代',
    value: '30代',
  },
  {
    label: '40代',
    value: '40代',
  },
  {
    label: '50代',
    value: '50代',
  },
  {
    label: '60代以上',
    value: '60代以上',
  },
]

export const DesiredCondition = () => {
  return (
    <div className="relative overflow-hidden rounded-xl">
      <div className="bg-light-blue_light px-5 py-3">
        <Typography.Text className="font-bold text-core-blue">
          希望条件
        </Typography.Text>
      </div>
      <div className="bg-gray-white p-10">
        <Form.Item
          required
          label={<FormLabel>性別</FormLabel>}
          rules={[
            {
              required: true,
              message: ErrorValidation.REQUIRED.message,
            },
          ]}
          colon={false}
          name="desiredGender"
          labelCol={{ span: 24 }}
        >
          <Radio.Group options={DESIRED_GENDER_OPTIONS} />
        </Form.Item>
        <Form.Item
          required
          label={<FormLabel>年齢</FormLabel>}
          colon={false}
          name="desiredAge"
          labelCol={{ span: 24 }}
          rules={[
            {
              required: true,
              message: ErrorValidation.REQUIRED.message,
            },
          ]}
        >
          <Checkbox.Group className="gap-5">
            {DESIRED_AGE_OPTIONS.map(({ label, value }) => (
              <CheckBoxDarker
                key={value}
                className="rounded px-4 py-[6px]"
                value={value}
              >
                {label}
              </CheckBoxDarker>
            ))}
          </Checkbox.Group>
        </Form.Item>
        <Form.Item
          required
          label={
            <FormLabel
              requiredProps={{
                className: 'bg-gray-gray_dark',
                children: '任意',
              }}
            >
              資格に関する希望
            </FormLabel>
          }
          colon={false}
          name="desiredQualifications"
          labelCol={{ span: 24 }}
          className="mb-0"
        >
          <Input.TextArea className="!min-h-[90px]" />
        </Form.Item>
        <span>例1）部活動指導員や教員免許を取得もしくは取得予定</span>
        <br />
        <span className="mb-10 inline-block">
          例2）競技指導資格の取得を将来的に考えている方
        </span>
        <Form.Item
          required
          label={
            <FormLabel
              requiredProps={{
                className: 'bg-gray-gray_dark',
                children: '任意',
              }}
            >
              求める人材
            </FormLabel>
          }
          colon={false}
          name="desiredTalent"
          labelCol={{ span: 24 }}
          className="mb-0"
        >
          <Input.TextArea className="!min-h-[90px]" />
        </Form.Item>
        <span>例1）指導経験のある方</span>
        <br />
        <span className="mb-10 inline-block">
          例2）大会や合宿等の遠征同行できる方
        </span>
        <Form.Item
          required
          label={<FormLabel>給与・報酬</FormLabel>}
          colon={false}
          name="desiredSalary"
          labelCol={{ span: 24 }}
          className="mb-0"
        >
          <Input.TextArea className="!min-h-[90px]" />
        </Form.Item>
        <span className="mb-10 inline-block">
          例）時給○○円 / 日当○○円 / 保有資格により要相談
        </span>
        <Form.Item
          required
          label={
            <FormLabel
              requiredProps={{
                className: 'bg-gray-gray_dark',
                children: '任意',
              }}
            >
              備考
            </FormLabel>
          }
          colon={false}
          name="desiredNote"
          labelCol={{ span: 24 }}
          className="mb-0"
        >
          <Input.TextArea className="!min-h-[90px]" />
        </Form.Item>
        <span className="mb-10 inline-block">
          コーディネーターに伝えたいことがあればご記入ください
        </span>
      </div>
    </div>
  )
}
