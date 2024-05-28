import { ListItem } from '@/components/organisms/List'
import { ClubTypeCategory } from '@/models'
import { useAppSelector } from '@/store'
import { useEffect, useState } from 'react'
var groupArray = require('group-array')

export type InputObject = {
  [key: string]: any
}

export type TreeNode = {
  title: string
  key: string
  children?: TreeNode[]
}

const activityCategories = [
  {
    title: '球技：ゴール型',
    children: ['サッカー', 'バスケットボール', 'ハンドボール', '水球', 'ラグビー', 'ホッケー', 'ラクロス'],
  },
  { title: '球技：ネット型', children: ['バレーボール', 'ソフトテニス', '硬式テニス', '卓球', 'バドミントン'] },
  { title: '球技：ベースボール型・その他', children: ['野球', 'ソフトボール', 'ドッヂボール'] },
  { title: '記録競技', children: ['水泳', '陸上競技'] },
  {
    title: '武道・格闘技',
    children: [
      '空手',
      'フェンシング',
      '剣道',
      'レスリング',
      '少林寺拳法',
      '相撲',
      '合気道',
      'なぎなた',
      '柔道',
      '格闘技',
    ],
  },
  { title: '射的スポーツ', children: ['弓道', 'アーチェリー', '射撃'] },
  { title: '採点競技', children: ['体操', '新体操', 'バトン', 'クラシックバレエ', '社交ダンス', 'ダンス'] },
  {
    title: '野外活動・氷上',
    children: ['ボート', 'カヌー', 'スキー', 'スケート', '馬術', '登山', 'ワンダーフォーゲル'],
  },
  { title: 'その他', children: ['よさこい', '和太鼓', '応援団', 'マーチングバンド', 'ジャグリング'] },
]

const cultureCategories = [
  {
    title: '芸術・音楽',
    children: ['美術', '写真', '吹奏楽', '合唱', '管弦楽', '演劇'],
  },
  {
    title: '三道',
    children: ['書道', '華道', '茶道'],
  },
  {
    title: 'マインドスポーツ',
    children: ['競技かるた', '囲碁', '将棋', 'eスポーツ'],
  },
  {
    title: '技術・家庭科',
    children: ['園芸', '手芸', '料理', '家庭科', 'SDGs', 'パソコン'],
  },
  {
    title: 'メディア',
    children: ['新聞', '放送', '漫画研究', '映画研究', '映像研究'],
  },
  {
    title: '学問',
    children: ['文芸', '数学研究', '英語', 'ディベート', '天文', '科学研究', '簿記'],
  },
  {
    title: 'その他',
    children: ['生徒会', '謎解き', 'ボランティア', 'クイズ', '鉄道研究'],
  },
]

const orderCategories = (input: TreeNode) => {
  const ordered: TreeNode[] = []
  const orderedCategories = input.title === '運動系' ? activityCategories : cultureCategories

  for (const orderCategory of orderedCategories) {
    if (!input.children) continue // カテゴリが存在しない場合はスキップ

    const foundCategory = input.children.find((cat) => cat.title === orderCategory.title)
    if (!foundCategory) continue // カテゴリが存在しない場合はスキップ

    const orderedChildren: typeof foundCategory.children = []
    for (const orderChild of orderCategory.children) {
      if (foundCategory.children) {
        const foundChild = foundCategory.children.find((child: any) =>
          typeof child === 'string' ? child === orderChild : child.title === orderChild,
        )
        if (foundChild) {
          orderedChildren.push(foundChild)
        }
      }
    }

    ordered.push({
      ...foundCategory,
      children: orderedChildren,
    })
  }

  return ordered
}

const getNodes = (object: InputObject): TreeNode[] => {
  return Object.entries(object).map(([key, value]) => {
    if (value && typeof value === 'object') {
      return value?.length > 0
        ? { title: key, key, children: customizeValue(value) }
        : { title: key, key, children: getNodes(value) }
    } else {
      return { title: key, key, value }
    }
  })
}

const customizeValue = (example: ClubTypeCategory[]): TreeNode[] => {
  return example.map((example) => ({
    title: example.name,
    key: example.id || '',
  }))
}

export const useClubs = () => {
  const [clubs, setClubs] = useState<ListItem[]>([])
  const { clubList } = useAppSelector((state) => state.global)

  useEffect(() => {
    if (!clubList) return
    if (clubList.length === 0) return

    // MEMO: 種目の順番はハードコーディングしている。←管理画面から制御できるようにしたほうがいいかも
    const initClubs = getNodes(groupArray([...clubList], 'largeCategoryName', 'mediumCategoryName'))
    const activities = initClubs[0]
    const cultures = initClubs[1]
    setClubs([
      {
        title: activities.title,
        key: activities.key,
        children: orderCategories(activities),
      },
      {
        title: cultures.title,
        key: cultures.key,
        children: orderCategories(cultures),
      },
    ])
  }, [clubList])

  return {
    clubs,
  }
}
