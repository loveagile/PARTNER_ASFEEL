import useSystemName from '@/hooks/useSystemName'
import { MdHelp } from 'react-icons/md'

export const CoordinatorLoginHeader = () => {
  const { systemName } = useSystemName()

  return (
    <header
      id="header"
      className="flex flex-row items-center justify-between bg-core-blue_dark px-[10px] py-[23.5px] text-gray-white pc:px-10 pc:py-[14.5px]"
    >
      <a href="#" className="text-small pc:text-h1">
        <h1>{systemName}</h1>
      </a>
      <div className="flex flex-row items-center gap-5 text-mini pc:text-timestamp">
        <a href="#" className="flex flex-row items-center gap-1 hover:cursor-pointer">
          <span className="text-[20px] pc:text-[12px]">
            <MdHelp />
          </span>
          <div className="hidden pc:block">ヘルプ</div>
        </a>
      </div>
    </header>
  )
}
