import { API_ROUTES, HTTP_METHOD } from '@/constants/common'
import { convertUrlSearchParams } from '@/utils/common'
import {
  Input,
  InputProps,
  List,
  Modal,
  ModalProps,
  Typography,
  Select,
} from 'antd'
import { useState, useRef, useCallback, useEffect } from 'react'
import { AiFillCaretDown, AiOutlineSearch } from 'react-icons/ai'
import useLoadMore from './useLoadmore'

type PrefectureModalProps = InputProps & {
  modalProps?: ModalProps
  prefecture?: any[]
}

const ModalOrganizationSelect = ({
  prefecture = [],
  modalProps,
  value,
  onChange,
  ...rest
}: PrefectureModalProps) => {
  const [isOpenPrefectureInput, setIsOpenPrefectureInput] = useState(false)
  const [keywordOrganizations, setKeywordOrganizations] = useState('')
  const [keywordPrefecture, setKeywordPrefecture] = useState(undefined)
  const [pageOrganizations, setPageOrganizations] = useState(1)

  const handleFetchOrganization = async (
    keyword: string,
    page: number,
    selectPrefecture: string,
  ) => {
    const urlSearchParams = convertUrlSearchParams(
      { keyword, page, perPage: 20, prefecture: selectPrefecture } || {},
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
    keywordPrefecture,
  )

  const observer = useRef<any>()

  const lastElementRef = useCallback(
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

  const handleSelect = (value: any) => {
    onChange?.(value)
    setIsOpenPrefectureInput(false)
  }

  useEffect(() => {
    setPageOrganizations(1)
  }, [keywordOrganizations, keywordPrefecture])

  return (
    <>
      <span
        className="cursor-pointer"
        onClick={() => setIsOpenPrefectureInput(true)}
      >
        <Input
          value={value}
          suffix={<AiFillCaretDown className="text-gray-black" />}
          placeholder="都道府県を選択"
          classNames={{
            input: 'cursor-pointer caret-transparent',
          }}
          {...rest}
        />
      </span>
      <Modal
        closeIcon={null}
        footer={null}
        {...modalProps}
        open={isOpenPrefectureInput}
        onCancel={() => setIsOpenPrefectureInput(false)}
        className="custom_modal !w-full !max-w-[32.5rem]"
      >
        <Typography.Title level={3} className="text-center">
          都道府県検索
        </Typography.Title>
        <Select
          options={prefecture}
          suffixIcon={<AiFillCaretDown className="text-gray-black" />}
          className="mb-4 w-full"
          onChange={(value) => setKeywordPrefecture(value)}
          allowClear
        />

        <Input
          prefix={<AiOutlineSearch color="#AFAFAF" />}
          placeholder="検索"
          className="prefecture_modal_input rounded-none border-x-0 !border-e-0 bg-gray-gray_lighter px-5"
          onChange={(value) => setKeywordOrganizations(value.target.value)}
        />
        <List
          loading={loading}
          className="list_modal_prefecture h-60 overflow-auto border-b pl-5 pr-1"
          dataSource={organization}
          renderItem={(item, index) => {
            return organization.length === index + 1 ? (
              <span
                onClick={() => handleSelect(item.name)}
                className="block cursor-pointer border-b border-gray-gray py-[10px]"
                ref={lastElementRef}
              >
                {item.name}
              </span>
            ) : (
              <span
                onClick={() => handleSelect(item.name)}
                className="block cursor-pointer border-b border-gray-gray py-[10px]"
              >
                {item.name}
              </span>
            )
          }}
        />
      </Modal>
    </>
  )
}

export default ModalOrganizationSelect
