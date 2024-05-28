'use client'

import LoadingView from '@/components/LoadingView'
import { API_ROUTES, DEBOUNCE_TIME, HTTP_METHOD } from '@/constants/common'
import { City, PaginationInfo } from '@/constants/model'
import { convertUrlSearchParams, customFetchUtils } from '@/utils/common'
import { CheckboxOptionType, Form } from 'antd'
import * as lodash from 'lodash'
import React from 'react'
import ListNotificationPage from '../../components/ListNotificationPage'
import { ErrorValidation } from '@/constants/error'
import PATH from '@/constants/path'
import { useRouter } from 'next/navigation'

const ListNotificationFeature = () => {
  const [form] = Form.useForm()
  const router = useRouter()
  const [notificationList, setNotificationList] = React.useState<any[]>([])
  const [prefectures, setPrefectures] = React.useState<CheckboxOptionType[]>([])
  const [pagination, setPagination] = React.useState<PaginationInfo>({})
  const [isLoading, setIsLoading] = React.useState<boolean>(false)
  const [isLoadingTable, setIsLoadingTable] = React.useState<boolean>(false)
  const [citiesOptions, setCitiesOptions] = React.useState<any[]>([])

  const handleFetchData = async (params?: { [key: string]: any }) => {
    setIsLoadingTable(true)

    const urlSearchParams = convertUrlSearchParams(params || {})

    try {
      const res = await customFetchUtils(
        `${API_ROUTES.NOTIFICATION.list}?${urlSearchParams || ''}`,
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

      setNotificationList(response.data)
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

  const handleFetchCities = async () => {
    try {
      const res = await customFetchUtils(API_ROUTES.ADDRESS.cities)
      const data: City[] | undefined = await res.json()

      const options =
        data?.map((item) => ({
          label: item?.city,
          value: item?.id,
          ...item,
        })) || []

      setCitiesOptions(options)
    } catch (error) {
      console.log(error)
    }
  }

  const handleChangePage = async (page: number, perPage: number) => {
    const values = form.getFieldsValue()
    await handleFetchData({ ...values, page, perPage })
  }

  const handleValuesChange = (changedValues: any, values: any) => {
    handleDebounceFetchData(values)
  }

  React.useEffect(() => {
    Promise.all([
      handleFetchData(),
      handleFetchPrefecture(),
      handleFetchCities(),
    ]).then(() => {
      setIsLoading(false)
    })
  }, [])

  return (
    <>
      <LoadingView spinning={isLoading} />
      <ListNotificationPage
        form={form}
        handleValuesChange={handleValuesChange}
        handleChangePage={handleChangePage}
        prefectures={prefectures}
        notificationList={notificationList}
        pagination={pagination}
        isLoadingTable={isLoadingTable}
        citiesOptions={citiesOptions}
      />
    </>
  )
}

export default ListNotificationFeature
