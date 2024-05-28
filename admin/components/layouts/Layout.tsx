'use client'

import { API_ROUTES, HTTP_METHOD } from '@/constants/common'
import PATH from '@/constants/path'
import Middleware from '@/features/middleware/components/Middleware'
import { auth } from '@/libs/firebase/firebase'
import { usePathname, useRouter } from 'next/navigation'
import React from 'react'
import { RecoilRoot } from 'recoil'
import { Header } from '../Header'
import { customFetchUtils } from '@/utils/common'

export default function Layout({ children }: { children: React.ReactNode }) {
  const [currentUser, setCurrentUser] = React.useState<any>(null)
  const router = useRouter()
  const pathName = usePathname()

  const handleLogout = async () => {
    try {
      await customFetchUtils(API_ROUTES.AUTH.logout, {
        method: HTTP_METHOD.POST,
      })

      await auth.signOut()
      router.replace(PATH.auth.login)
      router.refresh()
    } catch (error) {
      console.log(error)
    }
  }

  const fetchCurrentUser = async () => {
    try {
      const res = await customFetchUtils(API_ROUTES.AUTH.validateSession)
      const data = await res.json()

      setCurrentUser(data?.currentUser)
    } catch (error) {
      console.log(error)
    }
  }

  React.useEffect(() => {
    if (Object.values(PATH.auth).includes(pathName)) {
      setCurrentUser(null)
    } else {
      if (!currentUser) {
        fetchCurrentUser()
      }
    }
  }, [pathName])
  return (
    <RecoilRoot>
      <Middleware>
        <div className="flex h-screen flex-col">
          <Header currentUser={currentUser} handleLogout={handleLogout} />
          <div className="mt-16 flex-1">{children}</div>
        </div>
      </Middleware>
    </RecoilRoot>
  )
}
