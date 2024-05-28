import { FaMapMarkerAlt } from 'react-icons/fa'

export const AddressIcon = ({ isActive, ...rest }: { isActive?: boolean }) => {
  return <FaMapMarkerAlt style={{ fontSize: 16 }} {...rest} />
}
