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
import { Form } from 'antd'
import * as lodash from 'lodash'
import { useRouter } from 'next/navigation'
import React from 'react'
import ListCandidate from '../../components/ListCandidate'

type ListCandidateFeatureProps = {
  detailRecruitment: any
}

const ListCandidateFeature = ({
  detailRecruitment,
}: ListCandidateFeatureProps) => {
  const router = useRouter()
  const [form] = Form.useForm()
  const [candidateList, setCandidateList] = React.useState<any[]>([])
  const [pagination, setPagination] = React.useState<PaginationInfo>({})
  const [isLoading, setIsLoading] = React.useState<boolean>(false)
  const [isLoadingTable, setIsLoadingTable] = React.useState<boolean>(false)

  const handleFetchData = async (searchParams?: { [key: string]: any }) => {
    setIsLoadingTable(true)

    const params = {
      ...searchParams,
    } as any

    const urlSearchParams = convertUrlSearchParams(params || {})

    try {
      const res = await customFetchUtils(
        `${API_ROUTES.RECRUITMENT.getScout}?${urlSearchParams || ''}`,
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

      setCandidateList(response.data)
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

  const handleChangePage = async (page: number, perPage: number) => {
    const values = form.getFieldsValue()
    await handleFetchData({
      ...values,
      page,
      perPage,
      projectId: detailRecruitment?.id,
    })
  }

  const handleValuesChange = async (changedValues: any, values: any = {}) => {
    handleDebounceFetchData({
      ...values,
      page: 1,
      perPage: DEFAULT_PAGE_SIZE,
      projectId: detailRecruitment?.id,
    })
  }

  React.useEffect(() => {
    if (!detailRecruitment?.id) {
      return
    }

    setIsLoading(true)
    handleFetchData({
      projectId: detailRecruitment?.id,
    }).finally(() => {
      setIsLoading(false)
    })
  }, [detailRecruitment])

  return (
    <>
      <LoadingView spinning={isLoading} />
      <ListCandidate
        form={form}
        candidateList={candidateList}
        setCandidateList={setCandidateList}
        pagination={pagination}
        isLoadingTable={isLoadingTable}
        handleValuesChange={handleValuesChange}
        handleChangePage={handleChangePage}
        detailRecruitment={detailRecruitment}
        setIsLoading={setIsLoading}
      />
    </>
  )
}

export default ListCandidateFeature
