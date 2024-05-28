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

const CreateCategoryFeature = () => {
  const { showSuccess } = useModal()
  const [isLoading, setIsLoading] = React.useState(false)
  const router = useRouter()

  const handleSubmit = async (values: any) => {
    setIsLoading(true)
    try {
      const res = await customFetchUtils(API_ROUTES.CATEGORY.create, {
        method: HTTP_METHOD.POST,
        body: JSON.stringify(values),
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

  return (
    <>
      <LoadingView spinning={isLoading} />
      <CreateEditCategoryPage handleSubmit={handleSubmit} />
    </>
  )
}

export default CreateCategoryFeature
