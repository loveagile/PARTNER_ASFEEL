import { PCFooter, ButtonEnableFooter } from '../organisms'
import { HomeHeader } from '../organisms'

export default function LayoutWithButtonSP({
  children, // will be a page or nested layout
  onClick,
}: {
  children: React.ReactNode
  onClick: (event: React.MouseEvent<HTMLButtonElement, MouseEvent>) => void
}) {
  return (
    <>
      <HomeHeader />
      {children}
      <ButtonEnableFooter onClick={onClick} />
      <PCFooter />
    </>
  )
}
