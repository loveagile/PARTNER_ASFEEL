import { FC } from 'react'
export interface Card2Props {
  url: string
  number: number
  title: string
  desc: string
}

const Card2: FC<Card2Props> = ({ url, number, title, desc }) => {
  return (
    <div className="relative justify-self-center">
      <span className="absolute pc:left-2 sp:left-3.5 top-2 text-core-blue_dark font-bold pc:text-[20px] sp:text-[16px]">{'0' + number}</span>
      <div
        className={`pc:w-[150px] sp:w-[100px] pc:h-[150px] sp:h-[100px] flex items-center flex-col justify-center text-center gap-2 bg-neutral-200 ${
          title.split(' ').length > 1 ? 'pt-0' : 'pt-[15px]'
        } rounded-full mx-auto mb-[4px]`}
      >
        <img src={`/images/icons/${url}${number}.svg`} className="pc:w-[60px] pc:h-[60px] sp:w-[40px] sp:h-[40px] mx-auto" alt="" />
        <h1 className={`font-bold pc:text-[16px] sp:text-[12px] text-core-blue_dark ${number == 1 && '-ml-[5px]'}`}>
          {title.split(' ').length > 1 ? (
            <p>
              {title.split(' ')[0]}
              <br />
              {title.split(' ')[1]}
            </p>
          ) : (
            title
          )}
        </h1>
      </div>
      <h1 className="pc:w-[154px] sp:w-[130px] font-bold pc:text-[14px] sp:text-[12px] text-neutral-800 text-center">
        {desc.split(' ').length > 1 ? (
          <p>
            {desc.split(' ')[0]}
            <br />
            {desc.split(' ')[1]}
          </p>
        ) : (
          desc
        )}
      </h1>
    </div>
  )
}

export default Card2
