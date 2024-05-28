import { ButtonDisableFooter, DefaultFooter } from '../organisms'
import { LoginHeader } from '../organisms'

export default function DiabledAfterLoginLayout({
  children, // will be a page or nested layout
  onClick,
  isFixed,
}: {
  children: React.ReactNode
  onClick: (event: React.MouseEvent<HTMLButtonElement, MouseEvent>) => void
  isFixed?: boolean
}) {
  return (
    <>
      <LoginHeader isFixed={isFixed} />
      {children}
      <ButtonDisableFooter />
      <DefaultFooter />
    </>
  )
}
