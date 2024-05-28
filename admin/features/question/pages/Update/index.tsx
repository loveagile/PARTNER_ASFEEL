'use client'

import LoadingView from '@/components/LoadingView'
import { API_ROUTES, HTTP_METHOD } from '@/constants/common'
import PATH from '@/constants/path'
import useModal from '@/hooks/useModal'
import { useRouter } from 'next/navigation'
import React from 'react'
import CreateEditQuestionPage from '../../components/CreateEditQuestionPage'
import { ErrorValidation } from '@/constants/error'
import { customFetchUtils } from '@/utils/common'

const UpdateQuestionFeature = ({ id }: { id: string }) => {
  const { showSuccess, showConfirm } = useModal()
  const [detailQuestion, setDetailQuestion] = React.useState<any>(null)
  const [isLoading, setIsLoading] = React.useState(false)
  const router = useRouter()

  const handleSubmit = async (values: any) => {
    setIsLoading(true)
    try {
      const res = await customFetchUtils(API_ROUTES.QUESTION.update, {
        method: HTTP_METHOD.PUT,
        body: JSON.stringify({
          id,
          ...values,
        }),
      })

      if (res.ok) {
        showSuccess({
          title: '質問を編集しました',
          onOk: () => router.push(PATH.question.list),
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
      title: '質問を削除する',
      content: (
        <div className="text-center">
          この質問を削除します
          <br />
          よろしいですか？
        </div>
      ),
      onOk: async () => {
        const res = await customFetchUtils(API_ROUTES.QUESTION.delete, {
          method: HTTP_METHOD.DELETE,
          body: JSON.stringify({ id: detailQuestion.id }),
        })

        if (res.ok) {
          router.push(PATH.question.list)
        }
      },
    })
  }

  const fetchDetailQuestion = async () => {
    setIsLoading(true)
    try {
      const res = await customFetchUtils(API_ROUTES.QUESTION.detail(id!))
      const data = await res.json()
      setDetailQuestion(data)
    } catch (error) {
      console.error(error)
    }
    setIsLoading(false)
  }

  React.useEffect(() => {
    fetchDetailQuestion()
  }, [id])

  return (
    <>
      <LoadingView spinning={isLoading} />
      <CreateEditQuestionPage
        handleSubmit={handleSubmit}
        handleDelete={handleDelete}
        detailQuestion={detailQuestion}
      />
    </>
  )
}

export default UpdateQuestionFeature
