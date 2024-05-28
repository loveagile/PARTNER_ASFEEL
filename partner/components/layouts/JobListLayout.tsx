import { DefaultFooter } from '../organisms'
import { HomeHeader } from '../organisms'

export default function JobListLayout({
  children, // will be a page or nested layout
}: {
  children: React.ReactNode
}) {
  return (
    <>
      <HomeHeader />
      <div style={{ minHeight: 'calc(100vh - 136px)' }}>{children}</div>
      <DefaultFooter />
    </>
  )
}
