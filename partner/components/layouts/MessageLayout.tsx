import { MdArrowBackIos } from 'react-icons/md'
import { DefaultFooter, LoginHeader } from '../organisms'
import { useRouter } from 'next/router'
import { useState } from 'react'
import Link from 'next/link'
import { useAppDispatch, useAppSelector } from '@/store'
import { setStoreIsNavbarOpen } from '@/store/reducers/global'

const MessageDetailHeader = ({
  isMsgDetailPage,
  roomProjectType,
  project,
}: {
  isMsgDetailPage: boolean
  roomProjectType?: string
  project: any
}) => {
  const dispatch = useAppDispatch()
  const { isNavbarOpen } = useAppSelector((state) => state.global)

  const HeaderContent = () => (
    <div className="flex h-[46px] w-full bg-gray-white py-[10px] text-center">
      <MdArrowBackIos className="top-[10px] h-[25px] w-[25px] cursor-pointer text-gray-gray sp:ml-[10px] pc:ml-[30px]" />
      {roomProjectType === 'leader' ? (
        <p className="mx-auto line-clamp-1 self-center text-[14px] font-bold">
          {project?.organizationName} {project?.eventName} {project?.gender}
        </p>
      ) : (
        roomProjectType === 'event' && (
          <p className="mx-auto line-clamp-1 self-center text-[14px] font-bold">
            {project?.title} {project?.subTitle} {project?.gender}
          </p>
        )
      )}
    </div>
  )

  if (!isMsgDetailPage) return null

  return (
    <>
      {isNavbarOpen ? (
        <div className="relative">
          <div
            className="absolute left-0 top-0 h-[46px] w-full bg-black opacity-60"
            onClick={() => {
              dispatch(setStoreIsNavbarOpen(false))
            }}
          ></div>
          <HeaderContent />
        </div>
      ) : (
        <Link href="/messages">
          <HeaderContent />
        </Link>
      )}
    </>
  )
}

export default function MessageLayout({
  children, // will be a page or nested layout
  isFooter,
  roomProjectType,
  project,
}: {
  children: React.ReactNode
  isFooter: boolean
  roomProjectType?: string // /pages/messages/[id].tsxから渡される
  project?: any // /pages/messages/[id].tsxから渡される
}) {
  const router = useRouter()
  const [isMsgDetailPage, setIsMsgDetailPage] = useState(false)
  if (router.pathname.includes('/messages/') && !isMsgDetailPage) {
    setIsMsgDetailPage(true)
  }

  return (
    <div className="flex flex-col">
      <div className="sticky top-0 z-30 bg-white">
        <LoginHeader />
        <MessageDetailHeader isMsgDetailPage={isMsgDetailPage} roomProjectType={roomProjectType} project={project} />
      </div>

      <div className="flex-1 bg-gray-gray_light" style={{ minHeight: `${isFooter ? 'calc(100vh - 136px)' : 'unset'}` }}>
        {children}
      </div>

      {isFooter && <DefaultFooter />}
    </div>
  )
}
