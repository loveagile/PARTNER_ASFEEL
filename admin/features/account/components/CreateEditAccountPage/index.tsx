'use client'

import FormLabel from '@/components/atoms/Form/Label'
import InputKana from '@/components/atoms/InputKana'
import { ROLE_OPTIONS, STATUS_ACCOUNT_OPTIONS } from '@/constants/common'
import { ErrorValidation } from '@/constants/error'
import { Button, Form, FormInstance, Input, Select, Typography } from 'antd'
import React from 'react'
import { AiFillCaretDown } from 'react-icons/ai'

type CreateEditAccountPageProps = {
  form: FormInstance<any>
  detailAccount?: any
  handleSubmit: (values: any) => void
  handleDelete?: () => void
}

const CreateEditAccountPage = ({
  form,
  detailAccount,
  handleSubmit,
  handleDelete,
}: CreateEditAccountPageProps) => {
  const [isDisabled, setIsDisabled] = React.useState<boolean>(true)

  const handleValuesChange = async (changedValues: any, values: any) => {
    if (changedValues?.email && values?.confirmEmail) {
      await form.validateFields(['confirmEmail'])
    }

    if (changedValues?.newPassword && values?.confirmNewPassword) {
      await form.validateFields(['confirmNewPassword'])
    }

    if (!detailAccount) {
      delete values?.currentEmail
    } else {
      if (!values?.newPassword && !values?.confirmNewPassword) {
        delete values?.newPassword
        delete values?.confirmNewPassword
      }
    }

    const isDisabled = Object.entries(values).some(
      ([key, value]) => !value && key !== 'isPublish',
    )

    setIsDisabled(isDisabled)
  }

  React.useEffect(() => {
    if (!detailAccount) return
    form.setFieldsValue(detailAccount)
    form.setFieldValue('currentEmail', detailAccount.email)
  }, [detailAccount])

  return (
    <>
      <Typography.Title level={3} className="mb-8 text-center">
        {detailAccount
          ? '運営(ASF)アカウント情報編集'
          : '運営(ASF)アカウント情報登録'}
      </Typography.Title>
      <Form
        form={form}
        requiredMark={false}
        onFinish={handleSubmit}
        onValuesChange={handleValuesChange}
      >
        <div className="relative overflow-hidden rounded-xl">
          <div className="bg-light-blue_light px-5 py-3">
            <Typography.Text className="font-bold text-core-blue">
              基本情報
            </Typography.Text>
          </div>
          <div className="bg-gray-white p-10">
            {detailAccount && (
              <Form.Item
                name="isPublish"
                className="absolute right-10 z-10 h-[1.75rem] w-[6.25rem]"
              >
                <Select
                  options={STATUS_ACCOUNT_OPTIONS}
                  suffixIcon={<AiFillCaretDown className="text-gray-black" />}
                  className="select_filter select_status"
                  popupClassName="select_filter_popup"
                />
              </Form.Item>
            )}
            <Form.Item
              required
              label={<FormLabel>氏名</FormLabel>}
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
                    className="mb-4 md:mb-0"
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
              label={<FormLabel>メールアドレス</FormLabel>}
              labelCol={{ span: 24 }}
              className="max-w-[25rem]"
            >
              <Form.Item name="currentEmail" hidden />
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
                className="mb-0"
                name="confirmEmail"
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
            <Form.Item
              required={!detailAccount}
              label={<FormLabel>パスワード</FormLabel>}
              labelCol={{ span: 24 }}
              className="max-w-[25rem]"
            >
              <Form.Item
                className="mb-4"
                name="newPassword"
                validateFirst
                rules={[
                  {
                    required: !detailAccount,
                    message: ErrorValidation.REQUIRED.message,
                  },
                  {
                    pattern: ErrorValidation.PASSWORD.regex,
                    message: ErrorValidation.PASSWORD.message,
                  },
                ]}
              >
                <Input.Password visibilityToggle={false} />
              </Form.Item>
              <Form.Item
                name="confirmNewPassword"
                className="mb-0"
                validateFirst
                rules={[
                  {
                    required: !detailAccount,
                    message: ErrorValidation.REQUIRED.message,
                  },
                  {
                    validator: (_, value) => {
                      let newPassword = form.getFieldValue('newPassword')
                      if (!newPassword && !value) return Promise.resolve()

                      return value === form.getFieldValue('newPassword')
                        ? Promise.resolve()
                        : Promise.reject(
                            ErrorValidation.PASSWORD_NOT_MATCH.message,
                          )
                    },
                  },
                ]}
              >
                <Input.Password visibilityToggle={false} />
              </Form.Item>
              <span className="text-[12px] text-gray-black">
                確認のためもう一度入力してください
              </span>
            </Form.Item>
            <Form.Item
              required
              label={<FormLabel>権限</FormLabel>}
              labelCol={{ span: 24 }}
              className="max-w-[25rem]"
              name="role"
            >
              <Select
                options={ROLE_OPTIONS}
                suffixIcon={<AiFillCaretDown className="text-gray-black" />}
              />
            </Form.Item>
          </div>
          <div className="my-16 flex justify-center">
            <Form.Item shouldUpdate>
              {() => (
                <Button
                  type="primary"
                  htmlType="submit"
                  className="h-14 rounded-[30px] px-16"
                  disabled={
                    isDisabled ||
                    (!form.isFieldsTouched() && !detailAccount) ||
                    form.getFieldsError().some((item) => item.errors.length)
                  }
                >
                  {detailAccount ? '編集する' : '登録する'}
                </Button>
              )}
            </Form.Item>
          </div>
        </div>
        <div className="mb-[2.5rem] text-center">
          {detailAccount && (
            <button
              onClick={handleDelete}
              type="button"
              className="text-core-red underline"
            >
              {'この運営(ASF)アカウントを削除する'}
            </button>
          )}
        </div>
      </Form>
    </>
  )
}

export default CreateEditAccountPage
