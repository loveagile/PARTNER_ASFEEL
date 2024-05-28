import Button, {
  ButtonArrow,
  ButtonColor,
  ButtonIcon,
  ButtonShape,
  ButtonSize,
  ButtonType,
} from '@/components/atoms/Button/Button'
import React, { useEffect, useState } from 'react'
import { BiMeh } from 'react-icons/bi'
import { MdThumbUp } from 'react-icons/md'
import { TbSlash } from 'react-icons/tb'

const MobileIcon = () => {
  return (
    <svg width="16" height="16" viewBox="0 0 16 16" fill="none" xmlns="http://www.w3.org/2000/svg">
      <path
        d="M8.66671 4.66675H7.33337V6.00008H8.66671V4.66675ZM8.00004 7.33341C7.63337 7.33341 7.33337 7.63341 7.33337 8.00008L7.33337 10.6667C7.33337 11.0334 7.63337 11.3334 8.00004 11.3334C8.36671 11.3334 8.66671 11.0334 8.66671 10.6667V8.00008C8.66671 7.63341 8.36671 7.33341 8.00004 7.33341ZM11.3334 0.673415L4.66671 0.666748C3.93337 0.666748 3.33337 1.26675 3.33337 2.00008L3.33337 14.0001C3.33337 14.7334 3.93337 15.3334 4.66671 15.3334H11.3334C12.0667 15.3334 12.6667 14.7334 12.6667 14.0001V2.00008C12.6667 1.26675 12.0667 0.673415 11.3334 0.673415ZM11.3334 12.6667H4.66671L4.66671 3.33341L11.3334 3.33341V12.6667Z"
        fill="#307DC1"
      />
    </svg>
  )
}

export const TwoButtonEnableFooter = ({
  onClickVoteUp,
  onClickVoteDown,
}: {
  onClickVoteUp: (event: React.MouseEvent<HTMLButtonElement, MouseEvent>) => void
  onClickVoteDown: (event: React.MouseEvent<HTMLButtonElement, MouseEvent>) => void
}) => {
  const [scrollBottomState, setScrollBottomState] = useState(false)
  const [lastScrollPosition, setLastScrollPosition] = useState(0)

  useEffect(() => {
    function handleScroll() {
      const currentScrollPosition = window.pageYOffset

      // detect the scroll up event
      if (currentScrollPosition <= lastScrollPosition) {
        setScrollBottomState(false)
      }

      setLastScrollPosition(currentScrollPosition)

      // detect the scroll bottom event
      if (window.innerHeight + window.scrollY >= document.body.offsetHeight) {
        setScrollBottomState(true)
      }
    }

    window.addEventListener('scroll', handleScroll)
    window.addEventListener('resize', handleScroll)

    return () => {
      window.removeEventListener('scroll', handleScroll)
      window.removeEventListener('resize', handleScroll)
    }
  }, [])

  return (
    <div>
      <div
        style={{ background: 'rgba(255, 255, 255, 0.9)' }}
        className={`flex w-full flex-col items-center gap-[18px] py-5 ${
          scrollBottomState ? 'sp:relative pc:relative' : 'sp:fixed pc:fixed'
        } bottom-0 left-0 right-0 z-10 mx-auto border-t border-gray-gray text-core-blue`}
      >
        <div className="flex flex-row items-start gap-1 text-mini_b">
          <TbSlash size={16} className="scale-x-[-1] transform" />
          <div>スカウトへのご回答をお願いします</div>
          <TbSlash size={16} />
        </div>
        <div className="flex gap-[10px]">
          <Button
            size={ButtonSize.SP}
            color={ButtonColor.SUB}
            type={ButtonType.SECONDARY}
            shape={ButtonShape.ELLIPSE}
            icon={ButtonIcon.FRONT}
            arrow={ButtonArrow.OFF}
            iconComponent={<BiMeh className="mr-[2px] h-[17px] w-[17px]" />}
            disabled={false}
            text="興味なし"
            onclick={onClickVoteDown}
            className="px-[30px] py-[7px]"
          />
          <Button
            size={ButtonSize.SP}
            color={ButtonColor.SUB}
            type={ButtonType.DEFAULT}
            shape={ButtonShape.ELLIPSE}
            icon={ButtonIcon.FRONT}
            arrow={ButtonArrow.OFF}
            iconComponent={<MdThumbUp className="mr-[2px] h-[17px] w-[17px]" />}
            disabled={false}
            text="興味あり"
            onclick={onClickVoteUp}
            className="px-[30px] py-[7px]"
          />
        </div>
        <div className="flex flex-row items-start gap-1 text-mini">
          <MobileIcon />
          <a href="https://asfeel.notion.site/c569ab14cedd4f1194dbe2112c10c187?pvs=4">興味ありを押すとどうなるの？</a>
        </div>
      </div>
    </div>
  )
}
