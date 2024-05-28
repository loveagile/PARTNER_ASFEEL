'use client'

import LoadingView from '@/components/LoadingView'
import { API_ROUTES, DEFAULT_PAGE_SIZE, HTTP_METHOD } from '@/constants/common'
import { ErrorValidation } from '@/constants/error'
import { PaginationInfo } from '@/constants/model'
import PATH from '@/constants/path'
import { convertUrlSearchParams } from '@/utils/common'
import { Form } from 'antd'
import { useRouter } from 'next/navigation'
import React from 'react'
import ListAccountPage from '../../components/ListAccountPage'

const ListAccountFeature = () => {
  const router = useRouter()
  const [form] = Form.useForm()
  const [accountList, setAccountList] = React.useState<any[]>([])
  const accountListRef = React.useRef<any[]>([])
  const [pagination, setPagination] = React.useState<PaginationInfo>({})
  const [isLoading, setIsLoading] = React.useState<boolean>(false)
  const [isLoadingTable, setIsLoadingTable] = React.useState<boolean>(false)

  const handleFetchData = async (params?: { [key: string]: any }) => {
    setIsLoadingTable(true)

    const urlSearchParams = convertUrlSearchParams(params || {})

    try {
      const res: any = await fetch(
        `${API_ROUTES.ACCOUNT.list}?${urlSearchParams || ''}`,
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

      accountListRef.current = response.data
      setAccountList(response.data)
      setPagination(response.pagination)
    } catch (error) {
      console.log(error)
    }
    setIsLoadingTable(false)
  }

  const handleChangePage = async (page: number, perPage: number) => {
    //Not use yet
  }

  const handleValuesChange = (changedValues: any, values: any) => {
    let isPublish = [] as any[]
    let keyword = ''
    let role = [] as any[]
    Object.entries(values).forEach(([key, value]) => {
      if (value === undefined || value === null) return

      switch (key) {
        case 'keyword':
          keyword = value as any
          break
        case 'role':
          role = value as any
          break
        case 'isPublish':
          isPublish = value as any
          break
      }
    })

    const data = accountListRef.current.filter((account) => {
      let isMatchKeyword = true
      let isMatchRole = true
      let isMatchIsPublish = true

      if (keyword) {
        isMatchKeyword =
          account?.fullName?.includes(keyword) ||
          account?.email?.includes(keyword) ||
          account?.id?.includes(keyword)
      }

      if (role.length) {
        isMatchRole = role.includes(account.role)
      }

      if (isPublish.length) {
        isMatchIsPublish = isPublish.includes(account.isPublish)
      }

      return isMatchKeyword && isMatchRole && isMatchIsPublish
    })

    setAccountList(data)
    setPagination({
      page: 1,
      perPage: DEFAULT_PAGE_SIZE,
      total: data.length,
      allTotal: accountListRef.current.length,
    })
  }

  React.useEffect(() => {
    handleFetchData()
  }, [])

  return (
    <>
      <LoadingView spinning={isLoading} />
      <ListAccountPage
        form={form}
        handleValuesChange={handleValuesChange}
        handleChangePage={handleChangePage}
        accountList={accountList}
        pagination={pagination}
        isLoadingTable={isLoadingTable}
      />
    </>
  )
}

export default ListAccountFeature
