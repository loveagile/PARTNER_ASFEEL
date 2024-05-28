import SortIcon from '@/public/images/icons/sort.svg'
import { Table, TableProps } from 'antd'
import { ColumnsType, TablePaginationConfig } from 'antd/es/table'
import jp from 'antd/lib/locale/ja_JP'
import Overall from '../OverallTable'
import CustomPagination from './CustomPagination'

interface IProps<RecordType> extends TableProps<RecordType> {
  wrapperProps?: React.HTMLAttributes<HTMLDivElement>
  pagination?:
    | false
    | (TablePaginationConfig & {
        isShowOverallTable?: boolean
        allTotal?: number
      })
}

export const getColumns = (columns?: ColumnsType<any>) => {
  if (!columns) return undefined
  return columns.map((column) => ({
    ...column,
    sortIcon: () => {
      return <SortIcon width={16} />
    },
    width: column.width || (1 / columns.length) * 100 + '%',
    render: (value: any, record: any, index: number) => {
      return (
        <div className="line-clamp-2">
          {column.render ? column.render(value, record, index) : value}
        </div>
      )
    },
  }))
}

const CustomTable = ({ wrapperProps, ...props }: IProps<any>) => {
  const columns = getColumns(props.columns)

  const total = (props.pagination && props.pagination.total) || undefined
  const allTotal = (props.pagination && props.pagination.allTotal) || undefined
  const isShowOverallTable =
    (props.pagination && props.pagination.isShowOverallTable) || false

  return (
    <div {...wrapperProps}>
      <div className="mb-5 flex justify-between pl-3 pr-2">
        {isShowOverallTable ? (
          <Overall total={total} allTotal={allTotal} />
        ) : (
          <span />
        )}
        <CustomPagination {...props.pagination} />
      </div>
      <Table
        {...props}
        dataSource={
          props?.dataSource?.map((item, index) => ({
            ...item,
            key: item?.id || index,
          })) || []
        }
        columns={columns as any}
        pagination={false}
        locale={
          props.locale || {
            ...jp.Table,
            emptyText: 'データが見つかりません',
          }
        }
      />
    </div>
  )
}

export default CustomTable
