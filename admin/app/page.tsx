import PATH from '@/constants/path'
import { redirect } from 'next/navigation'

export default function Home() {
  redirect(PATH.root)
}
