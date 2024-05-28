import { AiFillWarning } from 'react-icons/ai'
interface Props {
  applyType: '応募' | 'スカウト'
  attention: boolean
}

export const HowToApply = (props: Props) => {
  const { applyType, attention } = props

  return (
    <div className="relative inline-flex h-[21px] w-[58px] items-center justify-center rounded-[20px] bg-gray-gray">
      <span className="text-timestamp">{applyType}</span>
      {attention && <AiFillWarning className="absolute -bottom-1 -right-[6px] w-3 text-core-red" />}
    </div>
  )
}
