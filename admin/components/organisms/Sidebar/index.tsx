'use client'

import { Grid, Layout, Menu } from 'antd'
import Link from 'next/link'
import { usePathname } from 'next/navigation'
import React from 'react'
import MENU, { MenuItem } from './Menu'

const Label = ({
  label,
  path,
  ...rest
}: { label: string; path?: string } & { [key: string]: any }) => {
  const newLabel = label

  if (path) {
    return (
      <Link href={path} {...rest}>
        {newLabel}
      </Link>
    )
  } else {
    return <span {...rest}>{newLabel}</span>
  }
}

const { useBreakpoint } = Grid

const getMenuItem = (
  item: MenuItem,
  currentPath?: string,
  isChildren?: boolean,
  isColapsed?: boolean,
) => {
  const MenuItemIcon: React.FunctionComponent<any> = item.icon!
  let isActive = false

  if (item.children) {
    isActive = item.children.some((child) => child.path === currentPath)
    return (
      <React.Fragment key={item.label}>
        {isActive && !isColapsed && (
          <span
            key={item.label}
            className="absolute inline-block h-12 border-l-[6px] border-core-blue_dark"
          />
        )}
        <Menu.SubMenu
          key={item.label}
          icon={
            <MenuItemIcon
              className={
                isActive ? 'text-core-blue_dark' : 'text-gray-gray_dark'
              }
            />
          }
          title={
            <Label
              label={item.label}
              className={`${isActive ? 'text-core-blue_dark' : ''} font-bold`}
            />
          }
        >
          {item.children.map((child) =>
            getMenuItem(child, currentPath, true, isColapsed),
          )}
        </Menu.SubMenu>
      </React.Fragment>
    )
  } else {
    isActive = item.path === currentPath

    return (
      <Menu.Item
        key={item.path}
        icon={
          <MenuItemIcon
            isActive={isChildren ? isActive && isChildren : isActive}
          />
        }
        style={{
          paddingInlineEnd: 0,
        }}
        className="font-bold"
      >
        {isActive && !isChildren && !isColapsed && (
          <span
            key={item.path}
            className="absolute left-0 top-0 inline-block h-12 border-l-[6px] border-core-blue_dark"
          />
        )}
        <Label label={item.label} path={item.path} />
      </Menu.Item>
    )
  }
}

const Sidebar = () => {
  const path = usePathname()
  const screens = useBreakpoint()
  const isColapsed = !screens.lg

  return (
    <Layout.Sider
      theme="light"
      className="pt-[10px] drop-shadow-drop_wide"
      breakpoint="lg"
      style={{
        overflow: 'auto',
        height: 'calc(100vh - 64px)',
        position: 'fixed',
        left: 0,
        top: 64,
        bottom: 0,
      }}
    >
      <Menu
        className="menu_wrapper"
        mode="inline"
        expandIcon={<></>}
        defaultOpenKeys={MENU.map((item) => (item?.path ? '' : item.label))}
        selectedKeys={[path]}
      >
        {MENU.map((item) => getMenuItem(item, path, false, isColapsed))}
      </Menu>
    </Layout.Sider>
  )
}

export default Sidebar
