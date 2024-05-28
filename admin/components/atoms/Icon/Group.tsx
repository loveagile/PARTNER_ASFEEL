import { MdGroups } from 'react-icons/md'

export const GroupIcon = ({ isActive, ...rest }: { isActive?: boolean }) => {
  return <MdGroups style={{ fontSize: 18 }} {...rest} />
}
