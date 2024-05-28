import jp from 'antd/lib/locale/ja_JP'
import { Table, TableProps } from 'antd'
import { getColumns } from '../atoms/CustomTable'
import styles from './index.module.scss'

const SubCustomTable = (props: TableProps<any>) => {
  const columns = getColumns(props.columns)

  const currentPage = (props.pagination && props.pagination.current) || 1
  const total = (props.pagination && props.pagination.total) || ''

  return (
    <Table
      columns={columns}
      footer={() => <span>{`${currentPage}ページ目(全${total}件)`}</span>}
      {...props}
      pagination={{
        position: ['bottomCenter'],
        ...props.pagination,
        showLessItems: true,
        showSizeChanger: false,
        className: styles.pagination_table,
      }}
      className={`${props.className} ${styles.table}`}
      locale={
        props.locale || {
          ...jp.Table,
          emptyText: 'データが見つかりません',
        }
      }
    />
  )
}

export default SubCustomTable
