import { IconType, SelectNotice, SelectSize, SelectStatus } from '@/components/atoms'
import { CoordinatorHeader, Sidebar, SidebarProps } from '@/components/organisms'
import { useState } from 'react'

export default function CoordinatorLayout({
  children,
  setCurrentPage,
}: {
  children: React.ReactNode
  setCurrentPage?: (href: string) => void
}) {
  const [activeItem, setActiveItem] = useState({
    group: 0,
    item: 1,
    option: -1,
  })
  const groups: SidebarProps = {
    activeItem: activeItem,
    setActiveItem: setActiveItem,
    groups: [
      {
        items: [
          {
            item: {
              text: 'Page 1',
              options: [
                { text: '○○市', href: '/coordinator/example/page1' },
                { text: 'その他', href: '#12' },
                { text: 'その他 : ○○中学校', href: '#13' },
                { text: 'その他 : ○○中学校', href: '#14' },
                { text: 'その他 : ○○中学校', href: '#15' },
                { text: 'その他 : ○○中学校', href: '#16' },
              ],
            },
          },
          {
            item: {
              text: 'Page 2',
              status: SelectStatus.OFF,
              notice: SelectNotice.OFF,
              size: SelectSize.DEFAULT,
              icon: IconType.CAMPAIGN,
              href: '/coordinator/example/page2',
            },
          },
          {
            item: {
              text: 'Page 3',
              status: SelectStatus.OFF,
              notice: SelectNotice.OFF,
              size: SelectSize.DEFAULT,
              icon: IconType.EDIT_NOTE,
              href: '/coordinator/example/page3',
            },
          },
          {
            item: {
              text: 'Main Page',
              status: SelectStatus.OFF,
              notice: SelectNotice.OFF,
              size: SelectSize.DEFAULT,
              icon: IconType.LIBRARY_ADD_CHECK,
              href: '/coordinator/example',
            },
          },
          {
            item: {
              text: '新規募集',
              onclick: () => {
                console.log('click')
              },
            },
          },
        ],
      },
      {
        items: [
          {
            item: {
              text: '登録者',
              status: SelectStatus.OFF,
              notice: SelectNotice.OFF,
              size: SelectSize.DEFAULT,
              icon: IconType.GROUPS,
              href: '#5',
            },
          },
        ],
      },
      {
        items: [
          {
            item: {
              text: 'メッセージ',
              status: SelectStatus.OFF,
              notice: SelectNotice.OFF,
              size: SelectSize.DEFAULT,
              icon: IconType.QUESTION_ANSWER,
              href: '#6',
            },
          },
        ],
      },
    ],
  }

  return (
    <>
      <CoordinatorHeader />
      <div className="flex min-h-[calc(100vh-64px)]">
        <Sidebar
          groups={groups.groups}
          activeItem={activeItem}
          setActiveItem={setActiveItem}
          setCurrentPage={setCurrentPage}
        />
        {children}
      </div>
    </>
  )
}
