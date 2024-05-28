'use client'

import { Select, SelectProps, Spin } from 'antd'
import React from 'react'
import { AiFillCaretDown } from 'react-icons/ai'

import { API_ROUTES, HTTP_METHOD } from '@/constants/common'
import { convertUrlSearchParams } from '@/utils/common'

import useLoadMore from './useLoadmore'

const OrganizationSelect = (props: SelectProps) => {
  const [keywordOrganizations, setKeywordOrganizations] = React.useState('')
  const [pageOrganizations, setPageOrganizations] = React.useState(1)

  const handleFetchOrganization = async (keyword: string, page: number) => {
    const urlSearchParams = convertUrlSearchParams(
      { keyword, page, perPage: 20 } || {},
    )

    const res = await fetch(
      `${API_ROUTES.ORGANIZATION.list}?${urlSearchParams || ''}`,
      {
        method: HTTP_METHOD.GET,
      },
    )
    const response = await res.json()
    return response.data
  }

  const {
    data: organization,
    hasMore,
    loading,
  } = useLoadMore(
    keywordOrganizations,
    pageOrganizations,
    handleFetchOrganization,
  )

  const observer = React.useRef<any>()

  const lastElementRef = React.useCallback(
    (node: any) => {
      if (loading) return
      if (observer.current) observer.current.disconnect()
      observer.current = new IntersectionObserver((entries) => {
        if (entries[0].isIntersecting && hasMore) {
          setPageOrganizations((prevPage) => prevPage + 1)
        }
      })
      if (node) observer.current.observe(node)
    },
    [loading, hasMore],
  )

  React.useEffect(() => {
    setPageOrganizations(1)
  }, [keywordOrganizations])

  return (
    <Select
      showSearch
      suffixIcon={<AiFillCaretDown className="text-gray-black" />}
      optionLabelProp="label"
      onSearch={(value) => setKeywordOrganizations(value)}
      loading
      {...props}
    >
      {organization?.map((org, index) => (
        <>
          {organization.length === index + 1 ? (
            <Select.Option key={org.id} value={org.name}>
              <span ref={lastElementRef}>{org.name}</span>
            </Select.Option>
          ) : (
            <Select.Option key={org.id} value={org.name}>
              {org.name}
            </Select.Option>
          )}
        </>
      ))}
      {loading ? (
        <Select.Option value="loading" disabled className="text-center">
          <Spin spinning={loading} />
        </Select.Option>
      ) : (
        <></>
      )}
    </Select>
  )
}

export default OrganizationSelect
