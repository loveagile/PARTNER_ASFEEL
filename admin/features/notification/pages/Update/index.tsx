'use client'

import LoadingView from '@/components/LoadingView'
import { API_ROUTES, HTTP_METHOD } from '@/constants/common'
import useModal from '@/hooks/useModal'
import dayjs, { Dayjs } from 'dayjs'
import React from 'react'
import CreateEditNotificationPage from '../../components/CreateEditNotificationPage'
import { useRouter } from 'next/navigation'
import PATH from '@/constants/path'
import { ErrorValidation } from '@/constants/error'
import { customFetchUtils } from '@/utils/common'

const UpdateNotificationFeature = ({ id }: { id: string }) => {
  const { showSuccess, showConfirm } = useModal()
  const [detailNotification, setDetailNotification] = React.useState<any>(null)
  const [isLoading, setIsLoading] = React.useState(false)
  const router = useRouter()

  const handleSubmit = async (values: any) => {
    setIsLoading(true)
    try {
      const sentAtDate = values.date as Dayjs
      const sentAtTime = values.time as Dayjs

      const sentAt = sentAtDate
        .hour(sentAtTime.hour())
        .minute(sentAtTime.minute())
        .second(0)
        .millisecond(0)

      const data = {
        id,
        prefecture: values?.prefecture,
        cities: values?.cities,
        title: values?.title,
        url: values?.url,
        sentAt: sentAt.toISOString(),
        status: values?.status,
      }

      const res = await customFetchUtils(API_ROUTES.NOTIFICATION.update, {
        method: HTTP_METHOD.PUT,
        body: JSON.stringify(data),
      })

      if (res.ok) {
        showSuccess({
          title: 'お知らせを編集しました',
          onOk: () => router.push(PATH.notification.list),
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
      title: 'お知らせを削除する',
      content: (
        <div className="text-center">
          このお知らせを削除します
          <br />
          よろしいですか？
        </div>
      ),
      onOk: async () => {
        const res = await customFetchUtils(API_ROUTES.NOTIFICATION.delete, {
          method: HTTP_METHOD.DELETE,
          body: JSON.stringify({ id: detailNotification.id }),
        })

        if (res.ok) {
          router.push(PATH.notification.list)
        }
      },
    })
  }

  const fetchDetailNotification = async () => {
    setIsLoading(true)
    try {
      const res = await customFetchUtils(API_ROUTES.NOTIFICATION.detail(id!))
      const data = await res.json()
      setDetailNotification({
        ...data,
        date: dayjs(data?.sentAt),
        time: dayjs(data?.sentAt),
      })
    } catch (error) {
      console.error(error)
    }
    setIsLoading(false)
  }

  React.useEffect(() => {
    fetchDetailNotification()
  }, [id])

  return (
    <>
      <LoadingView spinning={isLoading} />
      <CreateEditNotificationPage
        handleSubmit={handleSubmit}
        handleDelete={handleDelete}
        detailNotification={detailNotification}
      />
    </>
  )
}

export default UpdateNotificationFeature
