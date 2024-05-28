'use client'

import LoadingView from '@/components/LoadingView'
import { API_ROUTES, HTTP_METHOD } from '@/constants/common'
import PATH from '@/constants/path'
import useModal from '@/hooks/useModal'
import { customFetchUtils } from '@/utils/common'
import { useRouter } from 'next/navigation'
import React from 'react'
import CreateEditAddressPage from '../../components/CreateEditAddressPage'

const CreateAddressFeature = () => {
  const { showSuccess } = useModal()
  const [isLoading, setIsLoading] = React.useState(false)
  const router = useRouter()

  const handleSubmit = async (values: any) => {
    setIsLoading(true)
    try {
      const res = await customFetchUtils(API_ROUTES.ADDRESS.create, {
        method: HTTP_METHOD.POST,
        body: JSON.stringify(values),
      })

      if (res.ok) {
        showSuccess({
          title: '住所（郵便番号）を編集しました',
          onOk: () => router.push(PATH.address.list),
        })
      }
    } catch (error) {
      console.error(error)
    }
    setIsLoading(false)
  }

  return (
    <>
      <LoadingView spinning={isLoading} />
      <CreateEditAddressPage handleSubmit={handleSubmit} />
    </>
  )
}

export default CreateAddressFeature
