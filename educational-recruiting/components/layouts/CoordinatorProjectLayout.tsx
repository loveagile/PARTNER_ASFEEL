import { CoordinatorHeader, PCFooter } from '@/components/organisms'

export default function CoordinatorProjectLayout({ children }: { children: React.ReactNode }) {
  return (
    <>
      <CoordinatorHeader />
      <div className="flex min-h-[calc(100vh-64px)]">{children}</div>
      <PCFooter />
    </>
  )
}
