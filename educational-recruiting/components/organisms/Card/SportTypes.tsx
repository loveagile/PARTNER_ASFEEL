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
    <div className="pc:h-20 sp:h-12 pc:w-20 sp:w-12 pc:pt-3 sp:pt-1.5 mx-auto text-center bg-neutral-100 rounded-full">
      {/* <div className="pc:pt-3 sp:pt-1.5 mx-auto text-center bg-neutral-100 rounded-full"> */}
      <img src={`/images/icons/sports/${url}${(count % 14) + 1}.svg`} className="pc:w-10 pc:h-10 sp:w-6 sp:h-6 mx-auto" alt="" />
      <p className="pc:text-[10px] sp:text-[8px] mt-[2px]">{desc_arry[count % 14]}</p>
    </div>
    // </div>
  )
}
export default SportType
