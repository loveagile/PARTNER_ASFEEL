import React from 'react'
import { useMiddleware } from '../useMiddleware'
import { useAuthUserStateProvider } from '@/features/auth/providers/useAuthProvider'

function Middleware({ children }: { children: React.ReactNode }) {
  useAuthUserStateProvider()
  useMiddleware()
  return <div>{children}</div>
}

export default Middleware
