'use client'

import LoadingView from '@/components/LoadingView'
import {
  API_ROUTES,
  DEBOUNCE_TIME,
  DEFAULT_PAGE_SIZE,
  HTTP_METHOD,
  MAX_PAGE_SIZE,
} from '@/constants/common'
import { PaginationInfo } from '@/constants/model'
import { convertUrlSearchParams, customFetchUtils } from '@/utils/common'
import { Form } from 'antd'
import * as lodash from 'lodash'
import React from 'react'
import ListCategoryPage from '../../components/ListCategoryPage'
import { ErrorValidation } from '@/constants/error'
import PATH from '@/constants/path'
import { useRouter } from 'next/navigation'

const ListCategoryFeature = () => {
  const router = useRouter()
  const [form] = Form.useForm()
  const [categoryList, setCategoryList] = React.useState<any[]>([])
  const [largeCategory, setLargeCategory] = React.useState<any[]>([])
  const mediumCategoryRef = React.useRef<any[]>([])
  const [mediumCategory, setMediumCategory] = React.useState<any[]>([])
  const [nameCategory, setNameCategory] = React.useState<any[]>([])

  const [pagination, setPagination] = React.useState<PaginationInfo>({})
  const [isLoading, setIsLoading] = React.useState<boolean>(false)
  const [isLoadingTable, setIsLoadingTable] = React.useState<boolean>(false)
  const [isLoadingName, setIsLoadingName] = React.useState<boolean>(false)

  const fetchListData = async (params?: { [key: string]: any }) => {
    const urlSearchParams = convertUrlSearchParams(params || {})
    const res = await customFetchUtils(
      `${API_ROUTES.CATEGORY.list}?${urlSearchParams || ''}`,
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

    return response
  }

  const handleFetchData = async (params?: { [key: string]: any }) => {
    setIsLoadingTable(true)

    try {
      const response = await fetchListData(params)
      setCategoryList(response.data)
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

  const handleFetchCategory = async (
    type: 'large' | 'medium',
    callBack: (value: any) => void,
  ) => {
    try {
      const res = await customFetchUtils(API_ROUTES.CATEGORY.type(type))
      const data = await res.json()
      callBack(data || [])
    } catch (error) {
      console.log(error)
    }
  }

  const fetchNameCategory = async (largeData?: string, mediumData?: string) => {
    setIsLoadingName(true)
    setNameCategory([])
    try {
      const data = await fetchListData({
        mediumCategory: mediumData,
        largeCategory: largeData,
        perPage: MAX_PAGE_SIZE,
      })

      setNameCategory(data.data || [])
    } catch (error) {
      console.log(error)
    }
    setIsLoadingName(false)
  }

  const handleChangePage = async (page: number, perPage: number) => {
    const values = form.getFieldsValue()
    await handleFetchData({ ...values, page, perPage })
  }

  const handleValuesChange = async (changedValues: any, values: any) => {
    if (changedValues?.hasOwnProperty('largeCategory')) {
      form.resetFields(['mediumCategory'])
      delete values.mediumCategory

      const data = changedValues?.largeCategory?.length
        ? mediumCategoryRef.current.filter(
            (item) =>
              changedValues?.largeCategory?.includes(item?.largeCategory),
          )
        : mediumCategoryRef.current

      setMediumCategory(data)
    }

    if (
      changedValues?.hasOwnProperty('largeCategory') ||
      changedValues?.hasOwnProperty('mediumCategory')
    ) {
      delete values.name
      form.resetFields(['name'])
      fetchNameCategory(values?.largeCategory, values?.mediumCategory)
    }

    handleDebounceFetchData({ ...values, page: 1, perPage: DEFAULT_PAGE_SIZE })
  }

  React.useEffect(() => {
    setIsLoading(true)
    Promise.all([
      handleFetchData(),
      handleFetchCategory('large', setLargeCategory),
      handleFetchCategory('medium', (value) => {
        mediumCategoryRef.current = value
        setMediumCategory(value)
      }),
      fetchNameCategory(),
    ]).then(() => {
      setIsLoading(false)
    })
  }, [])

  const largeCategoryOption = largeCategory.map((item) => ({
    label: item?.name,
    value: item?.id,
  }))

  const mediumCategoryOption = mediumCategory.map((item) => ({
    label: item?.name,
    value: item?.id,
  }))

  const nameCategoryOption = nameCategory.map((item) => ({
    label: item?.name,
    value: item?.id,
  }))

  return (
    <>
      <LoadingView spinning={isLoading} />
      <ListCategoryPage
        form={form}
        handleValuesChange={handleValuesChange}
        handleChangePage={handleChangePage}
        largeCategory={largeCategoryOption}
        mediumCategory={mediumCategoryOption}
        nameCategory={nameCategoryOption}
        categoryList={categoryList}
        pagination={pagination}
        isLoadingTable={isLoadingTable}
        isLoadingName={isLoadingName}
      />
    </>
  )
}

export default ListCategoryFeature
