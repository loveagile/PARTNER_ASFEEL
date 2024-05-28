'use client'

import React from 'react'
import { Modal, Form, DatePicker, Typography, Input, Button } from 'antd'
import dayjs, { Dayjs } from 'dayjs'
import utc from 'dayjs/plugin/utc'
dayjs.extend(utc)

export interface CareerDetail {
  index?: number
  termOfStart: Dayjs
  termOfEnd: Dayjs
  organizationName: string
}

interface ModalCareerProps {
  careerDetail?: CareerDetail | 'created' | null
  onCancel: () => void
  handleDelete?: (careerDetail: CareerDetail) => void
  handleOk: (CareerDetail: CareerDetail, isCreated: boolean) => void
}

const ModalCareer = ({
  careerDetail,
  onCancel,
  handleDelete,
  handleOk,
}: ModalCareerProps) => {
  const [form] = Form.useForm()

  React.useEffect(() => {
    if (typeof careerDetail === 'string') {
      form.resetFields()
      return
    }
    if (!careerDetail) return

    form.setFieldsValue({
      ...careerDetail,
    })
  }, [careerDetail])

  const handleFinish = (value: CareerDetail) => {
    handleOk(
      value,
      typeof careerDetail === 'string' && careerDetail === 'created',
    )
  }

  return (
    <Modal
      open={!!careerDetail}
      onCancel={() => onCancel()}
      footer={null}
      title="経歴追加"
    >
      <Form form={form} onFinish={handleFinish}>
        <div className="mt-8">
          <Typography.Title level={5}>在籍期間</Typography.Title>
          <div className="flex items-center gap-3">
            <Form.Item
              labelCol={{ span: 24 }}
              name="termOfStart"
              className="mb-0"
            >
              <DatePicker format={'YYYY/MM'} placeholder={'YYYY/MM'} />
            </Form.Item>
            <span>{'~'}</span>
            <Form.Item
              labelCol={{ span: 24 }}
              name="termOfEnd"
              className="mb-0"
            >
              <DatePicker format={'YYYY/MM'} placeholder={'YYYY/MM'} />
            </Form.Item>
          </div>
        </div>
        <Form.Item
          label={'所属'}
          labelCol={{ span: 24 }}
          name="organizationName"
          className="mt-8"
        >
          <Input />
        </Form.Item>
        {typeof careerDetail !== 'string' && (
          <div className="mt-10 text-center">
            <button
              onClick={() => {
                if (
                  !handleDelete ||
                  !careerDetail ||
                  typeof careerDetail === 'string'
                )
                  return

                handleDelete(careerDetail)
              }}
              type="button"
              className="text-[1rem] text-core-red underline"
            >
              この経歴を削除する
            </button>
          </div>
        )}
        <div className="mt-8 flex gap-5">
          <Button className="h-9 flex-1 rounded-2xl bg-gray-gray_dark text-white">
            キャンセル
          </Button>
          <Button
            type="primary"
            className="h-9 flex-1 rounded-2xl bg-core-sky"
            htmlType="submit"
          >
            実行する
          </Button>
        </div>
      </Form>
    </Modal>
  )
}

export default ModalCareer
