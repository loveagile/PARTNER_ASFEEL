export const DEFAULT_PAGE_SIZE = 10
export const MAX_PAGE_SIZE = 100
export const DEBOUNCE_TIME = 500
export const DEFAULT_PASSWORD = '123456Aa@'
export const SESSION_EXPIRES_IN = 60 * 60 * 24 * 5 * 1000 // 5 days
export const REPORT_LINK_GOOGLE_FORM = 'https://forms.gle/UfqaKyQp9kyE271K6'
export enum SCOUT_STATUS {
  unsend = '未送信',
  scouted = 'スカウト済',
  notInterested = '興味なし',
  ng = 'NG',
}
export const SCOUT_STATUS_OPTIONS = [
  {
    label: '未送信',
    value: SCOUT_STATUS.unsend,
  },
  {
    label: 'スカウト済み',
    value: SCOUT_STATUS.scouted,
  },
  {
    label: '興味なし',
    value: SCOUT_STATUS.notInterested,
  },
  {
    label: 'NG',
    value: SCOUT_STATUS.ng,
  },
]
export const DAY_OF_WEEK = [
  {
    label: '月',
    value: 'monday',
  },
  {
    label: '火',
    value: 'tuesday',
  },
  {
    label: '水',
    value: 'wednesday',
  },
  {
    label: '木',
    value: 'thursday',
  },
  {
    label: '金',
    value: 'friday',
  },
  {
    label: '土',
    value: 'saturday',
  },
  {
    label: '日',
    value: 'sunday',
  },
]

export enum HTTP_METHOD {
  GET = 'GET',
  POST = 'POST',
  PUT = 'PUT',
  DELETE = 'DELETE',
}

export const KANA_CHAR_MAP = {
  half: '｡｢｣､･ｦｧｨｩｪｫｬｭｮｯｰｱｲｳｴｵｶｷｸｹｺｻｼｽｾｿﾀﾁﾂﾃﾄﾅﾆﾇﾈﾉﾊﾋﾌﾍﾎﾏﾐﾑﾒﾓﾔﾕﾖﾗﾘﾙﾚﾛﾜﾝﾞﾟ',
  full: '。「」、・ヲァィゥェォャュョッーアイウエオカキクケコサシスセソタチツテトナニヌネノハヒフヘホマミムメモヤユヨラリルレロワン゛゜',
}

export enum PAGINATION_TYPE {
  PREV = 'prev',
  NEXT = 'next',
}

export enum ROLE_NAME {
  ADMIN = 'admin',
  GENERAL = 'general',
}

export const ROLE_OPTIONS = [
  {
    label: '管理者',
    value: ROLE_NAME.ADMIN,
  },
  {
    label: '一般',
    value: ROLE_NAME.GENERAL,
  },
]

export const STATUS_SUSPENDED_OPTIONS = [
  {
    label: '利用中',
    value: false,
  },
  {
    label: '利用停止',
    value: true,
  },
]

// create this because of is publish field in firebase auth
export const STATUS_ACCOUNT_OPTIONS = [
  {
    label: '利用中',
    value: true,
  },
  {
    label: '利用停止',
    value: false,
  },
]

export enum STATUS_NOTIFICATION {
  PUBLISHED = 'published',
  UNPUBLISHED = 'unpublished',
}

export const STATUS_NOTIFICATION_OPTIONS = [
  {
    label: '掲載',
    value: STATUS_NOTIFICATION.PUBLISHED,
  },
  {
    label: '非掲載',
    value: STATUS_NOTIFICATION.UNPUBLISHED,
  },
]

export const STATUS_CATEGORY_OPTIONS = [
  {
    label: '掲載',
    value: true,
  },
  {
    label: '非掲載',
    value: false,
  },
]

export enum PROJECT_TYPE {
  LEADER = 'leader',
  EVENT = 'event',
  BOTH = 'both',
}

export const PROJECT_TYPE_OPTIONS = [
  {
    label: '指導者募集',
    value: PROJECT_TYPE.LEADER,
  },
  {
    label: 'イベント募集',
    value: PROJECT_TYPE.EVENT,
  },
  {
    label: '両方',
    value: PROJECT_TYPE.BOTH,
  },
]

export const GENDER_OPTIONS = [
  {
    label: '男性',
    value: '男性',
  },
  {
    label: '女性',
    value: '女性',
  },
  {
    label: 'その他',
    value: 'その他',
  },
]

export enum COMMON_STATUS {
  IN_PREPARATION = 'inpreparation',
  IN_PUBLIC = 'inpublic',
  FINISH = 'finished',
}

export const COMMON_STATUS_OBJECT = {
  [COMMON_STATUS.IN_PREPARATION]: '準備中',
  [COMMON_STATUS.IN_PUBLIC]: '募集中',
  [COMMON_STATUS.FINISH]: '終了',
}

export enum ORGANIZATION_TYPE_LABEL {
  PUBLIC_INSTITUTION = '公的機関',
  SCHOOL = '学校',
  OTHERS = 'その他',
}

export enum SELECTED_CANDIDATE_STATUS {
  notStarted = '未対応',
  inProgress = '対応中',
  interview = '面談',
  adopted = '採用',
  notAdopted = '不採用',
  cancel = '辞退',
}

export const SELECTED_CANDIDATE_OPTIONS = [
  {
    label: SELECTED_CANDIDATE_STATUS.notStarted,
    value: SELECTED_CANDIDATE_STATUS.notStarted,
  },
  {
    label: SELECTED_CANDIDATE_STATUS.inProgress,
    value: SELECTED_CANDIDATE_STATUS.inProgress,
  },
  {
    label: SELECTED_CANDIDATE_STATUS.interview,
    value: SELECTED_CANDIDATE_STATUS.interview,
  },
  {
    label: SELECTED_CANDIDATE_STATUS.adopted,
    value: SELECTED_CANDIDATE_STATUS.adopted,
  },
  {
    label: SELECTED_CANDIDATE_STATUS.notAdopted,
    value: SELECTED_CANDIDATE_STATUS.notAdopted,
  },
  {
    label: SELECTED_CANDIDATE_STATUS.cancel,
    value: SELECTED_CANDIDATE_STATUS.cancel,
  },
]

export const IS_BOARD_EDUCATION_OPTIONS = [
  {
    label: 'はい',
    value: true,
  },
  {
    label: 'いいえ',
    value: false,
  },
]

export const SORT_STATUS_ORDER = {
  [SELECTED_CANDIDATE_STATUS.notStarted]: 1,
  [SELECTED_CANDIDATE_STATUS.inProgress]: 2,
  [SELECTED_CANDIDATE_STATUS.interview]: 3,
  [SELECTED_CANDIDATE_STATUS.adopted]: 4,
  [SELECTED_CANDIDATE_STATUS.notAdopted]: 5,
  [SELECTED_CANDIDATE_STATUS.cancel]: 6,
}

export const INTERVIEW_STATUS = [
  SELECTED_CANDIDATE_STATUS.interview,
  SELECTED_CANDIDATE_STATUS.adopted,
  SELECTED_CANDIDATE_STATUS.notAdopted,
  SELECTED_CANDIDATE_STATUS.cancel,
]

export enum MESSAGE_TYPE {
  application = 'application',
  scout = 'scout',
  file = 'file',
  text = 'text',
}

export const ELASTIC_INDEX = {
  addresses: 'addresses',
  prefectures: 'prefectures',
  cities: 'cities',
  organizations: 'organizations',
  notifications: 'notifications',
  questions: 'questionsforprefecture',
  categories: 'clubtypecategories',
  coordinators: 'coordinators',
  leadersWantedProjects: 'leaderswantedprojects',
  leadersWantedProjectsScoutList: 'leaderswantedprojectsscoutlist',
  privateUsers: 'privateusers',
  eventProjects: 'eventprojects',
}

export const API_ROUTES = {
  ACCOUNT: {
    list: '/api/account/list',
    create: '/api/account/create',
    update: '/api/account/update',
    delete: '/api/account/delete',
    detail: (id: string) => `/api/account/${id}`,
  },
  ADDRESS: {
    find: '/api/address/find',
    cities: '/api/address/cities',
    areas: '/api/address/areas',
    list: '/api/address/list',
    create: '/api/address/create',
    update: '/api/address/update',
    delete: '/api/address/delete',
    detail: (id: string) => `/api/address/${id}`,
  },
  ORGANIZATION: {
    list: '/api/organization/list',
    create: '/api/organization/create',
    update: '/api/organization/update',
    delete: '/api/organization/delete',
    detail: (id: string) => `/api/organization/${id}`,
    type: `/api/organization/type`,
    schoolType: (type?: string, prefecture?: string) =>
      `/api/organization/school/type?type=${type}&prefecture=${prefecture}`,
  },
  NOTIFICATION: {
    list: '/api/notification/list',
    create: '/api/notification/create',
    update: '/api/notification/update',
    delete: '/api/notification/delete',
    detail: (id: string) => `/api/notification/${id}`,
  },
  QUESTION: {
    list: '/api/question/list',
    create: '/api/question/create',
    update: '/api/question/update',
    delete: '/api/question/delete',
    detail: (id: string) => `/api/question/${id}`,
  },
  CATEGORY: {
    list: '/api/category/list',
    create: '/api/category/create',
    update: '/api/category/update',
    delete: '/api/category/delete',
    detail: (id: string) => `/api/category/${id}`,
    type: (type?: 'large' | 'medium') => `/api/category/type?type=${type}`,
  },
  COORDINATOR: {
    list: '/api/coordinator/list',
    create: '/api/coordinator/create',
    update: '/api/coordinator/update',
    delete: '/api/coordinator/delete',
    detail: (id: string) => `/api/coordinator/${id}`,
  },
  AUTH: {
    createSession: '/api/auth/createSession',
    validateSession: '/api/auth/validateSession',
    logout: '/api/auth/logout',
  },
  //leader wanted project
  RECRUITMENT: {
    list: '/api/recruitment/list',
    detail: (id: string) => `/api/recruitment/${id}`,
    update: '/api/recruitment/update',
    modifyStatus: '/api/recruitment/modifyStatus',
    delete: '/api/recruitment/delete',
    check: '/api/recruitment/check',
    addMemo: '/api/recruitment/addMemo',
    scout: '/api/recruitment/scout',
    getScout: '/api/recruitment/getScout',
    getSelection: '/api/recruitment/getSelection',
    modifySelection: '/api/recruitment/modifySelection',
  },
  REGISTRANT: {
    list: '/api/registrant/list',
    detail: (id: string) => `/api/registrant/${id}`,
    delete: '/api/registrant/delete',
    update: `/api/registrant/update`,
    importCsv: '/api/registrant/import-csv',
    history: (id: string) => `/api/registrant/${id}/history`,
  },
  EVENT: {
    list: '/api/event/list',
    detail: (id: string) => `/api/event/${id}`,
    update: '/api/event/update',
    modifyStatus: '/api/event/modifyStatus',
    delete: '/api/event/delete',
    check: '/api/event/check',
    addMemo: '/api/event/addMemo',
    scout: '/api/event/scout',
    candidate: '/api/event/candidate',
    getSelection: '/api/event/getSelection',
    modifySelection: '/api/event/modifySelection',
  },
  MESSAGE: {
    findMessages: '/api/message/findMessages',
    createMessageRoom: '/api/message/createMessageRoom',
    sendMessage: '/api/message/sendMessage',
  },
}
