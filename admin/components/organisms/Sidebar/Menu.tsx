import { AddressIcon } from '@/components/atoms/Icon/Address'
import { BulbIcon } from '@/components/atoms/Icon/Bulb'
import { CampainIcon } from '@/components/atoms/Icon/Campain'
import { EditNoteIcon } from '@/components/atoms/Icon/EditNote'
import { GroupIcon } from '@/components/atoms/Icon/Group'
import { MailIcon } from '@/components/atoms/Icon/Mail'
import { SchoolIcon } from '@/components/atoms/Icon/School'
import { ShoesIcon } from '@/components/atoms/Icon/Shoes'
import { UserIcon } from '@/components/atoms/Icon/User'
import PATH from '@/constants/path'

export type MenuItem = {
  label: string
  path?: string
  children?: MenuItem[]
  icon?: React.FunctionComponent
  isActive?: boolean
}

const DefaultChildIcon = ({
  className,
  isActive,
}: {
  className?: string
  isActive?: boolean
}) => {
  const extraClassName = `${className || ''} ${
    isActive ? 'bg-core-blue_dark' : 'bg-gray-gray'
  }`

  return (
    <span
      style={{
        maxWidth: '16px',
        marginRight: '6px',
      }}
      className={`inline-block h-[1px] w-[18px] ${extraClassName}`}
    />
  )
}

const MENU: MenuItem[] = [
  {
    label: '運営アカウント',
    path: PATH.account.list,
    icon: UserIcon,
  },
  {
    label: 'コーディネーターアカウント',
    path: PATH.coordinator.list,
    icon: CampainIcon,
  },
  {
    label: '指導者募集',
    icon: EditNoteIcon,
    children: [
      {
        label: '募集中',
        path: PATH.recruitment.list.public,
        icon: DefaultChildIcon,
      },
      {
        label: '準備中',
        path: PATH.recruitment.list.prepare,
        icon: DefaultChildIcon,
      },
      {
        label: '終了',
        path: PATH.recruitment.list.finish,
        icon: DefaultChildIcon,
      },
    ],
  },
  {
    label: 'イベント募集',
    icon: EditNoteIcon,
    children: [
      {
        label: '募集中',
        path: PATH.event.list.public,
        icon: DefaultChildIcon,
      },
      {
        label: '準備中',
        path: PATH.event.list.prepare,
        icon: DefaultChildIcon,
      },
      {
        label: '終了',
        path: PATH.event.list.finish,
        icon: DefaultChildIcon,
      },
    ],
  },
  {
    label: '登録者情報',
    path: PATH.registrant.list,
    icon: GroupIcon,
  },
  {
    label: '学校・団体情報',
    path: PATH.organization.list,
    icon: SchoolIcon,
  },
  {
    label: '住所情報',
    icon: AddressIcon,
    path: PATH.address.list,
  },
  {
    label: '種目分類',
    icon: ShoesIcon,
    path: PATH.category.list,
  },
  {
    label: '独自質問',
    icon: BulbIcon,
    path: PATH.question.list,
  },
  {
    label: 'お知らせ',
    icon: MailIcon,
    path: PATH.notification.list,
  },
]

export default MENU
