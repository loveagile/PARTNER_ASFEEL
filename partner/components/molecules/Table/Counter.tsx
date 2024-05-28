import Counter from '@/components/atoms/Table/Counter'

interface CountersProps {
  className?: string
  recruitCount: number
  adoptCount: number
  selectCount: number
}

const Counters: React.FC<CountersProps> = ({ className = '', recruitCount, adoptCount, selectCount }) => {
  return (
    <div className={`inline-flex items-center rounded bg-gray-gray_light py-1 ${className}`}>
      <Counter className="pl-[10px] pr-4" label="募集" count={recruitCount} />
      <span className="inline-block h-[23px] w-[1px] bg-gray-gray"></span>
      <Counter className="pl-[10px] pr-4" label="採用" count={adoptCount} />
      <span className="inline-block h-[23px] w-[1px] bg-gray-gray"></span>
      <Counter className="pl-[10px] pr-4" label="選考" count={selectCount} />
    </div>
  )
}

export default Counters
