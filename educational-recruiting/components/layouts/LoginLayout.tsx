import { PCFooter } from '../organisms'
import { LoginHeader } from '../organisms'

export default function LoginLayout({
  children, // will be a page or nested layout
}: {
  children: React.ReactNode
}) {
  return (
    <>
      <LoginHeader />
      {children}
      <PCFooter />
    </>
  )
}
