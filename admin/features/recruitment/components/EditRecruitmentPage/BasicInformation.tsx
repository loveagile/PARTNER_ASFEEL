import FormLabel from '@/components/atoms/Form/Label'
import InputKana from '@/components/atoms/InputKana'
import { ErrorValidation } from '@/constants/error'
import { Form, Input, Typography } from 'antd'

export const BasicInformation = () => {
  const form = Form.useFormInstance()

  return (
    <div className="relative mt-10 overflow-hidden rounded-xl">
      <div className="bg-light-blue_light px-5 py-3">
        <Typography.Text className="font-bold text-core-blue">
          基本情報
        </Typography.Text>
      </div>
      <div className="bg-gray-white p-10">
        <Form.Item
          required
          label={<FormLabel>担当者名</FormLabel>}
          labelCol={{ span: 24 }}
        >
          <div>
            <div className="max-w-[26rem] gap-4 sm:flex">
              <Form.Item
                name={['name', 'sei']}
                className="mb-4"
                rules={[
                  {
                    required: true,
                    message: ErrorValidation.REQUIRED.message,
                  },
                ]}
              >
                <Input />
              </Form.Item>
              <Form.Item
                name={['name', 'mei']}
                className="mb-4 lg:mb-0"
                rules={[
                  {
                    required: true,
                    message: ErrorValidation.REQUIRED.message,
                  },
                ]}
              >
                <Input />
              </Form.Item>
            </div>
            <div className="max-w-[26rem] gap-4 sm:flex">
              <Form.Item
                name={['name', 'seiKana']}
                className="mb-4"
                rules={[
                  {
                    required: true,
                    message: ErrorValidation.REQUIRED.message,
                  },
                  {
                    pattern: ErrorValidation.KANA_ONLY.regex,
                    message: ErrorValidation.KANA_ONLY.message,
                  },
                ]}
              >
                <InputKana />
              </Form.Item>
              <Form.Item
                name={['name', 'meiKana']}
                className="mb-0"
                rules={[
                  {
                    required: true,
                    message: ErrorValidation.REQUIRED.message,
                  },
                  {
                    pattern: ErrorValidation.KANA_ONLY.regex,
                    message: ErrorValidation.KANA_ONLY.message,
                  },
                ]}
              >
                <InputKana />
              </Form.Item>
            </div>
          </div>
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
              役職
            </FormLabel>
          }
          labelCol={{ span: 24 }}
          className="max-w-[200px]"
          name="position"
        >
          <Input />
        </Form.Item>
        <Form.Item
          name="phoneNumber"
          required
          label={<FormLabel>電話番号</FormLabel>}
          labelCol={{ span: 24 }}
          className="mb-0"
          validateFirst
          rules={[
            {
              required: true,
              message: ErrorValidation.REQUIRED.message,
            },
            {
              pattern: ErrorValidation.NUMBER_ONLY.regex,
              message: ErrorValidation.NUMBER_ONLY.message,
            },
          ]}
        >
          <Input className="max-w-[15rem]" />
        </Form.Item>
        <span className="mb-10 inline-block text-[12px] text-gray-black">
          つながりやすい連絡先をご入力ください（ハイフン不要）
        </span>
        <Form.Item
          required
          label={<FormLabel>メールアドレス</FormLabel>}
          labelCol={{ span: 24 }}
          className="max-w-[25rem]"
        >
          <Form.Item
            className="mb-4"
            name="email"
            rules={[
              {
                required: true,
                message: ErrorValidation.REQUIRED.message,
              },
              {
                type: 'email',
                message: ErrorValidation.EMAIL.message,
              },
            ]}
          >
            <Input />
          </Form.Item>
          <Form.Item
            name="confirmEmail"
            className="mb-0"
            validateFirst
            rules={[
              {
                required: true,
                message: ErrorValidation.REQUIRED.message,
              },
              {
                validator: (_, value) =>
                  value === form.getFieldValue('email')
                    ? Promise.resolve()
                    : Promise.reject(ErrorValidation.EMAIL.message),
              },
            ]}
          >
            <Input />
          </Form.Item>
          <span className="text-[12px] text-gray-black">
            確認のためもう一度入力してください
          </span>
        </Form.Item>
      </div>
    </div>
  )
}
