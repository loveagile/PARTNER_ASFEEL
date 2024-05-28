import { EXTERNAL_URLS } from '@/utils/constants/externalUrls'
import React from 'react'
import { HiQuestionMarkCircle } from 'react-icons/hi'

function DontSendCodeQuestion() {
  return (
    <div className="flex justify-center py-[40px] text-core-blue">
      <HiQuestionMarkCircle className="h-[18px] w-[18px]" />
      <a href={EXTERNAL_URLS.codeNotArrived} target="_blank" className="text-[12px] font-bold ">
        コードが届かない場合
      </a>
    </div>
  )
}

export default DontSendCodeQuestion
