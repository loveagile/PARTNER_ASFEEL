'use client'
import { DEFAULT_PAGE_SIZE } from '@/constants/common'
import ChevronRight from '@/public/images/icons/chevron-right.svg'
import { Button, TablePaginationConfig, Typography } from 'antd'
import { useEffect } from 'react'

const MIN_CURRENT_PAGE = 1

const CustomPagination = ({
  current,
  pageSize,
  total,
  onChange,
  className,
  style,
}: TablePaginationConfig) => {
  const handleChangePage = (page: number) => {
    if (onChange) {
      onChange(page, pageSize || DEFAULT_PAGE_SIZE)
    }
  }

  let prevPage = MIN_CURRENT_PAGE
  let nextPage = MIN_CURRENT_PAGE
  let lastItemPage = MIN_CURRENT_PAGE
  let firstItemPage = MIN_CURRENT_PAGE

  if (current && pageSize && total) {
    prevPage = current > MIN_CURRENT_PAGE ? current - 1 : MIN_CURRENT_PAGE
    nextPage = current < total ? current + 1 : total
    lastItemPage = current * pageSize > total ? total : current * pageSize
    firstItemPage = (current - 1) * pageSize + 1
  }

  const isDisabledPrev = current === MIN_CURRENT_PAGE
  const isDisabledNext = lastItemPage === total

  useEffect(() => {
    handleChangePage(MIN_CURRENT_PAGE)
  }, [])

  return (
    !!total && (
      <div
        style={style}
        className={`flex items-center justify-end ${className}`}
      >
        <Typography.Text className="mr-5 text-small">
          {firstItemPage}-{lastItemPage}/{total}
        </Typography.Text>
        <div className="btn-pagination-wrapper">
          <Button
            type="link"
            disabled={isDisabledPrev}
            onClick={() => handleChangePage(prevPage)}
            className="btn-pagination mr-5 p-0 text-gray-black"
          >
            <ChevronRight width={18} height={18} className="rotate-180" />
          </Button>
          <Button
            type="link"
            disabled={isDisabledNext}
            onClick={() => handleChangePage(nextPage)}
            className="p-0 text-gray-black"
          >
            <ChevronRight width={18} height={18} />
          </Button>
        </div>
      </div>
    )
  )
}

export default CustomPagination
