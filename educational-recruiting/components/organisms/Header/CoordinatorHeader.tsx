import useSystemName from '@/hooks/useSystemName'
import React, { useEffect, useRef, useState } from 'react'
import { MdSupervisorAccount, MdMarkEmailRead, MdHelp, MdArrowDropDown } from 'react-icons/md'

export const CoordinatorHeader = () => {
  const { logo } = useSystemName()

  const [isMenuOpen, setIsMenuOpen] = useState(false)

  const selectRef = useRef<HTMLDivElement>(null)
  const optionsRef = useRef<HTMLDivElement>(null)

  useEffect(() => {
    const handleClickOutside = (event: MouseEvent) => {
      if (
        selectRef.current &&
        !selectRef.current.contains(event.target as Node) &&
        optionsRef.current &&
        !optionsRef.current.contains(event.target as Node)
      ) {
        setIsMenuOpen((prevState) => !prevState)
      }
    }

    document.addEventListener('mousedown', handleClickOutside)

    return () => {
      document.removeEventListener('mousedown', handleClickOutside)
    }
  }, [selectRef])

  return (
    <header
      id="header"
      className="flex flex-row items-center justify-between pc:px-10 px-[10px] pc:py-[14.5px] py-[23.5px] bg-core-blue_dark text-gray-white"
    >
      <a href="#" className="pc:text-h1 text-small">
        <h1>{logo}</h1>
      </a>
      <div className="flex flex-row items-center gap-3 pc:gap-5 text-timestamp">
        <div className="flex flex-row items-center gap-1 hover:cursor-pointer">
          <span className="pc:text-[12px] text-[20px]">
            <MdSupervisorAccount />
          </span>
          <div className="hidden pc:block">アカウント情報</div>
        </div>
        <div className="flex flex-row items-center gap-1 hover:cursor-pointer">
          <span className="pc:text-[12px] text-[20px]">
            <MdMarkEmailRead />
          </span>
          <div className="hidden pc:block">通知メール設定</div>
        </div>
        <div className="flex flex-row items-center gap-1 hover:cursor-pointer">
          <span className="pc:text-[12px] text-[20px]">
            <MdHelp />
          </span>
          <div className="hidden pc:block">ヘルプ</div>
        </div>
        <div className="relative" ref={selectRef}>
          <button
            className="flex flex-row items-center gap-1 hover:cursor-pointer pc:text-body_pc text-mini"
            onClick={() => setIsMenuOpen(!isMenuOpen)}
          >
            <span>千葉県教育委員会</span>
            <span className="hidden pc:block">
              <MdArrowDropDown size={30} />
            </span>
          </button>
          {isMenuOpen && (
            <div className="absolute z-10 w-full mt-3 bg-core-blue_dark text-timestamp" ref={optionsRef}>
              <div className="flex flex-col items-center justify-center h-full gap-3 py-3">
                <div
                  className="flex flex-row items-center gap-1 hover:cursor-pointer"
                  onClick={() => {
                    setIsMenuOpen(false)
                  }}
                >
                  <div>千葉県教育委員会</div>
                </div>
                <div
                  className="flex flex-row items-center gap-1 hover:cursor-pointer"
                  onClick={() => {
                    setIsMenuOpen(false)
                  }}
                >
                  <div>弥生市教育委員会</div>
                </div>
                <div
                  className="flex flex-row items-center gap-1 hover:cursor-pointer"
                  onClick={() => {
                    setIsMenuOpen(false)
                  }}
                >
                  <div>弥生町教育委員会</div>
                </div>
              </div>
            </div>
          )}
        </div>
      </div>
    </header>
  )
}