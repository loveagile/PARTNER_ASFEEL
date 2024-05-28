import { DefaultFooter } from '../organisms'
import { SimpleHeader } from '../organisms'

export default function SignUpLayout({
  children, // will be a page or nested layout
}: {
  children: React.ReactNode
}) {
  return (
    <>
      <SimpleHeader />
      <div className="relative min-h-[calc(100vh-136px)]">{children}</div>
      <DefaultFooter />
    </>
  )
}
