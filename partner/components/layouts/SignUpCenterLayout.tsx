import { SimpleCenterHeader } from '../organisms'

export default function SignUpCenterLayout({
  children,
  system_name,
}: {
  children: React.ReactNode
  system_name: string
}) {
  return (
    <>
      <SimpleCenterHeader system_name={system_name} />
      {children}
    </>
  )
}
