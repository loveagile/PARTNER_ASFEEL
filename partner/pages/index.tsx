import AfterLoginPage from './afterLogin'
import PreLoginPage from './preLogin'
import { useAppSelector } from '@/store'

export default function JobList() {
  const { authUser } = useAppSelector((state) => state.global)

  return <div>{authUser ? <AfterLoginPage /> : <PreLoginPage />}</div>
}
