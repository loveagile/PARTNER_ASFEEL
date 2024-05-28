'use client'

import CustomTable from '@/components/atoms/CustomTable'
import { DEFAULT_PAGE_SIZE } from '@/constants/common'
import { PaginationInfo, Prefecture } from '@/constants/model'
import { OrganizationTypes } from '../../model/organization.model'
import { columns } from './Column'
import Filter from './Filter'
import { FormInstance } from 'antd'

type ListOrganizationPageProps = {
  form: FormInstance<any>
  organizationsList: any[]
  isLoading?: boolean
  handleFilter: (values: any) => void
  handleChangePage: (page: number, perPage: number) => void
  organizationTypes?: OrganizationTypes[]
  prefectures?: Prefecture[]
  pagination?: PaginationInfo
}

const ListOrganizationPage = ({
  form,
  organizationTypes = [],
  prefectures = [],
  organizationsList = [],
  isLoading = false,
  handleFilter,
  handleChangePage,
  pagination,
}: ListOrganizationPageProps) => {
  return (
    <div>
      <Filter
        form={form}
        organizationTypes={organizationTypes}
        prefectures={prefectures}
        handleFilter={handleFilter}
      />
      <CustomTable
        dataSource={organizationsList}
        columns={columns()}
        scroll={{ x: 1200 }}
        loading={isLoading}
        pagination={{
          onChange: handleChangePage,
          current: pagination?.page || 1,
          pageSize: DEFAULT_PAGE_SIZE,
          total: pagination?.total || 0,
          allTotal: pagination?.allTotal || 0,
          isShowOverallTable: true,
        }}
      />
    </div>
  )
}

export default ListOrganizationPage
