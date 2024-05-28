import React, { useEffect } from 'react'
import { useView } from '@/hooks'
import { useRouter } from 'next/router'
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome'
import { faCircle } from '@fortawesome/free-solid-svg-icons'
import { useAppDispatch, useAppSelector } from '@/store'
import { Icon } from '@/components/atoms'
import { setStoreIsNavbarOpen } from '@/store/reducers/global'
import HeaderLogo from '@/components/atoms/HeaderLogo'
import { FiMenu } from 'react-icons/fi'
import { EXTERNAL_URLS } from '@/utils/constants/externalUrls'
import { calculateUnreadMessages } from '@/utils/common'

const HelpIcon = () => {
  const dispatch = useAppDispatch()
  return (
    <div
      className="cursor-pointer"
      onClick={() => {
        dispatch(setStoreIsNavbarOpen(false))
        window.open('https://asfeel.notion.site/_-e921b2257c6f491c90d76e2f24e8deda', '_blank')
      }}
    >
      <svg width="26" height="26" viewBox="0 0 26 26" fill="none" xmlns="http://www.w3.org/2000/svg">
        <path
          d="M13.0001 2.16675C7.02008 2.16675 2.16675 7.02008 2.16675 13.0001C2.16675 18.9801 7.02008 23.8334 13.0001 23.8334C18.9801 23.8334 23.8334 18.9801 23.8334 13.0001C23.8334 7.02008 18.9801 2.16675 13.0001 2.16675ZM14.0834 20.5834H11.9167V18.4167H14.0834V20.5834ZM16.3259 12.1876L15.3509 13.1842C14.8092 13.7367 14.4192 14.2351 14.2242 15.0151C14.1376 15.3617 14.0834 15.7517 14.0834 16.2501H11.9167V15.7084C11.9167 15.2101 12.0034 14.7334 12.1551 14.2892C12.3717 13.6609 12.7292 13.0976 13.1842 12.6426L14.5276 11.2776C15.0259 10.8009 15.2642 10.0859 15.1234 9.32758C14.9826 8.54758 14.3759 7.88675 13.6176 7.67008C12.4151 7.33425 11.2992 8.01675 10.9417 9.04592C10.8117 9.44675 10.4759 9.75008 10.0534 9.75008H9.72841C9.10008 9.75008 8.66675 9.14342 8.84008 8.53675C9.30591 6.94425 10.6601 5.73092 12.3392 5.47092C13.9859 5.21092 15.5567 6.06675 16.5317 7.42091C17.8101 9.18675 17.4309 11.0826 16.3259 12.1876Z"
          fill="#FDFDFD"
        />
      </svg>
    </div>
  )
}

const NotificationIcon = (props: any) => {
  const dispatch = useAppDispatch()
  const router = useRouter()
  return (
    <div
      className="relative cursor-pointer"
      onClick={() => {
        dispatch(setStoreIsNavbarOpen(false))
        router.push('/notifications')
      }}
    >
      <svg width="26" height="26" viewBox="0 0 26 26" fill="none" xmlns="http://www.w3.org/2000/svg">
        <path
          d="M13.0014 23.5625C14.1931 23.5625 15.1681 22.5875 15.1681 21.3958H10.8347C10.8347 22.5875 11.7989 23.5625 13.0014 23.5625ZM19.5014 17.0625V11.6458C19.5014 8.32 17.7247 5.53583 14.6264 4.79917V4.0625C14.6264 3.16333 13.9006 2.4375 13.0014 2.4375C12.1022 2.4375 11.3764 3.16333 11.3764 4.0625V4.79917C8.26723 5.53583 6.5014 8.30917 6.5014 11.6458V17.0625L5.1039 18.46C4.4214 19.1425 4.89807 20.3125 5.86223 20.3125H20.1297C21.0939 20.3125 21.5814 19.1425 20.8989 18.46L19.5014 17.0625Z"
          fill="#FDFDFD"
        />
      </svg>
      {props.notiCount > 0 && (
        <FontAwesomeIcon className={'absolute -top-[3px] right-[4px] mb-3 w-[8px] text-core-red'} icon={faCircle} />
      )}
    </div>
  )
}

const ChatBubbleIcon = (props: any) => {
  const dispatch = useAppDispatch()
  const router = useRouter()

  return (
    <div
      className="relative cursor-pointer"
      onClick={() => {
        dispatch(setStoreIsNavbarOpen(false))
        router.push('/messages')
      }}
    >
      <svg width="24" height="24" viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg">
        <path
          d="M19.6667 2.41675H4.33341C3.27925 2.41675 2.41675 3.27925 2.41675 4.33341V21.5834L6.25008 17.7501H19.6667C20.7209 17.7501 21.5834 16.8876 21.5834 15.8334V4.33341C21.5834 3.27925 20.7209 2.41675 19.6667 2.41675Z"
          fill="#FDFDFD"
        />
      </svg>
      {props.msgCount > 0 && (
        <FontAwesomeIcon className={'absolute -top-[3px] right-[0px] mb-3 w-[8px] text-core-red'} icon={faCircle} />
      )}
    </div>
  )
}

const ProfileIcon = (props: { avatar?: string }) => {
  const dispatch = useAppDispatch()
  const router = useRouter()

  return (
    <div
      onClick={() => {
        dispatch(setStoreIsNavbarOpen(false))
        router.push('/profile')
      }}
      className="cursor-pointer"
    >
      {props.avatar ? (
        <Icon src={props.avatar} alt="profile picture" size={25} />
      ) : (
        <svg width="26" height="26" viewBox="0 0 26 26" fill="none" xmlns="http://www.w3.org/2000/svg">
          <rect width="26" height="26" rx="13" fill="#D8D8D8" />
          <path
            d="M13 13C14.3812 13 15.5 11.8812 15.5 10.5C15.5 9.11875 14.3812 8 13 8C11.6188 8 10.5 9.11875 10.5 10.5C10.5 11.8812 11.6188 13 13 13ZM13 14.25C11.3312 14.25 8 15.0875 8 16.75V17.375C8 17.7188 8.28125 18 8.625 18H17.375C17.7188 18 18 17.7188 18 17.375V16.75C18 15.0875 14.6687 14.25 13 14.25Z"
            fill="#FDFDFD"
          />
        </svg>
      )}
    </div>
  )
}

export const LoginHeader = ({ isFixed }: { isFixed?: boolean | undefined }) => {
  const view = useView()
  const router = useRouter()

  const dispatch = useAppDispatch()

  const [open, setOpen] = React.useState(false)
  const [notiCount, setNotiCount] = React.useState(0)
  const [msgCount, setMsgCount] = React.useState(0)
  const { userInfo } = useAppSelector((state) => state.profile)
  const { authUser, notiList, userCheckedNotiList, isNavbarOpen, messageList } = useAppSelector((state) => state.global)

  useEffect(() => {
    if (!authUser) return

    setNotiCount(notiList.length - userCheckedNotiList.length)
    setMsgCount(calculateUnreadMessages(messageList, authUser.uid))
  }, [userCheckedNotiList, notiList, messageList])

  useEffect(() => {
    setOpen(false)
  }, [view, userInfo])

  const clickNavbar = () => {
    setOpen(!open)
    dispatch(setStoreIsNavbarOpen(!isNavbarOpen))
  }

  return view == 'PC' ? (
    <div className={`flex h-[64px] w-full flex-row items-center justify-between bg-core-blue_dark p-[10px]`}>
      <HeaderLogo
        onClick={() => {
          dispatch(setStoreIsNavbarOpen(false))
          router.push('/')
        }}
      />
      <div className="flex items-end space-x-2">
        <HelpIcon />
        <NotificationIcon notiCount={notiCount} />
        <ChatBubbleIcon msgCount={msgCount} />
        <div className="flex space-x-2">
          <p className="ml-3 flex items-end font-bold text-white">{`${userInfo.name.sei}${userInfo.name.mei}`}</p>
          <ProfileIcon avatar={userInfo.avatar} />
        </div>
      </div>
    </div>
  ) : (
    <div className={`z-20 flex h-[64px] w-full flex-row items-center justify-between bg-core-blue_dark p-[10px]`}>
      <div className="flex items-center text-[12px] font-bold text-gray-white hover:cursor-pointer">
        <div className="inset-y-0 left-0 flex items-center ">
          <button
            type="button"
            className="inline-flex h-8 w-8 items-center justify-center rounded-md p-2 text-gray-white hover:text-white focus:outline-none focus:ring-2 focus:ring-inset focus:ring-white"
            onClick={() => {
              clickNavbar()
            }}
          >
            <div className="relative">
              <FiMenu size="24px" />
              {notiCount > 0 && (
                <FontAwesomeIcon className={'absolute -right-1 -top-[1.5px] w-[10px] text-core-red'} icon={faCircle} />
              )}
            </div>
          </button>
        </div>
        <HeaderLogo
          className="ml-2 whitespace-pre-line"
          onClick={() => {
            dispatch(setStoreIsNavbarOpen(false))
            router.push('/')
          }}
        />
      </div>
      <div className="flex flex-row items-start gap-[10px]">
        <ChatBubbleIcon msgCount={msgCount} />
        <ProfileIcon avatar={userInfo.avatar} />
      </div>

      {isNavbarOpen && (
        <div className="absolute left-0 top-0 z-40 mt-[64px] flex w-[200px] flex-col gap-4 rounded-lg bg-white py-4 text-timestamp text-core-blue_dark">
          <div
            onClick={() => {
              dispatch(setStoreIsNavbarOpen(false))
              router.push('/notifications')
            }}
            className="ml-4 flex flex-row gap-1 text-start hover:cursor-pointer"
          >
            <div className="flex">
              <p>お知らせ</p>
              {notiCount > 0 && (
                <span className="absolute right-[10px] top-[10px] inline-flex h-5 w-5 items-center justify-center rounded-full bg-core-red text-timestamp text-gray-white">
                  {notiCount}
                </span>
              )}
            </div>
          </div>
          <a
            href={EXTERNAL_URLS.faqOfPartner}
            target="_blank"
            className="ml-4 flex flex-row gap-1 text-start hover:cursor-pointer"
          >
            <div>よくある質問</div>
          </a>
          <a
            href={EXTERNAL_URLS.inquiry}
            target="_blank"
            className="ml-4 flex flex-row gap-1 text-start hover:cursor-pointer"
          >
            <div>お問い合わせ</div>
          </a>
        </div>
      )}
    </div>
  )
}
