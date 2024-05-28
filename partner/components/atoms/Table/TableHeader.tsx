import React from 'react'

interface TableHeaderProps {
  column: {
    key: string
    title: string
    sortable?: boolean
  }
  sortColumn: string | null
  sortDirection: 'asc' | 'desc'
  handleSort: (columnKey: string) => void
}

const TableHeader: React.FC<TableHeaderProps> = ({ column, sortColumn, sortDirection, handleSort }) => {
  const isSortable = column.sortable !== undefined ? column.sortable : true
  const isSorted = sortColumn === column.key
  const isAscending = sortDirection === 'asc'

  const handleClick = () => {
    if (isSortable) {
      handleSort(column.key)
    }
  }

  return (
    <div
      className={`flex items-center px-3 py-4 text-timestamp text-gray-gray_dark ${isSortable ? 'cursor-pointer' : ''}`}
      onClick={handleClick}
    >
      <span>{column.title}</span>
      {isSortable && (
        <img
          className="ml-[9px]"
          width={8}
          src={
            isSorted
              ? isAscending
                ? '/images/icons/sort-asc.png'
                : '/images/icons/sort-desc.png'
              : '/images/icons/sort.svg'
          }
          alt=""
        />
      )}
    </div>
  )
}

export default TableHeader
