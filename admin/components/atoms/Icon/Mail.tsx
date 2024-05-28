import { TfiEmail } from 'react-icons/tfi'

export const MailIcon = ({ isActive, ...rest }: { isActive?: boolean }) => {
  return <TfiEmail style={{ fontSize: 16 }} {...rest} />
}
