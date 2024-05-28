'use client'

import useModal from '@/hooks/useModal'
import CreateEditNotificationPage from '../../components/CreateEditNotificationPage'
import LoadingView from '@/components/LoadingView'
import React from 'react'
import { API_ROUTES, HTTP_METHOD } from '@/constants/common'
import { Dayjs } from 'dayjs'
import { useRouter } from 'next/navigation'
import PATH from '@/constants/path'
import { ErrorValidation } from '@/constants/error'
import { customFetchUtils } from '@/utils/common'

const CreateNotificationFeature = () => {
  const { showSuccess } = useModal()
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
        prefecture: values?.prefecture,
        cities: values?.cities,
        title: values?.title,
        url: values?.url,
        sentAt: sentAt.toISOString(),
      }

      const res = await customFetchUtils(API_ROUTES.NOTIFICATION.create, {
        method: HTTP_METHOD.POST,
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

  return (
    <>
      <LoadingView spinning={isLoading} />
      <CreateEditNotificationPage handleSubmit={handleSubmit} />
    </>
  )
}

export default CreateNotificationFeature
