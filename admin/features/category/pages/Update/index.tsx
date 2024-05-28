'use client'

import LoadingView from '@/components/LoadingView'
import { API_ROUTES, HTTP_METHOD } from '@/constants/common'
import PATH from '@/constants/path'
import useModal from '@/hooks/useModal'
import { useRouter } from 'next/navigation'
import React from 'react'
import CreateEditCategoryPage from '../../components/CreateEditCategoryPage'
import { ErrorValidation } from '@/constants/error'
import { customFetchUtils } from '@/utils/common'

const UpdateCategoryFeature = ({ id }: { id: string }) => {
  const { showSuccess, showConfirm } = useModal()
  const [detailCategory, setDetailCategory] = React.useState<any>(null)
  const [isLoading, setIsLoading] = React.useState(false)
  const router = useRouter()

  const handleSubmit = async (values: any) => {
    setIsLoading(true)
    try {
      const res = await customFetchUtils(API_ROUTES.CATEGORY.update, {
        method: HTTP_METHOD.PUT,
        body: JSON.stringify({
          id,
          ...values,
        }),
      })

      if (res.ok) {
        showSuccess({
          title: '種目を編集しました',
          onOk: () => router.push(PATH.category.list),
        })
      } else {
        if (res.status === ErrorValidation.UNAUTHORIZED.code) {
          router.push(PATH.auth.login)
        }
      }
    } catch (error) {
      console.error(error)
    }
    setIsLoading(false)
  }

  const handleDelete = () => {
    showConfirm({
      title: '種目を削除する',
      content: (
        <div className="text-center">
          この種目を削除します
          <br />
          よろしいですか？
        </div>
      ),
      onOk: async () => {
        const res = await customFetchUtils(API_ROUTES.CATEGORY.delete, {
          method: HTTP_METHOD.DELETE,
          body: JSON.stringify({ id: detailCategory.id }),
        })

        if (res.ok) {
          router.push(PATH.category.list)
        }
      },
    })
  }

  const fetchDetailCategory = async () => {
    setIsLoading(true)
    try {
      const res = await customFetchUtils(API_ROUTES.CATEGORY.detail(id!))
      const data = await res.json()
      setDetailCategory(data)
    } catch (error) {
      console.error(error)
    }
    setIsLoading(false)
  }

  React.useEffect(() => {
    fetchDetailCategory()
  }, [id])

  return (
    <>
      <LoadingView spinning={isLoading} />
      <CreateEditCategoryPage
        handleSubmit={handleSubmit}
        handleDelete={handleDelete}
        detailCategory={detailCategory}
      />
    </>
  )
}

export default UpdateCategoryFeature
