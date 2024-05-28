import { GiRunningShoe } from 'react-icons/gi'

export const ShoesIcon = ({ isActive, ...rest }: { isActive?: boolean }) => {
  return <GiRunningShoe style={{ fontSize: 16 }} {...rest} />
}
