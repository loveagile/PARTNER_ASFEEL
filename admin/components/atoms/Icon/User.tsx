import PersonActive from '@/public/images/icons/person-active.svg'
import Person from '@/public/images/icons/person.svg'

export const UserIcon = ({ isActive, ...rest }: { isActive?: boolean }) => {
  if (isActive) {
    return <PersonActive width={18} height={18} {...rest} />
  }
  return <Person width={18} height={18} {...rest} />
}
