import { AfterLoginHeader, ButtonDisableFooter, ButtonEnableFooter, DefaultFooter } from '../organisms'
import { TwoButtonDisableFooter } from '../organisms/Footer/TwoButtonDisableFooter'
import { TwoButtonEnableFooter } from '../organisms/Footer/TwoButtonEnableFooter'

export const projectStatusItem = {
  interested: 'interested',
  applied: 'applied',
  scouted: 'scouted',
  notInterested: 'notInterested',
  default: 'default',
} as const

export type ProjectStatus = (typeof projectStatusItem)[keyof typeof projectStatusItem]

export default function AfterLoginScrollLayout({
  children,
  projectStatus = null,
  onClick,
  onOpenInterestModal,
  onOpenNotInterestModal,
}: {
  children: React.ReactNode
  projectStatus: ProjectStatus | null
  onClick: (event: React.MouseEvent<HTMLButtonElement, MouseEvent>) => void
  onOpenInterestModal: () => void
  onOpenNotInterestModal: () => void
}) {
  return (
    <>
      <AfterLoginHeader />
      <div className="pb-[145px] pt-[64px]">{children}</div>

      {projectStatus === projectStatusItem.interested && <TwoButtonDisableFooter status={projectStatus} />}
      {projectStatus === projectStatusItem.notInterested && <TwoButtonDisableFooter status={projectStatus} />}
      {projectStatus === projectStatusItem.scouted && (
        <TwoButtonEnableFooter onClickVoteDown={onOpenNotInterestModal} onClickVoteUp={onOpenInterestModal} />
      )}
      {projectStatus === projectStatusItem.applied && <ButtonDisableFooter />}
      {projectStatus === projectStatusItem.default && <ButtonEnableFooter onClick={onClick} />}
      <DefaultFooter />
    </>
  )
}
