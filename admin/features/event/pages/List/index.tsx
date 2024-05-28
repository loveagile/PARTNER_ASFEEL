'use client'

import {
  API_ROUTES,
  DEBOUNCE_TIME,
  DEFAULT_PAGE_SIZE,
  COMMON_STATUS,
} from '@/constants/common'
import ListEventPage from '@/features/event/components/ListEventPage'
import React from 'react'
import { usePathname } from 'next/navigation'
import PATH from '@/constants/path'
import { convertUrlSearchParams, customFetchUtils } from '@/utils/common'
import { PaginationInfo } from '@/constants/model'
import { Form } from 'antd'
import * as lodash from 'lodash'
import LoadingView from '@/components/LoadingView'

const ListEventFeature = () => {
  const pathName = usePathname()
  const [form] = Form.useForm()
  const [eventList, setEventList] = React.useState<any[]>([])
  const [pagination, setPagination] = React.useState<PaginationInfo>({})
  const [prefectures, setPrefectures] = React.useState<any[]>([])
  const [isLoading, setIsLoading] = React.useState<boolean>(false)
  const [isLoadingTable, setIsLoadingTable] = React.useState<boolean>(false)

  const eventStatus = React.useMemo(() => {
    switch (pathName) {
      case PATH.event.list.prepare:
        return COMMON_STATUS.IN_PREPARATION
      case PATH.event.list.public:
        return COMMON_STATUS.IN_PUBLIC
      default:
        return COMMON_STATUS.FINISH
    }
  }, [pathName])

  const handleFetchData = async (searchParams?: { [key: string]: any }) => {
    setIsLoadingTable(true)

    const params = {
      ...searchParams,
      status: eventStatus,
    }

    const urlSearchParams = convertUrlSearchParams(params)

    const res = await customFetchUtils(
      `${API_ROUTES.EVENT.list}?${urlSearchParams || ''}`,
    )

    const response = await res.json()

    if (!res.ok) {
      throw response
    }

    setEventList(response.data)
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

  React.useEffect(() => {
    setIsLoading(true)
    Promise.all([fetchPrefecture()]).finally(() => {
      setIsLoading(false)
    })
  }, [])

  return (
    <>
      <LoadingView spinning={isLoading} />
      <ListEventPage
        form={form}
        handleValuesChange={handleValuesChange}
        handleChangePage={handleChangePage}
        eventList={eventList}
        prefectures={prefectures}
        pagination={pagination}
        isLoadingTable={isLoadingTable}
        eventStatus={eventStatus}
      />
    </>
  )
}

export default ListEventFeature
