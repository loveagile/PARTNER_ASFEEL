'use client'

interface TabListProps {
  className?: string
  label: string
  selected?: boolean
  notice?: boolean
}

const TabList: React.FC<TabListProps> = ({
  className = '',
  label,
  selected = false,
  notice = false,
}) => {
  const style = [
    'border-b-[3px] pc:border-b-[4px]',
    selected
      ? ' border-core-blue_dark text-core-blue_dark'
      : 'border-transparent',
    'relative',
    'text-small pc:text-h4',
    'inline-flex justify-center items-center',
    'w-20 pc:w-[100px]',
    'pt-[10px] pb-[6px]',
    'cursor-pointer',
    `${className}`,
  ].join(' ')

  return (
    <div className={style}>
      <div className="relative">
        <span className={selected ? '' : 'opacity-40'}>{label}</span>
        {notice && (
          <span className="absolute right-[-11px] top-0 h-[7px] w-[7px] rounded-full bg-core-red pc:h-[10px] pc:w-[10px]"></span>
        )}
      </div>
    </div>
  )
}

export default TabList
