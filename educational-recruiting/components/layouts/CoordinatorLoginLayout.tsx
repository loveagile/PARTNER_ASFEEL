import { CoordinatorLoginHeader } from '@/components/organisms'
import { PCFooter } from '@/components/organisms'

export default function CoordinatorLoginLayout({ children }: { children: React.ReactNode }) {
  return (
    <>
      <CoordinatorLoginHeader />
      <div className="flex items-center bg-gray-white min-h-[calc(100vh-64px-58px)]">{children}</div>
      <PCFooter className="bg-gray-white" />
    </>
  )
}
