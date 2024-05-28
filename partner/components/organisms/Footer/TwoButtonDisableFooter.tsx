import React, { useEffect, useMemo, useState } from 'react'
import { IoMdThumbsUp } from 'react-icons/io'
import { BiMeh } from 'react-icons/bi'

export const TwoButtonDisableFooter = ({ status }: { status: 'interested' | 'notInterested' }) => {
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

  const isInterested = useMemo(() => status === 'interested', [status])

  return (
    <div>
      <div
        style={{ background: 'rgba(255, 255, 255, 0.9)' }}
        className={`flex w-full flex-col items-center gap-[18px] py-5 ${
          scrollBottomState ? 'sp:relative pc:relative' : 'sp:fixed pc:fixed'
        } bottom-0 left-0 right-0 z-10 mx-auto border-t border-gray-gray text-core-blue`}
      >
        {isInterested ? (
          <div
            className={`flex h-[34px] w-[150px] items-center justify-center space-x-1 rounded-full bg-[#dedede] text-sm text-white`}
          >
            <IoMdThumbsUp size={20} className="mb-1" />
            <span>{'興味あり'}</span>
          </div>
        ) : (
          <div
            className={`flex h-[34px] w-[150px] items-center justify-center space-x-1 rounded-full border border-[#dedede] text-sm text-[#dedede]`}
          >
            <BiMeh size={20} />
            <span>{'興味なし'}</span>
          </div>
        )}

        <div className="flex flex-row items-start gap-1 text-mini text-[#afafaf]">
          --- ご回答ありがとうございます ---
        </div>
      </div>
    </div>
  )
}
