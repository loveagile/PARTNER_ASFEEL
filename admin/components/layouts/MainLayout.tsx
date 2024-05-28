'use client'

import { Layout } from 'antd'
import Sidebar from '../organisms/Sidebar'
// import { redirect } from 'next/navigation'
// import PATH from '@/constants/path'
import React from 'react'

export default function MainLayout({
  children,
}: {
  children: React.ReactNode
}) {
  // React.useEffect(() => {
  //   const isAuthenticated = localStorage.getItem('token')
  //   if (!isAuthenticated) {
  //     redirect(PATH.login)
  //   }
  // }, [])

  return (
    <Layout className="h-full" hasSider>
      <Sidebar />
      <Layout.Content className="ml-20 pb-14 pl-10 pr-8 pt-10 lg:ml-48">
        {children}
      </Layout.Content>
    </Layout>
  )
}
