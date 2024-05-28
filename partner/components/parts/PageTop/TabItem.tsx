import { TabSize } from '@/components/atoms/PageTop/Tab'
import { faCircle } from '@fortawesome/free-solid-svg-icons'
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome'
import Link from 'next/link'
import React from 'react'

export enum State {
  OFF,
  ON,
}

export interface TabItemProps {
  notice: State
  url: string
  text: string
  size: TabSize
  setActiveItem: (index: number) => void
  activeItem?: number
  index: number
}

const TabItem = ({ notice, url, text, size, setActiveItem, activeItem, index }: TabItemProps) => {
  const colorStyle =
    activeItem == index ? 'text-core-blue_dark border-b-4 border-core-blue_dark ' : 'text-gray-black opacity-40 '
  let textStyle = ''
  switch (size) {
    case TabSize.PC:
      textStyle = ' text-h4 ' + (notice == State.ON ? ' pl-[17px] pr-[19px]' : ' px-[18px]')
      break
    case TabSize.SIDE:
      textStyle = ' text-h5 ' + (notice == State.ON ? ' pl-[21px] pr-[23px]' : ' px-[22px]')
      break
    case TabSize.SP:
      textStyle = ' text-body_sp py-[6px] ' + (notice == State.ON ? ' pl-[31px] pr-[33px]' : ' px-[32px]')
      break
  }

  const noticeStyle = size == TabSize.SP ? 'bottom-6 ' : ' bottom-3 '

  return (
    <Link
      href={url}
      className={'items-center py-[10px]  ' + colorStyle + textStyle}
      onClick={() => setActiveItem(index)}
    >
      {text}
      {notice == State.ON && (
        <>
          <FontAwesomeIcon className={'absolute mb-3 w-[10px] text-core-red  ' + noticeStyle} icon={faCircle} />
          <div className="mb-3 hidden w-[10px]" />
        </>
      )}
    </Link>
    // <div
    //   className={
    //     "flex flex-col items-center justify-center flex-none flex-grow-0 order-none w-24 h-10 gap-[10px] py-[10px] relative " +
    //     colorStyle +
    //     textStyle
    //   }
    // >
    //   <div className="">
    //     <Link
    //       href={url}
    //       onClick={() => setActiveItem(index)}
    //       className="mx-[18px]"
    //     >
    //       {text}
    //     </Link>
    //     {notice == State.ON && (
    //       <>
    //         <FontAwesomeIcon
    //           className={"w-[10px] bottom-5 text-core-red absolute"}
    //           icon={faCircle}
    //         />
    //       </>
    //     )}
    //   </div>
    // </div>
  )
}

export default TabItem
