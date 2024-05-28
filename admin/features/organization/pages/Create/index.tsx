'use client'

import { CreateOrganizationRequestType } from '@/app/api/organization/schema'
import LoadingView from '@/components/LoadingView'
import { API_ROUTES, HTTP_METHOD } from '@/constants/common'
import { ErrorValidation } from '@/constants/error'
import PATH from '@/constants/path'
import CreateEditOrganizationPage from '@/features/organization/components/CreateEditOrganizationPage'
import useModal from '@/hooks/useModal'
import { customFetchUtils } from '@/utils/common'
import { Form } from 'antd'
import { useRouter } from 'next/navigation'
import React from 'react'

const CreateOrganizationFeature = () => {
  const [form] = Form.useForm()
  const router = useRouter()
  const { showSuccess } = useModal()
  const [isSubmitting, setIsSubmitting] = React.useState(false)

  const handleSubmit = async (values: any) => {
    setIsSubmitting(true)
    try {
      const requestValues: CreateOrganizationRequestType = values
      const res = await customFetchUtils(API_ROUTES.ORGANIZATION.create, {
        method: HTTP_METHOD.POST,
        body: JSON.stringify(requestValues),
      })
      if (res.ok) {
        showSuccess({
          title: '学校・団体情報を編集しました',
          onOk: () => router.push(PATH.organization.list),
        })
      } else {
        if (res.status === ErrorValidation.UNAUTHORIZED.code) {
          router.push(PATH.auth.login)
        }

        const response = await res.json()

        if (
          response?.error?.code ===
          ErrorValidation.ORGANIZATION_ALREADY_EXISTS.code
        ) {
          form.setFields([
            {
              name: 'organizationId',
              errors: [ErrorValidation.ORGANIZATION_ALREADY_EXISTS.message],
            },
          ])
        }
      }
    } catch (error) {
      console.error(error)
    }
    setIsSubmitting(false)
  }

  return (
    <>
      <LoadingView spinning={isSubmitting} />
      <CreateEditOrganizationPage
        form={form}
        handleSubmit={handleSubmit}
        // prefectures={prefectures}
        // organizationTypes={organizationTypes}
      />
    </>
  )
}

export default CreateOrganizationFeature
