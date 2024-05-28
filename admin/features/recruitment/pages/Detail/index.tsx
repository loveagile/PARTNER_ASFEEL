'use client'

import React from 'react'
import DetailRecruitmentPage from '../../components/DetailRecruitmentPage'
import { customFetchUtils } from '@/utils/common'
import { API_ROUTES, COMMON_STATUS } from '@/constants/common'
import LoadingView from '@/components/LoadingView'
import useModal from '@/hooks/useModal'
import { useRouter } from 'next/navigation'
import PATH from '@/constants/path'

const EditRecruitmentFeature = ({ id }: { id: string }) => {
  const [detailRecruitment, setDetailRecruitment] = React.useState<any>(null)
  const [isLoading, setIsLoading] = React.useState<boolean>(false)
  const { showSuccess, showConfirm } = useModal()
  const router = useRouter()

  const handleFetchDetailRecruitment = async () => {
    try {
      const res = await customFetchUtils(API_ROUTES.RECRUITMENT.detail(id))
      const data = await res.json()

      setDetailRecruitment(data)
    } catch (error) {
      console.log(error)
    }
  }

  const handleUpdateIsChecked = async () => {
    await customFetchUtils(API_ROUTES.RECRUITMENT.check, {
      method: 'PUT',
      body: JSON.stringify({ id, isChecked: true }),
    })
  }

  const handlePublic = async () => {
    setIsLoading(true)
    try {
      const res = await customFetchUtils(API_ROUTES.RECRUITMENT.modifyStatus, {
        method: 'PUT',
        body: JSON.stringify({ id, status: COMMON_STATUS.IN_PUBLIC }),
      })

      if (res.ok) {
        showSuccess({
          title: '募集を開始しました',
          okText: '候補を確認する',
          content: (
            <div className="text-center">
              候補を確認して
              <br />
              スカウトを送信してください
            </div>
          ),
          onOk: () => router.push(PATH.recruitment.list.public),
        })
      }
    } catch (error) {
      console.log(error)
    }
    setIsLoading(false)
  }

  const handlePrepare = async () => {
    setIsLoading(true)
    try {
      const res = await customFetchUtils(API_ROUTES.RECRUITMENT.modifyStatus, {
        method: 'PUT',
        body: JSON.stringify({ id, status: COMMON_STATUS.IN_PREPARATION }),
      })

      if (res.ok) {
        router.push(PATH.recruitment.list.prepare)
      }
    } catch (error) {
      console.log(error)
    }
    setIsLoading(false)
  }

  const handleFinish = async () => {
    setIsLoading(true)
    try {
      showConfirm({
        title: '募集を終了する',
        okText: '終了する',
        content: (
          <div className="text-center">
            この募集を終了します
            <br />
            よろしいですか？
            <br />※ 終了した募集を再開することはできません
          </div>
        ),
        onOk: async () => {
          const res = await customFetchUtils(
            API_ROUTES.RECRUITMENT.modifyStatus,
            {
              method: 'PUT',
              body: JSON.stringify({ id, status: COMMON_STATUS.FINISH }),
            },
          )

          if (res.ok) {
            router.push(PATH.recruitment.list.finish)
          }
        },
      })
    } catch (error) {
      console.log(error)
    }
    setIsLoading(false)
  }

  const handleDelete = async () => {
    showConfirm({
      title: '募集を削除する',
      content: (
        <div className="text-center">
          この募集を削除します
          <br />
          よろしいですか？
        </div>
      ),
      onOk: async () => {
        const res = await customFetchUtils(API_ROUTES.RECRUITMENT.delete, {
          method: 'DELETE',
          body: JSON.stringify({ id }),
        })

        if (res.ok) {
          router.push(PATH.recruitment.list.prepare)
        }
      },
    })
  }

  React.useEffect(() => {
    setIsLoading(true)
    Promise.all([handleFetchDetailRecruitment(), handleUpdateIsChecked()]).then(
      () => {
        setIsLoading(false)
      },
    )
  }, [id])

  return (
    <>
      <LoadingView spinning={isLoading} />
      <DetailRecruitmentPage
        detailRecruitment={detailRecruitment}
        handlePublic={handlePublic}
        handlePrepare={handlePrepare}
        handleFinish={handleFinish}
        handleDelete={handleDelete}
      />
    </>
  )
}

export default EditRecruitmentFeature
