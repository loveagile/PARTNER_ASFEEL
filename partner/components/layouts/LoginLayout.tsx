import { PCFooter } from '../organisms'
import { LoginHeader } from '../organisms'

export default function LoginLayout({
  children, // will be a page or nested layout
  isFixed,
}: {
  children: React.ReactNode
  isFixed?: boolean
}) {
  return (
    <>
      <LoginHeader isFixed={isFixed} />
      {children}
      <PCFooter />
    </>
  )
}
