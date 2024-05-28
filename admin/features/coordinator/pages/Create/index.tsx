'use client'

import LoadingView from '@/components/LoadingView'
import { API_ROUTES, HTTP_METHOD } from '@/constants/common'
import useModal from '@/hooks/useModal'
import { useRouter } from 'next/navigation'
import React from 'react'
import CreateEditCoordinatorPage from '../../components/CreateEditCoordinatorPage'
import PATH from '@/constants/path'
import { ErrorValidation } from '@/constants/error'
import { Form } from 'antd'
import { customFetchUtils } from '@/utils/common'

const CreateCoordinatorFeature = () => {
  const [form] = Form.useForm()
  const { showSuccess } = useModal()
  const [isLoading, setIsLoading] = React.useState(false)
  const router = useRouter()

  const handleSubmit = async (values: any) => {
    setIsLoading(true)
    try {
      const res = await customFetchUtils(API_ROUTES.COORDINATOR.create, {
        method: HTTP_METHOD.POST,
        body: JSON.stringify(values),
      })

      if (res.ok) {
        showSuccess({
          title: (
            <div className="text-center">
              コーディネータアカウント情報を
              <br />
              修正しました
            </div>
          ),
          content: (
            <div className="text-center">
              候補を確認して
              <br />
              スカウトを送信してください
            </div>
          ),
          onOk: () => router.push(PATH.coordinator.list),
        })
      } else {
        if (res.status === ErrorValidation.UNAUTHORIZED.code) {
          router.push(PATH.auth.login)
        }

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
      <CreateEditCoordinatorPage
        form={form}
        handleSubmit={handleSubmit}
        handleIsLoading={setIsLoading}
      />
    </>
  )
}

export default CreateCoordinatorFeature
