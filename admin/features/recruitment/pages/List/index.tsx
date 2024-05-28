'use client'

import {
  API_ROUTES,
  DEBOUNCE_TIME,
  DEFAULT_PAGE_SIZE,
  COMMON_STATUS,
} from '@/constants/common'
import ListRecruitmentPage from '@/features/recruitment/components/ListRecruitmentPage'
import React, { useEffect } from 'react'
import { usePathname } from 'next/navigation'
import PATH from '@/constants/path'
import { convertUrlSearchParams, customFetchUtils } from '@/utils/common'
import { PaginationInfo } from '@/constants/model'
import { Form } from 'antd'
import * as lodash from 'lodash'
import LoadingView from '@/components/LoadingView'

const ListRecruitmentFeature = () => {
  const pathName = usePathname()
  const [form] = Form.useForm()
  const [recruitmentList, setRecruitmentList] = React.useState<any[]>([])
  const [pagination, setPagination] = React.useState<PaginationInfo>({})
  const [prefectures, setPrefectures] = React.useState<any[]>([])
  const [eventTypes, setEventTypes] = React.useState<any[]>([])
  const [eventNames, setEventNames] = React.useState<any[]>([])
  const [isLoading, setIsLoading] = React.useState<boolean>(false)
  const [isLoadingTable, setIsLoadingTable] = React.useState<boolean>(false)

  const recruitmentStatus = React.useMemo(() => {
    switch (pathName) {
      case PATH.recruitment.list.prepare:
        return COMMON_STATUS.IN_PREPARATION
      case PATH.recruitment.list.public:
        return COMMON_STATUS.IN_PUBLIC
      default:
        return COMMON_STATUS.FINISH
    }
  }, [pathName])

  const handleFetchData = async (searchParams?: { [key: string]: any }) => {
    setIsLoadingTable(true)

    const params = {
      ...searchParams,
      status: recruitmentStatus,
    }

    const urlSearchParams = convertUrlSearchParams(params)

    const res = await customFetchUtils(
      `${API_ROUTES.RECRUITMENT.list}?${urlSearchParams || ''}`,
    )

    const response = await res.json()

    if (!res.ok) {
      throw response
    }

    setRecruitmentList(response.data)
    setPagination(response.pagination)
    setIsLoadingTable(false)
  }

  const handleDebounceFetchData = React.useCallback(
    lodash.debounce(handleFetchData, DEBOUNCE_TIME),
    [],
  )

  const handleChangePage = async (page: number, perPage: number) => {
    const values = form.getFieldsValue()
    await handleFetchData({ ...values, page, perPage })
  }

  const handleValuesChange = async (changedValues: any, values: any = {}) => {
    handleDebounceFetchData({ ...values, page: 1, perPage: DEFAULT_PAGE_SIZE })
  }

  const fetchEventTypes = async () => {
    const res = await customFetchUtils(API_ROUTES.CATEGORY.type('large'))
    const data = await res.json()

    const eventTypesData =
      data?.map((item: any) => ({
        label: item?.name,
        value: item?.name,
      })) || []

    setEventTypes(eventTypesData)
  }

  const fetchPrefecture = async () => {
    const res = await customFetchUtils(API_ROUTES.ADDRESS.find)
    const data = await res.json()

    const prefecturesData =
      data?.map((item: any) => ({
        label: item?.prefecture,
        value: item?.prefecture,
      })) || []

    setPrefectures(prefecturesData)
  }

  const fetchEventsName = async () => {
    const res = await customFetchUtils(API_ROUTES.CATEGORY.type())
    const data = await res.json()

    const eventNamesData =
      data?.map((item: any) => ({
        label: item?.name,
        value: item?.name,
      })) || []

    setEventNames(eventNamesData)
  }

  React.useEffect(() => {
    setIsLoading(true)
    Promise.all([
      fetchPrefecture(),
      fetchEventTypes(),
      fetchEventsName(),
    ]).finally(() => {
      setIsLoading(false)
    })
  }, [])

  return (
    <>
      <LoadingView spinning={isLoading} />
      <ListRecruitmentPage
        form={form}
        handleValuesChange={handleValuesChange}
        handleChangePage={handleChangePage}
        recruitmentList={recruitmentList}
        prefectures={prefectures}
        eventTypes={eventTypes}
        eventNames={eventNames}
        pagination={pagination}
        isLoadingTable={isLoadingTable}
        recruitmentStatus={recruitmentStatus}
      />
    </>
  )
}

export default ListRecruitmentFeature
