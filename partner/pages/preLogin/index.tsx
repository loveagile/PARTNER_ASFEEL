import Button, {
  ButtonArrow,
  ButtonColor,
  ButtonIcon,
  ButtonShape,
  ButtonSize,
  ButtonType,
} from '@/components/atoms/Button/Button'
import HomeLayout from '@/components/layouts/HomeLayout'
import SportType from '@/components/organisms/Card/SportTypes'
import { useView } from '@/hooks'
import Card1 from '@/components/organisms/Card/Card1'
import { useEffect, useMemo, useRef, useState } from 'react'
import Card2 from '@/components/organisms/Card/Card2'
import { MdArrowBackIos, MdArrowForwardIos, MdArrowRight, MdEmail } from 'react-icons/md'
import { HiQuestionMarkCircle } from 'react-icons/hi'
import { useRouter } from 'next/router'

// import Swiper core and required modules
import { Virtual, Navigation, Pagination, Scrollbar, A11y } from 'swiper'

import { Swiper, SwiperSlide } from 'swiper/react'
// Import Swiper styles
import 'swiper/css'
import 'swiper/css/navigation'
import 'swiper/css/pagination'
import 'swiper/css/scrollbar'
import 'swiper/css/virtual'

import styled from 'styled-components'
import { customizeLeaderProjectList } from '@/utils/common'
import { getLeadersWantedProjectListByPrefecture } from '@/firebase/leadersWantedProject'
import { useAppSelector } from '@/store'
import AppLoader from '@/components/atoms/AppLoader'
import { JobCardProps } from '@/components/organisms/Card/JobCard'
import HeroSection from '@/components/organisms/PageTop/HeroSection'

const StyledPCSwipe = styled.div`
  @media only screen and (min-width: 800px) {
    .swiper.swiper-virtual.swiper-initialized.swiper-horizontal.swiper-watch-progress {
      overflow: unset;
    }
  }
  .swiper-button-prev,
  .swiper-button-next {
    visibility: hidden;
  }
`

const StyledSPSwipe = styled.div`
  .swiper-pagination.swiper-pagination-clickable.swiper-pagination-bullets.swiper-pagination-horizontal {
    bottom: -5px;
    position: inherit;
  }
`

const useInit = () => {
  const view = useView()
  const router = useRouter()
  const rowRef = useRef<HTMLDivElement>(null)
  const { subDomainPref } = useAppSelector((state) => state.global)

  const [leaderProjectList, setLeaderProjectList] = useState<JobCardProps[]>([])
  const [loading, setLoading] = useState<boolean>(true)

  useEffect(() => {
    const fetchData = async () => {
      try {
        const leaderProject = await getLeadersWantedProjectListByPrefecture(subDomainPref)
        const tmpLeaderProject = customizeLeaderProjectList(leaderProject)

        setLeaderProjectList(tmpLeaderProject)
      } catch (error) {
        console.error(error)
      } finally {
        setLoading(false)
      }
    }
    fetchData()
  }, [subDomainPref])

  const handleClick = (direction: string) => {
    const button =
      direction === 'prev'
        ? document.querySelector<HTMLElement>('.swiper-button-prev')
        : document.querySelector<HTMLElement>('.swiper-button-next')
    button?.click()
  }

  const isExistLeaderProjectList = useMemo(() => {
    return leaderProjectList && leaderProjectList.length > 0
  }, [leaderProjectList])

  return {
    view,
    router,
    rowRef,
    leaderProjectList,
    loading,
    isExistLeaderProjectList,
    handleClick,
  }
}

export default function PreLoginPage() {
  const { view, router, rowRef, leaderProjectList, loading, isExistLeaderProjectList, handleClick } = useInit()

  return (
    <div className="h-full bg-gray-white">
      <HomeLayout>
        <HeroSection view={view} />

        {loading ? (
          <div className="flex items-center justify-center pt-32">
            <AppLoader />
          </div>
        ) : (
          <div className="sp:pt-5 pc:pt-10">
            <div>
              <div className="flex justify-center gap-2 sp:pb-5 pc:pb-10">
                <img src="/images/icons/sound.svg" className="sp:w-6 pc:w-10" alt="image" />
                <h1 className="text-center font-bold text-core-blue_dark  sp:text-xl  pc:text-4xl">募集中の求人</h1>
              </div>

              <ClubIconsSection />

              {isExistLeaderProjectList && (
                <div className="mx-auto pc:max-w-[880px] pc:overflow-hidden">
                  <div className="z-0 sp:pb-5 pc:mx-auto pc:max-w-[650px] pc:pb-10" ref={rowRef}>
                    {view == 'PC' ? (
                      <StyledPCSwipe>
                        <Swiper
                          modules={[Virtual, Navigation, Pagination, Scrollbar, A11y]}
                          spaceBetween={10}
                          slidesPerView={2}
                          navigation
                          virtual
                          breakpoints={{
                            360: {
                              slidesPerView: 1.5,
                              spaceBetween: 10,
                            },
                            800: {
                              slidesPerView: 1.5,
                              spaceBetween: 10,
                            },
                            880: {
                              slidesPerView: 2,
                              spaceBetween: 10,
                            },
                            1024: {
                              slidesPerView: 2,
                              spaceBetween: 10,
                            },
                          }}
                        >
                          {leaderProjectList.map((data, index) => (
                            <SwiperSlide key={index} virtualIndex={index}>
                              <Card1 {...data} key={index} />
                            </SwiperSlide>
                          ))}
                        </Swiper>
                      </StyledPCSwipe>
                    ) : (
                      view == 'SP' && (
                        <StyledSPSwipe>
                          <Swiper
                            modules={[Virtual, Navigation, Pagination, Scrollbar, A11y]}
                            spaceBetween={10}
                            slidesPerView={1.5}
                            breakpoints={{
                              360: {
                                slidesPerView: 1.5,
                                spaceBetween: 10,
                              },
                              800: {
                                slidesPerView: 1.5,
                                spaceBetween: 10,
                              },
                              880: {
                                slidesPerView: 2,
                                spaceBetween: 10,
                              },
                              1024: {
                                slidesPerView: 2,
                                spaceBetween: 10,
                              },
                            }}
                            virtual
                            centeredSlides={true}
                            pagination={{ clickable: true }}
                          >
                            {leaderProjectList.map((data, index) => (
                              <SwiperSlide key={index} virtualIndex={index}>
                                <Card1 {...data} key={index} />
                              </SwiperSlide>
                            ))}
                          </Swiper>
                        </StyledSPSwipe>
                      )
                    )}
                  </div>
                </div>
              )}

              {isExistLeaderProjectList && view == 'PC' && (
                <div className=" mx-auto flex h-full w-full max-w-[992px] items-center justify-between sp:-mt-[150px] pc:-mt-[200px]">
                  <button className="z-30 rounded-full bg-core-blue p-4 " onClick={() => handleClick('prev')}>
                    {' '}
                    <MdArrowBackIos className="h-[24px] w-[24px] translate-x-1 text-white" />
                  </button>
                  <button className="z-30 rounded-full bg-core-blue p-4 " onClick={() => handleClick('next')}>
                    {' '}
                    <MdArrowForwardIos className="h-[24px] w-[24px] text-white" />
                  </button>
                </div>
              )}

              <div className="flex items-center justify-center sp:mt-[20px] sp:pb-[60px] pc:mt-36 pc:pb-[80px]">
                {isExistLeaderProjectList ? (
                  <Button
                    size={ButtonSize.PC}
                    color={ButtonColor.SUB}
                    type={ButtonType.SECONDARY}
                    shape={ButtonShape.RECTANGLE}
                    disabled={false}
                    icon={ButtonIcon.FRONT}
                    arrow={ButtonArrow.RIGHT}
                    text="すべて見る"
                    onclick={() => {
                      router.push('/jobList')
                    }}
                    className="border-2 py-1.5 sp:h-[34px] sp:w-[150px] sp:px-3 pc:h-[56px] pc:w-[190px] pc:px-6"
                  />
                ) : null}
              </div>
            </div>

            <StaticSection />
          </div>
        )}
      </HomeLayout>
    </div>
  )
}

function ClubIconsSection() {
  const { clubList } = useAppSelector((state) => state.global)
  const clubIcons = useMemo(() => {
    return clubList.map((club) => {
      return {
        url: club.name,
        descText: club.name,
      }
    })
  }, [clubList])

  return (
    <div className="flex sp:pb-5 pc:pb-10">
      <Swiper
        modules={[Virtual, Navigation, Pagination, Scrollbar, A11y]}
        spaceBetween={10}
        centeredSlides={false}
        slidesPerView={5}
        breakpoints={{
          360: {
            slidesPerView: 6,
            spaceBetween: 12,
          },
          800: {
            slidesPerView: 8,
            spaceBetween: 12,
          },
          880: {
            slidesPerView: 12,
            spaceBetween: 16,
          },
          1024: {
            slidesPerView: 12,
            spaceBetween: 16,
          },
          1440: {
            slidesPerView: 16,
            spaceBetween: 16,
          },
          1920: {
            slidesPerView: 18,
            spaceBetween: 16,
          },
        }}
        virtual
      >
        {clubIcons.map((club, index) => (
          <SwiperSlide key={index} virtualIndex={index}>
            <SportType {...club} key={index} />
          </SwiperSlide>
        ))}
      </Swiper>
    </div>
  )
}

function StaticSection() {
  const view = useView()
  const router = useRouter()
  const howToUseFlow = [
    {
      url: 'Group',
      number: 1,
      title: '登録',
      desc: `プロフィールや 指導できる競技を登録`,
    },
    {
      url: 'Group',
      number: 2,
      title: `応募 スカウト`,
      desc: `求人に応募したり スカウトをチェック！`,
    },
    {
      url: 'Group',
      number: 3,
      title: '面談',
      desc: `両社の希望が合えば 面談に進みます`,
    },
    {
      url: 'Group',
      number: 4,
      title: '勤務開始',
      desc: `学校や地域クラブで 指導・サポートを開始`,
    },
  ]
  return (
    <>
      <div className="mx-auto max-w-[800px] px-[10px]">
        <div className=" h-[1px] bg-core-blue_dark " />
        <h1 className="text-center font-bold text-core-blue_dark sp:py-2.5 sp:text-[16px] pc:py-5 pc:text-xl">
          ご利用の流れ
        </h1>
        <div className=" mb-[30px] h-[1px]  bg-core-blue_dark" />
        <div className="grid items-center sp:grid-cols-1 sp:gap-0 pc:grid-cols-4 pc:gap-[48px]">
          {howToUseFlow.map((data, index) => (
            <div className="sp:grid pc:flex" key={index}>
              <Card2 {...data} key={index} />
              {index < 3 &&
                (view == 'PC' ? (
                  <div className="pc:mt-[65px] pc:pl-[19px]">
                    <MdArrowRight className="scale-[2] transform text-core-blue_dark pc:h-[20px] pc:w-[20px]" />
                  </div>
                ) : (
                  <div className="justify-self-center">
                    <MdArrowRight className="my-[10px] rotate-90 scale-[2] transform text-core-blue_dark pc:h-[15px] pc:w-[15px]" />
                  </div>
                ))}
            </div>
          ))}
        </div>
      </div>

      <div className="flex items-center justify-center sp:mb-[60px] sp:mt-4 pc:mb-[80px] pc:mt-8">
        <Button
          size={ButtonSize.PC}
          color={ButtonColor.SUB}
          type={ButtonType.DEFAULT}
          shape={ButtonShape.ELLIPSE}
          disabled={false}
          icon={ButtonIcon.FRONT}
          arrow={ButtonArrow.RIGHT}
          text="はじめる"
          onclick={() => {
            router.push('/signup')
          }}
          className="border-2 py-1.5 sp:h-[34px] sp:w-[150px] sp:px-3 pc:h-[56px] pc:w-[190px] pc:px-6"
        />
      </div>

      <div className="mx-auto max-w-[800px] px-[10px]">
        <div className=" h-[1px] bg-core-blue_dark" />
        <h1 className="whitespace-pre-wrap text-center  font-bold text-core-blue_dark sp:py-4 sp:text-[16px] pc:py-5 pc:text-[20px]">
          {`部活動・地域クラブ活動指導員等を募集する\n団体の皆様へ`}
        </h1>
        <div className="relative h-[1px] bg-core-blue_dark" />
        <>
          <div className="py-[30px]">
            {/* <div className="mx-auto gap-[30px] sp:grid sp:justify-items-center pc:flex">
              <img src={landingPage2.src} className="h-[200px] sp:w-[300px] pc:w-[300px]" alt="landing Image" />
              <h1 className="font-bold text-neutral-900 sp:w-[300px] sp:text-[12px] pc:w-full pc:text-start  pc:text-[16px]">
                system_nameは教育委員会が運営する部活動指導員・外部指導者の人材マッチングサービスです。
                <br />
                2017年に「部活動指導員」が制度化されて以降,
                外部から積極的に指導やサポートを行う人材を迎える学校や地域クラブが増えており,
                その有用性は高く評価されています。
                <br />
                部活動指導員の導入は多忙な先生方の負担軽減だけでなく,
                スキルや専門知識を持つ人材の採用により生徒の技能向上が期待できます。導入をご検討の際はお問合せください。
              </h1>
            </div> */}
            <div className="mt-[30px] flex items-center justify-center sp:mb-[30px] pc:mb-[50px] ">
              <Button
                size={ButtonSize.PC}
                color={ButtonColor.SUB}
                type={ButtonType.SECONDARY}
                shape={ButtonShape.RECTANGLE}
                disabled={false}
                icon={ButtonIcon.FRONT}
                iconComponent={<MdEmail size={18} />}
                text="お問合せ"
                onclick={() => {
                  window.open('https://forms.gle/dkiBX1Y4i5ZcuKXL9', '_blank')
                }}
                className="border-2 py-1.5 sp:h-[34px] sp:w-[150px] sp:px-3 pc:h-[56px] pc:w-[190px] pc:px-6"
              />
            </div>
          </div>
        </>
      </div>

      <div className="mx-auto max-w-[800px] sp:mb-[40px] pc:mb-[60px]">
        <div className=" mx-[10px] h-[1px] bg-core-blue_dark" />
        <h1 className="text-center font-bold text-core-blue_dark sp:py-4 sp:text-[16px] pc:py-5 pc:text-[20px]">FAQ</h1>
        <div className=" mx-[10px] h-[1px] bg-core-blue_dark" />
        <div className="mx-auto w-fit px-[10px] sp:w-[300px] pc:w-[800px]">
          <h1 className="my-[30px] text-center font-bold text-neutral-900 sp:text-sm pc:text-[16px]">
            よくいただく質問をご紹介しております <br />
            サービスについてお困りごとがございましたらまずはこちらをご確認ください
          </h1>
          <div className="flex items-center justify-center">
            <Button
              size={ButtonSize.PC}
              color={ButtonColor.SUB}
              type={ButtonType.SECONDARY}
              shape={ButtonShape.RECTANGLE}
              disabled={false}
              icon={ButtonIcon.FRONT}
              iconComponent={<HiQuestionMarkCircle size={18} />}
              text="よくある質問"
              onclick={() => {
                window.open('https://www.notion.so/_-e921b2257c6f491c90d76e2f24e8deda?pvs=4', '_blank')
              }}
              className="border-2 py-1.5 sp:h-[34px] sp:w-[150px] sp:px-3 pc:h-[56px] pc:w-[190px] pc:px-6"
            />
          </div>
        </div>
      </div>
    </>
  )
}
