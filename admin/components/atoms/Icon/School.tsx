import SchoolActive from '@/public/images/icons/school-active.svg'
import School from '@/public/images/icons/school.svg'

export const SchoolIcon = ({ isActive, ...rest }: { isActive?: boolean }) => {
  if (isActive) {
    return <SchoolActive width={16} height={16} {...rest} />
  }
  return <School width={16} height={16} {...rest} />
}
