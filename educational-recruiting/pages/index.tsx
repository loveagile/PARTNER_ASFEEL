import Button, { ButtonArrow, ButtonColor, ButtonIcon, ButtonShape, ButtonSize, ButtonType } from '@/components/atoms/Button/Button'
import SchoolLayout from '@/components/layouts/SchoolLayout'
import { useView } from '@/hooks'
import landingPage from '../public/images/landing/landingImage.png'
import Router from 'next/router'
import useSystemName from '@/hooks/useSystemName'

const HeroSection = () => {
  const view = useView()
  const { logoWithoutNewLine } = useSystemName()
  return (
    <>
      <section
        style={{
          backgroundImage: `url(${landingPage.src})`,
          backgroundSize: 'cover',
          backgroundRepeat: 'no-repeat',
          backgroundPosition: 'center',
        }}
        className={` text-gray-white relative ${view == 'PC' ? ' pt-[165px] pb-4 pl-[30px] h-[24.5rem]' : ' pt-[117px] pl-5 h-[200px]'}`}
      >
        {/* <Image src={landingPage.src} alt="landing Image" fill /> */}
        <div className={`absolute flex flex-col items-start gap-5  ${view == 'PC' ? ' ' : ' z-[1] bottom-0 -mb-[9px]'}`}>
          <p className={` ${view == 'PC' ? ' text-title w-[448px]' : 'text-h2 w-[280px]'}`}>
            あなたのチカラで
            <br /> スポーツ・カルチャーの未来は もっと面白くなる
          </p>
          {view == 'PC' && (
            <div className={`flex flex-col items-start gap-1  ${view == 'PC' ? ' text-h4' : 'text-mini '}`}>
              <p>{logoWithoutNewLine}では、 部活動や地域クラブで子どもたちの指導やサポートを行う人材を募集しています。</p>
              <p>ぜひ、 あなたのスポーツ経験や文化的な知識を活かして、 未来の才能を伸ばすお手伝いをお願いします！</p>
            </div>
          )}
        </div>
      </section>
      {view !== 'PC' && (
        <div className={`py-4 px-5 text-body font-semibold bg-core-blue_dark text-gray-white  relative `}>
          <p>
            {logoWithoutNewLine}では、 部活動や地域クラブで子どもたちの指導やサポートを行う人材を募集しています。ぜひ、
            あなたのスポーツ経験や文化的な知識を活かして、 未来の才能を伸ばすお手伝いをお願いします！
          </p>
        </div>
      )}
    </>
  )
}

const Content = () => {
  const view = useView()
  return (
    <div className={`flex flex-col items-center py-[2rem]   ${view == 'PC' ? ' px-[12.5rem] gap-[30px] ' : 'px-[4rem] gap-[20px]'}`}>
      <p className={` ${view == 'PC' ? 'text-h1' : 'text-h2 '}`}>指導者募集</p>
      <Button
        size={view == 'SP' ? ButtonSize.SP : ButtonSize.PC}
        color={ButtonColor.DEFAULT}
        type={ButtonType.DEFAULT}
        shape={ButtonShape.ELLIPSE}
        disabled={false}
        icon={ButtonIcon.OFF}
        text="募集依頼を作成する"
        arrow={ButtonArrow.OFF}
        onclick={() => {
          Router.push('/projects/new/create')
        }}
        // style={{ padding: "16px 30px" }}
        className="py-4 px-[30px]"
      />
      <div className={`flex  items-center justify-between p-5  bg-gray-gray_lighter ${view == 'PC' ? 'flex-row gap-[50px]' : 'flex-col gap-[20px]'}`}>
        <div className="flex flex-col items-start gap-[10px] ">
          <p className={` ${view == 'PC' ? 'text-h1 ' : 'text-h4'}`}>オンライン説明会</p>
          <p className={` ${view == 'PC' ? 'text-body_pc ' : 'text-body_sp'}`}>
            採用までの流れを詳しくご説明いたしますので依頼前または後に説明会にご参加ください
          </p>
        </div>
        <Button
          size={view == 'SP' ? ButtonSize.SP : ButtonSize.PC}
          color={ButtonColor.SUB}
          type={ButtonType.DEFAULT}
          shape={ButtonShape.RECTANGLE}
          disabled={false}
          icon={ButtonIcon.OFF}
          text="説明会予約"
          arrow={ButtonArrow.OFF}
          onclick={() => {
            Router.push('https://timerex.net/s/bukatsu-app/f165742d')
          }}
          style={{ padding: '6.5px 35px' }}
        />
      </div>
    </div>
  )
}

export default function Page() {
  return (
    <div className="h-full bg-gray-white">
      <SchoolLayout>
        <HeroSection />
        <Content />
      </SchoolLayout>
    </div>
  )
}
