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

const UpdateAccountFeature = ({ id }: { id: string }) => {
  const [form] = Form.useForm()
  const { showSuccess, showConfirm } = useModal()
  const [detailAccount, setDetailAccount] = React.useState<any>(null)
  const [isLoading, setIsLoading] = React.useState(false)
  const router = useRouter()

  const handleSubmit = async (values: any) => {
    setIsLoading(true)
    try {
      const res = await customFetchUtils(API_ROUTES.ACCOUNT.update, {
        method: HTTP_METHOD.PUT,
        body: JSON.stringify({
          id,
          ...values,
        }),
      })

      if (res.ok) {
        showSuccess({
          title: '運営(ASF)アカウントを編集しました',
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

  const handleDelete = () => {
    showConfirm({
      title: '運営(ASF)アカウントを削除する',
      content: (
        <div className="text-center">
          この運営(ASF)アカウントを削除します
          <br />
          よろしいですか？
        </div>
      ),
      onOk: async () => {
        const res = await customFetchUtils(API_ROUTES.ACCOUNT.delete, {
          method: HTTP_METHOD.DELETE,
          body: JSON.stringify({ id: detailAccount.id }),
        })

        if (res.ok) {
          router.push(PATH.account.list)
        }
      },
    })
  }

  const fetchDetailAccount = async () => {
    setIsLoading(true)
    try {
      const res = await customFetchUtils(API_ROUTES.ACCOUNT.detail(id!))
      const data = await res.json()
      setDetailAccount(data)
    } catch (error) {
      console.error(error)
    }
    setIsLoading(false)
  }

  React.useEffect(() => {
    fetchDetailAccount()
  }, [id])

  return (
    <>
      <LoadingView spinning={isLoading} />
      <CreateEditAccountPage
        form={form}
        handleSubmit={handleSubmit}
        handleDelete={handleDelete}
        detailAccount={detailAccount}
      />
    </>
  )
}

export default UpdateAccountFeature
