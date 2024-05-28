'use client'

import React from 'react'
import lodash from 'lodash'
import { useRouter } from 'next/navigation'

import LoadingView from '@/components/LoadingView'
import { API_ROUTES, COMMON_STATUS, HTTP_METHOD } from '@/constants/common'
import PATH from '@/constants/path'
import useModal from '@/hooks/useModal'
import { customFetchUtils } from '@/utils/common'

import EditEventPage from '../../components/EditEventPage'

const UpdateEventFeature = ({ id }: { id: string }) => {
  const router = useRouter()
  const { showSuccess, showConfirm, showError } = useModal()
  const [isLoading, setIsLoading] = React.useState<boolean>(false)
  const [detailEvent, setDetailEvent] = React.useState<any>(null)

  const fetchDetailEvent = async () => {
    try {
      const res = await customFetchUtils(API_ROUTES.EVENT.detail(id))
      const data = await res.json()

      if (data?.status !== COMMON_STATUS.IN_PREPARATION) {
        router.push(PATH.event.list.prepare)
      }

      setDetailEvent(data)
    } catch (error) {
      console.log(error)
    }
  }

  const handleSubmit = async (values: any) => {
    try {
      setIsLoading(true)
      const res = await customFetchUtils(API_ROUTES.EVENT.update, {
        method: HTTP_METHOD.PUT,
        body: JSON.stringify({
          id,
          ...values,
          status: COMMON_STATUS.IN_PREPARATION,
        }),
      })

      if (res.ok) {
        showSuccess({
          title: '募集を編集しました',
          onOk: () => router.push(PATH.event.detail.prepare(id)),
        })
      } else {
        const errors = await res.json()
        const message = lodash.get(errors, 'error.message')

        showError({
          content: (
            <div>
              {message ||
                `${lodash.get(res, 'status')} ${lodash.get(res, 'statusText')}`}
            </div>
          ),
        })
      }
    } catch (error) {
      console.error(error)
    } finally {
      setIsLoading(false)
    }
  }

  React.useEffect(() => {
    setIsLoading(true)
    Promise.all([fetchDetailEvent()]).finally(() => {
      setIsLoading(false)
    })
  }, [id])

  return (
    <>
      <LoadingView spinning={isLoading} />
      <EditEventPage handleSubmit={handleSubmit} detailEvent={detailEvent} />
    </>
  )
}

export default UpdateEventFeature
