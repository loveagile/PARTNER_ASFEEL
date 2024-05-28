import { ButtonEnableFooter, DefaultFooter } from '../organisms'
import { LoginHeader } from '../organisms'

export default function AfterLoginScrollLayout({
  children, // will be a page or nested layout
  onClick,
}: {
  children: React.ReactNode
  onClick: (event: React.MouseEvent<HTMLButtonElement, MouseEvent>) => void
}) {
  return (
    <>
      <LoginHeader />
      {children}
      <ButtonEnableFooter onClick={onClick} />
      <DefaultFooter />
    </>
  )
}
