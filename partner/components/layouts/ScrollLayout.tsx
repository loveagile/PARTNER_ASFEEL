import { ButtonEnableFooter, DefaultFooter } from '../organisms'
import { HomeHeader } from '../organisms'

export default function ScrollLayout({
  children,
  onClick, // will be a page or nested layout
}: {
  children: React.ReactNode
  onClick: (event: React.MouseEvent<HTMLButtonElement, MouseEvent>) => void
}) {
  return (
    <>
      <HomeHeader />
      {children}
      <ButtonEnableFooter onClick={onClick} />
      <DefaultFooter />
    </>
  )
}
