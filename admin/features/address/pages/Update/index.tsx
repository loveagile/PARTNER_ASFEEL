'use client'

import LoadingView from '@/components/LoadingView'
import { API_ROUTES, HTTP_METHOD } from '@/constants/common'
import PATH from '@/constants/path'
import useModal from '@/hooks/useModal'
import { customFetchUtils } from '@/utils/common'
import { useRouter } from 'next/navigation'
import React from 'react'
import CreateEditAddressPage from '../../components/CreateEditAddressPage'

const UpdateAddressFeature = ({ id }: { id: string }) => {
  const { showSuccess, showConfirm } = useModal()
  const [detailAddress, setDetailAddress] = React.useState<any>(null)
  const [isLoading, setIsLoading] = React.useState(false)
  const router = useRouter()

  const handleSubmit = async (values: any) => {
    setIsLoading(true)
    try {
      const res = await customFetchUtils(API_ROUTES.ADDRESS.update, {
        method: HTTP_METHOD.PUT,
        body: JSON.stringify({
          id,
          ...values,
        }),
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

  const handleDelete = () => {
    showConfirm({
      title: '住所（郵便番号）を削除する',
      content: (
        <div className="text-center">
          この住所（郵便番号）を削除します
          <br />
          よろしいですか？
        </div>
      ),
      onOk: async () => {
        const res = await customFetchUtils(API_ROUTES.ADDRESS.delete, {
          method: HTTP_METHOD.DELETE,
          body: JSON.stringify({ id: detailAddress.id }),
        })

        if (res.ok) {
          router.push(PATH.address.list)
        }
      },
    })
  }

  const fetchDetailAddress = async () => {
    setIsLoading(true)
    try {
      const res = await customFetchUtils(API_ROUTES.ADDRESS.detail(id!))
      const data = await res.json()
      setDetailAddress(data)
    } catch (error) {
      console.error(error)
    }
    setIsLoading(false)
  }

  React.useEffect(() => {
    fetchDetailAddress()
  }, [id])

  return (
    <>
      <LoadingView spinning={isLoading} />
      <CreateEditAddressPage
        handleSubmit={handleSubmit}
        handleDelete={handleDelete}
        detailAddress={detailAddress}
      />
    </>
  )
}

export default UpdateAddressFeature
