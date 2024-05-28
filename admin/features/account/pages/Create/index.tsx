'use client'

import LoadingView from '@/components/LoadingView'
import { API_ROUTES, HTTP_METHOD } from '@/constants/common'
import PATH from '@/constants/path'
import useModal from '@/hooks/useModal'
import { useRouter } from 'next/navigation'
import React from 'react'
import CreateEditAccountPage from '../../components/CreateEditAccountPage'
import { ErrorValidation } from '@/constants/error'
import { Form } from 'antd'
import { customFetchUtils } from '@/utils/common'

const CreateAccountFeature = () => {
  const [form] = Form.useForm()
  const { showSuccess } = useModal()
  const [isLoading, setIsLoading] = React.useState(false)
  const router = useRouter()

  const handleSubmit = async (values: any) => {
    setIsLoading(true)
    try {
      const res = await customFetchUtils(API_ROUTES.ACCOUNT.create, {
        method: HTTP_METHOD.POST,
        body: JSON.stringify(values),
      })

      if (res.ok) {
        showSuccess({
          title: '運営(ASF)アカウントを登録しました',
          onOk: () => router.push(PATH.account.list),
        })
      } else {
        const response = await res.json()

        if (
          response?.error?.code === ErrorValidation.EMAIL_ALREADY_EXISTS.code
        ) {
          form.setFields([
            {
              name: 'email',
              errors: [ErrorValidation.EMAIL_ALREADY_EXISTS.message],
            },
          ])
        }
      }
    } catch (error) {
      console.error(error)
    }
    setIsLoading(false)
  }

  return (
    <>
      <LoadingView spinning={isLoading} />
      <CreateEditAccountPage form={form} handleSubmit={handleSubmit} />
    </>
  )
}

export default CreateAccountFeature
