import { ButtonDisableFooter, ButtonEnableFooter, DefaultFooter, LoginHeader } from '../organisms'
import { ButtonDisableVoteUpFooter } from '../organisms/Footer/ButtonDisableVoteUpFooter'
import { ButtonDisableVoteDownFooter } from '../organisms/Footer/ButtonDisableVoteDownFooter copy'
import { TwoButtonEnableFooter } from '../organisms/Footer/TwoButtonEnableFooter'

export default function ScrollLoginLayout({
  children,
  onClick, // will be a page or nested layout
  voteup,
  votedown,
  isvoteup,
  isvotedown,
  applied,
  accepted,
}: {
  children: React.ReactNode
  voteup: (event: React.MouseEvent<HTMLButtonElement, MouseEvent>) => void
  votedown: (event: React.MouseEvent<HTMLButtonElement, MouseEvent>) => void
  onClick: (event: React.MouseEvent<HTMLButtonElement, MouseEvent>) => void
  isvotedown: boolean
  isvoteup: boolean
  applied: boolean
  accepted: boolean
}) {
  return (
    <>
      <LoginHeader />
      {children}
      {!accepted ? (
        !applied ? (
          <ButtonEnableFooter onClick={onClick} />
        ) : (
          <ButtonDisableFooter />
        )
      ) : !(isvotedown || isvoteup) ? (
        <TwoButtonEnableFooter onClickVoteUp={voteup} onClickVoteDown={votedown} />
      ) : isvotedown ? (
        <ButtonDisableVoteDownFooter />
      ) : (
        <ButtonDisableVoteUpFooter />
      )}

      <DefaultFooter />
    </>
  )
}
