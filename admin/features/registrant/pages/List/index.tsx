'use client'

import { useRouter } from 'next/navigation'
import React from 'react'
import { Form } from 'antd'
import * as lodash from 'lodash'

import LoadingView from '@/components/LoadingView'
import { ClubType, PaginationInfo, Prefecture } from '@/constants/model'
import { ErrorValidation } from '@/constants/error'
import {
  API_ROUTES,
  DEBOUNCE_TIME,
  DEFAULT_PAGE_SIZE,
  HTTP_METHOD,
} from '@/constants/common'
import PATH from '@/constants/path'
import { convertUrlSearchParams } from '@/utils/common'

import ListRegistrantPage from '../../components/ListRegistrantPage'
import {
  ListRegistrantsResponse,
  Registrant,
} from '../../models/registrant.model'

interface ListRegistrantFeatureProps {
  clubTypes: ClubType[]
  prefectures: Prefecture[]
}

const ListRegistrantFeature = ({
  clubTypes,
  prefectures,
}: ListRegistrantFeatureProps) => {
  const router = useRouter()
  const [form] = Form.useForm()
  const [registrantList, setRegistrantList] = React.useState<Registrant[]>([])
  const [pagination, setPagination] = React.useState<PaginationInfo>({})
  const [isLoading, setIsLoading] = React.useState<boolean>(false)
  const [isLoadingTable, setIsLoadingTable] = React.useState<boolean>(false)

  const handleFetchData = async (params?: { [key: string]: any }) => {
    try {
      setIsLoadingTable(true)
      const urlSearchParams = convertUrlSearchParams(params || {})

      const res = await fetch(
        `${API_ROUTES.REGISTRANT.list}?${urlSearchParams || ''}`,
        {
          method: HTTP_METHOD.GET,
        },
      )

      const response: ListRegistrantsResponse = await res.json()

      if (!res.ok) {
        if (res.status === ErrorValidation.UNAUTHORIZED.code) {
          router.push(PATH.auth.login)
        }
        throw response
      }

      setRegistrantList(response.data)
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
    await handleFetchData({ ...values, page, perPage })
  }

  const handleValuesChange = async (changedValues: any, values: any = {}) => {
    handleDebounceFetchData({ ...values, page: 1, perPage: DEFAULT_PAGE_SIZE })
  }

  React.useEffect(() => {
    Promise.all([handleFetchData()]).then(() => {
      setIsLoading(false)
    })
  }, [])

  return (
    <>
      <LoadingView spinning={isLoading} />
      <ListRegistrantPage
        form={form}
        registrantList={registrantList}
        pagination={pagination}
        isLoadingTable={isLoadingTable}
        handleValuesChange={handleValuesChange}
        handleChangePage={handleChangePage}
        clubTypes={clubTypes}
        prefectures={prefectures}
      />
    </>
  )
}

export default ListRegistrantFeature
