'use client'

import { Dropdown } from 'antd'
import Link from 'next/link'
import { MdArrowDropDown } from 'react-icons/md'

type HeaderProps = {
  currentUser: any
  handleLogout: () => void
}

export const Header = ({ currentUser, handleLogout }: HeaderProps) => {
  const system_name = 'スポーツ・カルチャー人材バンク'

  return (
    <header
      id="header"
      className="fixed z-[999] flex w-full flex-row items-center justify-between bg-core-blue_dark px-[10px] py-[22px] text-gray-white pc:px-10 pc:py-[14.5px]"
    >
      <Link href="/" className="text-small hover:text-white pc:text-h1">
        <h1>{system_name}</h1>
      </Link>
      <div className="flex flex-row items-center gap-[10px] text-timestamp pc:gap-5">
        {currentUser && (
          <Dropdown
            menu={{
              className: 'w-[161px] text-center !rounded',
              items: [
                {
                  key: 0,
                  className: '!p-0',
                  label: 'ログアウト',
                  onClick: handleLogout,
                },
              ],
            }}
            placement="bottom"
            trigger={['click']}
          >
            <div className="ml-1 flex flex-row items-center hover:cursor-pointer">
              <span className="text-[20px] pc:text-[12px]">管理者</span>
              <div className="ml-3 hidden pc:block">{currentUser?.nameSei}</div>
              <MdArrowDropDown fontSize={30} />
            </div>
          </Dropdown>
        )}
      </div>
    </header>
  )
}
