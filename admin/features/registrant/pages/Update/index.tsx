'use client'

import React from 'react'
import { Form } from 'antd'
import { useRouter } from 'next/navigation'
import lodash from 'lodash'

import { API_ROUTES, HTTP_METHOD } from '@/constants/common'
import LoadingView from '@/components/LoadingView'
import useModal from '@/hooks/useModal'
import { customFetchUtils } from '@/utils/common'

import EditRegistrantPage from '../../components/EditRegistrantPage'
import PATH from '@/constants/path'
import { Prefecture } from '@/constants/model'
import { getClubTypeLarge, getPrefectures } from '@/libs/firebase/firestore'

const UpdateRegistrantFeature = ({ id }: { id: string }) => {
  const router = useRouter()
  const [form] = Form.useForm()
  const { showConfirm, showSuccess, showError } = useModal()
  const [isLoading, setIsLoading] = React.useState(false)
  const [detailRegistrant, setDetailRegistrant] = React.useState<any>(null)

  const [prefectures, setPrefectures] = React.useState<Prefecture[]>([])
  const [clubTypesLarge, setClubTypesLarge] = React.useState<Prefecture[]>([])

  const handleSubmit = async (values: any) => {
    try {
      setIsLoading(true)
      const res = await customFetchUtils(API_ROUTES.REGISTRANT.update, {
        method: HTTP_METHOD.PUT,
        body: JSON.stringify({
          id,
          ...values,
        }),
      })

      if (res.ok) {
        showSuccess({
          title: '登録者を編集しました',
          onOk: () => router.push(PATH.registrant.list),
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
    } finally {
      setIsLoading(false)
    }
  }

  const handleDelete = () => {
    try {
      showConfirm({
        title: '登録者を削除する',
        onOk: async () => {
          const res = await customFetchUtils(API_ROUTES.REGISTRANT.delete, {
            method: HTTP_METHOD.DELETE,
            body: JSON.stringify({ id: detailRegistrant.id }),
          })

          if (res.ok) {
            router.push(PATH.registrant.list)
          }
        },
        content: (
          <div
            style={{
              display: 'flex',
              flexDirection: 'column',
              textAlign: 'center',
              fontSize: '1rem',
            }}
          >
            <span>この登録者を削除します</span>
            <span>よろしいですか？</span>
          </div>
        ),
      })
    } catch (error) {
      console.error(error)
    }
  }

  const handleCancel = () => {
    showConfirm({
      onOk: () => router.push(PATH.registrant.list),
    })
  }

  const fetchDetailRegistrant = async () => {
    try {
      setIsLoading(true)
      const promiseAll: any[] = []
      promiseAll.push(
        customFetchUtils(API_ROUTES.REGISTRANT.detail(id!)).then((res) =>
          res.json(),
        ),
      )

      promiseAll.push(!prefectures.length ? getPrefectures() : null)
      promiseAll.push(!clubTypesLarge.length ? getClubTypeLarge() : null)

      const [detailRegis, resPref, resClub] = await Promise.all(promiseAll)

      resPref && resPref.length && setPrefectures(resPref)
      resClub && resClub.length && setClubTypesLarge(resClub)

      setDetailRegistrant(detailRegis)
    } catch (error) {
      console.error(error)
    } finally {
      setIsLoading(false)
    }
  }

  React.useEffect(() => {
    fetchDetailRegistrant()
  }, [id])

  return (
    <>
      <LoadingView spinning={isLoading} />
      <EditRegistrantPage
        form={form}
        handleSubmit={handleSubmit}
        handleDelete={handleDelete}
        detailRegistrant={detailRegistrant}
        prefectures={prefectures}
        clubTypesLarge={clubTypesLarge}
        handleCancel={handleCancel}
        setIsLoading={setIsLoading}
      />
    </>
  )
}

export default UpdateRegistrantFeature
