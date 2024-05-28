import { MdCampaign } from 'react-icons/md'

export const CampainIcon = ({ isActive, ...rest }: { isActive?: boolean }) => {
  return <MdCampaign style={{ fontSize: 22 }} {...rest} />
}
