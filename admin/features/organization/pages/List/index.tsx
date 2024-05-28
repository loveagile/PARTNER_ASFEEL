'use client'

import { API_ROUTES, DEFAULT_PAGE_SIZE, HTTP_METHOD } from '@/constants/common'
import { PaginationInfo, Prefecture } from '@/constants/model'
import ListOrganizationPage from '@/features/organization/components/ListOrganizationPage'
import { convertUrlSearchParams, customFetchUtils } from '@/utils/common'
import React from 'react'
import { Form } from 'antd'
import { useRouter } from 'next/navigation'
import { OrganizationTypes } from '../../model/organization.model'

type ListOrganizationFeatureProps = {
  organizationTypes?: OrganizationTypes[]
  prefectures?: Prefecture[]
}

const ListOrganizationFeature = ({
  organizationTypes = [],
  prefectures = [],
}: ListOrganizationFeatureProps) => {
  const [form] = Form.useForm()
  const router = useRouter()
  const [organizationsList, setOrganizationsList] = React.useState<any[]>([])
  const [pagination, setPagination] = React.useState<PaginationInfo>({})
  const [isLoading, setIsLoading] = React.useState<boolean>(false)

  const handleFetchData = async (params?: { [key: string]: any }) => {
    setIsLoading(true)

    const urlSearchParams = convertUrlSearchParams(params || {})

    try {
      const res = await customFetchUtils(
        `${API_ROUTES.ORGANIZATION.list}?${urlSearchParams || ''}`,
        {
          method: HTTP_METHOD.GET,
        },
      )
      const response = await res.json()

      setOrganizationsList(response.data)
      setPagination(response.pagination)
    } catch (error) {
      console.log(error)
    }
    setIsLoading(false)
  }

  const handleChangePage = async (page: number, perPage: number) => {
    const values = form.getFieldsValue()
    await handleFetchData({ ...values, page, perPage })
  }

  const handleFilter = async (values: any = {}) => {
    handleFetchData({ ...values, page: 1, perPage: DEFAULT_PAGE_SIZE })
  }

  React.useEffect(() => {
    handleFetchData()
  }, [])

  return (
    <ListOrganizationPage
      form={form}
      handleFilter={handleFilter}
      handleChangePage={handleChangePage}
      organizationTypes={organizationTypes}
      prefectures={prefectures}
      organizationsList={organizationsList}
      pagination={pagination}
      isLoading={isLoading}
    />
  )
}

export default ListOrganizationFeature
