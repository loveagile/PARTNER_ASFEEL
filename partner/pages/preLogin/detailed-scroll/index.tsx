import DetailedJobCard, { DetailedJobCardProps } from '@/components/organisms/Card/DetailedJobCard'
import { useView } from '@/hooks'
import { useEffect, useState } from 'react'
import { MdAccessTimeFilled, MdClose, MdLocationOn } from 'react-icons/md'
import { HiBookOpen, HiCurrencyYen } from 'react-icons/hi'
import { useRouter } from 'next/router'
import Schedule from '@/components/molecules/Table/Schedule'
import { BsFillSearchHeartFill, BsMortarboardFill } from 'react-icons/bs'
import BackButton from '@/components/atoms/Button/BackButton'
import ScrollLayout from '@/components/layouts/ScrollLayout'
import StepCard from '@/components/organisms/modal/StepCard'

const dummmyData: DetailedJobCardProps[] = new Array(1).fill({
  url: 'ball',
  title: '山梨県甲府市エリア',
  subTitle: 'サッカー',
  description:
    '中学生男子のサッカー部の指導の際のアシスタントを募集しています。練習（または試合）は平日ならびに土日祝もあります。指導経験者の方、指導未経験でもサッカー経験者のご応募をお待ちしています！中学生男子のサッカー部の指導の際のアシスタントを募集しています。練習（または試合）は平日ならびに土日祝もあります。指導経験者の方、指導未経験でもサッカー経験者のご応募をお待ちしています！',
  gender: '男子',
  school: '中学校',
  background: 'football',
  count: 1,
})

const scheduleInfo = {
  monday: ['am', 'pm'],
  tuesday: ['pm'],
  wednesday: [],
  thursday: ['am'],
  friday: ['am', 'pm'],
  saturday: [],
  sunday: ['pm'],
}

const Content = () => {
  const view = useView()
  const router = useRouter()

  return (
    <div className="relative">
      {view == 'SP' ? (
        <div className="pb-4">
          <div className="relative mx-auto h-[46px] w-full bg-white pt-[15px] text-center">
            <p className="text-[14px] font-bold">募集詳細</p>
            <MdClose
              className="absolute right-0 top-2.5 text-neutral-500"
              size={24}
              onClick={() => {
                router.push('/preLogin/job-list')
              }}
            />
          </div>
        </div>
      ) : (
        view == 'PC' && (
          <div className="absolute left-10 top-10">
            <BackButton
              onClick={() => {
                router.push('/preLogin/job-list')
              }}
            />
          </div>
        )
      )}

      <div className="mx-auto mb-4 rounded-2xl border border-gray-100 bg-white text-center sp:w-[300px] pc:w-[800px]">
        <div className="cards sp:w-max-[300px] relative z-0 mx-auto grid sp:gap-2 pc:w-[800px] pc:gap-4">
          {dummmyData.map((data, index) => (
            <DetailedJobCard {...data} key={index} />
          ))}
        </div>

        <div className="mx-4">
          <div className="sp:pb-[14px] pc:pb-8">
            <div className="flex sp:pb-[7.5px] pc:pb-[6px]">
              <MdLocationOn className="mr-2 text-core-blue_dark" size={24} />
              <div className="self-center text-start sp:text-[12px] pc:text-[16px]">
                <p className="font-bold text-core-blue_dark ">勤務地</p>
              </div>
            </div>
            <p className="text-start sp:ml-[20px] sp:text-[12px] pc:ml-[30px] pc:text-[16px]">
              山梨県富士吉田市上吉田東
            </p>
          </div>

          <div className="sp:pb-[14px] pc:pb-8">
            <div className="flex sp:pb-[7.5px] pc:pb-[10px]">
              <MdAccessTimeFilled className="mr-2 text-core-blue_dark" size={24} />
              <div className="self-center text-start sp:pt-[3px] sp:text-[12px] pc:pt-[1px] pc:text-[16px]">
                <p className="font-bold text-core-blue_dark sp:pb-[7.5px] pc:pb-[10px]">勤務時間</p>
                {view == 'SP' ? (
                  <Schedule schedule={scheduleInfo} size="mini" />
                ) : (
                  view == 'PC' && <Schedule schedule={scheduleInfo} size="small" />
                )}
              </div>
            </div>
            <div className="text-start sp:ml-[20px] sp:text-[12px] pc:ml-[30px] pc:text-[16px]">
              <p>週２日程度／授業がある平日（月・水・金のシフト制）</p>
              <p>※月に２回は、土日祝日の練習及び試合あり</p>
            </div>
          </div>

          <div className="sp:pb-[14px] pc:pb-8">
            <div className="flex sp:pb-[7.5px] pc:pb-[6px]">
              <HiCurrencyYen className="mr-2 text-core-blue_dark" size={24} />
              <div className="self-center text-start sp:text-[12px] pc:text-[16px]">
                <p className="font-bold text-core-blue_dark ">報酬について</p>
              </div>
            </div>
            <p className="text-start sp:ml-[20px] sp:text-[12px] pc:ml-[30px] pc:text-[16px]">時給2,000円</p>
          </div>

          <div className="sp:pb-[14px] pc:pb-8">
            <div className="flex sp:pb-[7.5px] pc:pb-[6px]">
              <HiBookOpen className="mr-2 text-core-blue_dark" size={24} />
              <div className="self-center text-start sp:text-[12px] pc:text-[16px]">
                <p className="font-bold text-core-blue_dark">活動の紹介</p>
              </div>
            </div>
            <p className="text-start sp:ml-[20px] sp:text-[12px] pc:ml-[30px] pc:text-[16px]">
              ダミーコピーです。僕たち北高サッカー部は顧問の先生の指導のもと、毎日汗を流しています。まだ発展途上の僕たちですが、個々のレベルを上げるとともにチーム力の底上げをして頑張っています。練習時間は約２時間と決して長くはありませんが、集中した中身の濃い練習をしています。今年のバスケットボール部は、去年に比べさらに個性的なメンバーが多くふざけすぎてしまうことも多々ありますが、まじめなゆかいな仲間たちです。
              試合で勝つためには、今以上の練習が必要です。普段の練習から「今の自分より上へ」という目標を持ち、技術的にも精神的にも成長したいと思っています。これからも応援よろしくお願いします。
            </p>
          </div>

          <div className="sp:pb-[14px] pc:pb-8">
            <div className="flex  sp:pb-[7.5px] pc:pb-[13px]">
              <BsMortarboardFill className="mr-2 text-core-blue_dark" size={24} />
              <div className="self-center text-start sp:text-[12px] pc:text-[16px]">
                <p className="font-bold text-core-blue_dark">資格に関する希望</p>
              </div>
            </div>
            <div className="text-start sp:ml-[20px] sp:text-[12px] pc:ml-[30px] pc:text-[16px]">
              <p>・教員免許を取得しているか取得予定の学生</p>
              <p>・普通自動車免許は必須</p>
            </div>
          </div>

          <div className="sp:pb-[14px] pc:pb-8">
            <div className="flex sp:pb-[7.5px] pc:pb-[13px]">
              <BsFillSearchHeartFill className="mr-2 text-core-blue_dark" size={24} />
              <div className="self-center text-start sp:text-[12px] pc:text-[16px]">
                <p className="font-bold text-core-blue_dark">求める人材</p>
              </div>
            </div>
            <p className="text-start sp:ml-[20px] sp:text-[12px] pc:ml-[30px] pc:text-[16px]">
              ダミーコピーです。部活動指導員は、運動部だけでなく文化部の指導も可能です。自分の経験を活かして、子どもたちの教育に携わることができます。何より、生徒の成長を直で感じられるのが1番のメリットです。例えば運動部の場合、顧問教師だけでは回しきれない実践練習も、部活動指導員がいれば実施可能です。生徒は、実際のプレーでしか吸収できない経験を積むことができます。また、フォームの指導1つでも、生徒の力がぐんと伸びることもあります。自分が今まで積んできた経験が、そのまま子どもの役に立つのは大きな喜びです。
            </p>
          </div>
        </div>
      </div>
    </div>
  )
}

export default function Page() {
  const [isModal1Open, setIsModal1Open] = useState(false)
  const [isModal2Open, setIsModal2Open] = useState(false)
  const [isModal3Open, setIsModal3Open] = useState(false)

  useEffect(() => {}, [isModal1Open])

  const click_button = () => {
    setIsModal1Open(true)
  }
  const click_button1 = () => {
    setIsModal1Open(false)
  }
  const click_button2 = () => {
    setIsModal1Open(false)
    setIsModal2Open(true)
  }

  const click_button3 = () => {
    setIsModal2Open(false)
  }
  const click_button4 = () => {
    setIsModal2Open(false)
    setIsModal3Open(true)
  }

  const click_button5 = () => {
    setIsModal3Open(false)
  }

  return (
    <div className="relative h-full bg-gray-white">
      <ScrollLayout onClick={click_button}>
        <Content />
        {isModal1Open && (
          <StepCard
            title={'応募する'}
            imgUrl="exit"
            subTitle="求人の応募にはログインが必要です"
            button1Text="会員登録"
            button2Text="ログイン"
            button1Click={click_button1}
            button2Click={click_button2}
            className="border border-blue-500 bg-white text-blue-500 "
            isModalOpen={isModal1Open}
          />
        )}
        {isModal2Open && (
          <StepCard
            title={'応募する'}
            imgUrl="armsraised"
            subTitle="この求人に応募してよろしいですか？"
            button1Text="キャンセル"
            button2Text="応募する"
            button1Click={click_button3}
            button2Click={click_button4}
            className="border border-gray-400 bg-gray-400 text-white "
          />
        )}
        {isModal3Open && (
          <StepCard
            title={'応募完了'}
            imgUrl="likeButton"
            subTitle="ご応募ありがとうございます！
            求人先とマッチングしましたら
            ご連絡いたします"
            button1Text="OK"
            button1Click={click_button5}
            className="border border-gray-400 bg-gray-400 text-white "
          />
        )}
      </ScrollLayout>
    </div>
  )
}
