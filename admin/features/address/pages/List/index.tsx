'use client'

import LoadingView from '@/components/LoadingView'
import {
  API_ROUTES,
  DEFAULT_PAGE_SIZE,
  HTTP_METHOD,
  MAX_PAGE_SIZE,
} from '@/constants/common'
import { PaginationInfo } from '@/constants/model'
import {
  convertUrlSearchParams,
  customFetchUtils,
  fetchAreaOption,
  fetchPrefecture,
} from '@/utils/common'
import { Form } from 'antd'
import React from 'react'
import ListAddressPage from '../../components/ListAddressPage'
import * as lodash from 'lodash'
import { ErrorValidation } from '@/constants/error'
import PATH from '@/constants/path'
import { useRouter } from 'next/navigation'

const ListAddressFeature = () => {
  const router = useRouter()
  const [form] = Form.useForm()
  const [addressList, setAddressList] = React.useState<any[]>([])
  const [prefectureOption, setPrefectureOption] = React.useState<any[]>([])
  const [areaOption, setAreaOption] = React.useState<any[]>([])
  const [pagination, setPagination] = React.useState<PaginationInfo>({})
  const [isLoading, setIsLoading] = React.useState<boolean>(false)
  const [isLoadingTable, setIsLoadingTable] = React.useState<boolean>(false)
  const [isFetchingArea, setIsFetchingArea] = React.useState<boolean>(false)

  const fetchArea = async (prefecture?: string) => {
    setIsFetchingArea(true)
    try {
      const areaOption = await fetchAreaOption(prefecture)
      setAreaOption(areaOption)
    } catch (error) {
      console.log(error)
    }
    setIsFetchingArea(false)
  }

  const handleFetchData = async (params?: { [key: string]: any }) => {
    setIsLoadingTable(true)
    const urlSearchParams = convertUrlSearchParams(params || {})

    try {
      const res: any = await customFetchUtils(
        `${API_ROUTES.ADDRESS.list}?${urlSearchParams || ''}`,
      )

      const response = await res.json()

      if (!res.ok) {
        if (res.status === ErrorValidation.UNAUTHORIZED.code) {
          router.push(PATH.auth.login)
        }
        throw response
      }

      setAddressList(response.data)
      setPagination(response.pagination)
    } catch (error) {
      console.log(error)
    }
    setIsLoadingTable(false)
  }

  const handleDebounceFetchData = React.useCallback(
    lodash.debounce(handleFetchData, 500),
    [],
  )

  const transformAddressesValues = (values: any) => {
    let prefecture = values?.prefecture
    let area = values?.area

    prefecture = prefectureOption.find(
      (item) => item.value === values.prefecture,
    )?.value

    area = areaOption.find((item) => item.value === values.area)?.value

    return {
      ...values,
      prefecture,
      area,
    }
  }

  const handleChangePage = async (page: number, perPage: number) => {
    const values = form.getFieldsValue()
    await handleFetchData({
      ...transformAddressesValues(values),
      page,
      perPage,
    })
  }

  const handleValuesChange = async (changedValues: any, values: any) => {
    if (changedValues?.hasOwnProperty('prefecture')) {
      form.resetFields(['area'])
      delete values.area
      fetchArea(changedValues.prefecture)
    }

    handleDebounceFetchData({
      ...transformAddressesValues(values),
      page: 1,
      perPage: DEFAULT_PAGE_SIZE,
    })
  }

  React.useEffect(() => {
    setIsLoading(true)
    Promise.all([
      handleFetchData(),
      fetchPrefecture(setPrefectureOption),
      fetchArea(),
    ]).then(() => {
      setIsLoading(false)
    })
  }, [])

  // const prefectureOptionList = prefectureOption.map((item) => ({
  //   value: item.label,
  //   label: item?.label,
  // }))

  // console.log('prefectureOptionList', prefectureOptionList)

  return (
    <>
      <LoadingView spinning={isLoading} />
      <ListAddressPage
        form={form}
        prefectureOption={prefectureOption}
        areaOption={areaOption}
        handleValuesChange={handleValuesChange}
        handleChangePage={handleChangePage}
        addressList={addressList}
        pagination={pagination}
        isLoadingTable={isLoadingTable}
        isFetchingArea={isFetchingArea}
      />
    </>
  )
}

export default ListAddressFeature
