'use client'

import LoadingView from '@/components/LoadingView'
import {
  API_ROUTES,
  DEBOUNCE_TIME,
  DEFAULT_PAGE_SIZE,
  HTTP_METHOD,
} from '@/constants/common'
import { ErrorValidation } from '@/constants/error'
import { PaginationInfo } from '@/constants/model'
import PATH from '@/constants/path'
import { convertUrlSearchParams, customFetchUtils } from '@/utils/common'
import { CheckboxOptionType, Form } from 'antd'
import * as lodash from 'lodash'
import { useRouter } from 'next/navigation'
import React from 'react'
import ListQuestionPage from '../../components/ListQuestionPage'

const ListQuestionFeature = () => {
  const router = useRouter()
  const [form] = Form.useForm()
  const [questionList, setQuestionList] = React.useState<any[]>([])
  const [prefectures, setPrefectures] = React.useState<CheckboxOptionType[]>([])
  const [pagination, setPagination] = React.useState<PaginationInfo>({})
  const [isLoading, setIsLoading] = React.useState<boolean>(false)
  const [isLoadingTable, setIsLoadingTable] = React.useState<boolean>(false)

  const handleFetchData = async (params?: { [key: string]: any }) => {
    setIsLoadingTable(true)

    const urlSearchParams = convertUrlSearchParams(params || {})

    try {
      const res = await customFetchUtils(
        `${API_ROUTES.QUESTION.list}?${urlSearchParams || ''}`,
        {
          method: HTTP_METHOD.GET,
        },
      )

      const response = await res.json()

      if (!res.ok) {
        if (res.status === ErrorValidation.UNAUTHORIZED.code) {
          router.push(PATH.auth.login)
        }
        throw response
      }

      setQuestionList(response.data)
      setPagination(response.pagination)
    } catch (error) {
      console.log(error)
    }
    setIsLoadingTable(false)
  }

  const handleDebounceFetchData = React.useCallback(
    lodash.debounce(handleFetchData, DEBOUNCE_TIME),
    [],
  )

  const handleFetchPrefecture = async () => {
    try {
      const res = await customFetchUtils(API_ROUTES.ADDRESS.find)
      const data = await res.json()

      setPrefectures(
        data?.map((item: any) => ({
          label: item?.prefecture,
          value: item?.id,
        })) || [],
      )
    } catch (error) {
      console.log(error)
    }
  }

  const handleChangePage = async (page: number, perPage: number) => {
    const values = form.getFieldsValue()
    await handleFetchData({ ...values, page, perPage })
  }

  const handleValuesChange = async (changedValues: any, values: any = {}) => {
    handleDebounceFetchData({ ...values, page: 1, perPage: DEFAULT_PAGE_SIZE })
  }

  React.useEffect(() => {
    Promise.all([handleFetchData(), handleFetchPrefecture()]).then(() => {
      setIsLoading(false)
    })
  }, [])

  return (
    <>
      <LoadingView spinning={isLoading} />
      <ListQuestionPage
        form={form}
        handleValuesChange={handleValuesChange}
        handleChangePage={handleChangePage}
        prefectures={prefectures}
        questionList={questionList}
        pagination={pagination}
        isLoadingTable={isLoadingTable}
      />
    </>
  )
}

export default ListQuestionFeature
