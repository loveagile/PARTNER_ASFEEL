import AfterLoginDetailPage from '@/pages/afterLogin/[id]'
import PreLoginDetailPage from '@/pages/preLogin/[id]'
import { useAppSelector } from '@/store'

export default function JobList() {
  const { authUser } = useAppSelector((state) => state.global)

  return <div>{authUser ? <AfterLoginDetailPage /> : <PreLoginDetailPage />}</div>
}
