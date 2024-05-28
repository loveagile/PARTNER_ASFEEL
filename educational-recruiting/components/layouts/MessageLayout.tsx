import { DefaultFooter } from '../organisms'
import { LoginHeader } from '../organisms'

export default function MessageLayout({
  children, // will be a page or nested layout
  isFooter,
}: {
  children: React.ReactNode
  isFooter: boolean
}) {
  return (
    <>
      <LoginHeader />
      <div style={{ minHeight: `${isFooter ? 'calc(100vh - 136px)' : 'calc(100vh - 64px)'}` }}>{children}</div>
      {isFooter && <DefaultFooter />}
    </>
  )
}
