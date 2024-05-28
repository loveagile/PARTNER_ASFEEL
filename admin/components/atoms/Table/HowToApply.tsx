'use client'

import { AiFillWarning } from 'react-icons/ai'
interface Props {
  applyType: string
  attention?: boolean
}

export const HowToApply = (props: Props) => {
  const { applyType, attention = false } = props

  return (
    <div className="relative inline-flex w-[58px] items-center justify-center rounded-[20px] bg-gray-gray py-[2px]">
      <span className="text-timestamp">{applyType}</span>
      {attention && (
        <AiFillWarning className="absolute -bottom-1 -right-[6px] w-3 text-core-red" />
      )}
    </div>
  )
}
