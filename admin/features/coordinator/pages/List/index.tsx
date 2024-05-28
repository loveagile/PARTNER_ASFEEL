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
  fetchParentOrganization,
  fetchPrefecture,
} from '@/utils/common'
import React from 'react'
import ListCoordinatorPage from '../../components/ListCoordinatorPage'
import { ListCoordinatorsResponse } from '../../model/coordinator.model'
import { DefaultOptionType } from 'antd/es/select'
import { Form } from 'antd'
import { ErrorValidation } from '@/constants/error'
import PATH from '@/constants/path'
import { useRouter } from 'next/navigation'

const ListCoordinatorFeature = () => {
  const router = useRouter()
  const [form] = Form.useForm()
  const prefectures = Form.useWatch('prefectures', form)
  const [cityOption, setCityOption] = React.useState<DefaultOptionType[]>([])
  const [prefectureOption, setPrefectureOption] = React.useState<
    DefaultOptionType[]
  >([])
  const [coordinatorList, setCoordinatorList] = React.useState<any[]>([])
  const [organizationTypeOption, setOrganizationTypeOption] = React.useState<
    any[]
  >([])
  const [parentOption, setParentOption] = React.useState<any[]>([])
  const [pagination, setPagination] = React.useState<PaginationInfo>({})
  const [isLoading, setIsLoading] = React.useState<boolean>(false)
  const [isLoadingTable, setIsLoadingTable] = React.useState<boolean>(false)

  const fetchOrganizationType = async () => {
    setIsLoading(true)
    try {
      const res = await customFetchUtils(API_ROUTES.ORGANIZATION.type)
      const data = await res.json()

      setOrganizationTypeOption(
        data?.map((item: any) => ({
          label: item?.name,
          value: item?.id,
        })) || [],
      )
    } catch (error) {
      console.log(error)
    }
    setIsLoading(false)
  }

  const fetchParent = async () => {
    try {
      const parentOption = await fetchParentOrganization()
      setParentOption(parentOption)
    } catch (error) {
      console.log(error)
    }
  }

  const fetchCities = async (prefectures?: string[]) => {
    try {
      const params = convertUrlSearchParams({ prefectures })
      const res = await customFetchUtils(
        `${API_ROUTES.ADDRESS.cities}?${params}`,
      )
      const data = await res.json()

      setCityOption(
        data?.map((item: any) => ({
          label: item?.city,
          value: item?.id,
        })) || [],
      )
    } catch (error) {
      console.log(error)
    }
  }

  const handleFetchData = async (params?: { [key: string]: any }) => {
    setIsLoadingTable(true)
    const urlSearchParams = convertUrlSearchParams(params || {})

    try {
      const res = await customFetchUtils(
        `${API_ROUTES.COORDINATOR.list}?${urlSearchParams || ''}`,
        {
          method: HTTP_METHOD.GET,
        },
      )

      const response: ListCoordinatorsResponse = await res.json()

      if (!res.ok) {
        if (res.status === ErrorValidation.UNAUTHORIZED.code) {
          router.push(PATH.auth.login)
        }
        throw response
      }

      setCoordinatorList(response.data)
      setPagination(response.pagination)
    } catch (error) {
      console.log(error)
    }
    setIsLoadingTable(false)
  }

  const handleChangePage = async (page: number, perPage: number) => {
    const values = form.getFieldsValue()
    await handleFetchData({ ...values, page, perPage })
  }

  const handleFilter = async (values: any = {}) => {
    handleFetchData({ ...values, page: 1, perPage: DEFAULT_PAGE_SIZE })
  }

  React.useEffect(() => {
    setCityOption([])
    fetchCities(prefectures)
  }, [prefectures])

  React.useEffect(() => {
    setIsLoading(true)
    Promise.all([
      handleFetchData(),
      fetchOrganizationType(),
      fetchParent(),
      fetchPrefecture(setPrefectureOption),
    ]).then(() => {
      setIsLoading(false)
    })
  }, [])

  return (
    <>
      <LoadingView spinning={isLoading} />
      <ListCoordinatorPage
        form={form}
        handleFilter={handleFilter}
        handleChangePage={handleChangePage}
        coordinatorList={coordinatorList}
        pagination={pagination}
        organizationTypeOption={organizationTypeOption}
        parentOption={parentOption}
        cityOption={cityOption}
        prefectureOption={prefectureOption}
        isLoadingTable={isLoadingTable}
      />
    </>
  )
}

export default ListCoordinatorFeature
