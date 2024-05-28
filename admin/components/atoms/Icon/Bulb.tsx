import BulbActive from '@/public/images/icons/bulb-active.svg'
import Bulb from '@/public/images/icons/bulb.svg'

export const BulbIcon = ({ isActive, ...rest }: { isActive?: boolean }) => {
  if (isActive) {
    return <BulbActive width={16} height={16} {...rest} />
  }
  return <Bulb width={16} height={16} {...rest} />
}
