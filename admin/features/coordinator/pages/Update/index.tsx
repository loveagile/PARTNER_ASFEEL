'use client'

import LoadingView from '@/components/LoadingView'
import { API_ROUTES, HTTP_METHOD } from '@/constants/common'
import PATH from '@/constants/path'
import useModal from '@/hooks/useModal'
import { useRouter } from 'next/navigation'
import React from 'react'
import CreateEditCoordinatorPage from '../../components/CreateEditCoordinatorPage'
import { ErrorValidation } from '@/constants/error'
import { Form } from 'antd'
import { customFetchUtils } from '@/utils/common'

const UpdateCoordinatorFeature = ({ id }: { id: string }) => {
  const [form] = Form.useForm()
  const { showSuccess, showConfirm } = useModal()
  const [detailCoordinator, setDetailCoordinator] = React.useState<any>(null)
  const [isLoading, setIsLoading] = React.useState(false)
  const router = useRouter()

  const handleSubmit = async (values: any) => {
    setIsLoading(true)
    try {
      const res = await customFetchUtils(API_ROUTES.COORDINATOR.update, {
        method: HTTP_METHOD.PUT,
        body: JSON.stringify({
          id,
          ...values,
        }),
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

        if (response?.error?.code === ErrorValidation.WRONG_PASSWORD.code) {
          form.setFields([
            {
              name: 'currentPassword',
              errors: [ErrorValidation.WRONG_PASSWORD.message],
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
    showConfirm({
      title: 'コーディネーターアカウントを削除する',
      content: (
        <div className="text-center">
          このコーディネーターアカウントを削除します
          <br />
          よろしいですか？
        </div>
      ),
      onOk: async () => {
        const res = await customFetchUtils(API_ROUTES.COORDINATOR.delete, {
          method: HTTP_METHOD.DELETE,
          body: JSON.stringify({ id: detailCoordinator.id }),
        })

        if (res.ok) {
          router.push(PATH.coordinator.list)
        }
      },
    })
  }

  const fetchDetailCoordinator = async () => {
    setIsLoading(true)
    try {
      const res = await customFetchUtils(API_ROUTES.COORDINATOR.detail(id!))
      const data = await res.json()
      setDetailCoordinator(data)
    } catch (error) {
      console.error(error)
    }
    setIsLoading(false)
  }

  React.useEffect(() => {
    fetchDetailCoordinator()
  }, [id])

  return (
    <>
      <LoadingView spinning={isLoading} />
      <CreateEditCoordinatorPage
        form={form}
        handleSubmit={handleSubmit}
        handleDelete={handleDelete}
        detailCoordinator={detailCoordinator}
      />
    </>
  )
}

export default UpdateCoordinatorFeature
