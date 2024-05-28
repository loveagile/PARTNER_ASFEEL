import React, { useEffect, useState } from 'react'
import useSystemName from '@/hooks/useSystemName'

interface ChildrenProps {
  view: string
  mainText: string
  subText: string
}

function HeroSection({ view }: { view: string }) {
  const { systemImg, isOnlyImg, mainText, subText, subTextSp } = useSystemName()
  const [bgHeight, setBgHeight] = useState('392px')

  useEffect(() => {
    const handleResize = () => {
      const ratio = 392 / 1280
      const newHeight = window.innerWidth * ratio
      setBgHeight(`${newHeight}px`)
    }

    window.addEventListener('resize', handleResize)
    handleResize() // 初期レンダリング時にも実行

    return () => {
      window.removeEventListener('resize', handleResize)
    }
  }, [])

  return (
    <>
      <section
        className={`relative text-gray-white ${
          isOnlyImg
            ? 'mx-auto w-full'
            : view == 'PC'
            ? 'h-[24.5rem] pb-4 pl-[30px] pt-[165px]'
            : 'h-[200px] pl-5 pt-[117px]'
        }`}
        style={{
          height: isOnlyImg ? bgHeight : undefined,
          backgroundImage: `url(${systemImg})`,
          backgroundSize: 'cover',
          backgroundRepeat: 'no-repeat',
          backgroundPosition: 'center',
        }}
      >
        {!isOnlyImg && <HeroContent view={view} mainText={mainText} subText={subText} />}
      </section>

      {!isOnlyImg && <Description view={view} subTextSp={subTextSp} />}
    </>
  )
}

function HeroContent({ view, mainText, subText }: ChildrenProps) {
  return (
    <div className={`absolute flex flex-col items-start gap-5  ${view == 'PC' ? ' ' : ' bottom-0 z-[1] -mb-[5.5px]'}`}>
      <p className={`whitespace-pre-wrap ${view == 'PC' ? ' w-[448px] text-title' : 'w-[280px] text-h2'}`}>
        {mainText}
      </p>

      {view == 'PC' && (
        <div
          className={`flex flex-col items-start gap-1 whitespace-pre-wrap ${view == 'PC' ? ' text-h4' : 'text-mini '}`}
        >
          {subText}
        </div>
      )}
    </div>
  )
}

function Description({ view, subTextSp }: { view: string; subTextSp: string }) {
  return (
    <>
      {view !== 'PC' && (
        <div className={`relative bg-core-blue_dark px-5 py-4 text-[10px]  text-gray-white `}>
          <p>{subTextSp}</p>
        </div>
      )}
    </>
  )
}

export default HeroSection
