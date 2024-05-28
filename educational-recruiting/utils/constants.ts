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
