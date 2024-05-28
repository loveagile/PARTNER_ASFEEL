import Button, {
  ButtonArrow,
  ButtonColor,
  ButtonIcon,
  ButtonShape,
  ButtonSize,
  ButtonType,
} from '@/components/atoms/Button/Button'
import React, { useEffect, useState } from 'react'

export const ButtonDisableFooter = () => {
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
        className={`flex w-full flex-col items-center gap-5 py-5 ${
          scrollBottomState ? 'sp:relative pc:relative' : 'sp:fixed pc:fixed'
        } bottom-0 left-0 right-0 z-10 border-t border-gray-gray`}
      >
        <Button
          size={ButtonSize.SP}
          color={ButtonColor.CANCEL}
          type={ButtonType.DEFAULT}
          shape={ButtonShape.ELLIPSE}
          icon={ButtonIcon.OFF}
          arrow={ButtonArrow.OFF}
          disabled={true}
          text="応募済み"
          onclick={() => {
            console.log('button clicked')
          }}
          className="px-[47px] py-[7px]"
        />
        <div className="flex flex-row items-start gap-1 text-mini text-gray-gray_dark">
          --- ご応募ありがとうございます ---
        </div>
      </div>
    </div>
  )
}
