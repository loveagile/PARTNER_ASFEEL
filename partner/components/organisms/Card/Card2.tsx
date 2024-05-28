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
      <span className="absolute top-2 font-bold text-core-blue_dark sp:left-3.5 sp:text-[16px] pc:left-2 pc:text-[20px]">
        {'0' + number}
      </span>
      <div
        className={`flex flex-col items-center justify-center gap-2 bg-neutral-200 text-center sp:h-[100px] sp:w-[100px] pc:h-[150px] pc:w-[150px] ${
          title.split(' ').length > 1 ? 'pt-0' : 'pt-[15px]'
        } mx-auto mb-[4px] rounded-full`}
      >
        {url ? (
          <img src={`/images/icons/${url}${number}.svg`}
            className="mx-auto sp:h-[40px] sp:w-[40px] pc:h-[60px] pc:w-[60px]"
            alt=""
          />
        ) : (
          <img src={`/images/icons/sports/empty.svg`} className="mx-auto sp:h-[40px] sp:w-[40px] pc:h-[60px] pc:w-[60px]" alt="" />
        )}
        <h1 className={`font-bold text-core-blue_dark sp:text-[12px] pc:text-[16px] ${number == 1 && '-ml-[5px]'}`}>
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
      <h1 className="text-center font-bold text-neutral-800 sp:w-[130px] sp:text-[12px] pc:w-[154px] pc:text-[14px]">
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
