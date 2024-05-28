import { DefaultFooter } from '../organisms'
import { LoginHeader } from '../organisms'

export default function AfterLoginLayout({
  children, // will be a page or nested layout
}: {
  children: React.ReactNode
}) {
  return (
    <>
      <LoginHeader />
      <div style={{ minHeight: 'calc(100vh - 136px)' }}>{children}</div>
      <DefaultFooter />
    </>
  )
}
