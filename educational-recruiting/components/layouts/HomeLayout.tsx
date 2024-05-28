import { TopFooter } from '../organisms'
import { HomeHeader } from '../organisms'

export default function HomeLayout({
  children, // will be a page or nested layout
}: {
  children: React.ReactNode
}) {
  return (
    <>
      <HomeHeader />
      {children}
      <TopFooter />
    </>
  )
}
