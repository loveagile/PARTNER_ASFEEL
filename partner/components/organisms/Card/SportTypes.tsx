import React from 'react'
var count = 0
const SportType = ({ url, descText }: { url: string; descText: string }) => {
  count = count + 1
  // count = count % 14 + 1

  let desc_arry = [
    'サッカー',
    'ハンド',
    'ダンス',
    '空手',
    'マーチング',
    '野球',
    '登山',
    '映画研究',
    '陸上',
    '軟式テニス',
    '応援団',
    'マーチング',
    'ラグビー',
    '科学研究',
  ]

  return (
    // <div className="bg-neutral-100 rounded-full">
    <div className="mx-auto rounded-full bg-neutral-100 text-center sp:h-12 sp:w-12 sp:pt-1.5 pc:h-20 pc:w-20 pc:pt-3">
      {/* <div className="pc:pt-3 sp:pt-1.5 mx-auto text-center bg-neutral-100 rounded-full"> */}
      {url ? (
        <img src={`/images/icons/sports/${url}.svg`} className="mx-auto sp:h-6 sp:w-6 pc:h-10 pc:w-10" alt="" />
      ) : (
        <img src={`/images/icons/sports/empty.svg`} className="mx-auto sp:h-6 sp:w-6 pc:h-10 pc:w-10" alt="" />
      )}
      <p className="mt-[2px] sp:text-[8px] pc:text-[10px]">{url}</p>
    </div>
    // </div>
  )
}
export default SportType
