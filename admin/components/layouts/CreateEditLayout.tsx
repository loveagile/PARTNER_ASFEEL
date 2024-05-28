'use client'

import useModal from '@/hooks/useModal'
import CopyrightIcon from '@/public/images/icons/copyright.svg'
import { Button, Layout, LayoutProps, ModalFuncProps } from 'antd'
import { useRouter } from 'next/navigation'
import { AiOutlineArrowLeft } from 'react-icons/ai'
import React from 'react'

type CreateEditLayoutProps = {
  children: React.ReactNode
  backLink: string
  backModalProps?: ModalFuncProps
  layoutProps?: LayoutProps
}

const CreateEditLayout = ({
  children,
  backLink,
  backModalProps,
  layoutProps,
}: CreateEditLayoutProps) => {
  const router = useRouter()
  const { showConfirm } = useModal()

  const handleNavigate = () => {
    showConfirm({
      onOk: () => router.push(backLink),
      ...backModalProps,
    })
  }

  // React.useEffect(() => {
  //   const isAuthenticated = localStorage.getItem('token')
  //   if (!isAuthenticated) {
  //     redirect(PATH.login)
  //   }
  // }, [])

  return (
    <Layout
      {...layoutProps}
      className={`relative h-full p-8 ${layoutProps?.className}`}
    >
      <Layout.Content>
        <Button
          onClick={handleNavigate}
          className="absolute left-3 top-3 flex h-5 w-5 items-center justify-center rounded-full border-0 bg-gray-gray p-0 xl:left-auto xl:top-8 xl:h-8 xl:w-8"
        >
          <AiOutlineArrowLeft color="#fff" fontSize={18} />
        </Button>
        <div className="flex justify-center ">
          <div className="w-full xl:w-3/4">{children}</div>
        </div>
      </Layout.Content>
      <Layout.Footer className="bg-transparent">
        <div className="flex justify-center text-timestamp">
          <CopyrightIcon width={14} />
          <span className="ml-1">ASFEEL Inc.All Right Reserved.</span>
        </div>
      </Layout.Footer>
    </Layout>
  )
}

export default CreateEditLayout
