import { IconTypeSelectBox, SelectBoxSize } from '@/components/atoms'

export const prefectureList = [
  '北海道',
  '青森',
  '岩手',
  '宮城',
  '秋田',
  '山形',
  '福島',
  '茨城',
  '栃木',
  '群馬',
  '埼玉',
  '千葉',
  '東京',
  '神奈川',
  '新潟',
  '富山',
  '石川',
  '福井',
  '山梨',
  '長野',
  '岐阜',
  '静岡',
  '愛知',
  '三重',
  '滋賀',
  '京都',
  '大阪',
  '兵庫',
  '奈良',
  '和歌山',
  '鳥取',
  '島根',
  '岡山',
  '広島',
  '山口',
  '徳島',
  '香川',
  '愛媛',
  '高知',
  '福岡',
  '佐賀',
  '長崎',
  '熊本',
  '大分',
  '宮崎',
  '鹿児島',
  '沖縄',
]

export const jobTypeList = [
  {
    value: '',
    placeholder: true,
    text: '選択してください',
    icon: IconTypeSelectBox.OFF,
    size: SelectBoxSize.PC,
  },
  {
    value: '大学生',
    text: '大学生',
    size: SelectBoxSize.PC,
    icon: IconTypeSelectBox.OFF,
    selected: true,
  },
  {
    value: '会社員',
    text: '会社員',
    size: SelectBoxSize.PC,
    icon: IconTypeSelectBox.OFF,
  },
  {
    value: '教員',
    text: '教員',
    size: SelectBoxSize.PC,
    icon: IconTypeSelectBox.OFF,
  },
  {
    value: '公務員（教員以外)',
    text: '公務員（教員以外)',
    size: SelectBoxSize.PC,
    icon: IconTypeSelectBox.OFF,
  },
  {
    value: '自営業/個人事業',
    text: '自営業/個人事業',
    size: SelectBoxSize.PC,
    icon: IconTypeSelectBox.OFF,
  },
  {
    value: '専業主婦(夫)',
    text: '専業主婦(夫)',
    size: SelectBoxSize.PC,
    icon: IconTypeSelectBox.OFF,
  },
  {
    value: 'その他',
    text: 'その他',
    size: SelectBoxSize.PC,
    icon: IconTypeSelectBox.OFF,
  },
]

export const columns1 = [
  { key: 'school_name', title: '学校・団体名', sortable: false },
  { key: 'event', title: '種目', sortable: true },
  { key: 'sex', title: '性別', sortable: true },
  { key: 'recruit_status', title: '採用状況', sortable: false },
  { key: 'candidate', title: '候補', sortable: true },
  { key: 'message', title: 'メッセージ', sortable: false },
  { key: 'date', title: '募集開始日', sortable: true },
]

export const data1 = [
  {
    school_name: '甲府市立明光学園',
    event: 'サッカー1',
    sex: '男子',
    recruit_status: {
      recruitCount: 0,
      adoptCount: 0,
      selectCount: 0,
    },
    candidate: 'Off',
    message: 'message',
    date: {
      date: '2023/12/10(金)',
      time: '14:00',
    },
  },
  {
    school_name: '甲府市立明光学園',
    event: 'サッカー2',
    sex: '男子',
    recruit_status: {
      recruitCount: 0,
      adoptCount: 0,
      selectCount: 0,
    },
    candidate: 'On',
    message: 'message',
    date: {
      date: '2023/12/10(金)',
      time: '14:00',
    },
  },
]

export const columns2 = [
  { key: 'school_name', title: '学校・団体名', sortable: false },
  { key: 'event', title: '種目', sortable: true },
  { key: 'sex', title: '性別', sortable: true },
  { key: 'recruit_status', title: '採用状況', sortable: false },
  { key: 'date', title: '登録日', sortable: true },
]

export const data2 = [
  {
    mark: true,
    school_name: '甲府市立明光学園',
    event: 'サッカー1',
    sex: '男子',
    recruit_status: {
      recruitCount: '-',
      adoptCount: '-',
      selectCount: '-',
    },
    date: {
      date: '2023/12/10(金)',
      time: '14:00',
    },
  },
  {
    school_name: '甲府市立明光学園',
    event: 'サッカー2',
    sex: '男子',
    recruit_status: {
      recruitCount: '-',
      adoptCount: '-',
      selectCount: '-',
    },
    candidate: 'On',
    message: 'message',
    date: {
      date: '2023/12/10(金)',
      time: '12:00',
    },
  },
]

export const columns3 = [
  { key: 'school_name', title: '学校・団体名', sortable: false },
  { key: 'event', title: '種目', sortable: true },
  { key: 'sex', title: '性別', sortable: true },
  { key: 'recruit_status', title: '採用状況', sortable: false },
  { key: 'date', title: '募集終了日', sortable: true },
]

export const data3 = [
  {
    school_name: '甲府市立明光学園',
    event: 'サッカー1',
    sex: '男子',
    recruit_status: {
      recruitCount: '0',
      adoptCount: '0',
      selectCount: '0',
    },
    date: {
      date: '2023/12/10(金)',
      time: '14:00',
    },
  },
  {
    school_name: '甲府市立明光学園',
    event: 'サッカー2',
    sex: '男子',
    recruit_status: {
      recruitCount: '0',
      adoptCount: '0',
      selectCount: '0',
    },
    candidate: 'On',
    message: 'message',
    date: {
      date: '2023/12/10(金)',
      time: '12:00',
    },
  },
]

export const PREFECTURE_MAP = {
  hokkaido: '北海道',
  aomori: '青森県',
  iwate: '岩手県',
  miyagi: '宮城県',
  akita: '秋田県',
  yamagata: '山形県',
  fukushima: '福島県',
  ibaraki: '茨城県',
  tochigi: '栃木県',
  gunma: '群馬県',
  saitama: '埼玉県',
  chiba: '千葉県',
  tokyo: '東京都',
  kanagawa: '神奈川県',
  niigata: '新潟県',
  toyama: '富山県',
  ishikawa: '石川県',
  fukui: '福井県',
  yamanashi: '山梨県',
  nagano: '長野県',
  gifu: '岐阜県',
  shizuoka: '静岡県',
  aichi: '愛知県',
  mie: '三重県',
  shiga: '滋賀県',
  kyoto: '京都府',
  osaka: '大阪府',
  hyogo: '兵庫県',
  nara: '奈良県',
  wakayama: '和歌山県',
  tottori: '鳥取県',
  shimane: '島根県',
  okayama: '岡山県',
  hiroshima: '広島県',
  yamaguchi: '山口県',
  tokushima: '徳島県',
  kagawa: '香川県',
  ehime: '愛媛県',
  kochi: '高知県',
  fukuoka: '福岡県',
  saga: '佐賀県',
  nagasaki: '長崎県',
  kumamoto: '熊本県',
  oita: '大分県',
  miyazaki: '宮崎県',
  kagoshima: '鹿児島県',
  okinawa: '沖縄県',
}

export type PREFECTURE_TYPE = keyof typeof PREFECTURE_MAP
