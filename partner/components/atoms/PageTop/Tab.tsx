import TabItem, { State } from '@/components/parts/PageTop/TabItem'
import React, { useState } from 'react'

export enum TabSize {
  PC,
  SIDE,
  SP,
}

export interface TabItemLightProps {
  notice: State
  url: string
  text: string
  size: TabSize
}

export interface TabProps {
  tabItems: TabItemLightProps[]
  size: TabSize
  onChange: (arg: number) => void
  isPossible?: boolean
  tabIndex?: number
}

const NoteIcon = () => {
  return (
    <svg width="18" height="19" viewBox="0 0 18 19" fill="none" xmlns="http://www.w3.org/2000/svg">
      <path
        d="M16 2.5V11.5H11V16.5H2V2.5H16ZM16 0.5H2C0.9 0.5 0 1.4 0 2.5V16.5C0 17.6 0.9 18.5 2 18.5H12L18 12.5V2.5C18 1.4 17.1 0.5 16 0.5ZM9 11.5H4V9.5H9V11.5ZM14 7.5H4V5.5H14V7.5Z"
        fill="#307DC1"
      />
    </svg>
  )
}

const Tab = ({ tabItems, size, onChange, isPossible, tabIndex }: TabProps) => {
  const [activeItem, setActiveItem] = useState(tabIndex ? tabIndex : 0)

  const handleClick = (index: number) => {
    if (isPossible == true) {
      setActiveItem(index)
      onChange(index)
    } else {
      alert('あなたのプロフィールは編集中です。')
    }
  }

  let widthStyle = ''
  switch (size) {
    case TabSize.PC:
      widthStyle = 'w-full'
      break
    case TabSize.SIDE:
      widthStyle = 'w-[450px]'
      break
    case TabSize.SP:
      widthStyle = 'w-full'
      break
  }

  let marginRule = ''
  switch (size) {
    case TabSize.PC:
      marginRule = ' bottom-[0.5px] '
      break
    case TabSize.SIDE:
      marginRule = ' bottom-[1.5px] '
      break
    case TabSize.SP:
      marginRule = ' bottom-[4px] '
      break
  }

  let flexStyle = ''
  switch (size) {
    case TabSize.PC:
      flexStyle = 'flex-row flex justify-between '
      break
    case TabSize.SIDE:
      flexStyle = 'flex-row flex justify-between '
      break
    case TabSize.SP:
      flexStyle = 'flex-row flex justify-center '
      break
  }

  let flexStyleItems = ''
  switch (size) {
    case TabSize.PC:
      flexStyleItems = ''
      break
    case TabSize.SIDE:
      flexStyleItems = ''
      break
    case TabSize.SP:
      flexStyleItems = ''
      break
  }

  return (
    <div className={'relative ' + widthStyle}>
      <div className={'mt-1  ' + flexStyle}>
        <div className={'py-[10px] ' + flexStyleItems}>
          {tabItems.map((tabItem, index) => (
            <TabItem key={index} index={index} setActiveItem={handleClick} activeItem={activeItem} {...tabItem} />
          ))}
        </div>
        {size == TabSize.PC && (
          <button className="mr-[10px] flex flex-wrap gap-2 self-center text-h5 font-bold text-core-blue_dark">
            <NoteIcon />
            メモを入力
          </button>
        )}

        {size == TabSize.SIDE && (
          <button className="mr-[10px] flex flex-wrap gap-2  self-center text-timestamp text-gray-black">
            <div className="h-[18px] w-[18px]  rounded-sm border border-gray-gray_dark bg-gray-white" />
            メモを入力
          </button>
        )}
      </div>
      <hr className={'absolute h-px w-full bg-gray-gray ' + marginRule}></hr>
    </div>
    //    <div
    //    className={
    //      "box-border flex flex-row items-start self-stretch justify-between flex-none flex-grow-0 order-none h-10 pt-[1px] rounded-none pl-[1px] gap-5 border-b border-gray-gray " +
    //      widthStyle
    //    }
    //  >
    //    <div
    //      className={
    //        "flex flex-row items-start flex-none flex-grow-0 order-none h-10  " +
    //        flexStyleItems
    //      }
    //    >
    //      {tabItems.map((tabItem, index) => (
    //        <TabItem
    //          key={index}
    //          index={index}
    //          setActiveItem={setActiveItem}
    //          activeItem={activeItem}
    //          {...tabItem}
    //        />
    //      ))}
    //    </div>
    //    {size == TabSize.PC && (
    //      <button className="flex mr-[10px] text-core-blue_dark gap-2 font-bold self-center flex-wrap text-h5">
    //        <NoteIcon />
    //        メモを入力
    //      </button>
    //    )}
    //    {size == TabSize.SIDE && (
    //      <button className="flex mr-[10px] text-gray-black gap-2  self-center flex-wrap text-timestamp">
    //        <div className="w-[18px] h-[18px]  bg-gray-white border border-gray-gray_dark rounded-sm" />
    //        メモを入力
    //      </button>
    //    )}
    //  </div>
  )
}

export default Tab
