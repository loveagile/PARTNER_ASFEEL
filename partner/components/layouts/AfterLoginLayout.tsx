import { DefaultFooter } from '../organisms'
import { LoginHeader } from '../organisms'

export default function AfterLoginLayout({
  children, // will be a page or nested layout
  isFixed,
}: {
  children: React.ReactNode
  isFixed?: boolean
}) {
  return (
    <>
      <LoginHeader isFixed={isFixed} />
      <div className="relative min-h-[calc(100vh-136px)]">{children}</div>
      <DefaultFooter />
    </>
  )
}
