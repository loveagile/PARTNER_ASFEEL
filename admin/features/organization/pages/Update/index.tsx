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

type UpdateOrganizationFeatureProps = {
  id?: string
}

const UpdateOrganizationFeature = ({ id }: UpdateOrganizationFeatureProps) => {
  const router = useRouter()
  const [form] = Form.useForm()
  const { showConfirm, showSuccess } = useModal()
  const [isLoading, setIsLoading] = React.useState(false)
  const [detailOrganization, setDetailOrganization] = React.useState<any>(null)

  const handleSubmit = async (values: any) => {
    setIsLoading(true)
    try {
      const requestValues: CreateOrganizationRequestType = {
        ...values,
        id: detailOrganization.id,
        address: {
          ...values.address,
          id: detailOrganization.address.id,
        },
      }

      const res = await customFetchUtils(API_ROUTES.ORGANIZATION.update, {
        method: HTTP_METHOD.PUT,
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
    setIsLoading(false)
  }

  const handleDelete = () => {
    try {
      showConfirm({
        title: '学校・団体情報を削除する',
        onOk: async () => {
          const res = await customFetchUtils(API_ROUTES.ORGANIZATION.delete, {
            method: HTTP_METHOD.DELETE,
            body: JSON.stringify({ id: detailOrganization.id }),
          })

          if (res.ok) {
            router.push(PATH.organization.list)
          }
        },
      })
    } catch (error) {
      console.error(error)
    }
  }

  const fetchDetailOrganization = async () => {
    setIsLoading(true)
    try {
      const res = await customFetchUtils(API_ROUTES.ORGANIZATION.detail(id!))
      const data = await res.json()
      setDetailOrganization(data)
    } catch (error) {
      console.error(error)
    }
    setIsLoading(false)
  }

  React.useEffect(() => {
    fetchDetailOrganization()
  }, [id])

  return (
    <>
      <LoadingView spinning={isLoading} />
      <CreateEditOrganizationPage
        form={form}
        detailOrganization={detailOrganization}
        handleSubmit={handleSubmit}
        handleDelete={handleDelete}
        // prefectures={prefectures}
        // organizationTypes={organizationTypes}
      />
    </>
  )
}

export default UpdateOrganizationFeature
