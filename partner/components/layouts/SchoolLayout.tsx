import { PCFooter } from '../organisms'
import { SchoolHeader } from '../organisms'

export default function SchoolLayout({
  children, // will be a page or nested layout
}: {
  children: React.ReactNode
}) {
  return (
    <>
      <SchoolHeader />
      <div style={{ minHeight: 'calc(100vh - 123px)' }}>{children}</div>
      <PCFooter />
    </>
  )
}
