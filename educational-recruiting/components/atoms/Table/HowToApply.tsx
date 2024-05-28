import { AiFillWarning } from 'react-icons/ai'
interface Props {
  applyType: '応募' | 'スカウト'
  attention: boolean
}

export const HowToApply = (props: Props) => {
  const { applyType, attention } = props

  return (
    <div className="relative inline-flex items-center justify-center w-[58px] h-[21px] rounded-[20px] bg-gray-gray">
      <span className="text-timestamp">{applyType}</span>
      {attention && <AiFillWarning className="absolute w-3 text-core-red -right-[6px] -bottom-1" />}
    </div>
  )
}
