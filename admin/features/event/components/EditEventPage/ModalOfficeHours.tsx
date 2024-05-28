'use client'

import React from 'react'
import { Modal, Form, DatePicker, Button, Input } from 'antd'
import dayjs from 'dayjs'
import utc from 'dayjs/plugin/utc'
import { ErrorValidation } from '@/constants/error'
dayjs.extend(utc)

interface ModalOfficeHourProps {
  onCancel: () => void
  handleOk: (value: any) => void
  open: boolean
  isDisabledSelectTime: boolean
}

const ModalOfficeHour = ({
  onCancel,
  handleOk,
  open,
  isDisabledSelectTime,
}: ModalOfficeHourProps) => {
  const [form] = Form.useForm()

  return (
    <Modal
      open={open}
      onCancel={() => onCancel()}
      footer={null}
      title="日付を追加"
    >
      <Form form={form} onFinish={handleOk}>
        <div className="flex items-center gap-3">
          <Form.Item labelCol={{ span: 24 }} name="date" className="mb-0">
            <DatePicker format={'YYYY/MM/DD'} placeholder={'YYYY/MM/DD'} />
          </Form.Item>
          <div className="flex gap-1">
            <div className="flex gap-1">
              <Form.Item
                rules={[
                  {
                    pattern: ErrorValidation.VALIDATE_NUMBER_HOUR.regex,
                    message: ErrorValidation.VALIDATE_NUMBER_HOUR.message,
                  },
                ]}
                className="mb-0"
                name={['start', 'hour']}
              >
                <Input className="w-16" disabled={isDisabledSelectTime} />
              </Form.Item>
              <span>:</span>
              <Form.Item
                rules={[
                  {
                    pattern: ErrorValidation.VALIDATE_NUMBER_MINUTE.regex,
                    message: ErrorValidation.VALIDATE_NUMBER_MINUTE.message,
                  },
                ]}
                className="mb-0"
                name={['start', 'min']}
              >
                <Input className="w-16" disabled={isDisabledSelectTime} />
              </Form.Item>
            </div>
            <span>~</span>
            <div className="flex gap-1">
              <Form.Item
                rules={[
                  {
                    pattern: ErrorValidation.VALIDATE_NUMBER_HOUR.regex,
                    message: ErrorValidation.VALIDATE_NUMBER_HOUR.message,
                  },
                ]}
                className="mb-0"
                name={['end', 'hour']}
              >
                <Input className="w-16" disabled={isDisabledSelectTime} />
              </Form.Item>
              <span>:</span>
              <Form.Item
                rules={[
                  {
                    pattern: ErrorValidation.VALIDATE_NUMBER_MINUTE.regex,
                    message: ErrorValidation.VALIDATE_NUMBER_MINUTE.message,
                  },
                ]}
                className="mb-0"
                name={['end', 'min']}
              >
                <Input className="w-16" disabled={isDisabledSelectTime} />
              </Form.Item>
            </div>
          </div>
        </div>
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

export default ModalOfficeHour
