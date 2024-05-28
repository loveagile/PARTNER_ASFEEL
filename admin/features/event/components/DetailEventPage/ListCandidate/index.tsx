'use client'

import React from 'react'
import { Form } from 'antd'
import * as lodash from 'lodash'
import { useRouter } from 'next/navigation'

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
import { Event } from '@/features/event/model/event.model'

import ListCandidate from './ListCandidate'

type ListCandidateFeatureProps = {
  detailEvent: Event
}

const ListCandidateFeature = ({ detailEvent }: ListCandidateFeatureProps) => {
  const router = useRouter()
  const [form] = Form.useForm()
  const [candidateList, setCandidateList] = React.useState<any[]>([])
  const [pagination, setPagination] = React.useState<PaginationInfo>({})
  const [isLoading, setIsLoading] = React.useState<boolean>(false)
  const [isLoadingTable, setIsLoadingTable] = React.useState<boolean>(false)

  const handleFetchData = async (searchParams?: { [key: string]: any }) => {
    try {
      setIsLoadingTable(true)
      const params = {
        ...searchParams,
      } as any
      const urlSearchParams = convertUrlSearchParams(params || {})

      const res = await customFetchUtils(
        `${API_ROUTES.EVENT.candidate}?${urlSearchParams || ''}`,
        {
          method: HTTP_METHOD.GET,
        },
      )

      const response = await res.json()
      console.log(
        '🚀 ~ file: ListCandidate.tsx:52 ~ handleFetchData ~ response:',
        response,
      )

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
    } finally {
      setIsLoadingTable(false)
    }
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
      isSearchScoutList: true,
      zipCode: detailEvent?.workplace?.zip,
      projectId: detailEvent?.id,
    })
  }

  const handleValuesChange = async (changedValues: any, values: any = {}) => {
    handleDebounceFetchData({
      ...values,
      page: 1,
      perPage: DEFAULT_PAGE_SIZE,
      isSearchScoutList: true,
      zipCode: detailEvent?.workplace?.zip,
      projectId: detailEvent?.id,
    })
  }

  React.useEffect(() => {
    if (!(detailEvent?.id && detailEvent?.workplace?.zip)) {
      return
    }

    setIsLoading(true)
    handleFetchData({
      isSearchScoutList: true,
      zipCode: detailEvent?.workplace?.zip,
      projectId: detailEvent?.id,
    }).finally(() => {
      setIsLoading(false)
    })
  }, [detailEvent])

  return (
    <>
      <LoadingView spinning={isLoading} />
      <ListCandidate
        form={form}
        candidateList={candidateList}
        pagination={pagination}
        isLoadingTable={isLoadingTable}
        handleValuesChange={handleValuesChange}
        handleChangePage={handleChangePage}
        detailEvent={detailEvent}
        setIsLoading={setIsLoading}
      />
    </>
  )
}

export default ListCandidateFeature
