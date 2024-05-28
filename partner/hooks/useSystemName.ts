import { useAppDispatch } from '@/store'
import { setStoreSubDomainPref } from '@/store/reducers/global'
import { getPrefectureFromHostname } from '@/utils/common'
import { useState, useEffect } from 'react'
import { useView } from './useView'

function useSystemName() {
  const view = useView()
  const dispatch = useAppDispatch()
  const [systemTitle, setSystemTitle] = useState('')
  const [systemSubTitle, setSystemSubTitle] = useState('')
  const [systemImg, setSystemImg] = useState(view === 'PC' ? '/images/hero_section/default_pc.png' : '/images/hero_section/default_sp.png')
  const [isOnlyImg, setIsOnlyImg] = useState(false)
  const [mainText, setMainText] = useState('')
  const [subText, setSubText] = useState('')
  const [subTextSp, setSubTextSp] = useState('')

  const [systemName, setSystemName] = useState('スポーツ・カルチャー人材バンク')

  useEffect(() => {
    const pref = getPrefectureFromHostname('ja')
    dispatch(setStoreSubDomainPref(pref))

    const { title, subTitle, img, isOnlyImg, mainText, subText, subTextSp } = genSystem(pref, view)
    setSystemTitle(title || pref)
    setSystemSubTitle(subTitle)
    setSystemImg(img)
    setIsOnlyImg(isOnlyImg)
    setMainText(mainText)
    setSubText(subText)
    setSubTextSp(subTextSp)

    setSystemName(`${title} ${subTitle}`)
  }, [])

  return {
    systemTitle,
    systemSubTitle,
    systemImg,
    isOnlyImg,
    mainText,
    subText,
    subTextSp,

    systemName,
  }
}

const genSystem = (pref: string, view: string) => {
  const defaultImg = view === 'PC' ? '/images/hero_section/default_pc.png' : '/images/hero_section/default_sp.png'
  const defaultMainText = 'あなたのチカラで\nスポーツ・カルチャーの未来は\nもっと面白くなる'
  const defaultSubText = (systemName: string) =>
    `${systemName}では、部活動や地域クラブで子どもたちの指導やサポートを行う人材を募集しています。ぜひ、あなたのスポーツ経験や文化的な知識を活かして、未来の才能を伸ばすお手伝いをお願いします！`

  const SYSTEM_NAME_MAP: {
    [key: string]: {
      title: string
      subTitle: string
      img: string
      isOnlyImg: boolean
      mainText: string
      subText: (value: string) => string
      subTextSp: (value: string) => string
    }
  } = {
    北海道: {
      title: '北海道',
      subTitle: 'スポーツ・カルチャー人材バンク',
      img: defaultImg,
      isOnlyImg: false,
      mainText: defaultMainText,
      subText: defaultSubText,
      subTextSp: defaultSubText,
    },
    青森県: {
      title: '青森県',
      subTitle: 'スポーツ・カルチャー人材バンク',
      img: defaultImg,
      isOnlyImg: false,
      mainText: defaultMainText,
      subText: defaultSubText,
      subTextSp: defaultSubText,
    },
    岩手県: {
      title: '岩手県',
      subTitle: 'スポーツ・カルチャー人材バンク',
      img: defaultImg,
      isOnlyImg: false,
      mainText: defaultMainText,
      subText: defaultSubText,
      subTextSp: defaultSubText,
    },
    宮城県: {
      title: '宮城県',
      subTitle: 'スポーツ・カルチャー人材バンク',
      img: defaultImg,
      isOnlyImg: false,
      mainText: defaultMainText,
      subText: defaultSubText,
      subTextSp: defaultSubText,
    },
    秋田県: {
      title: '秋田県',
      subTitle: 'スポーツ・カルチャー人材バンク',
      img: defaultImg,
      isOnlyImg: false,
      mainText: defaultMainText,
      subText: defaultSubText,
      subTextSp: defaultSubText,
    },
    山形県: {
      title: '山形県',
      subTitle: 'スポーツ・カルチャー人材バンク',
      img: defaultImg,
      isOnlyImg: false,
      mainText: defaultMainText,
      subText: defaultSubText,
      subTextSp: defaultSubText,
    },
    福島県: {
      title: '福島県',
      subTitle: 'スポーツ・カルチャー人材バンク',
      img: defaultImg,
      isOnlyImg: false,
      mainText: defaultMainText,
      subText: defaultSubText,
      subTextSp: defaultSubText,
    },
    茨城県: {
      title: '茨城県地域クラブ活動人材バンク',
      subTitle: '',
      img: defaultImg,
      isOnlyImg: false,
      mainText: 'あなたの協力で\n茨城県のスポーツ・文化は\nもっと輝く',
      subText: (systemName: string) =>
        `茨城県では、部活動や地域クラブで子どもたちの指導やサポートを行う人材を募集しています。\nぜひ、あなたのスポーツ経験や文化的な知識を活かして、未来の才能を伸ばすお手伝いをお願いします！`,
      subTextSp: (systemName: string) =>
        '茨城県では、子どもたちのために指導やサポートを行う人材を募集しています。あなたのスキルを活かして、一緒に未来をつくりませんか？',
    },
    栃木県: {
      title: '栃木県',
      subTitle: 'スポーツ・カルチャー人材バンク',
      img: defaultImg,
      isOnlyImg: false,
      mainText: defaultMainText,
      subText: defaultSubText,
      subTextSp: defaultSubText,
    },
    群馬県: {
      title: '群馬県',
      subTitle: 'スポーツ・カルチャー人材バンク',
      img: defaultImg,
      isOnlyImg: false,
      mainText: defaultMainText,
      subText: defaultSubText,
      subTextSp: defaultSubText,
    },
    埼玉県: {
      title: '埼玉県',
      subTitle: 'スポーツ・カルチャー人材バンク',
      img: defaultImg,
      isOnlyImg: false,
      mainText: defaultMainText,
      subText: defaultSubText,
      subTextSp: defaultSubText,
    },
    千葉県: {
      title: 'CIMS',
      subTitle: '千葉県地域クラブ活動等指導者人材バンク',
      img: '/images/hero_section/千葉県.png',
      isOnlyImg: true,
      mainText: defaultMainText,
      subText: defaultSubText,
      subTextSp: defaultSubText,
    },
    東京都: {
      title: '東京都',
      subTitle: 'スポーツ・カルチャー人材バンク',
      img: defaultImg,
      isOnlyImg: false,
      mainText: defaultMainText,
      subText: defaultSubText,
      subTextSp: defaultSubText,
    },
    神奈川県: {
      title: '神奈川県',
      subTitle: 'スポーツ・カルチャー人材バンク',
      img: defaultImg,
      isOnlyImg: false,
      mainText: defaultMainText,
      subText: defaultSubText,
      subTextSp: defaultSubText,
    },
    新潟県: {
      title: '新潟県',
      subTitle: 'スポーツ・カルチャー人材バンク',
      img: defaultImg,
      isOnlyImg: false,
      mainText: defaultMainText,
      subText: defaultSubText,
      subTextSp: defaultSubText,
    },
    富山県: {
      title: '富山県',
      subTitle: 'スポーツ・カルチャー人材バンク',
      img: defaultImg,
      isOnlyImg: false,
      mainText: defaultMainText,
      subText: defaultSubText,
      subTextSp: defaultSubText,
    },
    石川県: {
      title: '石川県',
      subTitle: 'スポーツ・カルチャー人材バンク',
      img: defaultImg,
      isOnlyImg: false,
      mainText: defaultMainText,
      subText: defaultSubText,
      subTextSp: defaultSubText,
    },
    福井県: {
      title: '福井県',
      subTitle: 'スポーツ・カルチャー人材バンク',
      img: defaultImg,
      isOnlyImg: false,
      mainText: defaultMainText,
      subText: defaultSubText,
      subTextSp: defaultSubText,
    },
    山梨県: {
      title: '山梨県',
      subTitle: 'スポーツ・カルチャー人材バンク',
      img: defaultImg,
      isOnlyImg: false,
      mainText: defaultMainText,
      subText: defaultSubText,
      subTextSp: defaultSubText,
    },
    長野県: {
      title: '長野県',
      subTitle: 'スポーツ・カルチャー人材バンク',
      img: defaultImg,
      isOnlyImg: false,
      mainText: defaultMainText,
      subText: defaultSubText,
      subTextSp: defaultSubText,
    },
    岐阜県: {
      title: '岐阜県',
      subTitle: 'スポーツ・カルチャー人材バンク',
      img: defaultImg,
      isOnlyImg: false,
      mainText: defaultMainText,
      subText: defaultSubText,
      subTextSp: defaultSubText,
    },
    静岡県: {
      title: '静岡県',
      subTitle: 'スポーツ・カルチャー人材バンク',
      img: defaultImg,
      isOnlyImg: false,
      mainText: defaultMainText,
      subText: defaultSubText,
      subTextSp: defaultSubText,
    },
    愛知県: {
      title: '愛知県',
      subTitle: 'スポーツ・カルチャー人材バンク',
      img: defaultImg,
      isOnlyImg: false,
      mainText: defaultMainText,
      subText: defaultSubText,
      subTextSp: defaultSubText,
    },
    三重県: {
      title: '三重県',
      subTitle: 'スポーツ・カルチャー人材バンク',
      img: defaultImg,
      isOnlyImg: false,
      mainText: defaultMainText,
      subText: defaultSubText,
      subTextSp: defaultSubText,
    },
    滋賀県: {
      title: '滋賀県',
      subTitle: 'スポーツ・カルチャー人材バンク',
      img: defaultImg,
      isOnlyImg: false,
      mainText: defaultMainText,
      subText: defaultSubText,
      subTextSp: defaultSubText,
    },
    京都府: {
      title: '京都府',
      subTitle: 'スポーツ・カルチャー人材バンク',
      img: defaultImg,
      isOnlyImg: false,
      mainText: defaultMainText,
      subText: defaultSubText,
      subTextSp: defaultSubText,
    },
    大阪府: {
      title: '大阪府',
      subTitle: 'スポーツ・カルチャー人材バンク',
      img: defaultImg,
      isOnlyImg: false,
      mainText: defaultMainText,
      subText: defaultSubText,
      subTextSp: defaultSubText,
    },
    兵庫県: {
      title: '兵庫県',
      subTitle: 'スポーツ・カルチャー人材バンク',
      img: defaultImg,
      isOnlyImg: false,
      mainText: defaultMainText,
      subText: defaultSubText,
      subTextSp: defaultSubText,
    },
    奈良県: {
      title: '奈良県',
      subTitle: 'スポーツ・カルチャー人材バンク',
      img: defaultImg,
      isOnlyImg: false,
      mainText: defaultMainText,
      subText: defaultSubText,
      subTextSp: defaultSubText,
    },
    和歌山県: {
      title: '和歌山県',
      subTitle: 'スポーツ・カルチャー人材バンク',
      img: defaultImg,
      isOnlyImg: false,
      mainText: defaultMainText,
      subText: defaultSubText,
      subTextSp: defaultSubText,
    },
    鳥取県: {
      title: '鳥取県',
      subTitle: 'スポーツ・カルチャー人材バンク',
      img: defaultImg,
      isOnlyImg: false,
      mainText: defaultMainText,
      subText: defaultSubText,
      subTextSp: defaultSubText,
    },
    島根県: {
      title: '島根県',
      subTitle: 'スポーツ・カルチャー人材バンク',
      img: defaultImg,
      isOnlyImg: false,
      mainText: defaultMainText,
      subText: defaultSubText,
      subTextSp: defaultSubText,
    },
    岡山県: {
      title: '岡山県',
      subTitle: 'スポーツ・カルチャー人材バンク',
      img: defaultImg,
      isOnlyImg: false,
      mainText: defaultMainText,
      subText: defaultSubText,
      subTextSp: defaultSubText,
    },
    広島県: {
      title: '広島県',
      subTitle: 'スポーツ・カルチャー人材バンク',
      img: defaultImg,
      isOnlyImg: false,
      mainText: defaultMainText,
      subText: defaultSubText,
      subTextSp: defaultSubText,
    },
    山口県: {
      title: '山口県',
      subTitle: 'スポーツ・カルチャー人材バンク',
      img: defaultImg,
      isOnlyImg: false,
      mainText: defaultMainText,
      subText: defaultSubText,
      subTextSp: defaultSubText,
    },
    徳島県: {
      title: '徳島県',
      subTitle: 'スポーツ・カルチャー人材バンク',
      img: defaultImg,
      isOnlyImg: false,
      mainText: defaultMainText,
      subText: defaultSubText,
      subTextSp: defaultSubText,
    },
    香川県: {
      title: '香川県',
      subTitle: 'スポーツ・カルチャー人材バンク',
      img: defaultImg,
      isOnlyImg: false,
      mainText: defaultMainText,
      subText: defaultSubText,
      subTextSp: defaultSubText,
    },
    愛媛県: {
      title: '愛媛県',
      subTitle: 'スポーツ・カルチャー人材バンク',
      img: defaultImg,
      isOnlyImg: false,
      mainText: defaultMainText,
      subText: defaultSubText,
      subTextSp: defaultSubText,
    },
    高知県: {
      title: '高知県',
      subTitle: 'スポーツ・カルチャー人材バンク',
      img: defaultImg,
      isOnlyImg: false,
      mainText: defaultMainText,
      subText: defaultSubText,
      subTextSp: defaultSubText,
    },
    福岡県: {
      title: '福岡県',
      subTitle: 'スポーツ・カルチャー人材バンク',
      img: defaultImg,
      isOnlyImg: false,
      mainText: defaultMainText,
      subText: defaultSubText,
      subTextSp: defaultSubText,
    },
    佐賀県: {
      title: '佐賀県',
      subTitle: 'スポーツ・カルチャー人材バンク',
      img: defaultImg,
      isOnlyImg: false,
      mainText: defaultMainText,
      subText: defaultSubText,
      subTextSp: defaultSubText,
    },
    長崎県: {
      title: '長崎県',
      subTitle: 'スポーツ・カルチャー人材バンク',
      img: defaultImg,
      isOnlyImg: false,
      mainText: defaultMainText,
      subText: defaultSubText,
      subTextSp: defaultSubText,
    },
    熊本県: {
      title: '熊本県',
      subTitle: 'スポーツ・カルチャー人材バンク',
      img: defaultImg,
      isOnlyImg: false,
      mainText: defaultMainText,
      subText: defaultSubText,
      subTextSp: defaultSubText,
    },
    大分県: {
      title: '大分県',
      subTitle: 'スポーツ・カルチャー人材バンク',
      img: defaultImg,
      isOnlyImg: false,
      mainText: defaultMainText,
      subText: defaultSubText,
      subTextSp: defaultSubText,
    },
    宮崎県: {
      title: '宮崎県',
      subTitle: 'スポーツ・カルチャー人材バンク',
      img: defaultImg,
      isOnlyImg: false,
      mainText: defaultMainText,
      subText: defaultSubText,
      subTextSp: defaultSubText,
    },
    鹿児島県: {
      title: '鹿児島県',
      subTitle: 'スポーツ・カルチャー人材バンク',
      img: defaultImg,
      isOnlyImg: false,
      mainText: defaultMainText,
      subText: defaultSubText,
      subTextSp: defaultSubText,
    },
    沖縄県: {
      title: '沖縄県',
      subTitle: 'スポーツ・カルチャー人材バンク',
      img: defaultImg,
      isOnlyImg: false,
      mainText: defaultMainText,
      subText: defaultSubText,
      subTextSp: defaultSubText,
    },
  }

  const { title, subTitle, img, isOnlyImg, mainText, subText, subTextSp } = SYSTEM_NAME_MAP[pref]
  return {
    title,
    subTitle,
    img,
    isOnlyImg,
    mainText,
    subText: subText(`${title} ${subTitle}`),
    subTextSp: subTextSp(`${title} ${subTitle}`),
  }
}

export default useSystemName
