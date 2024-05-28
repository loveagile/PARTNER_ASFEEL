import PreLoginJobList from '../preLogin/job-list'
import OtherJobList from './other'
import { useAppSelector } from '@/store'

export default function JobList() {
  const { authUser } = useAppSelector((state) => state.global)

  return <>{authUser ? <OtherJobList /> : <PreLoginJobList />}</>
}
